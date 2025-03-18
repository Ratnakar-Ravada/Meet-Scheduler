import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AuthButton = ({ loading, isAuthenticated, user }) => {
  const handleAuth = async () => {
    window.location.href = process.env.NEXTAUTH_URL + "/api/auth/signin";
  };

  const handleLogout = async () => {
    window.location.href = process.env.NEXTAUTH_URL + "/api/auth/signout";
  };

  if (isAuthenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="rounded-full p-0 h-10 w-10">
            <Avatar className="h-9 w-9 transition duration-300 hover:ring-2 hover:ring-primary/40">
              <AvatarImage src={user?.image} alt="User" />
              <AvatarFallback className="bg-primary/10 text-primary">
                <User size={18} />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mt-1 animate-fade-in">
          <div className="p-2 border-b">
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
          <DropdownMenuItem
            className="cursor-pointer flex items-center text-destructive focus:text-destructive mt-1"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return <></>;
};

export default AuthButton;
