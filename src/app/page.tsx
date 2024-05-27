import { redirect } from "next/navigation";
import LoginForm from "./_components/loginForm";
import { isLoggedIn } from "~/lib/serverutils";

export default async function Home() {
  const status = await isLoggedIn();
  if (status) {
    redirect("/home");
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
     <LoginForm/>
    </main>
  );
}

