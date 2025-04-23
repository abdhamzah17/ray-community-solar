
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BarChart2, Zap, CheckCircle, Settings } from 'lucide-react';

const HowItWorks: React.FC = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold">How Ray Unity Works</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Your step-by-step guide to community-powered solar energy adoption
        </p>
      </div>

      <div className="space-y-12">
        {/* Step 1 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4">
            <div className="flex justify-center">
              <div className="h-32 w-32 rounded-full bg-solar-yellow flex items-center justify-center">
                <Users className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
          <div className="md:col-span-8">
            <h2 className="text-3xl font-bold mb-4">1. Join or Create a Community</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p>
                  Start by joining an existing community in your area using a community code, or create your own if 
                  none exists. Each community is organized around a specific geographic location to facilitate 
                  group solar installation.
                </p>
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-medium mb-2">Key Benefits:</h4>
                  <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
                    <li>Leverage collective bargaining power for better pricing</li>
                    <li>Share installation costs and resources</li>
                    <li>Build connections with neighbors who share sustainability goals</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Step 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 md:order-last">
            <div className="flex justify-center">
              <div className="h-32 w-32 rounded-full bg-solar-blue flex items-center justify-center">
                <BarChart2 className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
          <div className="md:col-span-8">
            <h2 className="text-3xl font-bold mb-4">2. Input Energy Consumption Data</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p>
                  Each community member submits their energy consumption data based on recent electricity bills.
                  This information helps determine the ideal solar system size and configuration for your community.
                </p>
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-medium mb-2">What to Have Ready:</h4>
                  <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
                    <li>Your past 3-6 months of electricity bills</li>
                    <li>Monthly consumption in kilowatt-hours (kWh)</li>
                    <li>Peak usage periods and patterns</li>
                    <li>Roof details or available installation space</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Step 3 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4">
            <div className="flex justify-center">
              <div className="h-32 w-32 rounded-full bg-solar-green flex items-center justify-center">
                <Zap className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
          <div className="md:col-span-8">
            <h2 className="text-3xl font-bold mb-4">3. Receive and Review Solar Quotes</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p>
                  The community admin initiates the quote request process. Verified solar providers on the Ray Unity platform 
                  will evaluate your community's collective needs and submit detailed quotes for installation.
                </p>
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-medium mb-2">Quote Details Include:</h4>
                  <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
                    <li>Total system size and specifications</li>
                    <li>Equipment and installation costs</li>
                    <li>Projected energy production and savings</li>
                    <li>Financing options and payment schedules</li>
                    <li>Warranty information and service guarantees</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Step 4 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 md:order-last">
            <div className="flex justify-center">
              <div className="h-32 w-32 rounded-full bg-solar-orange flex items-center justify-center">
                <CheckCircle className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
          <div className="md:col-span-8">
            <h2 className="text-3xl font-bold mb-4">4. Vote on Your Preferred Provider</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p>
                  All community members participate in a democratic voting process to select the provider that best 
                  meets the community's needs. The community admin can set the voting period and finalize the selection.
                </p>
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-medium mb-2">Evaluation Criteria:</h4>
                  <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
                    <li>Cost-effectiveness and value</li>
                    <li>Provider reputation and experience</li>
                    <li>Equipment quality and technology</li>
                    <li>Installation timeline and process</li>
                    <li>After-sales service and maintenance</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Step 5 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4">
            <div className="flex justify-center">
              <div className="h-32 w-32 rounded-full bg-solar-blue flex items-center justify-center">
                <Settings className="h-16 w-16 text-white" />
              </div>
            </div>
          </div>
          <div className="md:col-span-8">
            <h2 className="text-3xl font-bold mb-4">5. Installation and Monitoring</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p>
                  Once a provider is selected, the installation process begins. Track the progress through the Ray Unity
                  platform and start monitoring your energy production and savings once the system is online.
                </p>
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="font-medium mb-2">Post-Installation Benefits:</h4>
                  <ul className="list-disc ml-5 space-y-1 text-muted-foreground">
                    <li>Real-time energy production tracking</li>
                    <li>Environmental impact metrics</li>
                    <li>Financial savings analysis</li>
                    <li>Community performance comparisons</li>
                    <li>Ongoing support and maintenance coordination</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Card className="mt-12 bg-solar-yellow text-foreground">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Your Solar Journey?</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Join thousands of homeowners who are already saving money and reducing their carbon footprint 
            through community solar projects.
          </p>
          <a 
            href="/register" 
            className="inline-block bg-solar-blue text-white px-6 py-3 rounded-md hover:bg-solar-blue/90 transition-colors"
          >
            Sign Up Now
          </a>
        </CardContent>
      </Card>

      <div className="py-8">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>How much money can I save?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Savings vary based on your current energy costs, consumption patterns, and local solar conditions. 
                On average, Ray Unity communities report 15-30% reductions in their electricity costs over time, 
                with some achieving even higher savings through optimized community installations.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>What if I move or sell my home?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Solar installations typically increase property value. If you move, the solar system remains 
                with the property, becoming a selling point for future buyers. The Ray Unity platform helps 
                facilitate the transfer of community membership and benefits to new homeowners.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Do I need to maintain the solar panels?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Solar systems require minimal maintenance. Most providers include maintenance packages as part 
                of their installation quote. The Ray Unity platform helps coordinate any necessary maintenance 
                and ensures providers fulfill their service obligations to the community.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>What if my roof isn't suitable for solar?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Not all homes in a community need to have solar panels installed on their roofs. Ray Unity 
                supports various community solar models, including shared systems where the benefits are 
                distributed based on investment, regardless of where the panels are physically installed.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
