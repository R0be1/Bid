
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTransition } from "react";
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
import { addCategory } from "@/app/admin/categories/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, "Category name is required."),
});

export function CategoryForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await addCategory(formData);
      if (result.success) {
        toast({
            title: "Category Added",
            description: result.message,
        });
        form.reset();
        router.refresh(); 
      } else {
         toast({
            title: "Error",
            description: result.message,
            variant: "destructive"
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form action={form.handleSubmit(() => onSubmit(new FormData(form.control._formValues)))} className="flex items-end gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Electronics" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Adding...' : 'Add Category'}
        </Button>
      </form>
    </Form>
  );
}
