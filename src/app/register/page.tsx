
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Phone, KeyRound, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const [step, setStep] = useState("phone"); // 'phone', 'otp', 'details', 'success'
  const [phoneNumber, setPhoneNumber] = useState("");
  const { toast } = useToast();

  const handlePhoneSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const phone = (event.currentTarget.elements.namedItem("phone") as HTMLInputElement).value;
    if (phone) {
        setPhoneNumber(phone);
        toast({
            title: "OTP Sent",
            description: "A one-time password has been sent to your phone.",
        });
        setStep("otp");
    }
  };

  const handleOtpSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const otp = (event.currentTarget.elements.namedItem("otp") as HTMLInputElement).value;

    // In a real app, you'd verify the OTP with your backend.
    if (otp && /^\d{6}$/.test(otp)) {
      toast({
        title: "Phone Verified",
        description: "Please complete your registration details.",
      });
      setStep("details");
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please enter the 6-digit code sent to your phone.",
        variant: "destructive",
      });
    }
  };
  
  const handleDetailsSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // In a real app, you would call a server action here to create the user.
    toast({
      title: "Registration Complete",
      description: "Your account has been created and is pending approval.",
    });
    setStep("success");
  };

  return (
    <div className="flex items-center justify-center py-12">
      {step === "phone" && (
        <Card className="w-full max-w-sm shadow-lg">
          <form onSubmit={handlePhoneSubmit}>
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Register</CardTitle>
              <CardDescription>
                Enter your phone number to begin registration.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input id="phone" name="phone" type="tel" placeholder="(123) 456-7890" required className="pl-10" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                Send Verification Code
              </Button>
               <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline text-primary">
                  Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      )}

      {step === "otp" && (
        <Card className="w-full max-w-sm shadow-lg">
           <form onSubmit={handleOtpSubmit}>
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Verify Phone</CardTitle>
              <CardDescription>
                Enter the 6-digit code sent to {phoneNumber}.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
               <div className="grid gap-2">
                <Label htmlFor="otp">Verification Code</Label>
                <div className="relative">
                   <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <KeyRound className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <Input id="otp" name="otp" type="text" placeholder="123456" required className="pl-10 tracking-widest text-center" maxLength={6} />
                </div>
              </div>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  This is a demo. In a real app, you would receive an SMS.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                Verify Code
              </Button>
              <Button variant="link" onClick={() => setStep("phone")}>
                  Use a different number
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {step === "details" && (
        <Card className="w-full max-w-sm shadow-lg">
          <form onSubmit={handleDetailsSubmit}>
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Complete Profile</CardTitle>
              <CardDescription>
                Your phone number is verified. Now, create your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
               <div className="grid gap-2">
                <Label htmlFor="phone-display">Phone Number</Label>
                <Input id="phone-display" type="tel" value={phoneNumber} disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" placeholder="John Doe" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                Create Account
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {step === "success" && (
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
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href="/">Back to Auctions</Link>
                </Button>
            </CardFooter>
        </Card>
      )}

    </div>
  );
}
