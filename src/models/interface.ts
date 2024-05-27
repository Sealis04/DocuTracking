import {type  Dispatch,type  SetStateAction } from "react";

export interface DialogInterface{
    open:boolean,
    onOpenChange: Dispatch<SetStateAction<boolean>>
}