import { AuthForm } from "@/components/auth/auth-form";
import { updatePassword } from "@/app/(auth)/actions";
import { getRequestDictionary } from "@/lib/i18n/request";
import { PlatformShell } from "@/components/platform-shell";
export default async function ResetPasswordPage() { return <PlatformShell contentClassName="flex flex-1 items-center px-4 py-12"><AuthForm dictionary={await getRequestDictionary()} action={updatePassword} mode="reset" /></PlatformShell>; }
