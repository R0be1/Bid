
"use client";

import type { AuctionItem, PaymentType } from "@/lib/types";
import { useState, useEffect, useTransition, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Info, Loader2, Banknote, Upload, CreditCard } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { getCurrentUserClient, type AuthenticatedUser } from "@/lib/auth-client";
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
import { handleLiveBid, type FormState } from "@/app/actions";
import { getAuctionItemForListing } from "@/lib/data/public";


function PaymentPrompt({ item, onPaymentSuccess }: { item: AuctionItem, onPaymentSuccess: (user: AuthenticatedUser) => void }) {
    const [isPending, startTransition] = useTransition();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const fees = {
        participation: item.participationFee,
        deposit: item.securityDeposit
    };

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
                                    </Header>
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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      className="absolute right-1 h-10 rounded-full px-6 font-bold"
      disabled={pending}
      variant="accent"
    >
      {pending ? "Placing..." : "Place Bid"}
    </Button>
  );
}


interface LiveBiddingProps {
  item: AuctionItem;
}

export default function LiveBidding({ item: initialItem }: LiveBiddingProps) {
  const [item, setItem] = useState(initialItem);
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null | undefined>(undefined);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const initialState: FormState = { success: false, message: "" };
  const [state, formAction] = useFormState(handleLiveBid, initialState);
  
  useEffect(() => {
    getCurrentUserClient().then(setCurrentUser);
  }, []);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success!" : "Bid Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      if (state.success) {
        formRef.current?.reset();
      }
    }
  }, [state, toast]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (new Date() < new Date(item.endDate)) {
        const updatedItem = await getAuctionItemForListing(item.id);
        if (updatedItem) {
          setItem(updatedItem);
        }
      } else {
        clearInterval(interval);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [item.id, item.endDate]);

  const requiresFees = (item.participationFee && item.participationFee > 0 && !currentUser?.paidParticipation) || 
                       (item.securityDeposit && item.securityDeposit > 0 && !currentUser?.paidDeposit);
  
  const highBidderName = item.highBidder === `${currentUser?.name}` ? "You" : item.highBidder;

  if (currentUser === undefined) {
    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Live Bidding</CardTitle>
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
                        <Link href="/login">Register or Log In</Link>
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
        <CardTitle>Live Bidding</CardTitle>
        <CardDescription>Place your bid to win this item!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-secondary/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">Current Bid</span>
              <span className="text-2xl font-bold text-primary">{item.currentBid?.toLocaleString()} Birr</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">High Bidder</span>
              <span className={`font-semibold ${highBidderName === 'You' ? 'text-accent' : ''}`}>{highBidderName}</span>
            </div>
          </div>
          <form ref={formRef} action={formAction} className="space-y-4">
             <input type="hidden" name="itemId" value={item.id} />
              <Label htmlFor="bidAmount" className="sr-only">Your Bid Amount</Label>
              <div className="relative flex items-center">
                <div className="absolute left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-muted-foreground font-semibold">Birr</span>
                </div>
                <Input
                  id="bidAmount"
                  name="bidAmount"
                  type="number"
                  placeholder={`Min. ${(item.currentBid! + item.minIncrement!).toLocaleString()}`}
                  className="pl-12 pr-32 h-12 text-lg rounded-full"
                  required
                  step={item.minIncrement}
                  disabled={currentUser.status !== 'APPROVED'}
                />
                 <SubmitButton />
              </div>
          </form>
           {currentUser.status !== 'APPROVED' ? (
             <p className="text-xs text-center text-red-600">
                Your account is not approved to bid. Please contact an administrator.
            </p>
            ) : (
            <p className="text-xs text-center text-muted-foreground">
              Minimum bid increment: {item.minIncrement?.toLocaleString()} Birr
            </p>
           )}
        </div>
      </CardContent>
    </Card>
  );
}
