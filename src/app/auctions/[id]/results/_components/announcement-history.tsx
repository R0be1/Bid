
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

interface AnnouncementHistoryProps {
  announcements: CommunicationLog[];
}

export function AnnouncementHistory({ announcements }: AnnouncementHistoryProps) {
  if (announcements.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4 border rounded-lg">
        <p>No announcements have been sent for this auction yet.</p>
      </div>
    );
  }

  return (
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
        {announcements.map((announcement) => (
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
  );
}
