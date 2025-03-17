
import React from 'react';
import AuthButton from './AuthButton';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const isMobile = useIsMobile();

  return (
    <nav className="w-full py-6 px-4 sm:px-6 animate-slide-down">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
            <span className="text-white font-semibold text-lg">M</span>
          </div>
          <h1 className="text-xl font-semibold">MeetLink</h1>
        </div>
        <div className="flex items-center space-x-4">
          <AuthButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
