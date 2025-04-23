
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Sun, Users, Calculator, Handshake, Check } from 'lucide-react';

const Home: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="py-16 px-4 md:px-0">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                Community Solar <span className="text-solar-yellow">Made Simple</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Ray Unity brings neighbors together to share the benefits of solar energy. 
                Reduce costs, track energy usage, and make a positive environmental impact—all on one platform.
              </p>
              <div className="space-x-4 pt-4">
                {currentUser ? (
                  <Link to="/dashboard">
                    <Button className="bg-solar-yellow text-foreground hover:bg-solar-orange">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register">
                      <Button className="bg-solar-yellow text-foreground hover:bg-solar-orange">
                        Get Started
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="outline">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-72 h-72 bg-solar-yellow rounded-full opacity-20 absolute -top-6 -left-6"></div>
                <img 
                  src="https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Solar panels on rooftop" 
                  className="rounded-lg shadow-lg relative z-10 max-w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How Ray Unity Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform simplifies every step of the community solar journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-solar-yellow rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">1. Form a Community</h3>
              <p className="text-muted-foreground">
                Create or join a community in your neighborhood based on your location.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-solar-blue rounded-full flex items-center justify-center mb-4">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-medium mb-2">2. Track Energy Usage</h3>
              <p className="text-muted-foreground">
                Input your electricity bills to calculate your community's solar requirements.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-solar-green rounded-full flex items-center justify-center mb-4">
                <Sun className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-medium mb-2">3. Go Solar Together</h3>
              <p className="text-muted-foreground">
                Select from verified providers, split costs, and enjoy clean energy savings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Benefits of Community Solar</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ray Unity makes solar energy accessible and affordable for everyone
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-solar-yellow rounded-full flex items-center justify-center">
                  <Check className="h-5 w-5 text-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Lower Installation Costs</h3>
                <p className="text-muted-foreground">
                  By pooling resources with neighbors, the per-household cost of installation is significantly reduced.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-solar-yellow rounded-full flex items-center justify-center">
                  <Check className="h-5 w-5 text-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Reduced Electricity Bills</h3>
                <p className="text-muted-foreground">
                  Generate clean energy and see immediate savings on your monthly electricity bills.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-solar-yellow rounded-full flex items-center justify-center">
                  <Check className="h-5 w-5 text-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Environmental Impact</h3>
                <p className="text-muted-foreground">
                  Reduce carbon footprint and contribute to a sustainable future for your community.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 bg-solar-yellow rounded-full flex items-center justify-center">
                  <Check className="h-5 w-5 text-foreground" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-2">Transparent Process</h3>
                <p className="text-muted-foreground">
                  Track every step from planning to installation and monitor your savings in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Provider Section */}
      <section className="py-12 bg-solar-blue text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Are You a Solar Provider?</h2>
              <p className="mb-6">
                Join Ray Unity to connect with communities seeking solar solutions. 
                Expand your business and contribute to India's sustainable energy future.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Handshake className="h-5 w-5" />
                  <span>Connect directly with pre-qualified community groups</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Handshake className="h-5 w-5" />
                  <span>Streamlined quotation and approval process</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Handshake className="h-5 w-5" />
                  <span>Simplified project management and payment tracking</span>
                </div>
              </div>
              <div className="mt-8">
                <Link to="/register">
                  <Button className="bg-white text-solar-blue hover:bg-opacity-90">
                    Register as a Provider
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://images.unsplash.com/photo-1591696205602-2f950c417cb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Solar installation technicians" 
                className="rounded-lg shadow-lg max-w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Go Solar?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join Ray Unity today and take the first step towards affordable, 
            community-based solar energy for your neighborhood.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <Button className="bg-solar-yellow text-foreground hover:bg-solar-orange">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
