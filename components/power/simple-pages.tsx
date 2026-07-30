import Link from "next/link";
import { DataDisclaimer } from "@/components/power/marketing";
import { PlatformShell } from "@/components/platform-shell";
export function SimplePowerPage({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) { return <PlatformShell><main className="mx-auto w-full max-w-5xl text-slate-800"><p className="eyebrow">{eyebrow}</p><h1 className="mt-3 text-4xl font-bold text-slate-950">{title}</h1><div className="mt-8">{children}</div></main></PlatformShell>; }
export function SignInRequired({ feature }: { feature: string }) { return <div className="info-card"><h2>Sign in required</h2><p>Sign in to use {feature}. Public map and methodology pages remain available without an account.</p><Link href="/login" className="button-primary mt-5">Sign in</Link></div>; }
export function DemoModeNote() { return <p className="mt-4 rounded-xl bg-cyan-50 p-3 text-sm text-cyan-900">Demo mode: values below are demonstration data; no payment, subscription, alert or saved location has been created.</p>; }
export { DataDisclaimer };
