
"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Info, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

type SuperAdminForTable = {
    id: string;
    name: string;
    email: string;
    tempPassword: string | null;
}

interface SuperAdminListProps {
  initialAdmins: SuperAdminForTable[];
}

export function SuperAdminList({ initialAdmins }: SuperAdminListProps) {
    const { toast } = useToast();

    const handleCopyPassword = (password: string | null | undefined) => {
      if (!password) return;
      navigator.clipboard.writeText(password).then(() => {
        toast({
          title: "Copied!",
          description: "Temporary password copied to clipboard.",
        });
      });
    };

    return (
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
                        {initialAdmins.map((admin) => (
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
    );
}

