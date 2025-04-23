
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Ray Unity</h3>
            <p className="text-muted-foreground">
              Empowering communities through collaborative solar energy solutions.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-solar-orange transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-solar-orange transition-colors">About Us</Link></li>
              <li><Link to="/how-it-works" className="text-muted-foreground hover:text-solar-orange transition-colors">How It Works</Link></li>
              <li><Link to="/communities" className="text-muted-foreground hover:text-solar-orange transition-colors">Communities</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/faq" className="text-muted-foreground hover:text-solar-orange transition-colors">FAQ</Link></li>
              <li><Link to="/solar-calculator" className="text-muted-foreground hover:text-solar-orange transition-colors">Solar Calculator</Link></li>
              <li><Link to="/providers" className="text-muted-foreground hover:text-solar-orange transition-colors">Solar Providers</Link></li>
              <li><Link to="/blog" className="text-muted-foreground hover:text-solar-orange transition-colors">Blog</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">Email: info@rayunity.com</li>
              <li className="text-muted-foreground">Phone: +91 1234567890</li>
              <li className="text-muted-foreground">Chennai, Tamil Nadu, India</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Ray Unity. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link to="/terms" className="text-muted-foreground text-sm hover:text-solar-orange transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="text-muted-foreground text-sm hover:text-solar-orange transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
