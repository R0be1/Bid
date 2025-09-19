
"use client";

import { useState, FormEvent, useTransition } from "react";
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
import { Phone, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { login } from "./actions";
import type { AuthResult } from "@/lib/auth";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const authResult: AuthResult = await login(phone, password);

      if (authResult.success) {
        toast({ title: "Login Successful", description: authResult.message });
        switch (authResult.role) {
          case "super-admin":
            router.push("/super-admin");
            break;
          case "admin":
            router.push("/admin");
            break;
          case "user":
            router.push("/dashboard");
            break;
          default:
            router.push("/");
            break;
        }
        router.refresh(); // Refresh layout to get new user state
      } else {
        toast({
          title: "Invalid Credentials",
          description: authResult.message,
          variant: "destructive",
        });
      }
    });
  };


  return (
    <div className="flex items-center justify-center min-h-full w-full">
      <Card className="w-full max-w-sm shadow-lg">
        <form onSubmit={handleLogin}>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Login</CardTitle>
            <CardDescription>
              Enter your phone number and password to access your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="0912345678" 
                    required 
                    className="pl-10" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <KeyRound className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    required 
                    className="pl-10" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isPending}>
              {isPending ? 'Signing in...' : 'Sign in'}
            </Button>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
