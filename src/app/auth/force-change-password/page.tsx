
'use client';

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
import { KeyRound, Lock } from "lucide-react";
import { Suspense, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { forceChangePassword } from "./actions";

const formSchema = z.object({
    newPassword: z.string().min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
});


function ForceChangePasswordComponent() {
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const userId = searchParams.get('userId');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        newPassword: "",
        confirmPassword: ""
    },
  });

  if (!userId) {
      return (
          <div className="flex items-center justify-center min-h-full w-full bg-muted/40">
              <Card className="w-full max-w-sm shadow-lg">
                  <CardHeader>
                      <CardTitle>Invalid Request</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p>User ID is missing. Please try the login process again.</p>
                  </CardContent>
              </Card>
          </div>
      )
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userId) return;

    startTransition(async () => {
        const result = await forceChangePassword(userId, values.newPassword);
        toast({
            title: result.success ? "Success" : "Error",
            description: result.message,
            variant: result.success ? "default" : "destructive",
        });
        if (result.success) {
            router.push('/login');
        }
    });
  }

  return (
    <div className="flex items-center justify-center min-h-full w-full bg-muted/40">
        <Card className="w-full max-w-sm shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-headline"><KeyRound /> Set Your New Password</CardTitle>
                <CardDescription>
                    For your security, you must set a new password before you can log in.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        <Button type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Setting Password..." : "Set Password and Proceed to Login"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}


export default function ForceChangePasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ForceChangePasswordComponent />
        </Suspense>
    )
}
