'use client'
import { localLogin, login } from "~/actions/actions";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { toast } from "sonner";
import FormComponent from "./userPassComponent";
export default function LoginForm(){
    const initialState ={
      isLoggedIn:false,
      message:""
    }
    const [state, formAction] = useFormState(localLogin,initialState);
    useEffect(()=>{
      if(state == undefined){
        return;
      }
      if(state.message != ''){
        if(!state.isLoggedIn){
          toast.error("Error, something went wrong",{
            description:state.message,
          })
        }else{
          toast.dismiss();
        }
      }
    },[state])
    return (
      <>
        <FormComponent formAction={formAction} buttonName="Login" />
      </>
    );
}
