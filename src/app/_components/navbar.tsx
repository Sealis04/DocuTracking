import { Button } from "~/components/ui/button"
import AddDialog from "./dialogComponents/addRecordDialog";
import { useState } from "react";
import Logout from "./logoutButton";
import ListDialog from "./dialogComponents/endorsedToListDialog";

interface NavbarInterface {
  refetch: () => void;
}
export default function Navbar({refetch}: NavbarInterface){
  const [open, setOpen] = useState(false);
  // const [openList, setOpenList] = useState(false);
    return (
      <div className="flex h-[6vh] gap-2 w-full flex-wrap items-center">
        <Button onClick={()=>{
          setOpen(true);
        }}>Add Record</Button>
        {/* <Button onClick={()=>{
          setOpenList(true);
        }}>Print List</Button> */}
        <Logout/>
        <AddDialog refetch={refetch}  open={open} onOpenChange={setOpen}/>
        {/* <ListDialog open={openList} onOpenChange={setOpenList}/> */}
      </div>
    );
}