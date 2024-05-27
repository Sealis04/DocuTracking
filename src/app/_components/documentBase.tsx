import { type listDocument } from "~/models/models";
import ListTable from "./listTable";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { useContext, useEffect, useRef } from "react";
import { SessionContext } from "./table";

interface DocumentBaseInterface{
    list:   listDocument []
    className?:string
}

export default function DocumentBase({list,className}:DocumentBaseInterface){
    const docuRef = useRef<HTMLDivElement>(null);
    const session = useContext(SessionContext)
    useEffect(()=>{
        if(!docuRef.current) return;

        if(docuRef.current.clientHeight >= 1000){
            docuRef.current.className += ' break-after-page'
        }
    },[docuRef])
    return (
      <div ref={docuRef} className={cn("flex flex-col gap-4 print:max-w-[11in] print:min-w-[8.5in] print:m-16",className)}>
        <div className="flex gap-2">
          <Label>Endorsed To: </Label>
          <Label>{list[0]?.endorsedTo}</Label>
        </div>
        <div className="flex gap-2">
          <Label>Print Date: </Label>
          <Label>{new Date().toLocaleDateString()}</Label>
        </div>
        <div className="flex gap-2">
          <Label>Printed By: </Label>
          <Label>{session?.name}</Label>
        </div>
        <ListTable list={list} />
      </div>
    );
}