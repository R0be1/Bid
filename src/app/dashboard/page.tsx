
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getAuctionItems } from "@/lib/data";
import type { AuctionItem, User } from "@/lib/types";
import { getUser, recordPayment } from "@/lib/users";
import { CheckCircle, Clock, CreditCard, DollarSign, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";


// MOCK: In a real app, you'd get the logged-in user's ID from an auth context.
const MOCK_USER_ID = "2"; 

export default function DashboardPage() {
    const [user, setUser] = useState<User | undefined>(getUser(MOCK_USER_ID));
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

    const handlePayment = (type: 'participation' | 'deposit') => {
        const updatedUser = recordPayment(user.id, type);
        setUser(updatedUser);
        toast({
            title: "Payment Successful",
            description: `Your ${type} fee has been processed and your account is now approved for bidding.`
        });
    }

    const getPendingPayments = (item: AuctionItem) => {
        const payments = [];
        if (item.participationFee && !user.paidParticipation) {
            payments.push({ type: 'participation', amount: item.participationFee });
        }
        if (item.securityDeposit && !user.paidDeposit) {
            payments.push({ type: 'deposit', amount: item.securityDeposit });
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
                                Your account is currently pending administrator approval. For auctions with fees, you can make a payment to be approved automatically.
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
                            <div key={item.id} className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <h3 className="font-semibold">
                                        <Link href={`/auctions/${item.id}`} className="hover:underline text-primary">
                                            {item.name}
                                        </Link>
                                    </h3>
                                    <p className="text-sm text-muted-foreground">Requires payment to participate.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    {pendingPayments.map(p => (
                                        <Button key={p.type} onClick={() => handlePayment(p.type)} disabled={user.status === 'blocked'}>
                                            <DollarSign className="mr-2 h-4 w-4" />
                                            Pay {p.type} Fee (${p.amount})
                                        </Button>
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
