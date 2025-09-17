
import { getUsers } from "@/lib/users";
import { UserList } from "./_components/user-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersPage() {
  const users = getUsers();

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline text-primary">Manage Users</h1>
            <p className="text-muted-foreground">Approve, block, and manage registered users.</p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Registered Users</CardTitle>
            </CardHeader>
            <CardContent>
                <UserList initialUsers={users} />
            </CardContent>
        </Card>
    </div>
  );
}
