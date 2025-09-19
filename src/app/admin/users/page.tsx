

import { getUsersForAdmin } from "@/lib/data/admin";
import { UserList } from "./_components/user-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCog } from "lucide-react";

export default async function UsersPage() {
  const users = await getUsersForAdmin();

  return (
    <div className="space-y-8 p-4 md:p-8">
        <div>
            <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
                <UserCog />
                Manage Bidders
            </h1>
            <p className="text-muted-foreground">Approve, block, and manage registered bidders and their payment statuses.</p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Registered Bidders</CardTitle>
                <CardDescription>View all bidders, their approval status, and any payments made for auction entry.</CardDescription>
            </CardHeader>
            <CardContent>
                <UserList initialUsers={users} />
            </CardContent>
        </Card>
    </div>
  );
}
