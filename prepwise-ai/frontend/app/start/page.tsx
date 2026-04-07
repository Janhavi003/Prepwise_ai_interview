"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function StartPage() {
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("");
  const router = useRouter();

  const start = () => {
    if (!role || !level) return;

    localStorage.setItem("role", role);
    localStorage.setItem("level", level);

    router.push("/interview");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-6">

      <Card className="w-full max-w-md p-8 space-y-6">

        <div>
          <h1 className="text-2xl font-semibold">Start Interview</h1>
          <p className="text-muted-foreground text-sm">
            Enter your target role and experience level
          </p>
        </div>

        <Input
          placeholder="Frontend Developer"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <Input
          placeholder="Entry / Mid / Senior"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        />

        <Button onClick={start} className="w-full">
          Start Interview
        </Button>

      </Card>

    </main>
  );
}