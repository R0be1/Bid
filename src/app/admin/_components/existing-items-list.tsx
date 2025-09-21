
"use client";

import type { AuctionItem } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface ExistingItemsListProps {
  items: AuctionItem[];
}

export function ExistingItemsList({ items }: ExistingItemsListProps) {

  if (items.length === 0) {
    return <p className="text-center text-muted-foreground py-4">You have not created any auction items yet.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
           const now = new Date();
           const startDate = new Date(item.startDate);
           let status: "Active" | "Upcoming" | "Ended";
           if (new Date(item.endDate) < now) {
               status = "Ended";
           } else if (startDate > now) {
               status = "Upcoming";
           } else {
               status = "Active";
           }

           const isEditable = status === "Upcoming";

          return (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>
                <Badge variant={item.type === 'live' ? 'destructive' : 'secondary'} className="capitalize">{item.type}</Badge>
              </TableCell>
               <TableCell>
                 <Badge variant={status === 'Active' ? 'default' : status === 'Ended' ? 'outline' : 'secondary'}>
                    {status}
                 </Badge>
              </TableCell>
              <TableCell>{format(new Date(item.endDate), "PPP")}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" disabled={!isEditable} title={!isEditable ? "Cannot edit an active or ended auction" : "Edit Item"}>
                    <Link href={isEditable ? `/admin/manage-items/${item.id}/edit` : '#'}>
                      <Edit className="h-4 w-4" />
                    </Link>
                </Button>
                 <Button variant="ghost" size="icon" className="text-destructive" disabled={!isEditable} title={!isEditable ? "Cannot delete an active or ended auction" : "Delete Item"}>
                    <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
