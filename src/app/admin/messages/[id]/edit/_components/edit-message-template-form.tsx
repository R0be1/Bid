
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateMessageTemplateAction } from "@/app/admin/messages/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { CommunicationChannel, MessageTemplate } from "@prisma/client";

const formSchema = z.object({
  name: z.string().min(1, "Template name is required."),
  channel: z.enum([CommunicationChannel.email, CommunicationChannel.sms], { required_error: "Channel is required." }),
  template: z.string().min(1, "Template content is required."),
});

interface EditMessageTemplateFormProps {
    template: MessageTemplate;
}

export function EditMessageTemplateForm({ template }: EditMessageTemplateFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: template.name,
      channel: template.channel,
      template: template.template,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await updateMessageTemplateAction(template.id, values);
       if (result.success) {
        toast({
            title: "Template Updated",
            description: result.message,
        });
        router.push('/admin/messages');
        router.refresh();
      } else {
         toast({
            title: "Error",
            description: result.message,
            variant: "destructive"
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Name <span className="text-destructive">*</span></FormLabel>
              <FormControl>
                <Input placeholder="Template Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="channel"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Channel <span className="text-destructive">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Select a channel" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                    </Select>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="template"
            render={({ field }) => (
            <FormItem>
                <FormLabel>Template Content <span className="text-destructive">*</span></FormLabel>
                <FormControl>
                <Textarea
                    placeholder="Template Content"
                    className="resize-y min-h-[120px]"
                    {...field}
                />
                </FormControl>
                <FormMessage />
            </FormItem>
            )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
