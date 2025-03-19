import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LogOut } from "lucide-react";
import { handleLogout } from "@/apis/auth";

const ConsentWarning = () => {
  return (
    <div className="p-4 bg-red-500 text-white text-sm rounded-lg">
      <Popover>
        <p className="font-medium">
          Permissions not granted to create or schedule meetings. {""}
          <PopoverTrigger asChild>
            <span className="underline cursor-pointer hover:text-red-200">
              Know more
            </span>
          </PopoverTrigger>
        </p>
        <PopoverContent className="p-4 max-w-sm text-black space-y-2">
          <p className="font-medium">To create or schedule a meeting:</p>

          <ul className="list-disc list-inside text-sm space-y-1">
            <ul className="space-y-1 text-sm">
              <li className="flex items-start gap-1.5">
                <span className="text-black">-</span> You must grant the
                necessary permissions.
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-black">-</span> This may require selecting
                the checkboxes on the consent screen.
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-black">-</span> Log in again and provide
                consent to ensure a seamless experience.
              </li>
            </ul>
          </ul>
          <hr className="my-4" />
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all duration-300 shadow-none outline-none"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-white text-sm font-medium">Log out</span>
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ConsentWarning;
