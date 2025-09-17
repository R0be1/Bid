"use client";

import type { AuctionItem } from "@/lib/types";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { handleSealedBid, type FormState } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DollarSign } from "lucide-react";

interface SealedBidFormProps {
  item: AuctionItem;
}

const formSchema = z.object({
  bidAmount: z.coerce.number().min(0.01, "Bid must be greater than zero."),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full font-bold" disabled={pending} style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
      {pending ? "Submitting..." : "Submit Sealed Bid"}
    </Button>
  );
}

export default function SealedBidForm({ item }: SealedBidFormProps) {
  const { toast } = useToast();
  
  const initialState: FormState = { success: false, message: "" };
  const [state, formAction] = useFormState(handleSealedBid, initialState);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bidAmount: undefined,
    },
  });

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success!" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      if (state.success) {
        form.reset();
      }
    }
  }, [state, toast, form]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Submit a Sealed Bid</CardTitle>
        <CardDescription>
          Your bid is confidential. Enter your best offer before the deadline.
          The highest bid wins.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={formAction} className="space-y-6">
            <input type="hidden" name="itemId" value={item.id} />
            <FormField
              control={form.control}
              name="bidAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Bid Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                         <DollarSign className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <Input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        {...field}
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
