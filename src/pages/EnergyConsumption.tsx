
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Zap, BarChart2, ArrowDown, ArrowUp, Info } from 'lucide-react';
import { format, parseISO, subMonths } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';

interface EnergyConsumptionData {
  id: string;
  period_start: string;
  period_end: string;
  units_consumed: number;
  bill_amount: number;
  community_id: string;
  savings_percentage?: number;
}

interface EnergySavingsData {
  id: string;
  month: string;
  pre_solar: number;
  post_solar: number;
  savings: number;
  savings_percentage: number;
}

const EnergyConsumption: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [consumptionData, setConsumptionData] = useState<EnergyConsumptionData[]>([]);
  const [savingsData, setSavingsData] = useState<EnergySavingsData[]>([]);
  const [activeTab, setActiveTab] = useState('consumption');
  const [loading, setLoading] = useState(true);
  const [communityName, setCommunityName] = useState<string>('');
  const [totalSaved, setTotalSaved] = useState<number>(0);
  const [avgSavingsPercentage, setAvgSavingsPercentage] = useState<number>(0);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchEnergyData = async () => {
      try {
        setLoading(true);
        
        // First get the user's community
        const { data: memberData, error: memberError } = await supabase
          .from('community_members')
          .select('community_id')
          .eq('user_id', currentUser.id)
          .single();
          
        if (memberError) {
          // User is not in any community
          setLoading(false);
          return;
        }
        
        // Get community name
        const { data: communityData, error: communityError } = await supabase
          .from('communities')
          .select('name')
          .eq('id', memberData.community_id)
          .single();
          
        if (communityData) {
          setCommunityName(communityData.name);
        }
        
        // Get consumption data
        const { data: consData, error: consError } = await supabase
          .from('energy_consumption')
          .select('*')
          .eq('user_id', currentUser.id)
          .eq('community_id', memberData.community_id)
          .order('period_start', { ascending: false });
          
        if (consError) {
          throw consError;
        }
        
        setConsumptionData(consData || []);
        
        // Generate mock savings data for demonstration
        if (consData && consData.length > 0) {
          // Assuming we have some pre-solar and post-solar data
          // For real implementation, this would come from actual solar production data
          const mockSavings: EnergySavingsData[] = [];
          let totalSavingsAmount = 0;
          let totalSavingsPercentage = 0;
          
          // Use the last 6 months of data
          const recentMonths = Math.min(consData.length, 6);
          
          for (let i = 0; i < recentMonths; i++) {
            const item = consData[i];
            const month = format(parseISO(item.period_start), 'MMM yyyy');
            
            // Mock pre-solar is the actual consumption plus a random amount (15-30%)
            const savingsPercentage = Math.floor(Math.random() * 15) + 15; // 15-30%
            const preSolar = Math.round(item.units_consumed * (100 + savingsPercentage) / 100);
            const postSolar = item.units_consumed;
            const savings = preSolar - postSolar;
            
            mockSavings.push({
              id: `savings-${i}`,
              month,
              pre_solar: preSolar,
              post_solar: postSolar,
              savings,
              savings_percentage: savingsPercentage
            });
            
            totalSavingsAmount += savings;
            totalSavingsPercentage += savingsPercentage;
          }
          
          setSavingsData(mockSavings.reverse()); // Reverse to show chronological order
          setTotalSaved(totalSavingsAmount);
          setAvgSavingsPercentage(totalSavingsPercentage / recentMonths);
        }
        
      } catch (error: any) {
        toast({
          title: "Error loading energy data",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEnergyData();
  }, [currentUser, navigate, toast]);

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'MMM d, yyyy');
  };

  const customTooltipFormatter = (value: number, name: string) => {
    if (name === 'units_consumed') return [`${value} kWh`, 'Consumption'];
    if (name === 'bill_amount') return [`₹${value}`, 'Bill Amount'];
    if (name === 'pre_solar') return [`${value} kWh`, 'Before Solar'];
    if (name === 'post_solar') return [`${value} kWh`, 'After Solar'];
    if (name === 'savings') return [`${value} kWh`, 'Energy Saved'];
    return [value.toString(), name];
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Energy Tracking</h1>
          <p className="text-muted-foreground">
            Monitor your energy consumption and solar savings
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
            <p>Loading energy data...</p>
          </div>
        </div>
      ) : (
        <>
          {communityName && (
            <Card className="bg-solar-yellow/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-solar-yellow" />
                  <p>Viewing energy data for <span className="font-medium">{communityName}</span> community</p>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Energy Saved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{totalSaved} kWh</div>
                    <p className="text-xs text-muted-foreground">
                      From solar power generation
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-solar-green/20 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-solar-green" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{avgSavingsPercentage.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground">
                      Reduction in energy consumption
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-solar-blue/20 flex items-center justify-center">
                    <ArrowDown className="h-5 w-5 text-solar-blue" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">CO₂ Emissions Avoided</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{(totalSaved * 0.85).toFixed(0)} kg</div>
                    <p className="text-xs text-muted-foreground">
                      Based on your energy savings
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <BarChart2 className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="consumption">Consumption History</TabsTrigger>
              <TabsTrigger value="savings">Energy Savings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="consumption" className="space-y-4">
              {consumptionData.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Energy Consumption</CardTitle>
                    <CardDescription>
                      Your energy usage over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[...consumptionData].reverse().map(item => ({
                            ...item,
                            date: format(parseISO(item.period_start), 'MMM yyyy')
                          }))}
                          margin={{ top: 5, right: 20, left: 20, bottom: 25 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" angle={-45} textAnchor="end" height={50} />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <RechartsTooltip formatter={customTooltipFormatter} />
                          <Legend />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="units_consumed"
                            stroke="#2563eb"
                            strokeWidth={2}
                            name="kWh Consumed"
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="bill_amount"
                            stroke="#16a34a"
                            strokeWidth={2}
                            name="Bill Amount (₹)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-8">
                      <h4 className="text-lg font-medium mb-4">Consumption Details</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Period</th>
                              <th className="text-right p-2">Units (kWh)</th>
                              <th className="text-right p-2">Bill Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {consumptionData.map((item) => (
                              <tr key={item.id} className="border-b hover:bg-muted/50">
                                <td className="p-2">
                                  {formatDate(item.period_start)} - {formatDate(item.period_end)}
                                </td>
                                <td className="text-right p-2">{item.units_consumed} kWh</td>
                                <td className="text-right p-2">₹{item.bill_amount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Zap className="h-16 w-16 text-muted-foreground" />
                      <h3 className="text-xl font-medium">No Consumption Data</h3>
                      <p className="text-muted-foreground">
                        You haven't added any energy consumption data yet. 
                        Add your electricity bill details to track your usage.
                      </p>
                      <Button 
                        onClick={() => navigate('/energy/input')}
                        className="mt-2 bg-solar-green text-white hover:bg-solar-green/90"
                      >
                        Add Consumption Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="savings" className="space-y-4">
              {savingsData.length > 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Solar Energy Savings</CardTitle>
                    <CardDescription>
                      Compare your energy usage before and after solar installation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={savingsData}
                          margin={{ top: 5, right: 20, left: 20, bottom: 25 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <RechartsTooltip formatter={customTooltipFormatter} />
                          <Legend />
                          <Bar dataKey="pre_solar" stackId="a" fill="#94a3b8" name="Before Solar" />
                          <Bar dataKey="post_solar" stackId="a" fill="#16a34a" name="After Solar" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-8">
                      <h4 className="text-lg font-medium mb-4">Monthly Savings</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Month</th>
                              <th className="text-right p-2">Before Solar</th>
                              <th className="text-right p-2">After Solar</th>
                              <th className="text-right p-2">Savings</th>
                              <th className="text-right p-2">% Saved</th>
                            </tr>
                          </thead>
                          <tbody>
                            {savingsData.map((item) => (
                              <tr key={item.id} className="border-b hover:bg-muted/50">
                                <td className="p-2">{item.month}</td>
                                <td className="text-right p-2">{item.pre_solar} kWh</td>
                                <td className="text-right p-2">{item.post_solar} kWh</td>
                                <td className="text-right p-2">
                                  <span className="flex items-center justify-end gap-1">
                                    <ArrowDown className="h-4 w-4 text-solar-green" />
                                    {item.savings} kWh
                                  </span>
                                </td>
                                <td className="text-right p-2">
                                  <span className="inline-block bg-solar-green/10 text-solar-green px-2 py-1 rounded text-sm">
                                    {item.savings_percentage}%
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <BarChart2 className="h-16 w-16 text-muted-foreground" />
                      <h3 className="text-xl font-medium">No Savings Data Yet</h3>
                      <p className="text-muted-foreground">
                        Your solar installation needs to be completed before you can see energy savings data.
                        Check your installation progress or add energy consumption data to get started.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 mt-2">
                        <Button 
                          onClick={() => navigate('/energy/input')}
                          variant="outline"
                        >
                          Add Consumption Data
                        </Button>
                        <Button 
                          onClick={() => navigate('/installation/tracking')}
                          className="bg-solar-blue text-white hover:bg-solar-blue/90"
                        >
                          Check Installation Status
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default EnergyConsumption;
