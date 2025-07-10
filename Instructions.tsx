
import React from 'react';
import { CheckCircle, Shield, Copy, Sliders } from 'lucide-react';

const Instructions = () => {
  const features = [
    {
      icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      title: "Password Analysis",
      description: "Enter any password to check its strength and get improvement suggestions."
    },
    {
      icon: <Shield className="h-5 w-5 text-blue-600" />,
      title: "Smart Improvement",
      description: "Automatically enhance weak passwords while keeping them recognizable."
    },
    {
      icon: <Sliders className="h-5 w-5 text-purple-600" />,
      title: "Custom Generation",
      description: "Generate secure passwords with customizable length using the slider."
    },
    {
      icon: <Copy className="h-5 w-5 text-orange-600" />,
      title: "Easy Copying",
      description: "One-click copy for any password - secure and convenient."
    }
  ];

  const tips = [
    "Use at least 12 characters for better security",
    "Mix uppercase, lowercase, numbers, and symbols",
    "Avoid common words and personal information",
    "Use unique passwords for each account",
    "Consider using a password manager"
  ];

  return (
    <footer className="w-full bg-gray-50 py-12 px-4 mt-12">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Features */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">How It Works</h3>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  {feature.icon}
                  <div>
                    <h4 className="font-medium text-gray-800">{feature.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Tips */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Security Tips</h3>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <ul className="space-y-3">
                {tips.map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></span>
                    <span className="text-sm text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            🔐 All password processing happens locally in your browser - your passwords never leave your device.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Instructions;
