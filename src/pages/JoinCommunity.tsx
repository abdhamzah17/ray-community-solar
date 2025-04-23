
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Loader } from 'lucide-react';

// Form validation schema
const formSchema = z.object({
  communityCode: z
    .string()
    .min(6, { message: 'Community code must be 6 characters' })
    .max(6, { message: 'Community code must be 6 characters' }),
});

type FormValues = z.infer<typeof formSchema>;

const JoinCommunity: React.FC = () => {
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
      communityCode: '',
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
      // Find community with the provided code
      const { data: community, error: communityError } = await supabase
        .from('communities')
        .select('id, name, admin_id')
        .eq('community_code', data.communityCode.toUpperCase())
        .single();
        
      if (communityError) {
        if (communityError.code === 'PGRST116') {
          toast({
            title: 'Community Not Found',
            description: 'The community code you entered is invalid. Please check and try again.',
            variant: 'destructive',
          });
        } else {
          throw communityError;
        }
        return;
      }
      
      // Check if user is already a member (redundant check)
      const { data: existingMember, error: memberCheckError } = await supabase
        .from('community_members')
        .select('id')
        .eq('user_id', currentUser.id)
        .eq('community_id', community.id)
        .maybeSingle();
        
      if (existingMember) {
        toast({
          title: 'Already a Member',
          description: `You are already a member of ${community.name}.`,
          variant: 'default',
        });
        navigate('/dashboard');
        return;
      }
      
      // Add user as a member of the community
      const { error: joinError } = await supabase
        .from('community_members')
        .insert({
          user_id: currentUser.id,
          community_id: community.id
        });
        
      if (joinError) {
        throw joinError;
      }
      
      toast({
        title: 'Community Joined',
        description: `You have successfully joined ${community.name}.`,
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error Joining Community',
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
      <h1 className="text-3xl font-bold mb-8 text-center">Join a Community</h1>
      
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
              If you want to join a different community, you'll need to leave your current community first.
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
            <CardTitle>Enter Community Code</CardTitle>
            <CardDescription>
              Enter the 6-character code provided by the community admin
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Alert className="bg-muted border border-solar-yellow text-foreground">
                  <AlertCircle className="h-4 w-4 text-solar-yellow" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    You can only join one community at a time. Once you join a community, you'll need to leave it before joining another.
                  </AlertDescription>
                </Alert>
                
                <FormField
                  control={form.control}
                  name="communityCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Community Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., ABC123" 
                          {...field} 
                          value={field.value.toUpperCase()}
                          maxLength={6}
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
                        <Loader className="mr-2 h-4 w-4 animate-spin" /> Joining...
                      </>
                    ) : (
                      'Join Community'
                    )}
                  </Button>
                </div>
                
                <div className="text-center mt-6">
                  <p className="text-sm text-muted-foreground">Don't have a code?</p>
                  <Button 
                    type="button" 
                    variant="link" 
                    onClick={() => navigate('/communities/create')}
                    className="text-solar-blue"
                    disabled={isLoading}
                  >
                    Create your own community
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

export default JoinCommunity;
