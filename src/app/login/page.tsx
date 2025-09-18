
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
import { Phone, KeyRound } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAuctioneers } from "@/lib/auctioneers";
import { getUsers } from "@/lib/users";
import { getSuperAdmins } from "@/lib/super-admins";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const superAdmin = getSuperAdmins()[0]; // Assuming one super admin for now
    const auctioneers = getAuctioneers();
    const users = getUsers();

    // Super Admin Check
    if (phone === "0912345678" && password === "Admin@123") {
      toast({ title: "Login Successful", description: "Redirecting to Super Admin Dashboard." });
      router.push("/super-admin");
      return;
    }

    // Auctioneer Check
    const auctioneer = auctioneers.find(
      (a) => a.user.phone === phone && a.user.tempPassword === password
    );
    if (auctioneer) {
      // In a real app, you would force a password change here.
      toast({ title: "Login Successful", description: `Welcome, ${auctioneer.name}.` });
      router.push("/admin");
      return;
    }
    
    // Bidder/Customer check (mocked)
    // In a real app, you would check a hashed password from your database.
    const user = users.find(u => u.email.split('@')[0] === phone); // MOCK: using user's name as phone for demo
    if (user && password === "password") {
       toast({ title: "Login Successful", description: `Welcome back, ${user.name}!` });
       router.push("/dashboard");
       return;
    }


    toast({
      title: "Invalid Credentials",
      description: "Please check your phone number and password.",
      variant: "destructive",
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
            <Button className="w-full" type="submit">Sign in</Button>
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
