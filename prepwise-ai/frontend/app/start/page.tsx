"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function StartPage() {
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("");
  const router = useRouter();

  const handleStart = () => {
    if (!role || !level) return alert("Fill all fields");

    localStorage.setItem("role", role);
    localStorage.setItem("level", level);

    router.push("/interview");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="space-y-4 w-80">

        <h1 className="text-2xl font-bold">Start Interview</h1>

        <Input
          placeholder="Job Role (e.g. Frontend Developer)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />

        <Input
          placeholder="Experience Level (Entry / Mid / Senior)"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        />

        <Button onClick={handleStart} className="w-full">
          Start Interview
        </Button>

      </div>
    </div>
  );
}