"use client";

import { useState } from "react";

export function CopyEmailButton({ email, ro }: { email: string; ro: boolean }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  return (
    <div>
      <button
        type="button"
        className="button-outline"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(email);
            setStatus("copied");
          } catch {
            setStatus("failed");
          }
        }}
      >
        {ro ? "Copiază adresa de email" : "Copy email address"}
      </button>
      <p role="status" aria-live="polite" className="mt-2 text-sm">
        {status === "copied"
          ? ro
            ? "Adresa a fost copiată. O poți lipi în serviciul tău de email."
            : "Address copied. You can paste it into your email service."
          : status === "failed"
            ? ro
              ? "Copierea automată nu este disponibilă. Selectează și copiază adresa de mai sus."
              : "Automatic copying is unavailable. Select and copy the address above."
            : ""}
      </p>
    </div>
  );
}
