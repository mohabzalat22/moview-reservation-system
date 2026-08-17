"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      router.push("/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-center text-foreground">
            Create an account
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="text-sm text-primary bg-primary/10 border border-primary/20 rounded-md px-3 py-2">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-muted-foreground">Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-muted-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-muted-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-muted-foreground">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t-white/[0.06]">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-semibold cursor-pointer" disabled={loading}>
              {loading ? "Creating account…" : "Sign up"}
            </Button>
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
