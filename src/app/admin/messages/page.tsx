

import { getMessageTemplates } from "@/lib/messages";
import { MessageTemplateList } from "./_components/message-template-list";
import { MessageTemplateForm } from "./_components/message-template-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { List } from "lucide-react";


export default function MessagesPage() {
  const availablePlaceholders = [
    { placeholder: "{itemName}", description: "The name of the auction item." },
    { placeholder: "{winnerName}", description: "The name of the winning bidder." },
    { placeholder: "{userName}", description: "The name of the user receiving the message." },
    { placeholder: "{winningBid}", description: "The final winning bid amount." },
    { placeholder: "{currentBid}", description: "The current highest bid amount." },
    { placeholder: "{auctionEndDate}", description: "The date and time the auction ends." },
  ];

  return (
    <div className="space-y-8 p-4 md:p-8">
        <div>
            <h1 className="text-3xl font-bold font-headline text-primary">Message Templates</h1>
            <p className="text-muted-foreground">Manage templates for email and SMS notifications.</p>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="placeholders">
                <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <List className="h-5 w-5" />
                        <span>Available Placeholders</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Use these placeholders in your templates. They will be automatically replaced with the correct values.
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                       {availablePlaceholders.map(p => (
                            <li key={p.placeholder}>
                                <code className="font-semibold bg-secondary px-1 py-0.5 rounded-sm">{p.placeholder}</code> - <span className="text-muted-foreground">{p.description}</span>
                            </li>
                       ))}
                    </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                 <Card>
                    <CardHeader>
                        <CardTitle>Add New Template</CardTitle>
                        <CardDescription>Create a new reusable message template.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MessageTemplateForm />
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>Existing Templates</CardTitle>
                        <CardDescription>View, edit, or delete your saved templates.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MessageTemplateList />
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
