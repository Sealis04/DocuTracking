'use server'

import { getIronSession } from "iron-session"
import { cookies } from "next/headers"
import { sessionOptions } from "./utils"
import { type userDetails } from "~/models/models"
import { redirect } from "next/navigation"


const isLoggedIn = async () =>{
    const session = await getIronSession<{ user: userDetails }>(cookies(),sessionOptions);
        if(session.user){
            if(session.user.id != undefined){
                return true;
            }else{
                return false;
            }
        }else{
            return false
        }
}

const UseGetSession = async () =>{
    const session = await getIronSession<{ user: userDetails }>(cookies(),sessionOptions);
    return session;
}
export {isLoggedIn,UseGetSession}