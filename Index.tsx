
import React from 'react';
import Header from '@/components/Header';
import PasswordGenerator from '@/components/PasswordGenerator';
import Instructions from '@/components/Instructions';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      <main className="py-12">
        <PasswordGenerator />
      </main>
      <Instructions />
    </div>
  );
};

export default Index;
