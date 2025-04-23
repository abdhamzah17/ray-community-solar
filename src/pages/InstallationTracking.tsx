
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Package, Truck, Wrench, CheckCircle, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface Project {
  id: string;
  community_id: string;
  community_name: string;
  provider_id: string;
  provider_name: string;
  status: string;
  progress_percentage: number;
  total_cost: number;
  start_date?: string;
  estimated_completion_date?: string;
  created_at: string;
}

const InstallationTracking: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Get communities the user belongs to
        const { data: memberData, error: memberError } = await supabase
          .from('community_members')
          .select('community_id')
          .eq('user_id', currentUser.id);
          
        if (memberError) {
          throw memberError;
        }
        
        if (!memberData || memberData.length === 0) {
          setProjects([]);
          setLoading(false);
          return;
        }
        
        const communityIds = memberData.map(m => m.community_id);
        
        // Get projects for these communities
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select(`
            id, 
            community_id, 
            provider_id, 
            status, 
            progress_percentage, 
            total_cost, 
            start_date, 
            estimated_completion_date, 
            created_at
          `)
          .in('community_id', communityIds);
          
        if (projectError) {
          throw projectError;
        }
        
        if (!projectData || projectData.length === 0) {
          setProjects([]);
          setLoading(false);
          return;
        }
        
        // Get community names
        const { data: communitiesData, error: communitiesError } = await supabase
          .from('communities')
          .select('id, name')
          .in('id', projectData.map(p => p.community_id));
          
        if (communitiesError) {
          throw communitiesError;
        }
        
        // Get provider names
        const { data: providersData, error: providersError } = await supabase
          .from('profiles')
          .select('id, name')
          .in('id', projectData.map(p => p.provider_id));
          
        if (providersError) {
          throw providersError;
        }
        
        // Combine all data
        const enhancedProjects: Project[] = projectData.map(project => {
          const community = communitiesData?.find(c => c.id === project.community_id);
          const provider = providersData?.find(p => p.id === project.provider_id);
          
          return {
            ...project,
            community_name: community?.name || 'Unknown Community',
            provider_name: provider?.name || 'Unknown Provider'
          };
        });
        
        setProjects(enhancedProjects);
        
      } catch (error: any) {
        toast({
          title: "Error loading projects",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentUser, navigate, toast]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning':
        return <Package className="h-6 w-6" />;
      case 'procurement':
        return <Truck className="h-6 w-6" />;
      case 'installation':
        return <Wrench className="h-6 w-6" />;
      case 'completed':
        return <CheckCircle className="h-6 w-6" />;
      default:
        return <Package className="h-6 w-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'procurement':
        return 'bg-blue-100 text-blue-800';
      case 'installation':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Installation Tracking</h1>
          <p className="text-muted-foreground">
            Monitor the progress of your community's solar installation
          </p>
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
            <p>Loading installation projects...</p>
          </div>
        </div>
      ) : projects.length > 0 ? (
        <div className="space-y-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden">
              <CardHeader className="bg-muted pb-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <CardTitle>{project.community_name} Solar Installation</CardTitle>
                    <CardDescription>Provider: {project.provider_name}</CardDescription>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(project.status)}
                      <span className="capitalize">{project.status}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Progress: {project.progress_percentage}%</span>
                      <span>{project.progress_percentage === 100 ? 'Completed' : 'In progress'}</span>
                    </div>
                    <Progress value={project.progress_percentage} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>Project Started:</span>
                      </div>
                      <p className="font-medium">
                        {project.start_date 
                          ? format(new Date(project.start_date), 'PPP') 
                          : 'Not started yet'}
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>Expected Completion:</span>
                      </div>
                      <p className="font-medium">
                        {project.estimated_completion_date 
                          ? format(new Date(project.estimated_completion_date), 'PPP')
                          : 'To be determined'}
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Clock className="h-4 w-4" />
                        <span>Current Phase:</span>
                      </div>
                      <p className="font-medium capitalize">{project.status}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Package className="h-4 w-4" />
                        <span>Total Investment:</span>
                      </div>
                      <p className="font-medium">₹{project.total_cost.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    {project.status === 'completed' ? (
                      <Button 
                        onClick={() => navigate('/energy/consumption')}
                        className="bg-solar-green text-white hover:bg-solar-green/90"
                      >
                        View Energy Savings
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => {
                          toast({
                            title: "Installation updates",
                            description: "You will be notified when there are new updates to your installation.",
                          });
                        }}
                        variant="outline"
                      >
                        Subscribe to Updates
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <Package className="h-16 w-16 text-muted-foreground" />
              <h3 className="text-xl font-medium">No Installation Projects</h3>
              <p className="text-muted-foreground">
                You don't have any active installation projects at the moment. 
                Once your community selects a solar provider, your installation tracking will appear here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button 
                  onClick={() => navigate('/communities/join')}
                  variant="outline"
                >
                  Join a Community
                </Button>
                <Button 
                  onClick={() => navigate('/communities/create')}
                  className="bg-solar-yellow text-foreground hover:bg-solar-orange"
                >
                  Create a Community
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InstallationTracking;
