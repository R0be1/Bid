
"use client";

import type { MessageTemplate } from "@prisma/client";
import { useState, useMemo, useTransition } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteMessageTemplateAction } from "@/app/admin/messages/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Edit, Trash2 } from "lucide-react";
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

interface MessageTemplateListProps {
  initialTemplates: MessageTemplate[];
}

export function MessageTemplateList({ initialTemplates }: MessageTemplateListProps) {
  const [templates, setTemplates] = useState<MessageTemplate[]>(initialTemplates);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MessageTemplate | null>(null);

  const paginatedTemplates = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return templates.slice(startIndex, startIndex + rowsPerPage);
  }, [templates, page, rowsPerPage]);
  
  useState(() => {
    setTemplates(initialTemplates);
  }, [initialTemplates]);

  const handleDeleteClick = (template: MessageTemplate) => {
    setItemToDelete(template);
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;

    startTransition(async () => {
      const result = await deleteMessageTemplateAction(itemToDelete.id);
       if (result.success) {
        setTemplates(prev => prev.filter(t => t.id !== itemToDelete.id));
        toast({
          title: "Template Deleted",
          description: "The message template has been successfully deleted.",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete template.",
          variant: "destructive",
        });
      }
      setDialogOpen(false);
      setItemToDelete(null);
    });
  };

  if (templates.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No message templates found.</p>;
  }

  return (
    <>
       <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the message template.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isPending}>
              {isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="space-y-4">
          {paginatedTemplates.map((template) => (
              <Card key={template.id} className="shadow-sm">
                  <CardHeader>
                      <div className="flex justify-between items-start">
                          <div>
                              <CardTitle className="text-lg">{template.name}</CardTitle>
                              <CardDescription>
                                  <Badge variant={template.channel === 'email' ? 'secondary' : 'default'} className="capitalize mt-1">{template.channel}</Badge>
                              </CardDescription>
                          </div>
                          <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" disabled>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit Template</span>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(template)} disabled={isPending}>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                  <span className="sr-only">Delete Template</span>
                              </Button>
                          </div>
                      </div>
                  </CardHeader>
                  <CardContent>
                      <p className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-md border">
                          {template.template}
                      </p>
                  </CardContent>
                  <CardFooter>
                      <p className="text-xs text-muted-foreground">ID: {template.id}</p>
                  </CardFooter>
              </Card>
          ))}
          <DataTablePagination
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              totalRows={templates.length}
          />
      </div>
    </>
  );
}
