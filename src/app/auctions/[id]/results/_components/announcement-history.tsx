
"use client";

import type { CommunicationLog } from "@/lib/types";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import { DataTablePagination } from "@/components/ui/data-table-pagination";

interface AnnouncementHistoryProps {
  announcements: CommunicationLog[];
}

export function AnnouncementHistory({ announcements }: AnnouncementHistoryProps) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const paginatedAnnouncements = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return announcements.slice(startIndex, startIndex + rowsPerPage);
  }, [announcements, page, rowsPerPage]);

  if (announcements.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4 border rounded-lg">
        <p>No announcements have been sent for this auction yet.</p>
      </div>
    );
  }

  return (
    <>
    <div className="overflow-x-auto border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date Sent</TableHead>
            <TableHead>Template Used</TableHead>
            <TableHead>Channel</TableHead>
            <TableHead className="text-right">Recipients</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedAnnouncements.map((announcement) => (
            <TableRow key={announcement.id}>
              <TableCell>{format(announcement.sentAt, "PPP p")}</TableCell>
              <TableCell className="font-medium">{announcement.templateName}</TableCell>
              <TableCell>
                  <Badge variant={announcement.channel === 'email' ? 'secondary' : 'default'} className="capitalize">
                      {announcement.channel}
                  </Badge>
              </TableCell>
              <TableCell className="text-right">{announcement.recipientsCount} bidder(s)</TableCell>
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
        totalRows={announcements.length}
      />
    </>
  );
}
