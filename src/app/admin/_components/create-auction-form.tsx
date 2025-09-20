
"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, addDays, getHours, getMinutes, setHours, setMinutes } from "date-fns";
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import type { Category } from "@prisma/client";
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";
import { createAuctionItem } from "../manage-items/actions";
import { useRouter } from "next/navigation";


const imageSchema = z.object({
  url: z.string().url("Invalid URL").min(1, "URL is required."),
});

const formSchema = z.object({
  name: z.string().min(1, "Item name is required."),
  description: z.string().min(1, "Description is required."),
  categoryId: z.string().min(1, "Category is required."),
  startingPrice: z.coerce.number().positive("Starting price must be positive."),
  type: z.enum(["LIVE", "SEALED"]),
  startDate: z.date({ required_error: "Start date is required." }),
  endDate: z.date({ required_error: "End date is required." }),
  participationFee: z.coerce.number().min(0).optional(),
  securityDeposit: z.coerce.number().min(0).optional(),
  minIncrement: z.coerce.number().optional(),
  maxAllowedValue: z.coerce.number().optional(),
  images: z.array(imageSchema).min(1, "At least one image is required.").max(3, "You can add a maximum of 3 images."),
}).refine((data) => {
    if (data.type === 'LIVE') {
        return data.minIncrement !== undefined && data.minIncrement > 0;
    }
    return true;
}, {
    message: "Minimum increment must be a positive number for live auctions.",
    path: ["minIncrement"],
}).refine((data) => {
    if (data.type === 'SEALED') {
        return data.maxAllowedValue !== undefined && data.maxAllowedValue > data.startingPrice;
    }
    return true;
}, {
    message: "Max value must be greater than starting price for sealed bids.",
    path: ["maxAllowedValue"],
}).refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date.",
    path: ["endDate"],
});

interface CreateAuctionFormProps {
    categories: Category[];
}

export function CreateAuctionForm({ categories }: CreateAuctionFormProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      startingPrice: 0,
      type: "LIVE",
      startDate: new Date(),
      endDate: addDays(new Date(), 3),
      participationFee: 0,
      securityDeposit: 0,
      minIncrement: 1,
      images: [{url: ''}],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const auctionType = useWatch({
      control: form.control,
      name: "type"
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const result = await createAuctionItem(values);
      if (result.success) {
        toast({
          title: "Auction Item Created!",
          description: `"${values.name}" has been successfully created.`,
        });
        form.reset();
        router.refresh();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        })
      }
    });
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Create New Auction Item</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Vintage Pocket Watch" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the item in detail."
                      className="resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category <span className="text-destructive">*</span></FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startingPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Starting Price (Birr) <span className="text-destructive">*</span></FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auction Type <span className="text-destructive">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an auction type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="LIVE">Live Auction</SelectItem>
                        <SelectItem value="SEALED">Sealed Bid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="participationFee"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participation Fee (Birr)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional fee to participate in the auction.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date <span className="text-destructive">*</span></FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP p")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                          captionLayout="dropdown-buttons"
                          fromYear={new Date().getFullYear() - 1}
                          toYear={new Date().getFullYear() + 10}
                        />
                         <div className="p-3 border-t border-border flex items-center justify-center gap-2">
                            <Select
                                value={String(getHours(field.value || new Date()))}
                                onValueChange={(value) => {
                                    if (!field.value) return;
                                    field.onChange(setHours(field.value, parseInt(value)));
                                }}
                            >
                                <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Array.from({length: 24}, (_, i) => String(i).padStart(2, '0')).map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            :
                            <Select
                                value={String(getMinutes(field.value || new Date())).padStart(2, '0')}
                                onValueChange={(value) => {
                                    if (!field.value) return;
                                    field.onChange(setMinutes(field.value, parseInt(value)));
                                }}
                            >
                                <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Array.from({length: 60}, (_, i) => String(i).padStart(2, '0')).map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date <span className="text-destructive">*</span></FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP p")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                          initialFocus
                          captionLayout="dropdown-buttons"
                          fromYear={new Date().getFullYear()}
                          toYear={new Date().getFullYear() + 10}
                        />
                        <div className="p-3 border-t border-border flex items-center justify-center gap-2">
                             <Select
                                value={String(getHours(field.value || new Date()))}
                                onValueChange={(value) => {
                                    if (!field.value) return;
                                    field.onChange(setHours(field.value, parseInt(value)));
                                }}
                            >
                                <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Array.from({length: 24}, (_, i) => String(i).padStart(2, '0')).map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            :
                            <Select
                                value={String(getMinutes(field.value || new Date())).padStart(2, '0')}
                                onValueChange={(value) => {
                                    if (!field.value) return;
                                    field.onChange(setMinutes(field.value, parseInt(value)));
                                }}
                            >
                                <SelectTrigger className="w-20"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Array.from({length: 60}, (_, i) => String(i).padStart(2, '0')).map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <FormField
                control={form.control}
                name="securityDeposit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Security Deposit (Birr)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional deposit forfeited if winner doesn't pay.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {auctionType === 'LIVE' ? (
                <FormField
                  control={form.control}
                  name="minIncrement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Increment (Birr) <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormDescription>
                        The smallest amount by which a bid can be increased.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                 <FormField
                  control={form.control}
                  name="maxAllowedValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Allowed Value (Birr) <span className="text-destructive">*</span></FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormDescription>
                        (Sealed Bid) The max value for bid validation.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                    )}
                  />
              )}
            </div>

            <div>
              <FormLabel>Item Images <span className="text-destructive">*</span></FormLabel>
              <FormDescription className="text-xs">Provide public image URLs.</FormDescription>
              <div className="space-y-4 mt-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-2 p-2 border rounded-md">
                     <div className="grid gap-2 flex-grow">
                        <FormField
                            control={form.control}
                            name={`images.${index}.url`}
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="https://example.com/image.png" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                     </div>
                      {fields.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                  </div>
                ))}
                {fields.length < 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({url: ''})}
                    className="mt-2"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Image URL
                  </Button>
                )}
              </div>
              <FormMessage>{form.formState.errors.images?.message}</FormMessage>
            </div>


            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Auction Item'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    
