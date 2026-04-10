"use client";

import Sidebar from "./sidebar";

export default function DashboardLayout({ children }: any) {
  return (
    <div className="flex">

      <Sidebar />

      <main className="flex-1 min-h-screen bg-background p-6">
        {children}
      </main>

    </div>
  );
}