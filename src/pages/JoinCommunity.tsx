
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Form validation schemas
const codeSchema = z.object({
  communityCode: z.string().length(6, { message: 'Community code must be 6 characters' }),
});

const zipCodeSchema = z.object({
  zipCode: z.string().length(6, { message: 'Zip code must be 6 digits' }).regex(/^\d+$/, { message: 'Zip code must contain only numbers' }),
});

type CodeFormValues = z.infer<typeof codeSchema>;
type ZipCodeFormValues = z.infer<typeof zipCodeSchema>;

// Mock data for communities
const MOCK_COMMUNITIES = [
  { id: '1', name: 'Green Meadows Community', zipCode: '600001', members: 24, description: 'A community focused on sustainable living in Chennai North' },
  { id: '2', name: 'Sunlit Apartments', zipCode: '600042', members: 16, description: 'Apartment complex in Velachery seeking solar alternatives' },
  { id: '3', name: 'Eco Garden Housing', zipCode: '600042', members: 32, description: 'Large housing community with shared green spaces' },
];

const JoinCommunity: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('code');
  const [foundCommunities, setFoundCommunities] = useState<typeof MOCK_COMMUNITIES>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Form setup for community code
  const codeForm = useForm<CodeFormValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: {
      communityCode: '',
    },
  });

  // Form setup for zip code search
  const zipCodeForm = useForm<ZipCodeFormValues>({
    resolver: zodResolver(zipCodeSchema),
    defaultValues: {
      zipCode: '',
    },
  });

  // Redirect if not logged in
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const onCodeSubmit = async (data: CodeFormValues) => {
    setIsLoading(true);
    try {
      // This would be replaced with an actual API call to join by code
      // For now, we'll simulate a successful join
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Successfully joined community!',
        description: 'You are now a member of this community.',
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Failed to join community',
        description: error instanceof Error ? error.message : 'Invalid community code or community not found',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onZipCodeSubmit = async (data: ZipCodeFormValues) => {
    setIsLoading(true);
    try {
      // This would be replaced with an actual API call to search communities
      // For now, we'll simulate a search using our mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const results = MOCK_COMMUNITIES.filter(
        community => community.zipCode === data.zipCode
      );
      
      setFoundCommunities(results);
      setHasSearched(true);
      
      if (results.length === 0) {
        toast({
          title: 'No communities found',
          description: 'No communities found with this zip code. Consider creating one!',
        });
      }
    } catch (error) {
      toast({
        title: 'Search failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinCommunity = (communityId: string) => {
    // This would be replaced with an actual API call to join the community
    // For now, we'll simulate a successful join
    toast({
      title: 'Successfully joined community!',
      description: 'You are now a member of this community.',
    });
    
    navigate('/dashboard');
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
          <CardTitle className="text-2xl">Join a Community</CardTitle>
          <CardDescription>
            Connect with neighbors to share solar benefits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="code" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="code">Join with Code</TabsTrigger>
              <TabsTrigger value="search">Search by Zip Code</TabsTrigger>
            </TabsList>
            
            <TabsContent value="code" className="space-y-4 pt-4">
              <Form {...codeForm}>
                <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="space-y-4">
                  <FormField
                    control={codeForm.control}
                    name="communityCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Community Code</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter the 6-digit code" 
                            {...field} 
                            maxLength={6}
                            className="solar-input uppercase"
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
                    {isLoading ? 'Joining...' : 'Join Community'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="search" className="space-y-4 pt-4">
              <Form {...zipCodeForm}>
                <form onSubmit={zipCodeForm.handleSubmit(onZipCodeSubmit)} className="space-y-4">
                  <FormField
                    control={zipCodeForm.control}
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full bg-solar-yellow text-foreground hover:bg-solar-orange"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Searching...' : 'Find Communities'}
                  </Button>
                </form>
              </Form>
              
              {hasSearched && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Search Results</h3>
                  
                  {foundCommunities.length > 0 ? (
                    <div className="space-y-4">
                      {foundCommunities.map(community => (
                        <div 
                          key={community.id}
                          className="border rounded-lg p-4"
                        >
                          <h4 className="font-medium">{community.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {community.members} members • Zip Code: {community.zipCode}
                          </p>
                          <p className="text-sm mb-4">{community.description}</p>
                          <Button 
                            onClick={() => handleJoinCommunity(community.id)}
                            className="bg-solar-blue text-white hover:bg-solar-blue/90"
                          >
                            Join This Community
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 border rounded-lg">
                      <p className="text-muted-foreground mb-4">No communities found in this zip code</p>
                      <Button 
                        onClick={() => navigate('/communities/create')}
                        className="bg-solar-green text-white hover:bg-solar-green/90"
                      >
                        Create a New Community
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinCommunity;
