
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
import { getSuperAdmins } from "@/lib/super-admins";
import { User, Lock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { getCurrentUser } from "@/lib/auth";
import { useEffect, useState } from "react";
import type { SuperAdmin } from "@/lib/types";


const formSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});


export default function SuperAdminProfilePage() {
  const { toast } = useToast();
  const [superAdmin, setSuperAdmin] = useState<SuperAdmin | undefined>();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser?.role === 'super-admin') {
      const admin = getSuperAdmins().find(a => a.id === currentUser.id);
      setSuperAdmin(admin);
    }
  }, []);
  

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
  
  if (!superAdmin) {
      return <div>Loading...</div>
  }

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold font-headline text-primary">Your Profile</h1>
            <p className="text-muted-foreground">View your account details and manage your password.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User /> Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={superAdmin.name} readOnly disabled className="border-0 bg-secondary" />
                    </div>
                    <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" value={superAdmin.email} readOnly disabled className="border-0 bg-secondary" />
                    </div>
                     <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" value={superAdmin.phone} readOnly disabled className="border-0 bg-secondary" />
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
                                        <Input type="password" {...field} className="bg-secondary/50"/>
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
                                        <Input type="password" {...field} className="bg-secondary/50"/>
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
                                        <Input type="password" {...field} className="bg-secondary/50"/>
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
    </div>
  );
}
