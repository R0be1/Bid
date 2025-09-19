
'use client';

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Clock, CreditCard, Banknote, UserCheck, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getDashboardData, recordPaymentAction } from './actions';
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardData } from './actions';
import type { AuctionItemFee, PaymentType } from "@/lib/types";

const statusVariantMap = {
  APPROVED: 'default' as const,
  PENDING: 'secondary' as const,
  BLOCKED: 'destructive' as const,
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    getDashboardData()
      .then((res) => {
        if (res.success && res.data) {
          setData(res.data);
        } else {
          toast({ title: "Error", description: res.message, variant: "destructive" });
        }
      })
      .finally(() => setIsLoading(false));
  }, [toast]);

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
        setData(d => d ? ({ ...d, user: result.data! }) : null);
      }
      setIsDialogOpen(false);
    });
  };

  const getPendingPayments = (item: AuctionItemFee) => {
      if (!data?.user) return [];
      const payments = [];
      if (item.participationFee && !data.user.paidParticipation) {
          payments.push({ type: 'participation' as const, amount: item.participationFee });
      }
      if (item.securityDeposit && !data.user.paidDeposit) {
          payments.push({ type: 'deposit' as const, amount: item.securityDeposit });
      }
      return payments;
  }

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!data || !data.user) {
    return (
      <div className="text-center">
        <p>Could not load user data. Please try again.</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Reload
        </Button>
      </div>
    );
  }

  const { user, feeItems } = data;
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary">Your Dashboard</h1>
        <p className="text-muted-foreground">Manage your account status, payments, and bidding activity.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck />
            Account Status
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          <p>Your current status is:</p>
          <Badge variant={statusVariantMap[user.status]} className="capitalize text-lg px-4 py-1">{user.status.toLowerCase()}</Badge>
        </CardContent>
        {user.status === 'PENDING' && (
          <CardContent>
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertTitle>Approval Pending</AlertTitle>
              <AlertDescription>
                Your account is currently pending administrator approval. For auctions with fees, you can make a payment to be approved automatically or upload a receipt for review.
                {user.paymentMethod === 'RECEIPT' && " Your uploaded receipt is awaiting review."}
              </AlertDescription>
            </Alert>
          </CardContent>
        )}
        {user.status === 'BLOCKED' && (
          <CardContent>
            <Alert variant="destructive">
              <Clock className="h-4 w-4" />
              <AlertTitle>Account Blocked</AlertTitle>
              <AlertDescription>
                Your account has been blocked. Please contact support for assistance.
              </AlertDescription>
            </Alert>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard />
            Pending Payments for Auctions
          </CardTitle>
          <CardDescription>
            Some auctions require a participation fee or a security deposit. Pay them here to be eligible to bid.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {feeItems.map(item => {
            const pendingPayments = getPendingPayments(item);
            if (pendingPayments.length === 0) return null;

            return (
              <div key={item.id} className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold">
                    <Link href={`/auctions/${item.id}`} className="hover:underline text-primary">
                      {item.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground">Requires payment to participate.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto shrink-0">
                  {pendingPayments.map(p => (
                    <div key={p.type} className="space-y-2">
                      <p className="text-sm font-medium text-center capitalize">{p.type} Fee: {p.amount} Birr</p>
                      <div className="flex flex-col gap-2">
                        <Button onClick={() => handlePayment(p.type, 'direct')} disabled={user.status === 'BLOCKED' || isPending}>
                          <Banknote className="mr-2 h-4 w-4" />
                          {isPending ? 'Processing...' : 'Pay Now'}
                        </Button>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="secondary" disabled={user.status === 'BLOCKED'}>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload Receipt
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Upload Payment Receipt</DialogTitle>
                              <DialogDescription>
                                Upload a screenshot or document of your payment for the {p.type} fee of {p.amount} Birr. An admin will review it.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="receipt">Receipt File</Label>
                                <Input id="receipt" type="file" />
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button type="button" onClick={() => handlePayment(p.type, 'receipt')} disabled={isPending}>
                               {isPending ? 'Submitting...' : 'Submit for Review'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
          {feeItems.every(item => getPendingPayments(item).length === 0) && (
            <div className="text-center text-muted-foreground py-8">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <p className="font-semibold">You have no pending payments.</p>
              <p>You're all set to bid on any auction!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
        <div>
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
        </div>
        <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-10 w-1/3" />
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border rounded-lg flex justify-between items-center gap-4">
                  <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                  </div>
                  <div className="space-y-2">
                     <Skeleton className="h-9 w-24" />
                     <Skeleton className="h-9 w-24" />
                  </div>
              </div>
               <div className="p-4 border rounded-lg flex justify-between items-center gap-4">
                  <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-4 w-1/4" />
                  </div>
                   <div className="space-y-2">
                     <Skeleton className="h-9 w-24" />
                     <Skeleton className="h-9 w-24" />
                  </div>
              </div>
            </CardContent>
        </Card>
    </div>
  )
}
