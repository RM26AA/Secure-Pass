
import React from 'react';
import { Shield } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-6 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Shield className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">SecurePass</h1>
              <p className="text-blue-100">Advanced Password Generator & Security Checker</p>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <p className="text-sm font-medium">🔒 Your Security Matters</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
