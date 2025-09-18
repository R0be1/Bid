
"use client";

import type { User } from "@/lib/types";
import { useState, useMemo } from "react";
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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { updateUserStatus } from "@/lib/users";
import { DollarSign, Paperclip, CheckCircle } from "lucide-react";
import Link from "next/link";

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
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
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
  
  const handleBulkApprove = () => {
    const idsToApprove = Array.from(selectedUserIds);
    let approvedCount = 0;
    const updatedUsers = users.map(user => {
      if (idsToApprove.includes(user.id) && user.status === 'pending') {
        user.status = 'approved';
        approvedCount++;
      }
      return user;
    });

    setUsers(updatedUsers);
    setSelectedUserIds(new Set());
    toast({
      title: "Bulk Approval Successful",
      description: `${approvedCount} user(s) have been approved.`,
    });
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    const newSelectedIds = new Set(selectedUserIds);
    if (checked) {
      newSelectedIds.add(userId);
    } else {
      newSelectedIds.delete(userId);
    }
    setSelectedUserIds(newSelectedIds);
  };
  
  const handleSelectAll = (checked: boolean) => {
      if (checked) {
          const allUserIds = new Set(users.map(u => u.id));
          setSelectedUserIds(allUserIds);
      } else {
          setSelectedUserIds(new Set());
      }
  };

  const isAllSelected = useMemo(() => selectedUserIds.size > 0 && selectedUserIds.size === users.length, [selectedUserIds, users.length]);
  const isSomeSelected = useMemo(() => selectedUserIds.size > 0 && selectedUserIds.size < users.length, [selectedUserIds, users.length]);

  if (users.length === 0) {
    return <p className="text-muted-foreground">No users found.</p>;
  }

  return (
    <div className="space-y-4">
        {selectedUserIds.size > 0 && (
            <div className="flex items-center gap-4 p-2 rounded-md bg-secondary border">
                <p className="text-sm font-medium">{selectedUserIds.size} user(s) selected.</p>
                <Button size="sm" onClick={handleBulkApprove}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Selected
                </Button>
            </div>
        )}
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                  checked={isAllSelected || isSomeSelected}
                  indeterminate={isSomeSelected}
                  aria-label="Select all rows"
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Payments</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Change Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} data-state={selectedUserIds.has(user.id) ? "selected" : ""}>
                <TableCell>
                  <Checkbox 
                    onCheckedChange={(checked) => handleSelectUser(user.id, Boolean(checked))}
                    checked={selectedUserIds.has(user.id)}
                    aria-label={`Select user ${user.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {user.paidParticipation ? <Badge variant="secondary" className="gap-1"><DollarSign className="h-3 w-3"/> Participation</Badge> : null}
                    {user.paidDeposit ? <Badge variant="secondary" className="gap-1"><DollarSign className="h-3 w-3"/> Deposit</Badge> : null}
                    {user.paymentMethod === 'receipt' && user.receiptUrl && (
                      <Button variant="ghost" size="icon" asChild className="h-6 w-6">
                        <Link href={user.receiptUrl} target="_blank" title="View Receipt">
                          <Paperclip className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
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
                    <SelectTrigger className="w-[120px] ml-auto h-8">
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
    </div>
  );
}
