import { AuthForm } from "@/components/auth/auth-form";
import { signUp } from "@/app/(auth)/actions";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { PlatformShell } from "@/components/platform-shell";
export default function RegisterPage() { return <PlatformShell contentClassName="flex flex-1 items-center px-4 py-12"><AuthForm dictionary={getDictionary()} action={signUp} mode="register" /></PlatformShell>; }
