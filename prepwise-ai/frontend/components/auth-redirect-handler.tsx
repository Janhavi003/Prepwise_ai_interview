"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

/**
 * Redirects Supabase auth hash errors (e.g. otp_expired) to login with a message.
 * Errors can land on Site URL (/) when redirect_to doesn't match or link is invalid.
 */
export function AuthRedirectHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/auth/callback" || pathname === "/login") return;

    const hash = window.location.hash.slice(1);
    if (!hash.includes("error")) return;

    const params = new URLSearchParams(hash);
    const errorCode = params.get("error_code");
    if (errorCode === "otp_expired" || params.get("error") === "access_denied") {
      router.replace("/login?error=link_expired");
    }
  }, [pathname, router]);

  return null;
}
