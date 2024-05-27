import { redirect } from "next/navigation";
import Logout from "~/app/_components/logoutButton";
import ResetDetails from "~/app/_components/resetDetailsForm";
import { Label } from "~/components/ui/label";
import { UseGetSession } from "~/lib/serverutils";

export default async function Home({params}:{params:{userID:number}}){
    const session = await UseGetSession();
    if(!session || session.user.resetPass){
        redirect('/');
    }
    if(session.user.id != params.userID){
        redirect('/');
    }
    //form for username password reset
    return(
        <div className="flex flex-col gap-2 m-4 justify-center">
            <div className="flex justify-between">
            <Label>Please input a new username and password for this account. You will be logged out shortly after submitting so please login again using your new account details</Label>
            <Logout/>
            </div>
            <ResetDetails />
        </div>
    )
}