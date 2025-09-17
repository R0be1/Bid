
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { MessageTemplate, Bid, AuctionItem, CommunicationLog } from "@/lib/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { addCommunicationLog } from "@/lib/communications";

interface AnnounceResultsFormProps {
  templates: MessageTemplate[];
  bids: Bid[];
  item: AuctionItem;
  onAnnouncementSent: (announcement: CommunicationLog) => void;
}

const formSchema = z.object({
  templateId: z.string().min(1, "Please select a message template."),
  numberOfWinners: z.coerce.number().min(1, "Number of bidders must be at least 1."),
});

export function AnnounceResultsForm({ templates, bids, item, onAnnouncementSent }: AnnounceResultsFormProps) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templateId: "",
      numberOfWinners: 1,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const template = templates.find(t => t.id === values.templateId);
    if (!template) {
        toast({ title: "Error", description: "Selected template not found.", variant: "destructive" });
        return;
    }
    
    // In a real application, this would trigger a server action to send emails/SMS.
    // For now, we just log it.
    const newLog = addCommunicationLog({
      auctionId: item.id,
      auctionName: item.name,
      templateName: template.name,
      channel: template.channel,
      recipientsCount: values.numberOfWinners,
      sentAt: new Date(),
    });


    onAnnouncementSent(newLog);

    toast({
        title: "Announcements Sent!",
        description: `Notifications have been queued for the top ${values.numberOfWinners} bidder(s) using the "${template.name}" template.`,
    });
    form.reset();
  }
  
  if (bids.length === 0) {
      return (
          <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>No Bids to Announce</AlertTitle>
              <AlertDescription>
                  There were no bids placed for this auction, so no announcements can be sent.
              </AlertDescription>
          </Alert>
      );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-6 items-end">
        <FormField
          control={form.control}
          name="templateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message Template</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name} ({template.channel})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="numberOfWinners"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Top Bidders to Notify</FormLabel>
              <FormControl>
                <Input type="number" min="1" max={bids.length} {...field} />
              </FormControl>
              <FormDescription>
                Notify the top N bidders.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Announce to Top Bidders
        </Button>
      </form>
    </Form>
  );
}
