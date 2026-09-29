import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getSession, safeNext } from "@/lib/auth";

export const metadata = { title: "Register" };

export default async function RegisterPage({ searchParams }: { searchParams: { next?: string } }) {
  const next = safeNext(searchParams.next, "");
  const s = await getSession();
  if (s) redirect(next || "/purchases");
  return <AuthForm mode="register" next={next || undefined} />;
}
