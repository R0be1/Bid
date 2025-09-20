
"use client";

import type { UserForAdminTable } from "@/lib/data/admin";
import type { UserStatus } from "@prisma/client";
import { useState, useMemo, useTransition } from "react";
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
import { updateUserStatus, bulkUpdateUserStatus } from "@/app/admin/users/actions";
import { Banknote, Paperclip, CheckCircle, Ban } from "lucide-react";
import Link from "next/link";
import { DataTablePagination } from "@/components/ui/data-table-pagination";


interface UserListProps {
  initialUsers: UserForAdminTable[];
}

const statusVariantMap: { [key in UserStatus]: 'default' | 'secondary' | 'destructive' } = {
  APPROVED: 'default',
  PENDING: 'secondary',
  BLOCKED: 'destructive'
};

export function UserList({ initialUsers }: UserListProps) {
  const [users, setUsers] = useState<UserForAdminTable[]>(initialUsers);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useState(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const handleStatusChange = (userId: string, newStatus: UserStatus) => {
    startTransition(async () => {
      const result = await updateUserStatus(userId, newStatus);
      if (result.success && result.user) {
        setUsers(users.map(u => u.id === userId ? {...u, status: newStatus} : u));
        toast({
          title: "Status Updated",
          description: `User status changed to ${newStatus}.`,
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update user status.",
          variant: "destructive",
        });
      }
    });
  };
  
  const handleBulkAction = (action: 'approve' | 'block') => {
    const idsToUpdate = Array.from(selectedUserIds);
    const newStatus = action === 'approve' ? 'APPROVED' : 'BLOCKED';

    startTransition(async () => {
        const result = await bulkUpdateUserStatus(idsToUpdate, newStatus);
        if (result.success) {
            setUsers(users.map(user => 
                idsToUpdate.includes(user.id) ? { ...user, status: newStatus } : user
            ));
            setSelectedUserIds(new Set());
            toast({
                title: `Bulk ${action === 'approve' ? 'Approval' : 'Block'} Successful`,
                description: `${result.count} user(s) have been updated.`,
            });
        } else {
            toast({
                title: "Error",
                description: result.message,
                variant: "destructive",
            });
        }
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
          const allUserIds = new Set(paginatedUsers.map(u => u.id));
          setSelectedUserIds(allUserIds);
      } else {
          setSelectedUserIds(new Set());
      }
  };

  const paginatedUsers = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return users.slice(startIndex, startIndex + rowsPerPage);
  }, [users, page, rowsPerPage]);

  const isAllOnPageSelected = useMemo(() => paginatedUsers.length > 0 && paginatedUsers.every(u => selectedUserIds.has(u.id)), [selectedUserIds, paginatedUsers]);

  if (users.length === 0) {
    return <p className="text-muted-foreground">No users found.</p>;
  }

  return (
    <div className="space-y-4">
        {selectedUserIds.size > 0 && (
            <div className="flex items-center gap-4 p-2 rounded-md bg-secondary border">
                <p className="text-sm font-medium">{selectedUserIds.size} user(s) selected.</p>
                <Button size="sm" onClick={() => handleBulkAction('approve')} disabled={isPending}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Selected
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleBulkAction('block')} disabled={isPending}>
                    <Ban className="mr-2 h-4 w-4" />
                    Block Selected
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
                  checked={isAllOnPageSelected}
                  aria-label="Select all rows on this page"
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
            {paginatedUsers.map((user) => (
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
                    {user.paidParticipation && <Badge variant="secondary" className="gap-1"><Banknote className="h-3 w-3"/> Participation</Badge>}
                    {user.paidDeposit && <Badge variant="secondary" className="gap-1"><Banknote className="h-3 w-3"/> Deposit</Badge>}
                    {user.paymentMethod === 'RECEIPT' && user.receiptUrl && (
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
                      {user.status.toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Select
                    value={user.status}
                    onValueChange={(value: UserStatus) => handleStatusChange(user.id, value)}
                    disabled={isPending}
                  >
                    <SelectTrigger className="w-[120px] ml-auto h-8">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="BLOCKED">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
       <DataTablePagination 
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalRows={users.length}
      />
    </div>
  );
}

