
'use client';

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Clock, CreditCard, UserCheck, Paperclip, Ban } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getDashboardData } from './actions';
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardData } from './actions';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PaymentMethod } from "@prisma/client";

const statusVariantMap = {
  APPROVED: 'default' as const,
  PENDING: 'secondary' as const,
  BLOCKED: 'destructive' as const,
};

const paymentStatusText = {
    paid: {
        [PaymentMethod.DIRECT]: "Paid",
        [PaymentMethod.RECEIPT]: "Paid (Receipt Approved)",
    },
    pending: "Pending (Receipt Submitted)",
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!data || !data.user) {
    return (
      <div className="text-center p-8">
        <Card>
            <CardHeader>
                <CardTitle>Error</CardTitle>
                <CardDescription>Could not load user data. Please try again.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => window.location.reload()} className="mt-4">
                Reload
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  const { user } = data;
  
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
                Your account is currently pending administrator approval.
                {user.paymentMethod === 'RECEIPT' && " Your uploaded receipt is awaiting review."}
                 {!user.paymentMethod && ' You can participate in auctions that require fees by paying directly or uploading a receipt on the auction page.'}
              </AlertDescription>
            </Alert>
          </CardContent>
        )}
        {user.status === 'BLOCKED' && (
          <CardContent>
            <Alert variant="destructive">
              <Ban className="h-4 w-4" />
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
            Fee Payment Status
          </CardTitle>
          <CardDescription>
            This section shows the status of any required participation or security deposit fees.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
             <div className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                    <h3 className="font-semibold text-base">Participation Fee</h3>
                    <p className="text-sm text-muted-foreground">Required for some auctions to join bidding.</p>
                </div>
                <div>
                   {user.paidParticipation ? (
                       <Badge variant="default" className="text-sm gap-2"><CheckCircle /> {user.status === 'APPROVED' ? paymentStatusText.paid[user.paymentMethod || 'DIRECT'] : paymentStatusText.pending}</Badge>
                   ) : (
                       <Badge variant="secondary" className="text-sm">Not Paid</Badge>
                   )}
                </div>
             </div>
             <div className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                    <h3 className="font-semibold text-base">Security Deposit</h3>
                    <p className="text-sm text-muted-foreground">A refundable deposit required for certain high-value auctions.</p>
                </div>
                 <div>
                   {user.paidDeposit ? (
                       <Badge variant="default" className="text-sm gap-2"><CheckCircle /> {user.status === 'APPROVED' ? paymentStatusText.paid[user.paymentMethod || 'DIRECT'] : paymentStatusText.pending}</Badge>
                   ) : (
                       <Badge variant="secondary" className="text-sm">Not Paid</Badge>
                   )}
                </div>
             </div>
             { (user.paidParticipation || user.paidDeposit) && user.paymentMethod === 'RECEIPT' && user.receiptUrl && (
                <div className="p-4 border rounded-lg bg-secondary/50">
                    <h3 className="font-semibold text-base mb-2">Submitted Receipt</h3>
                    <Button asChild variant="outline">
                        <Link href={user.receiptUrl} target="_blank" rel="noopener noreferrer">
                            <Paperclip className="mr-2 h-4 w-4" />
                            View Your Submitted Receipt
                        </Link>
                    </Button>
                     {user.status === 'PENDING' && (
                        <p className="text-xs text-muted-foreground mt-2">Your receipt is awaiting review by an administrator. Your status will be updated to 'Approved' upon verification.</p>
                     )}
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
                  <Skeleton className="h-9 w-24" />
              </div>
               <div className="p-4 border rounded-lg flex justify-between items-center gap-4">
                  <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-4 w-1/4" />
                  </div>
                   <Skeleton className="h-9 w-24" />
              </div>
            </CardContent>
        </Card>
    </div>
  )
}
