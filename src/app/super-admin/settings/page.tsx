
import { addSuperAdmin, getSuperAdmins } from "@/lib/super-admins";
import { SettingsForm } from "./_components/settings-form";
import { SuperAdminList } from "./_components/super-admin-list";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";


export default async function SettingsPage() {
    const admins = await getSuperAdmins();

    return (
        <div className="space-y-8 p-4 sm:p-6 lg:p-8">
            <div>
                <h1 className="text-3xl font-bold font-headline text-primary">Settings</h1>
                <p className="text-muted-foreground">Manage super admin users.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle>Register New Super Admin</CardTitle>
                        <CardDescription>Add another user with super administrative privileges.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SettingsForm onAddAdmin={addSuperAdmin} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Registered Super Admins</CardTitle>
                        <CardDescription>List of all users with super administrative privileges.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <SuperAdminList initialAdmins={admins} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

