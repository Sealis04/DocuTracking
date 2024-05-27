import { redirect } from "next/navigation";
import { UseGetSession, isLoggedIn } from "~/lib/serverutils";
import Table from "../_components/table";

export const dynamic = "force-dynamic"

export default async function Home(){
const status = await isLoggedIn();
const session = await UseGetSession();
  if (!status) {
    redirect("/");
  }
  if(!session.user.resetPass){
    redirect(`/resetDetails/${session.user.id}`);
  }
    return (
      <div>
        <Table session={session.user}/>
      </div>
    );
}