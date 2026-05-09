'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Eye } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  useAdminQueries,
  useUpdateAdminQuery,
} from '@/lib/hooks/use-admin';

const getPriorityBadgeVariant = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'default';
    case 'low':
      return 'secondary';
    default:
      return 'default';
  }
};

export default function QueriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuery, setSelectedQuery] = useState<any>(null);
  const [responseText, setResponseText] = useState('');
  const [detailOpen, setDetailOpen] = useState(false);

  const { data, isLoading, isError, error } = useAdminQueries();
  const updateMutation = useUpdateAdminQuery();

  const queries =
    ((data as any)?.data || (data as any[]) || []).filter((query: any) =>
      query.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      query.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      query.message?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleView = (query: any) => {
    setSelectedQuery(query);
    setResponseText(query.response || '');
    setDetailOpen(true);
  };

  const handleRespond = () => {
    if (!selectedQuery) return;
    updateMutation.mutate(
      {
        queryId: selectedQuery.id,
        data: {
          status: 'resolved',
          response: responseText,
        },
      },
      {
        onSuccess: () => {
          setDetailOpen(false);
          setSelectedQuery(null);
          setResponseText('');
        },
      }
    );
  };

  const handleStatusUpdate = (query: any, status: string) => {
    updateMutation.mutate({
      queryId: query.id,
      data: { status },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Client Queries</h2>
          <p className="text-muted-foreground">
            Manage and respond to customer inquiries
          </p>
        </div>
      </div>

      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search queries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Recent Queries</h3>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : isError ? (
            <div className="rounded-md bg-destructive/10 p-4 text-center">
              <p className="text-sm text-destructive">
                {error?.message || 'Failed to load queries. Please try again.'}
              </p>
            </div>
          ) : queries.length === 0 ? (
            <div className="py-12 text-center">
              <h3 className="text-lg font-semibold">No queries found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'No customer inquiries at the moment'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queries.map((query: any) => (
                  <TableRow key={query.id}>
                    <TableCell className="font-medium">{query.customerName}</TableCell>
                    <TableCell>{query.subject}</TableCell>
                    <TableCell>
                      <Badge variant={getPriorityBadgeVariant(query.priority)}>
                        {query.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={query.status === 'resolved' ? 'default' : 'secondary'}
                      >
                        {query.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {query.createdAt
                        ? format(new Date(query.createdAt), 'MMM dd, yyyy')
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(query)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Query Details</DialogTitle>
            <DialogDescription>
              View and respond to customer inquiry
            </DialogDescription>
          </DialogHeader>
          {selectedQuery && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Customer:</span>
                  <p className="font-medium">{selectedQuery.customerName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Subject:</span>
                  <p className="font-medium">{selectedQuery.subject}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Priority:</span>
                  <Badge variant={getPriorityBadgeVariant(selectedQuery.priority)}>
                    {selectedQuery.priority}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <Badge
                    variant={
                      selectedQuery.status === 'resolved' ? 'default' : 'secondary'
                    }
                  >
                    {selectedQuery.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label>Message</Label>
                <p className="mt-1 text-sm rounded-md bg-muted p-3">
                  {selectedQuery.message}
                </p>
              </div>
              {selectedQuery.response && (
                <div>
                  <Label>Previous Response</Label>
                  <p className="mt-1 text-sm rounded-md bg-muted p-3">
                    {selectedQuery.response}
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="response">Your Response</Label>
                <Textarea
                  id="response"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response..."
                  rows={4}
                />
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            {selectedQuery?.status !== 'resolved' && (
              <Button
                variant="outline"
                onClick={() => handleStatusUpdate(selectedQuery, 'in-progress')}
                disabled={updateMutation.isPending}
              >
                Mark In Progress
              </Button>
            )}
            <Button
              onClick={handleRespond}
              disabled={updateMutation.isPending || !responseText.trim()}
            >
              {updateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Respond & Resolve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
