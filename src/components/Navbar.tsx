
import React from 'react';
import AuthButton from './AuthButton';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = ({ isAuthenticated, user }: { isAuthenticated: boolean; user: any }) => {
  const isMobile = useIsMobile();

  return (
    <nav className="w-full py-6 px-4 sm:px-6 animate-slide-down">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="h-9 w-9 rounded-full flex items-center justify-center">
            <img src='/favicon/favicon.ico' alt="MS"/>
          </div>
          <h1 className="text-xl font-semibold">Meet Scheduler</h1>
        </div>
        <div className="flex items-center space-x-4">
          <AuthButton isAuthenticated={isAuthenticated} user={user} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
