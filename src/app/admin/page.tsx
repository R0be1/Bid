import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Shield } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader>
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit">
            <Shield className="h-8 w-8" />
          </div>
          <CardTitle className="mt-4">Admin Dashboard</CardTitle>
          <CardDescription>Manage users, auctions, and settings.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This area is restricted to administrators only. Full functionality for managing the auction system will be available here.
          </p>
          <Button asChild className="w-full" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
            <Link href="/">Return to Homepage</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
