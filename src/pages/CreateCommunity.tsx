
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(3, { message: 'Community name must be at least 3 characters long' }),
  zipCode: z.string().min(6, { message: 'Please enter a valid ZIP code' }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateCommunity: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [existingCommunity, setExistingCommunity] = useState<{ id: string, name: string } | null>(null);
  const [isCheckingMembership, setIsCheckingMembership] = useState(true);

  // Form setup with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      zipCode: '',
      description: '',
    },
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Check if user is already a member of a community
    const checkExistingMembership = async () => {
      try {
        setIsCheckingMembership(true);
        
        // Check if user is already an admin of a community
        const { data: adminCommunity, error: adminError } = await supabase
          .from('communities')
          .select('id, name')
          .eq('admin_id', currentUser.id)
          .maybeSingle();
          
        if (adminCommunity) {
          setExistingCommunity(adminCommunity);
          return;
        }
        
        // Check if user is a member of any community
        const { data: membership, error: memberError } = await supabase
          .from('community_members')
          .select('community_id')
          .eq('user_id', currentUser.id)
          .maybeSingle();
          
        if (membership) {
          // Get community details
          const { data: community, error: communityError } = await supabase
            .from('communities')
            .select('id, name')
            .eq('id', membership.community_id)
            .single();
            
          if (community) {
            setExistingCommunity(community);
          }
        }
      } catch (error) {
        console.error('Error checking membership:', error);
      } finally {
        setIsCheckingMembership(false);
      }
    };

    checkExistingMembership();
  }, [currentUser, navigate]);

  const onSubmit = async (data: FormValues) => {
    if (!currentUser) return;
    
    setIsLoading(true);
    try {
      // Generate a random 6-character community code
      const communityCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Create the community
      const { data: community, error } = await supabase
        .from('communities')
        .insert({
          name: data.name,
          zip_code: data.zipCode,
          description: data.description || null,
          admin_id: currentUser.id,
          community_code: communityCode
        })
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Add the creator as a member of the community
      const { error: memberError } = await supabase
        .from('community_members')
        .insert({
          user_id: currentUser.id,
          community_id: community.id
        });
        
      if (memberError) {
        throw memberError;
      }
      
      toast({
        title: 'Community Created',
        description: `${data.name} has been successfully created. Your community code is ${communityCode}.`,
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error Creating Community',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  if (isCheckingMembership) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-solar-yellow border-t-transparent animate-spin"></div>
          <p className="text-lg">Checking your community status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Create a Community</h1>
      
      {existingCommunity ? (
        <Card>
          <CardHeader>
            <CardTitle>Already in a Community</CardTitle>
            <CardDescription>
              You are already a member of a community. Each user can only be part of one community at a time.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You are currently a member of <span className="font-semibold">{existingCommunity.name}</span>.</p>
            <p>
              If you want to create a new community, you'll need to leave your current community first.
              Please contact the community administrator to discuss this.
            </p>
            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Community Details</CardTitle>
            <CardDescription>
              Create a new solar community for your neighborhood
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Community Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Green Meadows Community" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 600001" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell potential members about your community..."
                          className="resize-none"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-between pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/dashboard')}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-solar-yellow text-foreground hover:bg-solar-orange"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" /> Creating...
                      </>
                    ) : (
                      'Create Community'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CreateCommunity;
