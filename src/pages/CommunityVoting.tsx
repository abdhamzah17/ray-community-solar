import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, AlertCircle, Users, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';

interface Provider {
  id: string;
  name: string | null;
  email: string;
}

interface Quote {
  id: string;
  provider_id: string;
  provider: Provider;
  total_cost: number;
  details: {
    system_size: number;
    panel_count: number;
    panel_type: string;
    inverter_type: string;
    warranty_years: number;
    estimated_annual_production: number;
    installation_timeframe: string;
  };
  votes_count: number;
  vote_percentage: number;
  has_user_voted: boolean;
}

interface QuoteRequest {
  id: string;
  community_id: string;
  requested_by: string;
  status: string;
  created_at: string;
  closed_at: string | null;
  community_name: string;
  admin_id: string;
  total_votes: number;
}

const CommunityVoting: React.FC = () => {
  const { currentUser } = useAuth();
  const { id: quoteRequestId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [quoteRequest, setQuoteRequest] = useState<QuoteRequest | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [endVotingDialogOpen, setEndVotingDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Quote | null>(null);
  const [endVotingLoading, setEndVotingLoading] = useState(false);
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!quoteRequestId) {
      navigate('/dashboard');
      return;
    }

    const fetchVotingData = async () => {
      try {
        setLoading(true);
        
        // Get quote request details
        const { data: requestData, error: requestError } = await supabase
          .from('quote_requests')
          .select(`
            id,
            community_id,
            requested_by,
            status,
            created_at,
            closed_at
          `)
          .eq('id', quoteRequestId)
          .maybeSingle();
          
        if (requestError || !requestData) {
          throw requestError || new Error("Quote request not found");
        }
        
        // Get community details
        const { data: communityData, error: communityError } = await supabase
          .from('communities')
          .select('name, admin_id')
          .eq('id', requestData.community_id)
          .maybeSingle();
          
        if (communityError || !communityData) {
          throw communityError || new Error("Community not found");
        }
        
        // Check if user is community admin
        setIsUserAdmin(communityData.admin_id === currentUser.id);
        
        // Get provider quotes
        const { data: quotesData, error: quotesError } = await supabase
          .from('provider_quotes')
          .select(`
            id,
            provider_id,
            total_cost,
            details
          `)
          .eq('quote_request_id', quoteRequestId);
          
        if (quotesError || !quotesData) {
          throw quotesError || new Error("No provider quotes found.");
        }
        
        // Get provider details
        const providerIds = quotesData.map(quote => quote.provider_id);
        let providersData: Provider[] = [];
        if (providerIds.length > 0) {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, name, email')
            .in('id', providerIds);
          if (error) throw error;
          if (data) providersData = data.map(p => ({
            id: p.id,
            name: p.name,
            email: p.email
          }));
        }
        
        // Get votes
        const { data: votesData, error: votesError } = await supabase
          .from('votes')
          .select('id, provider_quote_id, voter_id')
          .eq('quote_request_id', quoteRequestId);
          
        if (votesError || !votesData) {
          throw votesError || new Error("Votes could not be loaded");
        }
        
        // Calculate vote counts and whether current user has voted
        const totalVotes = votesData ? votesData.length : 0;
        const enhancedQuotes: Quote[] = quotesData.map(quote => {
          const provider = providersData.find(p => p.id === quote.provider_id) || { id: quote.provider_id, name: 'Unknown Provider', email: '' };
          const quotesVotes = votesData.filter(v => v.provider_quote_id === quote.id).length || 0;
          const votePercentage = totalVotes > 0 ? Math.round((quotesVotes / totalVotes) * 100) : 0;
          const hasUserVoted = votesData.some(v => v.provider_quote_id === quote.id && v.voter_id === currentUser.id) || false;
          
          return {
            ...quote,
            provider,
            votes_count: quotesVotes,
            vote_percentage: votePercentage,
            has_user_voted: hasUserVoted
          } as Quote;
        });
        
        // Sort quotes by votes count (descending)
        enhancedQuotes.sort((a, b) => b.votes_count - a.votes_count);
        
        setQuoteRequest({
          ...requestData,
          community_name: communityData.name,
          admin_id: communityData.admin_id,
          total_votes: totalVotes
        });
        setQuotes(enhancedQuotes);
        
      } catch (error: any) {
        toast({
          title: "Error loading voting data",
          description: error.message,
          variant: "destructive"
        });
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchVotingData();
  }, [currentUser, navigate, quoteRequestId, toast]);

  const handleVote = async (quoteId: string) => {
    try {
      // Check if user has already voted
      const hasVoted = quotes.some(q => q.has_user_voted);
      
      if (hasVoted) {
        // Update existing vote
        const { data: existingVote, error: findError } = await supabase
          .from('votes')
          .select('id')
          .eq('quote_request_id', quoteRequestId)
          .eq('voter_id', currentUser?.id)
          .maybeSingle();
          
        if (findError) {
          throw findError;
        }
        
        if (existingVote) {
          // Update vote
          const { error: updateError } = await supabase
            .from('votes')
            .update({
              provider_quote_id: quoteId
            })
            .eq('id', existingVote.id);
            
          if (updateError) {
            throw updateError;
          }
        }
      } else {
        // Insert new vote
        const { error: insertError } = await supabase
          .from('votes')
          .insert({
            quote_request_id: quoteRequestId,
            provider_quote_id: quoteId,
            voter_id: currentUser?.id
          });
          
        if (insertError) {
          throw insertError;
        }
      }
      
      // Update local state
      setQuotes(quotes.map(quote => ({
        ...quote,
        has_user_voted: quote.id === quoteId,
      })));
      
      toast({
        title: "Vote recorded",
        description: "Your vote has been successfully submitted.",
      });
      
      // Refresh data
      window.location.reload();
      
    } catch (error: any) {
      toast({
        title: "Voting failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleEndVoting = async () => {
    if (!selectedProvider || !quoteRequest) return;
    
    try {
      setEndVotingLoading(true);
      
      // Update quote request status to closed
      const { error: updateRequestError } = await supabase
        .from('quote_requests')
        .update({
          status: 'closed',
          closed_at: new Date().toISOString()
        })
        .eq('id', quoteRequestId);
        
      if (updateRequestError) {
        throw updateRequestError;
      }
      
      // Add selected provider record
      const { error: insertProviderError } = await supabase
        .from('selected_providers')
        .insert({
          quote_request_id: quoteRequestId,
          provider_quote_id: selectedProvider.id,
          provider_id: selectedProvider.provider_id
        });
        
      if (insertProviderError) {
        throw insertProviderError;
      }
      
      // Create project
      const { error: insertProjectError } = await supabase
        .from('projects')
        .insert({
          community_id: quoteRequest.community_id,
          provider_id: selectedProvider.provider_id,
          status: 'planning',
          progress_percentage: 0,
          total_cost: selectedProvider.total_cost,
          estimated_completion_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days from now
        });
        
      if (insertProjectError) {
        throw insertProjectError;
      }
      
      toast({
        title: "Voting ended",
        description: "The provider has been selected and the project is now being created.",
      });
      
      navigate('/dashboard');
      
    } catch (error: any) {
      toast({
        title: "Failed to end voting",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setEndVotingDialogOpen(false);
      setEndVotingLoading(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Provider Voting</h1>
          {quoteRequest && (
            <p className="text-muted-foreground">
              Vote for the solar provider for {quoteRequest.community_name}
            </p>
          )}
        </div>
        <Button 
          onClick={() => navigate('/dashboard')}
          variant="outline"
        >
          Back to Dashboard
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p>Loading voting data...</p>
          </div>
        </div>
      ) : quoteRequest ? (
        <>
          <Card className="bg-muted">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-solar-blue" />
                  <div>
                    <p className="text-sm font-medium">Total Votes: {quoteRequest.total_votes}</p>
                    <p className="text-xs text-muted-foreground">
                      Voting {quoteRequest.status === 'closed' ? 'ended' : 'in progress'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-solar-yellow" />
                  <div>
                    <p className="text-sm font-medium">Started on {format(parseISO(quoteRequest.created_at), 'PP')}</p>
                    {quoteRequest.closed_at ? (
                      <p className="text-xs text-muted-foreground">
                        Ended on {format(parseISO(quoteRequest.closed_at), 'PP')}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Voting period: {differenceInDays(new Date(), parseISO(quoteRequest.created_at))} days
                      </p>
                    )}
                  </div>
                </div>
                
                {isUserAdmin && quoteRequest.status !== 'closed' && (
                  <Button 
                    variant="destructive" 
                    onClick={() => {
                      // Find the quote with the most votes
                      const topVotedQuote = quotes.length > 0 ? quotes[0] : null;
                      setSelectedProvider(topVotedQuote);
                      setEndVotingDialogOpen(true);
                    }}
                    className="ml-auto"
                  >
                    End Voting Period
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            {quotes.length > 0 ? (
              quotes.map((quote, index) => (
                <Card 
                  key={quote.id}
                  className={quote.has_user_voted ? "border-solar-green border-2" : ""}
                >
                  <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {quote.provider.name}
                          {index === 0 && quoteRequest.total_votes > 0 && (
                            <Badge className="bg-solar-yellow text-foreground">Leading</Badge>
                          )}
                          {quote.has_user_voted && (
                            <Badge className="bg-solar-green text-white">Your Vote</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>Quote #{index + 1}</CardDescription>
                      </div>
                      <div className="text-2xl font-bold">
                        ₹{quote.total_cost.toLocaleString()}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">System Size</p>
                          <p className="font-medium">{quote.details.system_size} kW</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Panel Type</p>
                          <p className="font-medium">{quote.details.panel_type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Panel Count</p>
                          <p className="font-medium">{quote.details.panel_count} panels</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Inverter Type</p>
                          <p className="font-medium">{quote.details.inverter_type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Warranty</p>
                          <p className="font-medium">{quote.details.warranty_years} years</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Installation Time</p>
                          <p className="font-medium">{quote.details.installation_timeframe}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Estimated Annual Production: 
                          <span className="text-foreground font-medium ml-2">
                            {quote.details.estimated_annual_production.toLocaleString()} kWh
                          </span>
                        </p>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>Votes: {quote.votes_count}</span>
                          <span>{quote.vote_percentage}%</span>
                        </div>
                        <Progress value={quote.vote_percentage} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    {quoteRequest.status === 'pending' ? (
                      <Button 
                        className={quote.has_user_voted 
                          ? "bg-green-100 text-green-800 hover:bg-green-200" 
                          : "bg-solar-yellow text-foreground hover:bg-solar-orange"
                        }
                        disabled={quoteRequest.status !== 'pending'}
                        onClick={() => handleVote(quote.id)}
                      >
                        {quote.has_user_voted ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" /> Voted
                          </>
                        ) : (
                          'Vote for this Provider'
                        )}
                      </Button>
                    ) : (
                      <Badge className="px-3 py-1">
                        {quoteRequest.status === 'closed' ? 'Voting Closed' : quoteRequest.status}
                      </Badge>
                    )}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <AlertCircle className="h-16 w-16 text-muted-foreground" />
                    <h3 className="text-xl font-medium">No Provider Quotes Yet</h3>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                      There are no quotes from providers yet. Please check back later or contact your 
                      community administrator for more information.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <Dialog open={endVotingDialogOpen} onOpenChange={setEndVotingDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>End Voting Period</DialogTitle>
                <DialogDescription>
                  This will close voting and select the provider with the most votes. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              
              {selectedProvider && (
                <div className="py-4">
                  <h4 className="font-medium mb-2">Selected Provider:</h4>
                  <div className="p-4 border rounded-md">
                    <p className="font-medium">{selectedProvider.provider.name}</p>
                    <p className="text-sm text-muted-foreground">Cost: ₹{selectedProvider.total_cost.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      Votes: {selectedProvider.votes_count} ({selectedProvider.vote_percentage}%)
                    </p>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setEndVotingDialogOpen(false)} disabled={endVotingLoading}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleEndVoting} 
                  variant="destructive"
                  disabled={!selectedProvider || endVotingLoading}
                >
                  {endVotingLoading ? 'Processing...' : 'End Voting & Select Provider'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <AlertCircle className="h-16 w-16 text-muted-foreground" />
              <h3 className="text-xl font-medium">Quote Request Not Found</h3>
              <p className="text-muted-foreground">
                The quote request you're looking for doesn't exist or you don't have access to it.
              </p>
              <Button 
                onClick={() => navigate('/dashboard')}
                className="mt-2"
              >
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommunityVoting;
