
'use client';

import { useState, useEffect } from 'react';
import { getBidHistory, type BidHistoryItem } from './actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { History, CheckCircle, XCircle, Clock, Trophy } from 'lucide-react';

export default function HistoryPage() {
    const [history, setHistory] = useState<BidHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        getBidHistory().then(result => {
            if (result.success) {
                setHistory(result.history);
            } else {
                toast({
                    title: 'Error',
                    description: result.message || 'Failed to load history.',
                    variant: 'destructive',
                });
            }
            setIsLoading(false);
        })
    }, [toast]);

    if (isLoading) {
        return <HistoryPageSkeleton />;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline text-primary flex items-center gap-2"><History /> Bidding History</h1>
                <p className="text-muted-foreground">A record of all auctions you've participated in.</p>
            </div>

            {history.length === 0 ? (
                 <Card>
                    <CardContent className="text-center text-muted-foreground py-12">
                        <p>You haven't placed any bids yet.</p>
                        <Button asChild className="mt-4">
                            <Link href="/">Explore Auctions</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {history.map(item => (
                        <HistoryItemCard key={item.auctionId} item={item} />
                    ))}
                </div>
            )}
        </div>
    )
}

function HistoryItemCard({ item }: { item: BidHistoryItem }) {
    const statusMap = {
        Won: { variant: 'default', icon: <Trophy className="h-4 w-4" />, text: 'You Won' },
        Lost: { variant: 'destructive', icon: <XCircle className="h-4 w-4" />, text: 'You Lost' },
        'In Progress': { variant: 'secondary', icon: <Clock className="h-4 w-4" />, text: 'In Progress' },
    } as const;

    const currentStatus = statusMap[item.status];
    
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="aspect-w-16 aspect-h-9 mb-4">
                    <Image src={item.auctionImage} alt={item.auctionName} width={400} height={300} className="rounded-md object-cover"/>
                </div>
                <CardTitle>{item.auctionName}</CardTitle>
                <CardDescription>Ended on {format(new Date(item.endDate), 'PPP')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 flex-grow">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Your Highest Bid</span>
                    <span className="font-semibold">{item.yourHighestBid.toLocaleString()} Birr</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Winning Bid</span>
                    <span className="font-semibold">{item.winningBid ? `${item.winningBid.toLocaleString()} Birr` : 'N/A'}</span>
                </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Winner</span>
                    <span className="font-semibold">{item.winnerName || 'N/A'}</span>
                </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Outcome</span>
                     <Badge variant={currentStatus.variant} className="gap-1">
                        {currentStatus.icon} {currentStatus.text}
                    </Badge>
                </div>
            </CardContent>
            <CardFooter>
                 <Button asChild variant="outline" className="w-full">
                    <Link href={`/auctions/${item.auctionId}/results`}>View Final Results</Link>
                 </Button>
            </CardFooter>
        </Card>
    );
}


function HistoryPageSkeleton() {
    return (
        <div className="space-y-8">
            <div>
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="aspect-video w-full" />
                            <Skeleton className="h-6 w-3/4 mt-4" />
                            <Skeleton className="h-4 w-1/2 mt-2" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-full" />
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-10 w-full" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
