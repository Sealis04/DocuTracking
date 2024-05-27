import { useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import { type UseSearchFilters } from "./table";

export default function SearchBar({filters} : {filters: UseSearchFilters}){
    return (
      <div className="flex w-full flex-wrap gap-2">
        <SearchBarHeader
          title="Control No"
          docuInput={filters.controlNo ?? ''}
          customOnChange={(val:string) => {
            filters.setControlNo(val)
          }}
          type="text"
        />
        <SearchBarHeader
          title="Admin Control No"
          docuInput={filters.adminControlNo ?? ''}
          customOnChange={(val:string) => {
            filters.setAdminControlNo(val)
          }}
          type="text"
        />
        <SearchBarHeader
          title="Particulars"
          docuInput={filters.particulars ?? ''}
          customOnChange={(val:string) => {
            filters.setParticulars(val)
          }}
          type="text"
        />
      </div>
    );
}

interface SearchBarHeaderInterface
extends React.HTMLAttributes<HTMLInputElement> {
title: string
customOnChange: (arg0:string)=>void
type: React.HTMLInputTypeAttribute
docuInput:string
}

export function SearchBarHeader({
    title,
    className,
    customOnChange,
    type = "text",
    docuInput
  }: SearchBarHeaderInterface) {
    const[input, setInput] = useState(docuInput);
    const [firstRender, setFirstRender] = useState(true);
        // debounce code
        useEffect(() => {
         if(firstRender){
          setFirstRender(false);
          return;
         }
          const timeout = setTimeout(() => {
            customOnChange(input);
          }, 750);
          return () => clearTimeout(timeout);
        }, [input, customOnChange, firstRender]);
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <Input type={type} placeholder={title} className="px-1 py-1 h-9 text-center" value={input} onChange={(e)=>{
          setInput(e.target.value);
        }}/>
      </div>
    )
  }