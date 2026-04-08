"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mic2, BarChart3, FileText, Home } from "lucide-react";

export default function Sidebar() {
  const path = usePathname();

  const links = [
    { href: "/start", label: "Interview", icon: Mic2 },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/report", label: "Report", icon: FileText },
  ];

  const isActive = (href: string) => path === href;

  return (
    <aside className="w-64 min-h-screen border-r border-border bg-card/50 backdrop-blur-sm p-6 flex flex-col">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8 group">
        <div className="w-10 h-10 bg-linear-to-br from-primary to-accent rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-primary/25 transition-all">
          <span className="text-primary-foreground font-bold">P</span>
        </div>
        <span className="text-xl font-semibold">PrepWise</span>
      </Link>

      {/* Main Navigation */}
      <nav className="space-y-1 flex-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                active
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="pt-6 border-t border-border">
        <div className="p-4 rounded-lg bg-muted/30 border border-border space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Tip
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Practice regularly to improve your interview performance and gain confidence.
          </p>
        </div>
      </div>
    </aside>
  );
}