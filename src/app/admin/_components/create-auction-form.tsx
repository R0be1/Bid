
"use client";

import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
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
import type { Category } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(1, "Item name is required."),
  description: z.string().min(1, "Description is required."),
  category: z.string().min(1, "Category is required."),
  startingPrice: z.coerce.number().positive("Starting price must be positive."),
  type: z.enum(["live", "sealed"]),
  startDate: z.date({ required_error: "Start date is required." }),
  endDate: z.date({ required_error: "End date is required." }),
  participationFee: z.coerce.number().min(0).optional(),
  securityDeposit: z.coerce.number().min(0).optional(),
  minIncrement: z.coerce.number().optional(),
  images: z.array(z.any()).min(1, "At least one image is required.").max(3, "You can add a maximum of 3 images."),
}).refine((data) => {
    if (data.type === 'live') {
        return data.minIncrement !== undefined && data.minIncrement > 0;
    }
    return true;
}, {
    message: "Minimum increment must be a positive number for live auctions.",
    path: ["minIncrement"],
}).refine((data) => data.endDate > data.startDate, {
    message: "End date must be after start date.",
    path: ["endDate"],
});

interface CreateAuctionFormProps {
    categories: Category[];
}

export function CreateAuctionForm({ categories }: CreateAuctionFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      startingPrice: 0,
      type: "live",
      participationFee: 0,
      securityDeposit: 0,
      minIncrement: 1,
      images: [undefined],
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
    // In a real app, you would call a server action here to save the data.
    // This would involve uploading the files to a storage service (like Firebase Storage)
    // and then saving the returned URLs with the auction item data.
    console.log("Form Values:", values);
    
    // Create a FormData object to see how files would be handled
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    // ... append other fields

    values.images.forEach((fileList, index) => {
      if (fileList && fileList[0]) {
        formData.append(`image_${index}`, fileList[0]);
      }
    });

    console.log("FormData to be sent (demo):", formData.get("image_0"));
    alert("Auction item created! (Check console for data). This is a demo and data is not saved.");
    form.reset();
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
                  <FormLabel>Item Name</FormLabel>
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
                  <FormLabel>Description</FormLabel>
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
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
                    <FormLabel>Starting Price (Birr)</FormLabel>
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
                    <FormLabel>Auction Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an auction type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="live">Live Auction</SelectItem>
                        <SelectItem value="sealed">Sealed Bid</SelectItem>
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
                    <FormLabel>Start Date</FormLabel>
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
                              format(field.value, "PPP")
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
                        />
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
                    <FormLabel>End Date</FormLabel>
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
                              format(field.value, "PPP")
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
                        />
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
              {auctionType === 'live' && (
                <FormField
                  control={form.control}
                  name="minIncrement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Increment (Birr)</FormLabel>
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
              )}
            </div>

            <div>
              <FormLabel>Item Images</FormLabel>
              <div className="space-y-4 mt-2">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`images.${index}`}
                    render={({ field: { onChange, value, ...rest } }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormControl>
                             <Input 
                               type="file" 
                               accept="image/*"
                               onChange={(e) => onChange(e.target.files)}
                               {...rest}
                              />
                          </FormControl>
                          {fields.length > 1 && (
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                {fields.length < 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append(undefined)}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Image
                  </Button>
                )}
              </div>
              <FormDescription className="mt-2">
                Add up to 3 images for the item.
              </FormDescription>
            </div>


            <Button type="submit" className="w-full">
              Create Auction Item
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
