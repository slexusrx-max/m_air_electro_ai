import { AuthForm } from "@/components/auth/auth-form";
import { requestPasswordReset } from "@/app/(auth)/actions";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { PlatformShell } from "@/components/platform-shell";
export default function ForgotPasswordPage() { return <PlatformShell contentClassName="flex flex-1 items-center px-4 py-12"><AuthForm dictionary={getDictionary()} action={requestPasswordReset} mode="forgot" /></PlatformShell>; }
