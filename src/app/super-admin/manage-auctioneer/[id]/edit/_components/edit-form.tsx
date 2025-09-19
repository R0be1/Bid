"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updateAuctioneer } from "../../../actions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

type AuctioneerForEdit = {
    id: string;
    name: string;
    address: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
}

const formSchema = z.object({
  name: z.string().min(1, "Auctioneer name is required."),
  address: z.string().min(1, "Address is required."),
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  phone: z.string().min(1, "Phone number is required."),
  email: z.string().email("Invalid email address."),
});

interface EditAuctioneerFormProps {
  auctioneer: AuctioneerForEdit;
}

export function EditAuctioneerForm({ auctioneer }: EditAuctioneerFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const id = auctioneer.id;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: auctioneer.name,
        address: auctioneer.address,
        firstName: auctioneer.firstName,
        lastName: auctioneer.lastName,
        phone: auctioneer.phone,
        email: auctioneer.email
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
        try {
            await updateAuctioneer(id, values);
            toast({
                title: "Auctioneer Updated",
                description: `The details for "${values.name}" have been saved.`,
            });
            router.push("/super-admin/manage-auctioneer");
            router.refresh();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update auctioneer.",
                variant: "destructive",
            });
        }
    });
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-4 md:px-0 pb-8">
            <Card>
                <CardHeader>
                    <CardTitle>Auctioneer Details</CardTitle>
                    <CardDescription>Information about the auctioneer's business.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Auctioneer/Company Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. Vintage Treasures LLC" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Business Address <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                            <Textarea placeholder="123 Main St, Anytown, USA" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Primary User Account</CardTitle>
                    <CardDescription>This user manages the auctioneer portal.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>First Name <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Last Name <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input placeholder="Smith" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email Address <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="john.smith@company.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Phone Number <span className="text-destructive">*</span></FormLabel>
                            <FormControl>
                                <Input type="tel" placeholder="0911223344" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>

            <Button type="submit" size="lg" variant="accent" className="w-full" disabled={isPending}>
                {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
        </form>
    </Form>
  );
}
