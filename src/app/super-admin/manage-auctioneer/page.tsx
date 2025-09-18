
import Link from "next/link";
import { getAuctioneers } from "@/lib/auctioneers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { PlusCircle } from "lucide-react";

export default function ManageAuctioneerPage() {
  const auctioneers = getAuctioneers();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold font-headline text-primary">Manage Auctioneers</h1>
            <p className="text-muted-foreground">View and register new auctioneers.</p>
        </div>
        <Button asChild>
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
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Primary Contact</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date Registered</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {auctioneers.map((auctioneer) => (
                          <TableRow key={auctioneer.id}>
                              <TableCell className="font-medium">{auctioneer.name}</TableCell>
                              <TableCell>{auctioneer.user.firstName} {auctioneer.user.lastName}</TableCell>
                              <TableCell>{auctioneer.user.email}</TableCell>
                              <TableCell>
                                  <Badge variant={auctioneer.status === 'active' ? 'default' : 'secondary'}>
                                      {auctioneer.status}
                                  </Badge>
                              </TableCell>
                              <TableCell>{format(auctioneer.createdAt, "PPP")}</TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </CardContent>
      </Card>

    </div>
  );
}
