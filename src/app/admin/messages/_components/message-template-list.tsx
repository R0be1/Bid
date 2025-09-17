
"use client";

import type { MessageTemplate } from "@/lib/types";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteMessageTemplate } from "@/lib/messages";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


interface MessageTemplateListProps {
  initialTemplates: MessageTemplate[];
}

export function MessageTemplateList({ initialTemplates }: MessageTemplateListProps) {
  const [templates, setTemplates] = useState<MessageTemplate[]>(initialTemplates);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = (templateId: string) => {
    try {
      deleteMessageTemplate(templateId);
      setTemplates(templates.filter((t) => t.id !== templateId));
      toast({
        title: "Template Deleted",
        description: "The message template has been successfully deleted.",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete template.",
        variant: "destructive",
      });
    }
  };

  if (templates.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No message templates found.</p>;
  }

  return (
    <div className="space-y-4">
        {templates.map((template) => (
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
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                    <span className="sr-only">Delete Template</span>
                                </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the message template.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(template.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
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
    </div>
  );
}
