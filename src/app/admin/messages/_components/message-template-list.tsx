
"use client";

import type { MessageTemplate } from "@prisma/client";
import { useState, useMemo, useTransition } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { updateMessageTemplateAction, deleteMessageTemplateAction } from "@/app/admin/messages/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Check, X } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CommunicationChannel } from "@prisma/client";

interface MessageTemplateListProps {
  initialTemplates: MessageTemplate[];
}

export function MessageTemplateList({ initialTemplates }: MessageTemplateListProps) {
  const [templates, setTemplates] = useState<MessageTemplate[]>(initialTemplates);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<{name: string, channel: CommunicationChannel, template: string} | null>(null);

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

  const handleEditClick = (template: MessageTemplate) => {
    setEditingTemplateId(template.id);
    setEditingValues({ name: template.name, channel: template.channel, template: template.template });
  };

  const handleCancelEdit = () => {
    setEditingTemplateId(null);
    setEditingValues(null);
  };

  const handleSaveEdit = (templateId: string) => {
    if (!editingValues) return;
    startTransition(async () => {
      const result = await updateMessageTemplateAction(templateId, editingValues);
      if (result.success && result.template) {
        setTemplates(prev => prev.map(t => t.id === templateId ? result.template! : t));
        handleCancelEdit();
        toast({
          title: "Template Updated",
          description: "Your message template has been updated.",
        });
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update template.",
          variant: "destructive",
        });
      }
    });
  };

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
            {editingTemplateId === template.id ? (
              <>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="grid gap-2 w-full">
                       <Input
                          value={editingValues?.name || ''}
                          onChange={(e) => setEditingValues(v => v ? {...v, name: e.target.value} : null)}
                          className="text-lg font-semibold"
                          disabled={isPending}
                        />
                         <Select 
                            value={editingValues?.channel} 
                            onValueChange={(value: CommunicationChannel) => setEditingValues(v => v ? {...v, channel: value} : null)}
                            disabled={isPending}
                         >
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="sms">SMS</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleSaveEdit(template.id)} disabled={isPending}>
                        <Check className="h-4 w-4 text-green-600" />
                        <span className="sr-only">Save</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleCancelEdit} disabled={isPending}>
                        <X className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Cancel</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={editingValues?.template || ''}
                    onChange={(e) => setEditingValues(v => v ? {...v, template: e.target.value} : null)}
                    className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-md border min-h-[100px]"
                    disabled={isPending}
                  />
                </CardContent>
              </>
            ) : (
              <>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription>
                        <Badge variant={template.channel === 'email' ? 'secondary' : 'default'} className="capitalize mt-1">{template.channel}</Badge>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(template)} disabled={isPending}>
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
                  <p className="text-sm text-muted-foreground bg-secondary/30 p-3 rounded-md border whitespace-pre-wrap">
                    {template.template}
                  </p>
                </CardContent>
              </>
            )}
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
