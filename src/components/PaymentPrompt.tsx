
"use client";

import type { AuctionItem, PaymentType } from "@/lib/types";
import { useState, useTransition, ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Banknote, Upload, CreditCard } from "lucide-react";
import type { AuthenticatedUser } from "@/lib/auth-client";
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

interface PaymentPromptProps {
  item: AuctionItem;
  onPaymentSuccess: (user: AuthenticatedUser) => void;
}

export function PaymentPrompt({ item, onPaymentSuccess }: PaymentPromptProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const fees = {
    participation: item.participationFee,
    deposit: item.securityDeposit,
  };

  const handleDirectPayment = (paymentType: PaymentType) => {
    startTransition(async () => {
      const result = await recordPaymentAction(paymentType, "direct");
      toast({
        title: result.success ? "Success" : "Error",
        description: result.message,
        variant: result.success ? "default" : "destructive",
      });

      if (result.success && result.data) {
        onPaymentSuccess(result.data);
      }
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard /> Payment Required
        </CardTitle>
        <CardDescription>
          This auction requires one or more fees to participate.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {fees.participation && fees.participation > 0 && (
          <PaymentOption
            feeType="participation"
            feeAmount={fees.participation}
            onPaymentSuccess={onPaymentSuccess}
            isPending={isPending}
            startTransition={startTransition}
            handleDirectPayment={handleDirectPayment}
          />
        )}
        {fees.deposit && fees.deposit > 0 && (
          <PaymentOption
            feeType="deposit"
            feeAmount={fees.deposit}
            onPaymentSuccess={onPaymentSuccess}
            isPending={isPending}
            startTransition={startTransition}
            handleDirectPayment={handleDirectPayment}
          />
        )}
      </CardContent>
    </Card>
  );
}

interface PaymentOptionProps {
    feeType: PaymentType;
    feeAmount: number;
    onPaymentSuccess: (user: AuthenticatedUser) => void;
    isPending: boolean;
    startTransition: React.TransitionStartFunction;
    handleDirectPayment: (paymentType: PaymentType) => void;
}


function PaymentOption({ feeType, feeAmount, onPaymentSuccess, isPending, startTransition, handleDirectPayment }: PaymentOptionProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const { toast } = useToast();
    const feeTitle = feeType === 'participation' ? 'Participation Fee' : 'Security Deposit';
    const feeDescription = feeType === 'participation' ? 'A one-time fee to enter this auction.' : 'A refundable deposit to ensure bid integrity.';

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setReceiptFile(e.target.files[0]);
        }
    };
    
    const handleReceiptUpload = () => {
        if (!receiptFile) {
            toast({ title: "No file selected", description: "Please select a file to upload.", variant: "destructive" });
            return;
        }

        startTransition(async () => {
            // In a real app, you would upload this file to a storage service (e.g., Firebase Storage)
            // and get a URL. For this prototype, we'll just use the file name as a placeholder URL.
            const receiptUrl = `/uploads/receipts/${receiptFile.name}`;
            const result = await recordPaymentAction(feeType, "receipt", receiptUrl);

            toast({
                title: result.success ? "Success" : "Error",
                description: result.message,
                variant: result.success ? "default" : "destructive",
            });
            
            if (result.success && result.data) {
                onPaymentSuccess(result.data);
            }
            setIsDialogOpen(false);
            setReceiptFile(null);
        });
    };

    return (
        <div className="p-4 border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
                <h3 className="font-semibold">{feeTitle}: {feeAmount.toLocaleString()} Birr</h3>
                <p className="text-sm text-muted-foreground">{feeDescription}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <Button onClick={() => handleDirectPayment(feeType)} disabled={isPending}>
                    <Banknote className="mr-2 h-4 w-4" />
                    {isPending ? "Processing..." : "Pay Now"}
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="secondary"><Upload className="mr-2 h-4 w-4" /> Upload Receipt</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Upload Payment Receipt for {feeTitle}</DialogTitle>
                            <DialogDescription>
                                Please upload a valid proof of payment. Your account will be pending review after submission.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <Input id="receipt" type="file" onChange={handleFileChange} />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline" onClick={() => setReceiptFile(null)}>Cancel</Button>
                            </DialogClose>
                            <Button type="button" onClick={handleReceiptUpload} disabled={isPending || !receiptFile}>
                                {isPending ? "Submitting..." : "Submit for Review"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

