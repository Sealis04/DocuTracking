
'use client'
import { logout } from "~/actions/actions";
import { Button } from "~/components/ui/button";

export default function Logout(){
    return (
      <div className="flex justify-center">
        <Button
          className="absolute right-10 bg-red-500"
          onClick={async () => {
            await logout();
          }}
        >
          Logout
        </Button>
      </div>
    );
}