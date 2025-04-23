
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Users, Zap, Check } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold">About Ray Unity</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Empowering communities through collective solar adoption and sustainable energy solutions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-6 w-6 text-solar-yellow" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Ray Unity's mission is to accelerate the transition to clean, renewable solar energy by making it more 
              accessible and affordable for everyone through community-driven solar projects.
            </p>
            <p>
              We believe that by bringing neighbors together to adopt solar power collectively, we can negotiate better 
              prices, share installation costs, and create a stronger community focused on sustainability.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-solar-blue" />
              Our Story
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Ray Unity was founded in 2023 by a team of renewable energy enthusiasts and community organizers who 
              recognized the barriers preventing widespread solar adoption in residential areas.
            </p>
            <p>
              After witnessing how group purchasing power dramatically reduced costs in pilot communities, we built 
              Ray Unity as a platform to scale this model across regions and make solar power a reality for more households.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-solar-green" />
            Our Impact
          </CardTitle>
          <CardDescription>
            Together, Ray Unity communities are making a significant environmental impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <p className="text-3xl font-bold text-solar-blue">50+</p>
              <p className="text-muted-foreground">Communities Powered</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold text-solar-green">1,200+</p>
              <p className="text-muted-foreground">Households Connected</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold text-solar-orange">₹9.5M+</p>
              <p className="text-muted-foreground">Cost Savings</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold text-solar-yellow">4,500+</p>
              <p className="text-muted-foreground">Tons of CO₂ Avoided</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="py-8">
        <h2 className="text-2xl font-bold mb-6">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-solar-yellow flex items-center justify-center">
                <Check className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-medium">Community First</h3>
            </div>
            <p className="text-muted-foreground">
              We believe in the power of communities coming together to achieve what individuals cannot do alone.
            </p>
          </div>
          
          <div className="p-6 border rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-solar-green flex items-center justify-center">
                <Check className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-medium">Transparency</h3>
            </div>
            <p className="text-muted-foreground">
              We provide clear, honest information about costs, benefits, and processes so communities can make informed decisions.
            </p>
          </div>
          
          <div className="p-6 border rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-solar-blue flex items-center justify-center">
                <Check className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-medium">Sustainability</h3>
            </div>
            <p className="text-muted-foreground">
              We're committed to environmental stewardship and helping create a cleaner, more sustainable future.
            </p>
          </div>
        </div>
      </div>

      <Card className="mt-6 bg-solar-blue text-white">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Join the Movement</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Whether you're an individual homeowner, part of a residential community, or a solar installation provider, 
            there's a place for you in the Ray Unity ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register" className="bg-white text-solar-blue px-6 py-2 rounded hover:bg-gray-100 transition-colors">
              Sign Up Today
            </a>
            <a href="/how-it-works" className="border border-white px-6 py-2 rounded hover:bg-solar-blue/80 transition-colors">
              Learn How It Works
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
