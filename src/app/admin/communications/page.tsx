
"use client";

import { useState, useEffect, useMemo, useTransition } from "react";
import { getCommunicationsForAdmin } from "@/lib/data/admin";
import type { CommunicationLog } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { Skeleton } from "@/components/ui/skeleton";


export default function CommunicationsPage() {
  const [communications, setCommunications] = useState<CommunicationLog[]>([]);
  const [isLoading, startTransition] = useTransition();
  
  useEffect(() => {
    startTransition(async () => {
        const comms = await getCommunicationsForAdmin();
        setCommunications(comms);
    });
  }, []);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const paginatedCommunications = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return communications.slice(startIndex, startIndex + rowsPerPage);
  }, [communications, page, rowsPerPage]);
  
  if (isLoading) {
    return <CommunicationsPageSkeleton />;
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold font-headline text-primary">Communication History</h1>
        <p className="text-muted-foreground">A log of all announcements sent for your auctions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sent Announcements</CardTitle>
          <CardDescription>
            This log shows all the email and SMS communications sent from your auction results pages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {communications.length > 0 ? (
            <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date Sent</TableHead>
                  <TableHead>Auction Item</TableHead>
                  <TableHead>Template Used</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead className="text-right">Recipients</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCommunications.map((log) => (
                  <TableRow key={log.id}>
                     <TableCell>{format(new Date(log.sentAt), "PPP p")}</TableCell>
                    <TableCell>
                      <Button variant="link" asChild className="p-0 h-auto">
                        <Link href={`/admin/results/${log.auctionId}`}>
                           {log.auctionName}
                        </Link>
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{log.templateName}</TableCell>
                     <TableCell>
                        <Badge variant={log.channel === 'email' ? 'secondary' : 'default'} className="capitalize">
                            {log.channel}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">{log.recipientsCount} bidder(s)</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <DataTablePagination
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              totalRows={communications.length}
            />
            </>
          ) : (
             <div className="text-center text-muted-foreground py-8">
                <p>No communications have been sent for your auctions yet.</p>
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


function CommunicationsPageSkeleton() {
    return (
        <div className="space-y-8 p-4 md:p-8">
            <div>
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-1/4" />
                    <Skeleton className="h-4 w-2/3 mt-2" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
