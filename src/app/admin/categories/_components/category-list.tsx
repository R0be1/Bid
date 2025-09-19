
"use client";

import type { Category } from "@prisma/client";
import { useState, useMemo, useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Check, X } from "lucide-react";
import { deleteCategory, updateCategory } from "@/app/admin/categories/actions";
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
import { DataTablePagination } from "@/components/ui/data-table-pagination";

interface CategoryListProps {
  initialCategories: Category[];
}

export function CategoryList({ initialCategories }: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isPending, startTransition] = useTransition();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Category | null>(null);

  const paginatedCategories = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return categories.slice(startIndex, startIndex + rowsPerPage);
  }, [categories, page, rowsPerPage]);
  
  // Update categories when initialCategories change
  useState(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  const handleEditClick = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingName(category.name);
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingName("");
  };

  const handleSaveEdit = (categoryId: string) => {
     startTransition(async () => {
        if (!editingName.trim()) {
            toast({
                title: "Error",
                description: "Category name cannot be empty.",
                variant: "destructive",
            });
            return;
        }
        const result = await updateCategory(categoryId, editingName);
        if (result.success && result.category) {
            setCategories(categories.map((c) => (c.id === categoryId ? result.category! : c)));
            toast({
                title: "Category Updated",
                description: result.message,
            });
            handleCancelEdit();
            router.refresh();
        } else {
            toast({
                title: "Error",
                description: result.message,
                variant: "destructive",
            });
        }
    });
  };

  const handleDeleteClick = (category: Category) => {
    setItemToDelete(category);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    startTransition(async () => {
        const result = await deleteCategory(itemToDelete.id);
        if (result.success) {
            setCategories(prev => prev.filter(c => c.id !== itemToDelete.id));
            toast({
                title: "Category Deleted",
                description: result.message
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

  if (categories.length === 0) {
    return <p className="text-muted-foreground">No categories found.</p>;
  }

  return (
    <>
      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category.
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

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedCategories.map((category) => (
          <TableRow key={category.id}>
            <TableCell>
              {editingCategoryId === category.id ? (
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(category.id);
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  autoFocus
                  className="h-8"
                  disabled={isPending}
                />
              ) : (
                category.name
              )}
            </TableCell>
            <TableCell className="text-right">
              {editingCategoryId === category.id ? (
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleSaveEdit(category.id)} disabled={isPending}>
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleCancelEdit} disabled={isPending}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(category)} disabled={isPending}>
                    <Edit className="h-4 w-4" />
                  </Button>
                   <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(category)} disabled={isPending}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <DataTablePagination
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        totalRows={categories.length}
      />
    </>
  );
}
