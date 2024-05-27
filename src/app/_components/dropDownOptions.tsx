import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu";

interface DropdownOptionsInterface{
  openDialog: (
    dialog: string
) => void,
}

export default function DropdownOptions({openDialog}:DropdownOptionsInterface){
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
            >
              <DotsHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[160px]">
            <DropdownMenuItem onClick={()=>{
              openDialog('endorse');
            }}>Endorse letter</DropdownMenuItem>
            <DropdownMenuItem onClick={()=>{
              openDialog('action');
            }}>Add Action Taken</DropdownMenuItem>
            <DropdownMenuItem onClick={()=>{
              openDialog('remarks');
            }}>Add Remarks</DropdownMenuItem>
            <DropdownMenuItem onClick={()=>{
              openDialog('details');
            }}>View Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
}