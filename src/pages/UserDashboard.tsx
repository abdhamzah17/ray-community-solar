
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

// Placeholder data for demonstration
const myCommunities = [
  { id: '1', name: 'Green Meadows Community', zipCode: '600001', members: 24, role: 'Member' },
  { id: '2', name: 'Sunlit Apartments', zipCode: '600042', members: 16, role: 'Admin' },
];

const UserDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h1 className="text-2xl font-bold mb-4">You need to be signed in to view this page</h1>
        <Button onClick={() => navigate('/login')}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {currentUser.name}!
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => navigate('/communities/join')}
            className="bg-solar-blue text-white hover:bg-solar-blue/90"
          >
            Join Community
          </Button>
          <Button 
            onClick={() => navigate('/communities/create')}
            className="bg-solar-yellow text-foreground hover:bg-solar-orange"
          >
            Create Community
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="my-communities">My Communities</TabsTrigger>
          <TabsTrigger value="energy-data">Energy Consumption</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Communities Joined
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
                <div className="text-2xl font-bold">{myCommunities.length}</div>
                <p className="text-xs text-muted-foreground">
                  + 0 from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Energy Savings
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
                <div className="text-2xl font-bold">₹ 0</div>
                <p className="text-xs text-muted-foreground">
                  Start tracking to see savings
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  CO₂ Emissions Saved
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
                <div className="text-2xl font-bold">0 kg</div>
                <p className="text-xs text-muted-foreground">
                  Start tracking to see impact
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-1">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Get Started with Ray Unity</CardTitle>
                <CardDescription>
                  Follow these steps to begin your solar journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-4 border rounded-lg">
                    <div className="mr-4 h-8 w-8 rounded-full bg-solar-yellow flex items-center justify-center">
                      <span className="font-medium text-foreground">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Join or Create a Community</h3>
                      <p className="text-sm text-muted-foreground">Connect with neighbors to share solar benefits</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="ml-auto"
                      onClick={() => setActiveTab('my-communities')}
                    >
                      View Communities
                    </Button>
                  </div>
                  
                  <div className="flex items-center p-4 border rounded-lg">
                    <div className="mr-4 h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="font-medium">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Enter Your Energy Consumption</h3>
                      <p className="text-sm text-muted-foreground">Add your electricity bill details to calculate solar needs</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="ml-auto"
                      onClick={() => setActiveTab('energy-data')}
                    >
                      Add Energy Data
                    </Button>
                  </div>
                  
                  <div className="flex items-center p-4 border rounded-lg">
                    <div className="mr-4 h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                      <span className="font-medium">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Vote for a Solar Provider</h3>
                      <p className="text-sm text-muted-foreground">Once your community has quotes, vote for your preferred provider</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="ml-auto"
                      disabled={true}
                    >
                      Not Available Yet
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="my-communities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Communities</CardTitle>
              <CardDescription>
                Communities you've created or joined
              </CardDescription>
            </CardHeader>
            <CardContent>
              {myCommunities.length > 0 ? (
                <div className="space-y-4">
                  {myCommunities.map(community => (
                    <div 
                      key={community.id}
                      className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{community.name}</h3>
                        <p className="text-sm text-muted-foreground">Zip Code: {community.zipCode} • Members: {community.members}</p>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-solar-yellow text-foreground mt-2">
                          {community.role}
                        </span>
                      </div>
                      <div className="mt-4 md:mt-0 self-end md:self-center">
                        <Button 
                          onClick={() => navigate(`/communities/${community.id}`)}
                          className="bg-solar-blue text-white hover:bg-solar-blue/90"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">You haven't joined any communities yet</p>
                  <div className="flex justify-center space-x-4">
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="energy-data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Energy Consumption</CardTitle>
              <CardDescription>
                Enter your electricity bill details to calculate solar needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>To get started, select a community and enter your consumption data.</p>
                <Button 
                  onClick={() => navigate('/energy/input')}
                  className="bg-solar-green text-white hover:bg-solar-green/90"
                >
                  Add Consumption Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
              <CardDescription>
                Manage your payments for solar installations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">No payment information available yet</p>
                <p className="text-sm">Once your community selects a solar provider, payment details will appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;
