
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
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
import { registerAuctioneer } from "../actions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Auctioneer name is required."),
  address: z.string().min(1, "Address is required."),
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  phone: z.string().min(1, "Phone number is required."),
  email: z.string().email("Invalid email address."),
});

export default function RegisterAuctioneerPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name: "",
        address: "",
        firstName: "",
        lastName: "",
        phone: "",
        email: ""
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        await registerAuctioneer(values);
        toast({
          title: "Auctioneer Registered",
          description: `The portal for "${values.name}" has been created.`,
        });
        router.push("/super-admin/manage-auctioneer");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to register auctioneer.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="max-w-2xl mx-auto">
        <div className="mb-8 pt-8 md:px-0">
            <h1 className="text-3xl font-bold font-headline text-primary">Register New Auctioneer</h1>
            <p className="text-muted-foreground">Create a new portal for an auctioneer.</p>
        </div>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-8">
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
                                <Input placeholder="Auctioneer/Company Name" {...field} />
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
                                <Textarea placeholder="Business Address" {...field} />
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
                        <CardDescription>This user will manage the auctioneer portal. Their credentials will be used for login.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>First Name <span className="text-destructive">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="First Name" {...field} />
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
                                    <Input placeholder="Last Name" {...field} />
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
                                    <Input type="email" placeholder="Email Address" {...field} />
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
                                    <Input type="tel" placeholder="Phone Number" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                <Button type="submit" size="lg" variant="accent" className="w-full" disabled={isPending}>
                  {isPending ? 'Registering...' : 'Register Auctioneer'}
                </Button>
            </form>
        </Form>
    </div>
  );
}

    