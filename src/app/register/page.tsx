"use client";

import { useState, useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
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
import { CheckCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { registerUser, type RegisterFormState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Creating Account..." : "Create Account"}
    </Button>
  );
}

export default function RegisterPage() {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const initialState: RegisterFormState = { success: false, message: "" };
  const [state, formAction] = useActionState(registerUser, initialState);

  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (state.message) {
       if (state.success) {
          toast({
            title: "Registration Submitted!",
            description: state.message,
          });
          setIsSubmitted(true);
       } else {
            toast({
              title: "Registration Failed",
              description: state.message,
              variant: "destructive",
            });
       }
    }
  }, [state, toast]);
  

  if (isSubmitted) {
    return (
       <div className="flex items-center justify-center min-h-full w-full px-4">
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
    <div className="flex items-center justify-center min-h-full w-full px-4">
        <Card className="w-full max-w-md shadow-lg">
          <form action={formAction}>
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Create Your Account</CardTitle>
              <CardDescription>
                Complete the form below to register. Your account will require admin approval.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name <span className="text-destructive">*</span></Label>
                    <Input id="firstName" name="firstName" placeholder="John" required />
                  </div>
                   <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name <span className="text-destructive">*</span></Label>
                    <Input id="lastName" name="lastName" placeholder="Smith" required />
                  </div>
               </div>
               <div className="grid gap-2">
                <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                <Input id="phone" name="phone" type="tel" placeholder="0912345678" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password <span className="text-destructive">*</span></Label>
                <div className="relative">
                    <Input id="password" name="password" type={showPassword ? "text" : "password"} required />
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
              <SubmitButton />
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
