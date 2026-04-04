"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email
    });

    if (error) alert(error.message);
    else alert("Check your email for login link!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>

        <Input
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button onClick={handleLogin}>
          Send Magic Link
        </Button>
      </div>
    </div>
  );
}