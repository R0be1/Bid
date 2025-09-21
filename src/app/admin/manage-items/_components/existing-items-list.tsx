
"use client";

import { useState, useMemo, useTransition } from "react";
import type { AuctionItem } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { useToast } from "@/hooks/use-toast";
import { deleteAuctionItem } from "../actions";
import { useRouter } from "next/navigation";


interface ExistingItemsListProps {
  items: AuctionItem[];
}

export function ExistingItemsList({ items: initialItems }: ExistingItemsListProps) {
  const [items, setItems] = useState<AuctionItem[]>(initialItems);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<AuctionItem | null>(null);

  const paginatedItems = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return items.slice(startIndex, startIndex + rowsPerPage);
  }, [items, page, rowsPerPage]);

  const handleDeleteClick = (item: AuctionItem) => {
    setItemToDelete(item);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    startTransition(async () => {
        const result = await deleteAuctionItem(itemToDelete.id);
        if (result.success) {
            setItems(prev => prev.filter(item => item.id !== itemToDelete.id));
            toast({
                title: "Item Deleted",
                description: `"${itemToDelete.name}" has been deleted.`
            });
        } else {
            toast({
                title: "Error",
                description: result.message,
                variant: "destructive"
            });
        }
        setDialogOpen(false);
        setItemToDelete(null);
    });
  }


  if (items.length === 0) {
    return <p className="text-center text-muted-foreground py-4">You have not created any auction items yet.</p>;
  }

  return (
    <>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the auction item
              and all associated bids.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <div className="border rounded-lg">
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
            {paginatedItems.map((item) => {
              const now = new Date();
              const startDate = new Date(item.startDate);
              const endDate = new Date(item.endDate);
              const isEditable = startDate > now;
              
              let status: "Active" | "Upcoming" | "Ended";
              if (endDate < now) {
                  status = "Ended";
              } else if (startDate > now) {
                  status = "Upcoming";
              } else {
                  status = "Active";
              }

              return (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant={item.type === 'LIVE' ? 'destructive' : 'secondary'} className="capitalize">{item.type.toLowerCase()}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status === 'Active' ? 'default' : status === 'Ended' ? 'outline' : 'secondary'}>
                        {status}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(endDate, "PPP")}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild disabled={!isEditable} title={!isEditable ? "Cannot edit an active or ended auction" : "Edit Item"}>
                        <Link href={isEditable ? `/admin/manage-items/${item.id}/edit` : '#'}>
                          <Edit className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteClick(item)} disabled={isPending || !isEditable} title={!isEditable ? "Cannot delete an active or ended auction" : "Delete Item"}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          totalRows={items.length}
        />
    </>
  );
}
