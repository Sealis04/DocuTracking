"use client";
import { useEffect } from "react";
import FormComponent from "./userPassComponent";
import { resetDetails } from "~/actions/actions";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export default function ResetDetails() {
    const initialState ={
        isSuccess:false,
        message:""
      }
      const [state, formAction] = useFormState(resetDetails,initialState);
      useEffect(()=>{
        if(state == undefined){
          return;
        }
        if(state.message != ''){
          if(!state.isSuccess){
            toast.error("Error, something went wrong",{
              description:state.message,
            })
          }else{
            toast.dismiss();
          }
        }
      },[state])
  return (
    <FormComponent formAction={formAction} buttonName="Submit"/>
  );
}
