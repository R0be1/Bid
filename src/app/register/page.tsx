
"use client";

import { useState } from "react";
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
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleDetailsSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you would call a server action here to:
    // 1. Validate the input
    // 2. Hash the temporary password
    // 3. Create the user in the database with a 'force password change' flag
    // 4. Handle any potential errors (e.g., phone number already exists)
    
    const formData = new FormData(event.currentTarget);
    const firstName = formData.get("first-name");

    toast({
      title: "Registration Submitted!",
      description: `Welcome, ${firstName}! Your account is pending admin approval.`,
    });
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
       <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-sm shadow-lg text-center">
            <CardHeader>
                <div className="mx-auto bg-green-100 rounded-full p-2 w-fit">
                    <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              <CardTitle className="text-2xl font-headline mt-4">Registration Successful!</CardTitle>
              <CardDescription>
                Your account is now pending approval from an administrator.
              </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">You will be notified once your account is approved. You can then log in and participate in auctions.</p>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
                <Button asChild className="w-full">
                    <Link href="/login">Proceed to Login</Link>
                </Button>
                <Button asChild variant="link" className="w-full">
                    <Link href="/">Back to Auctions</Link>
                </Button>
            </CardFooter>
        </Card>
      </div>
    )
  }


  return (
    <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md shadow-lg">
          <form onSubmit={handleDetailsSubmit}>
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Create Your Account</CardTitle>
              <CardDescription>
                Complete the form below to register. Your account will require admin approval.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
               <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" name="first-name" placeholder="John" required />
                  </div>
                   <div className="grid gap-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" name="last-name" placeholder="Smith" required />
                  </div>
               </div>
               <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="(123) 456-7890" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full">
                Create Account
              </Button>
               <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                  Log in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
    </div>
  );
}
