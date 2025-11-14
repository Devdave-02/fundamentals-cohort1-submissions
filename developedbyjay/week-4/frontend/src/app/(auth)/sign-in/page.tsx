import { auth } from "@/lib/auth";
import { SignInForm } from "./_components/signInForm";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const session = await auth();

  if (session?.user.id) redirect("/home");
  return <SignInForm />;
}
