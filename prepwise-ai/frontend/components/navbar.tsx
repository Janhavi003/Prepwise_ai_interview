"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="w-full fixed top-0 left-0 z-50 bg-black/80 backdrop-blur border-b border-gray-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <h1 className="text-xl font-bold">PrepWise AI</h1>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-300">
          <Link href="#" className="hover:text-white">
            Features
          </Link>

          <Link href="/dashboard" className="hover:text-white">
            Dashboard
          </Link>

          {/* 🔥 FIXED ROUTE */}
          <Link href="/start" className="hover:text-white">
            Interview
          </Link>
        </div>

        {/* CTA */}
        <Link href="/start">
          <Button size="sm">
            Get Started
          </Button>
        </Link>

      </div>
    </nav>
  );
}