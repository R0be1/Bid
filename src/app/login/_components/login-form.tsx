
"use client";

import { useState, FormEvent, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Phone, KeyRound, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { login } from "../actions";
import type { AuthResult } from "@/lib/auth";

export function LoginForm() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const authResult: AuthResult = await login(phone, password);
      
      if (authResult.success) {
        if (authResult.forcePasswordChange && authResult.userId) {
            router.push(`/auth/force-change-password?userId=${authResult.userId}`);
            return;
        }

        toast({ title: "Login Successful", description: authResult.message });
        const redirectUrl = searchParams.get('redirect');
        
        let destination = "/";
        if (redirectUrl) {
          destination = redirectUrl;
        } else {
          switch (authResult.role) {
            case "super-admin":
              destination = "/super-admin";
              break;
            case "admin":
              destination = "/admin";
              break;
            case "user":
              destination = "/";
              break;
            default:
              destination = "/";
              break;
          }
        }
        // Force a full page reload to ensure all components are re-rendered with the new session state.
        window.location.href = destination;
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
    <div className="flex items-center justify-center min-h-full w-full bg-muted/40">
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
              <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
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
              <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <KeyRound className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
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
