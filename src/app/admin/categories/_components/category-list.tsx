
"use client";

import type { Category } from "@/lib/types";
import { useState } from "react";
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
import { deleteCategory, updateCategory } from "@/lib/categories";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CategoryListProps {
  initialCategories: Category[];
}

export function CategoryList({ initialCategories }: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const handleEditClick = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingName(category.name);
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingName("");
  };

  const handleSaveEdit = (categoryId: string) => {
    if (!editingName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    try {
      const updated = updateCategory(categoryId, editingName);
      if (updated) {
        setCategories(categories.map((c) => (c.id === categoryId ? updated : c)));
        toast({
          title: "Category Updated",
          description: `Category has been updated to "${updated.name}".`,
        });
        router.refresh();
      }
      handleCancelEdit();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = (categoryId: string) => {
    try {
      deleteCategory(categoryId);
      setCategories(categories.filter((c) => c.id !== categoryId));
      toast({
        title: "Category Deleted",
        description: "The category has been successfully deleted.",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category.",
        variant: "destructive",
      });
    }
  };

  if (categories.length === 0) {
    return <p className="text-muted-foreground">No categories found.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="font-medium">{category.id}</TableCell>
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
                />
              ) : (
                category.name
              )}
            </TableCell>
            <TableCell className="text-right">
              {editingCategoryId === category.id ? (
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleSaveEdit(category.id)}>
                    <Check className="h-4 w-4 text-green-600" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                   <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the category
                          and may affect auction items using it.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(category.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
