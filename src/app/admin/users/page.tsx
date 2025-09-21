
import { getUsersForAdmin } from "@/lib/data/admin";
import { UserList } from "./_components/user-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCog } from "lucide-react";
import { getCurrentUser } from "@/lib/data/server-only";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect('/login');

  const users = await getUsersForAdmin(currentUser.id);

  return (
    <div className="space-y-8 p-4 md:p-8">
        <div>
            <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2">
                <UserCog />
                Manage Bidders
            </h1>
            <p className="text-muted-foreground">Approve, block, and manage registered bidders for your auctions.</p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Bidders in Your Auctions</CardTitle>
                <CardDescription>View all bidders who have participated in your auctions, their approval status, and any payments made for auction entry.</CardDescription>
            </CardHeader>
            <CardContent>
                <UserList initialUsers={users} />
            </CardContent>
        </Card>
    </div>
  );
}
