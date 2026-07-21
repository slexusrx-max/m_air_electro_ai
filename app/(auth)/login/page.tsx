import { AuthForm } from "@/components/auth/auth-form";
import { signIn } from "@/app/(auth)/actions";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { PlatformShell } from "@/components/platform-shell";
export default function LoginPage() { return <PlatformShell contentClassName="flex flex-1 items-center px-4 py-12"><AuthForm dictionary={getDictionary()} action={signIn} mode="login" /></PlatformShell>; }
