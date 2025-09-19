
import { getSuperAdminProfile } from "./actions";
import { updateUserPassword } from "@/app/profile/actions";
import { User, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChangePasswordForm } from "./_components/change-password-form";


export default async function SuperAdminProfilePage() {
  const superAdmin = await getSuperAdminProfile();
  
  if (!superAdmin) {
      return <div>Loading...</div>
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
        <div>
            <h1 className="text-3xl font-bold font-headline text-primary">Your Profile</h1>
            <p className="text-muted-foreground">View your account details and manage your password.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User /> Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={superAdmin.name} readOnly disabled className="border-0 bg-secondary" />
                    </div>
                    <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" value={superAdmin.email} readOnly disabled className="border-0 bg-secondary" />
                    </div>
                     <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" value={superAdmin.phone} readOnly disabled className="border-0 bg-secondary" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Lock /> Change Password</CardTitle>
                    <CardDescription>Update your password here. Remember to choose a strong one.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChangePasswordForm onUpdatePassword={updateUserPassword} />
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
