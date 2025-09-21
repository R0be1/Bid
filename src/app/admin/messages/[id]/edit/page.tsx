
import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/data/server-only";
import { getMessageTemplateForEdit } from "@/lib/data/admin";
import { EditMessageTemplateForm } from "./_components/edit-message-template-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function EditMessageTemplatePage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  
  const template = await getMessageTemplateForEdit(params.id);

  if (!template) {
    notFound();
  }

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-2xl mx-auto">
        <div>
            <h1 className="text-3xl font-bold font-headline text-primary">Edit Message Template</h1>
            <p className="text-muted-foreground">Modify the details for "{template.name}".</p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Edit Template</CardTitle>
                <CardDescription>Make your changes below and save.</CardDescription>
            </CardHeader>
            <CardContent>
                <EditMessageTemplateForm template={template} />
            </CardContent>
        </Card>
    </div>
  );
}
