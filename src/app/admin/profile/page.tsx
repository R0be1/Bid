

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
import { useToast } from "@/hooks/use-toast";
import { getAuctioneers } from "@/lib/auctioneers";
import { User, Lock } from "lucide-react";

// MOCK: In a real app, you'd get the logged-in user's ID from an auth context.
const MOCK_AUCTIONEER_ID = "auc-1";

const formSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});


export default function ProfilePage() {
  const { toast } = useToast();
  // MOCK: Fetching the specific auctioneer. In a real app, this would come from a session.
  const auctioneer = getAuctioneers().find(a => a.id === MOCK_AUCTIONEER_ID);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // MOCK: In a real app, you'd call a server action here to verify the current password
    // and update it in the database.
    console.log("Password change values:", values);
    
    // Mocking success
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });

    form.reset();
  }
  
  if (!auctioneer) {
      return <div>Auctioneer not found.</div>
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
        <div>
            <h1 className="text-3xl font-bold font-headline text-primary">Your Profile</h1>
            <p className="text-muted-foreground">View your account details and manage your password.</p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><User /> Account Information</CardTitle>
                <CardDescription>These details are managed by the platform administrator.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="companyName">Auctioneer/Company Name</Label>
                        <Input id="companyName" value={auctioneer.name} readOnly disabled />
                    </div>
                 </div>
                 <div className="grid md:grid-cols-2 gap-4">
                     <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" value={auctioneer.user.firstName} readOnly disabled />
                    </div>
                    <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" value={auctioneer.user.lastName} readOnly disabled />
                    </div>
                 </div>
                 <div className="grid md:grid-cols-2 gap-4">
                     <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" value={auctioneer.user.email} readOnly disabled />
                    </div>
                    <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" value={auctioneer.user.phone} readOnly disabled />
                    </div>
                 </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lock /> Change Password</CardTitle>
                <CardDescription>Update your password here. Remember to choose a strong one.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <FormControl>
                                    <Input type="password" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Update Password</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>

    </div>
  );
}
