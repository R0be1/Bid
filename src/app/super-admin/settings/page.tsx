
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
import { addSuperAdmin, getSuperAdmins } from "@/lib/super-admins";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useMemo } from "react";
import type { SuperAdmin } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Info, Copy } from "lucide-react";


const formSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(1, "Phone number is required."),
});

export default function SettingsPage() {
    const { toast } = useToast();
    const initialAdmins = useMemo(() => getSuperAdmins(), []);
    const [admins, setAdmins] = useState<SuperAdmin[]>(initialAdmins);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        // In a real app, this would call a server action to create a new super admin user
        const newAdmin = addSuperAdmin({name: values.name, email: values.email, phone: values.phone});
        setAdmins(prev => [...prev, newAdmin]);
        
        toast({
            title: "Super Admin Registered",
            description: `${values.name} has been added as a super admin.`,
        });
        form.reset();
    }
    
    const handleCopyPassword = (password: string | undefined) => {
      if (!password) return;
      navigator.clipboard.writeText(password).then(() => {
        toast({
          title: "Copied!",
          description: "Temporary password copied to clipboard.",
        });
      });
    };


    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline text-primary">Settings</h1>
                <p className="text-muted-foreground">Manage super admin users.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <Card>
                    <CardHeader>
                        <CardTitle>Register New Super Admin</CardTitle>
                        <CardDescription>Add another user with super administrative privileges.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Jane Doe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="jane.doe@example.com" {...field} />
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
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input type="tel" placeholder="0911223344" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" variant="accent" className="w-full">Register Admin</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Registered Super Admins</CardTitle>
                        <CardDescription>List of all users with super administrative privileges.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TooltipProvider>
                            <div className="overflow-x-auto border rounded-lg">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Email</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {admins.map((admin) => (
                                            <TableRow key={admin.id}>
                                                <TableCell className="font-medium">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="flex items-center gap-2 cursor-help">
                                                            <span>{admin.name}</span>
                                                            <Info className="h-4 w-4 text-muted-foreground"/>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <div className="flex items-center gap-2">
                                                                <p>Temp Password: <span className="font-bold">{admin.tempPassword}</span></p>
                                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopyPassword(admin.tempPassword)}>
                                                                    <Copy className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell>{admin.email}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </TooltipProvider>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
