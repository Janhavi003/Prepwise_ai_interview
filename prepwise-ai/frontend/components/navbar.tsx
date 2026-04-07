"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="w-full fixed top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

        <h1 className="text-lg font-semibold">PrepWise AI</h1>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link href="/start">Interview</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>

        <Link href="/start">
          <Button size="sm">Start</Button>
        </Link>

      </div>
    </nav>
  );
}