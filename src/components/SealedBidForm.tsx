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
import { Banknote, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import Link from "next/link";

interface SealedBidFormProps {
  item: AuctionItem;
}

const formSchema = z.object({
  bidAmount: z.coerce.number().min(0.01, "Bid must be greater than zero."),
});

// This is a mock value. In a real app, this would come from an authentication context.
const MOCK_IS_LOGGED_IN = false;
const MOCK_USER_STATUS = 'pending'; // or 'approved' or 'blocked'
const MOCK_USER_HAS_PAID = false;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full font-bold" disabled={pending || MOCK_USER_STATUS !== 'approved'}>
      {pending ? "Submitting..." : "Submit Sealed Bid"}
    </Button>
  );
}

export default function SealedBidForm({ item }: SealedBidFormProps) {
  const { toast } = useToast();
  
  const initialState: FormState = { success: false, message: "" };
  const [state, formAction] = useFormState(handleSealedBid, initialState);

  const requiresFees = (item.participationFee && item.participationFee > 0) || (item.securityDeposit && item.securityDeposit > 0);

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

  const handleFormAction = (formData: FormData) => {
    if (!MOCK_IS_LOGGED_IN) {
        toast({ title: "Login Required", description: "You must be logged in to place a bid.", variant: "destructive"});
        return;
    }
    if (requiresFees && !MOCK_USER_HAS_PAID) {
      toast({ title: "Payment Required", description: "Please complete the required payments from your dashboard to participate.", variant: "destructive"});
      return;
    }
    if (MOCK_USER_STATUS !== 'approved') {
        toast({ title: "Account Not Approved", description: `Your account status is "${MOCK_USER_STATUS}". Admin approval is required to bid.`, variant: "destructive"});
        return;
    }
    formAction(formData);
  }

  if (!MOCK_IS_LOGGED_IN) {
     return (
      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Join the Auction</CardTitle>
        </CardHeader>
        <CardContent>
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Registration Required</AlertTitle>
                <AlertDescription>
                   You need to be logged in to participate in this auction. Please register or log in to continue.
                    <Button asChild className="w-full mt-4">
                        <Link href="/register">Register or Log In</Link>
                    </Button>
                </AlertDescription>
            </Alert>
        </CardContent>
      </Card>
    );
  }

  if (requiresFees && !MOCK_USER_HAS_PAID) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Special Auction Requirements</CardTitle>
        </CardHeader>
        <CardContent>
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Payment Required</AlertTitle>
                <AlertDescription>
                    This auction requires payment of fees. Please visit your dashboard to complete the payment.
                    <Button asChild className="w-full mt-4">
                        <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                </AlertDescription>
            </Alert>
        </CardContent>
      </Card>
    );
  }

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
          <form action={handleFormAction} className="space-y-6">
            <input type="hidden" name="itemId" value={item.id} />
            <FormField
              control={form.control}
              name="bidAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Bid Amount <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                         <span className="text-muted-foreground">Birr</span>
                      </div>
                      <Input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        {...field}
                        className="pl-10"
                        disabled={MOCK_USER_STATUS !== 'approved'}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SubmitButton />
             {MOCK_USER_STATUS !== 'approved' && <p className="text-xs text-center text-red-600">Your account is not approved to submit a bid. Please contact an administrator.</p>}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
