
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
import { Info, Phone } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Register</CardTitle>
          <CardDescription>
            Create an account to start bidding on exclusive items.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="full-name">Full Name</Label>
            <Input id="full-name" placeholder="John Doe" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
              </div>
              <Input id="phone" type="tel" placeholder="(123) 456-7890" required className="pl-10" />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Your account will be pending approval from an administrator. For some auctions, payment of fees and phone verification will be required.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>Create Account</Button>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline text-primary">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
