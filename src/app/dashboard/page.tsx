
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getAuctionItems } from "@/lib/data";
import type { AuctionItem, User } from "@/lib/types";
import { getUser, recordPayment } from "@/lib/users";
import { CheckCircle, Clock, CreditCard, DollarSign, UserCheck, Upload } from "lucide-react";
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


// MOCK: In a real app, you'd get the logged-in user's ID from an auth context.
const MOCK_USER_ID = "2"; 

export default function DashboardPage() {
    const [user, setUser] = useState<User | undefined>(getUser(MOCK_USER_ID));
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    if (!user) {
        // This should ideally redirect to login
        return <div>Please log in to view your dashboard.</div>
    }

    const allItems = getAuctionItems();
    const feeItems = allItems.filter(item => (item.participationFee || 0) > 0 || (item.securityDeposit || 0) > 0);

    const statusVariantMap: { [key in User['status']]: 'default' | 'secondary' | 'destructive' } = {
        approved: 'default',
        pending: 'secondary',
        blocked: 'destructive'
    };

    const handleDirectPayment = (type: 'participation' | 'deposit') => {
        const updatedUser = recordPayment(user.id, type, 'direct');
        setUser(updatedUser);
        toast({
            title: "Payment Successful",
            description: `Your ${type} fee has been processed and your account is now approved for bidding.`
        });
    }

    const handleReceiptUpload = (type: 'participation' | 'deposit') => {
        // In a real app, you would handle file upload to a storage service.
        const updatedUser = recordPayment(user.id, type, 'receipt', '/receipt-placeholder.pdf');
        setUser(updatedUser);
        toast({
            title: "Receipt Uploaded",
            description: `Your ${type} payment receipt has been submitted for review. Your account will be approved once the payment is confirmed.`
        });
        setIsDialogOpen(false);
    }

    const getPendingPayments = (item: AuctionItem) => {
        const payments = [];
        if (item.participationFee && !user.paidParticipation) {
            payments.push({ type: 'participation' as const, amount: item.participationFee });
        }
        if (item.securityDeposit && !user.paidDeposit) {
            payments.push({ type: 'deposit' as const, amount: item.securityDeposit });
        }
        return payments;
    }

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
                <CardContent className="flex items-center gap-4">
                    <p>Your current status is:</p>
                    <Badge variant={statusVariantMap[user.status]} className="capitalize text-lg px-4 py-1">{user.status}</Badge>
                </CardContent>
                {user.status === 'pending' && (
                    <CardContent>
                        <Alert>
                            <Clock className="h-4 w-4" />
                            <AlertTitle>Approval Pending</AlertTitle>
                            <AlertDescription>
                                Your account is currently pending administrator approval. For auctions with fees, you can make a payment to be approved automatically or upload a receipt for review.
                                {user.paymentMethod === 'receipt' && !user.paidDeposit && !user.paidParticipation && " Your uploaded receipt is awaiting review."}
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                )}
                 {user.status === 'blocked' && (
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
                            <div key={item.id} className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start gap-4">
                                <div>
                                    <h3 className="font-semibold">
                                        <Link href={`/auctions/${item.id}`} className="hover:underline text-primary">
                                            {item.name}
                                        </Link>
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Requires payment to participate.</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
                                    {pendingPayments.map(p => (
                                        <div key={p.type} className="space-y-2">
                                            <p className="text-sm font-medium text-center capitalize">{p.type} Fee: ${p.amount}</p>
                                            <div className="flex flex-col gap-2">
                                                <Button onClick={() => handleDirectPayment(p.type)} disabled={user.status === 'blocked'}>
                                                    <DollarSign className="mr-2 h-4 w-4" />
                                                    Pay Now
                                                </Button>
                                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="secondary" disabled={user.status === 'blocked'}>
                                                            <Upload className="mr-2 h-4 w-4" />
                                                            Upload Receipt
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Upload Payment Receipt</DialogTitle>
                                                            <DialogDescription>
                                                                Upload a screenshot or document of your payment for the {p.type} fee of ${p.amount}. An admin will review it.
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
                                                            <Button type="button" onClick={() => handleReceiptUpload(p.type)}>Submit for Review</Button>
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
