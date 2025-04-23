
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(3, { message: 'Community name must be at least 3 characters' }),
  zipCode: z.string().length(6, { message: 'Zip code must be 6 digits' }).regex(/^\d+$/, { message: 'Zip code must contain only numbers' }),
  description: z.string().min(10, { message: 'Please provide a brief description (at least 10 characters)' }),
});

type FormValues = z.infer<typeof formSchema>;

const CreateCommunity: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [communityCode, setCommunityCode] = useState<string | null>(null);

  // Form setup with react-hook-form and zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      zipCode: '',
      description: '',
    },
  });

  // Redirect if not logged in
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      // This would be replaced with an actual API call to create the community
      // For now, we'll simulate a successful creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a random community code
      const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      setCommunityCode(generatedCode);
      
      toast({
        title: 'Community created successfully!',
        description: 'You are now the admin of this community.',
      });
    } catch (error) {
      toast({
        title: 'Failed to create community',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        ← Back
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create a New Community</CardTitle>
          <CardDescription>
            Start a solar community in your area and invite your neighbors to join
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!communityCode ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Community Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Green Valley Residency" 
                          {...field} 
                          className="solar-input"
                        />
                      </FormControl>
                      <FormDescription>
                        Choose a name that represents your neighborhood or building
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., 600001" 
                          {...field} 
                          maxLength={6}
                          className="solar-input"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter the 6-digit pin code of your community location
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Briefly describe your community and solar goals" 
                          {...field} 
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full bg-solar-yellow text-foreground hover:bg-solar-orange"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Community...' : 'Create Community'}
                </Button>
              </form>
            </Form>
          ) : (
            <div className="space-y-6 text-center">
              <div className="rounded-md bg-muted p-6">
                <h3 className="text-lg font-medium mb-2">Community Created Successfully!</h3>
                <p className="text-muted-foreground mb-4">
                  Share this unique code with neighbors so they can join your community:
                </p>
                <div className="bg-white border-2 border-solar-yellow rounded-md p-3 text-2xl font-bold tracking-wider text-center">
                  {communityCode}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  As the community admin, you can manage members and track energy usage
                </p>
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-solar-blue text-white hover:bg-solar-blue/90"
                >
                  Go to Dashboard
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCommunity;
