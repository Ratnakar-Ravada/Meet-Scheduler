
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const AuthButton = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuth = () => {
    // In a real app, this would trigger the NextAuth.js flow
    // For now, we'll simulate authentication
    setIsAuthenticated(!isAuthenticated);
  };

  if (isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="rounded-full p-0 h-10 w-10">
            <Avatar className="h-9 w-9 transition duration-300 hover:ring-2 hover:ring-primary/40">
              <AvatarImage src="https://i.pravatar.cc/100" alt="User" />
              <AvatarFallback className="bg-primary/10 text-primary">
                <User size={18} />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mt-1 animate-fade-in">
          <div className="p-2 border-b">
            <p className="font-medium">John Doe</p>
            <p className="text-sm text-muted-foreground">john.doe@example.com</p>
          </div>
          <DropdownMenuItem 
            className="cursor-pointer flex items-center text-destructive focus:text-destructive mt-1"
            onClick={handleAuth}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button 
      onClick={handleAuth} 
      className="button-hover"
      size="sm"
    >
      Sign in with Google
    </Button>
  );
};

export default AuthButton;
