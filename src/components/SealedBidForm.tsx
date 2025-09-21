
"use client";

import type { AuctionItem, PaymentType } from "@/lib/types";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { handleSealedBid, type FormState } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUserClient, type AuthenticatedUser } from "@/lib/auth-client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Info, Loader2, CreditCard, Banknote, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { recordPaymentAction } from "@/app/dashboard/actions";


function PaymentPrompt({ item, onPaymentSuccess }: { item: AuctionItem, onPaymentSuccess: (user: AuthenticatedUser) => void }) {
    const [isPending, startTransition] = useTransition();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const fees = {
        participation: item.participationFee,
        deposit: item.securityDeposit
    }

    const handlePayment = (paymentType: PaymentType, method: 'direct' | 'receipt') => {
        startTransition(async () => {
            // In a real app, receipt would be a file upload.
            const receiptFile = method === 'receipt' ? '/receipt-placeholder.pdf' : undefined;
            const result = await recordPaymentAction(paymentType, method, receiptFile);

            toast({
                title: result.success ? "Success" : "Error",
                description: result.message,
                variant: result.success ? "default" : "destructive",
            });

            if (result.success && result.data) {
                onPaymentSuccess(result.data);
            }
            setIsDialogOpen(false);
        });
    };

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><CreditCard /> Payment Required</CardTitle>
                <CardDescription>This auction requires one or more fees to participate.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {fees.participation && fees.participation > 0 && (
                     <div className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                        <h3 className="font-semibold">Participation Fee: {fees.participation.toLocaleString()} Birr</h3>
                        <p className="text-sm text-muted-foreground">A one-time fee to enter this auction.</p>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                            <Button onClick={() => handlePayment('participation', 'direct')} disabled={isPending}>
                                <Banknote className="mr-2 h-4 w-4" />
                                {isPending ? 'Processing...' : 'Pay Now'}
                            </Button>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="secondary"><Upload className="mr-2 h-4 w-4" /> Upload Receipt</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                    <DialogTitle>Upload Payment Receipt</DialogTitle>
                                    <DialogDescription>Upload proof of payment for the participation fee.</DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4"><Input id="receipt" type="file" /></div>
                                    <DialogFooter>
                                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                                    <Button type="button" onClick={() => handlePayment('participation', 'receipt')} disabled={isPending}>{isPending ? 'Submitting...' : 'Submit for Review'}</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                )}
                 {fees.deposit && fees.deposit > 0 && (
                     <div className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex-1">
                        <h3 className="font-semibold">Security Deposit: {fees.deposit.toLocaleString()} Birr</h3>
                        <p className="text-sm text-muted-foreground">A refundable deposit to ensure bid integrity.</p>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                           <Button onClick={() => handlePayment('deposit', 'direct')} disabled={isPending}>
                                <Banknote className="mr-2 h-4 w-4" />
                                {isPending ? 'Processing...' : 'Pay Now'}
                            </Button>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                     <Button variant="secondary"><Upload className="mr-2 h-4 w-4" /> Upload Receipt</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                    <DialogTitle>Upload Payment Receipt</DialogTitle>
                                    <DialogDescription>Upload proof of payment for the security deposit.</DialogDescription>
                                    </DialogHeader>
                                    <div className="py-4"><Input id="receipt" type="file" /></div>
                                    <DialogFooter>
                                    <DialogClose asChild><Button type="button" variant="outline">Cancel</Button></DialogClose>
                                    <Button type="button" onClick={() => handlePayment('deposit', 'receipt')} disabled={isPending}>{isPending ? 'Submitting...' : 'Submit for Review'}</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

interface SealedBidFormProps {
  item: AuctionItem;
}

const formSchema = z.object({
  bidAmount: z.coerce.number().min(0.01, "Bid must be greater than zero."),
});

function SubmitButton({ currentUser, children }: { currentUser: AuthenticatedUser | null, children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <Button 
        type="submit" 
        className="absolute right-1 h-10 rounded-full px-6 font-bold" 
        disabled={pending || currentUser?.status !== 'APPROVED'}
        variant="accent"
    >
        {pending ? "Submitting..." : children}
    </Button>
  );
}

export default function SealedBidForm({ item }: SealedBidFormProps) {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null | undefined>(undefined);
  
  useEffect(() => {
    getCurrentUserClient().then(setCurrentUser);
  }, []);

  const initialState: FormState = { success: false, message: "" };
  const [state, formAction] = useFormState(handleSealedBid, initialState);
  
  const requiresFees = (item.participationFee && item.participationFee > 0 && !currentUser?.paidParticipation) || 
                       (item.securityDeposit && item.securityDeposit > 0 && !currentUser?.paidDeposit);


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
    if (!currentUser) {
        toast({ title: "Login Required", description: "You must be logged in to place a bid.", variant: "destructive"});
        return;
    }
    if (requiresFees) {
      toast({ title: "Payment Required", description: "Please complete the required payments to participate.", variant: "destructive"});
      return;
    }
    if (currentUser.status !== 'APPROVED') {
        toast({ title: "Account Not Approved", description: `Your account status is "${currentUser.status}". Admin approval is required to bid.`, variant: "destructive"});
        return;
    }
    formAction(formData);
  }
  
  if (currentUser === undefined) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Submit a Sealed Bid</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
        </Card>
    );
  }

  if (!currentUser) {
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

  if (requiresFees) {
    return <PaymentPrompt item={item} onPaymentSuccess={setCurrentUser} />;
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
                  <FormLabel htmlFor={field.name} className="sr-only">Your Bid Amount</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                       <div className="absolute left-0 pl-3 flex items-center pointer-events-none">
                         <span className="text-muted-foreground font-semibold">Birr</span>
                      </div>
                      <Input
                        type="number"
                        placeholder="Your Sealed Bid"
                        step="0.01"
                        {...field}
                        id={field.name}
                        className="pl-12 pr-36 h-12 text-lg rounded-full"
                        disabled={currentUser.status !== 'APPROVED'}
                      />
                      <SubmitButton currentUser={currentUser}>Submit Bid</SubmitButton>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {currentUser.status !== 'APPROVED' && <p className="text-xs text-center text-red-600">Your account is not approved to submit a bid. Please contact an administrator.</p>}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
