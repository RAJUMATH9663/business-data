import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { getSession, safeNext } from "@/lib/auth";

export const metadata = {
  title: "Client Login",
  description: "Sign in to your NivoLeads account to access and download your purchased verified business contact datasets.",
};

export default async function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  const next = safeNext(searchParams.next, "");
  const s = await getSession();
  if (s) redirect(next || (s.user.role === "ADMIN" ? "/admin" : "/purchases"));
  return <AuthForm mode="login" next={next || undefined} />;
}
