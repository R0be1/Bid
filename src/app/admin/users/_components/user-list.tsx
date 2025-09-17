
"use client";

import type { User } from "@/lib/types";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { updateUserStatus } from "@/lib/users";
import { DollarSign } from "lucide-react";

interface UserListProps {
  initialUsers: User[];
}

const statusVariantMap: { [key in User['status']]: 'default' | 'secondary' | 'destructive' } = {
  approved: 'default',
  pending: 'secondary',
  blocked: 'destructive'
};

export function UserList({ initialUsers }: UserListProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const { toast } = useToast();

  const handleStatusChange = (userId: string, newStatus: User['status']) => {
    try {
      const updatedUser = updateUserStatus(userId, newStatus);
      if (updatedUser) {
        setUsers(users.map(u => u.id === userId ? updatedUser : u));
        toast({
          title: "Status Updated",
          description: `User ${updatedUser.name}'s status changed to ${newStatus}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status.",
        variant: "destructive",
      });
    }
  };

  if (users.length === 0) {
    return <p className="text-muted-foreground">No users found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Payments</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Change Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {user.paidParticipation ? <Badge variant="secondary" className="gap-1"><DollarSign className="h-3 w-3"/> Participation</Badge> : null}
                  {user.paidDeposit ? <Badge variant="secondary" className="gap-1"><DollarSign className="h-3 w-3"/> Deposit</Badge> : null}
                  {!user.paidParticipation && !user.paidDeposit && <span className="text-xs text-muted-foreground">None</span>}
                </div>
              </TableCell>
              <TableCell>
                 <Badge variant={statusVariantMap[user.status]} className="capitalize">
                    {user.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Select
                  value={user.status}
                  onValueChange={(value: User['status']) => handleStatusChange(user.id, value)}
                >
                  <SelectTrigger className="w-[120px] ml-auto">
                    <SelectValue placeholder="Change status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
