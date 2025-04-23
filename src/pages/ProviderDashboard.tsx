
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

// Placeholder data for demonstration
const quoteRequests = [
  { 
    id: '1', 
    communityName: 'Green Meadows Community', 
    zipCode: '600001', 
    members: 24, 
    totalConsumption: '3600 kWh', 
    avgBill: '₹5,400',
    requestDate: '2023-04-15' 
  },
  { 
    id: '2', 
    communityName: 'Sunlit Apartments', 
    zipCode: '600042', 
    members: 16, 
    totalConsumption: '2800 kWh', 
    avgBill: '₹4,200',
    requestDate: '2023-04-10' 
  },
];

const activeProjects = [
  { 
    id: '1', 
    communityName: 'Solar Heights Association', 
    zipCode: '600010', 
    members: 32, 
    totalCapacity: '24 kW', 
    status: 'Installation In Progress',
    progressPercent: 65,
    startDate: '2023-03-01' 
  },
];

const ProviderDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  if (!currentUser || !currentUser.isSolarProvider) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-4">You need to be logged in as a solar provider to view this page.</p>
        <Button onClick={() => navigate('/login')}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Provider Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {currentUser.name}!
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => navigate('/provider/profile')}
            variant="outline"
          >
            Edit Provider Profile
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="quote-requests">Quote Requests</TabsTrigger>
          <TabsTrigger value="active-projects">Active Projects</TabsTrigger>
          <TabsTrigger value="completed">Completed Projects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Quote Requests
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{quoteRequests.length}</div>
                <p className="text-xs text-muted-foreground">
                  Pending quote requests
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Projects
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeProjects.length}</div>
                <p className="text-xs text-muted-foreground">
                  Projects in progress
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Installations
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  <path d="M9 9h.01" />
                  <path d="M15 9h.01" />
                  <path d="M8 13h8" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  Completed installations
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="quote-requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quote Requests</CardTitle>
              <CardDescription>
                Communities requesting pricing for solar installations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {quoteRequests.length > 0 ? (
                <div className="space-y-4">
                  {quoteRequests.map(request => (
                    <div 
                      key={request.id}
                      className="flex flex-col p-4 border rounded-lg"
                    >
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <h3 className="font-medium">{request.communityName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Zip Code: {request.zipCode} • Members: {request.members}
                          </p>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                              <p className="text-xs text-muted-foreground">Total Consumption</p>
                              <p className="text-sm font-medium">{request.totalConsumption}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Average Bill</p>
                              <p className="text-sm font-medium">{request.avgBill}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <Badge className="bg-solar-yellow text-foreground">
                            Requested on {request.requestDate}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button 
                          onClick={() => navigate(`/provider/quote/${request.id}`)}
                          className="bg-solar-blue text-white hover:bg-solar-blue/90"
                        >
                          Submit Quote
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No quote requests at the moment</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active-projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
              <CardDescription>
                Ongoing solar installation projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeProjects.length > 0 ? (
                <div className="space-y-4">
                  {activeProjects.map(project => (
                    <div 
                      key={project.id}
                      className="flex flex-col p-4 border rounded-lg"
                    >
                      <div className="flex flex-col md:flex-row justify-between">
                        <div>
                          <h3 className="font-medium">{project.communityName}</h3>
                          <p className="text-sm text-muted-foreground">
                            Zip Code: {project.zipCode} • Members: {project.members}
                          </p>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                              <p className="text-xs text-muted-foreground">Total Capacity</p>
                              <p className="text-sm font-medium">{project.totalCapacity}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Started On</p>
                              <p className="text-sm font-medium">{project.startDate}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                          <Badge className="bg-solar-green text-white">
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div 
                            className="bg-solar-green h-2.5 rounded-full" 
                            style={{ width: `${project.progressPercent}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-right mt-1">{project.progressPercent}% Complete</p>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button 
                          onClick={() => navigate(`/provider/project/${project.id}`)}
                          className="bg-solar-blue text-white hover:bg-solar-blue/90"
                        >
                          Update Progress
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No active projects at the moment</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Projects</CardTitle>
              <CardDescription>
                Successfully completed solar installations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-muted-foreground">No completed projects yet</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProviderDashboard;
