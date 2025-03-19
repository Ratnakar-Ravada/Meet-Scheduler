import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleLogout } from "@/apis/auth";

const AuthButton = ({ loading, isAuthenticated, user }) => {
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
          <div className="w-25 p-2 border-b">
            <p className="font-medium truncate">{user?.name}</p>
            <p className="text-sm text-muted-foreground truncate">
              {user?.email}
            </p>
          </div>

          <div className="flex justify-center py-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-300 shadow-none outline-none"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-white text-sm font-medium">Log out</span>
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  return <></>;
};

export default AuthButton;
