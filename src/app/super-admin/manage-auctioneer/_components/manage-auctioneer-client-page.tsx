
"use client";

import { useState, useMemo, useTransition } from 'react';
import Link from 'next/link';
import { toggleAuctioneerStatus } from '../actions';
import type { UserStatus } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { PlusCircle, Edit, Power, Info, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { DataTablePagination } from '@/components/ui/data-table-pagination';

type AuctioneerForTable = {
    id: string;
    name: string;
    contact: string;
    email: string;
    status: UserStatus;
    createdAt: Date;
    tempPassword: string | null;
}

interface ManageAuctioneerClientPageProps {
  auctioneers: AuctioneerForTable[];
}


export function ManageAuctioneerClientPage({ auctioneers: initialAuctioneers }: ManageAuctioneerClientPageProps) {
  const [auctioneers, setAuctioneers] = useState<AuctioneerForTable[]>(initialAuctioneers);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const paginatedAuctioneers = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return auctioneers.slice(startIndex, startIndex + rowsPerPage);
  }, [auctioneers, page, rowsPerPage]);

  const handleToggleStatus = (auctioneerId: string, currentStatus: UserStatus) => {
    startTransition(async () => {
      try {
        await toggleAuctioneerStatus(auctioneerId, currentStatus);
        const newStatus = currentStatus === 'APPROVED' ? 'BLOCKED' : 'APPROVED';
        setAuctioneers(prev => prev.map(a => a.id === auctioneerId ? {...a, status: newStatus} : a));
        toast({
          title: 'Status Updated',
          description: `Auctioneer status has been set to ${newStatus.toLowerCase()}.`,
        });
      } catch (error) {
         toast({
          title: 'Error',
          description: 'Failed to update status.',
          variant: 'destructive'
        });
      }
    });
  };

  const handleCopyPassword = (password: string | null) => {
    if (!password) return;
    navigator.clipboard.writeText(password).then(() => {
      toast({
        title: "Copied!",
        description: "Temporary password copied to clipboard.",
      });
    });
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold font-headline text-primary">Manage Auctioneers</h1>
            <p className="text-muted-foreground">View and register new auctioneers.</p>
        </div>
        <Button asChild variant="accent">
            <Link href="/super-admin/manage-auctioneer/register">
                <PlusCircle className="mr-2 h-4 w-4" />
                Register Auctioneer
            </Link>
        </Button>
      </div>

      <Card>
          <CardHeader>
              <CardTitle>Registered Auctioneers</CardTitle>
              <CardDescription>A list of all registered auctioneer portals.</CardDescription>
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Company Name</TableHead>
                            <TableHead>Primary Contact</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date Registered</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedAuctioneers.map((auctioneer) => (
                            <TableRow key={auctioneer.id}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                      <span>{auctioneer.name}</span>
                                      {auctioneer.tempPassword && (
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                              <Info className="h-4 w-4 text-muted-foreground cursor-help"/>
                                          </TooltipTrigger>
                                          <TooltipContent>
                                            <div className="flex items-center gap-2">
                                                <p>Temp Password: <span className="font-bold">{auctioneer.tempPassword}</span></p>
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopyPassword(auctioneer.tempPassword)}>
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                          </TooltipContent>
                                        </Tooltip>
                                      )}
                                    </div>
                                </TableCell>
                                <TableCell>{auctioneer.contact}</TableCell>
                                <TableCell>{auctioneer.email}</TableCell>
                                <TableCell>
                                    <Badge variant={auctioneer.status === 'APPROVED' ? 'default' : 'destructive'}>
                                        {auctioneer.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{format(auctioneer.createdAt, "PPP")}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <Button asChild variant="ghost" size="icon" title="Edit Auctioneer">
                                          <Link href={`/super-admin/manage-auctioneer/${auctioneer.id}/edit`}>
                                              <Edit className="h-4 w-4" />
                                          </Link>
                                      </Button>
                                      <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          title={auctioneer.status === 'APPROVED' ? 'Deactivate' : 'Activate'}
                                          className={auctioneer.status === 'APPROVED' ? 'text-green-600 hover:text-green-700' : 'text-destructive hover:text-destructive/80'}
                                          onClick={() => handleToggleStatus(auctioneer.id, auctioneer.status)}
                                          disabled={isPending}
                                      >
                                          <Power className="h-4 w-4" />
                                      </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              </div>
              <DataTablePagination
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                totalRows={auctioneers.length}
              />
            </TooltipProvider>
          </CardContent>
      </Card>

    </div>
  );
}
