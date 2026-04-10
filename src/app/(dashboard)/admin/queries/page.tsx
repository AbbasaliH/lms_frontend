'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { mockClientQueries } from '@/lib/mock-data';
import { format } from 'date-fns';

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
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Client Queries</h2>
        <p className="text-muted-foreground">
          Manage and respond to customer inquiries
        </p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Recent Queries</h3>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockClientQueries.map((query) => (
                <TableRow key={query.id}>
                  <TableCell className="font-medium">{query.customerName}</TableCell>
                  <TableCell>{query.subject}</TableCell>
                  <TableCell>
                    <Badge variant={getPriorityBadgeVariant(query.priority)}>
                      {query.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={query.status === 'resolved' ? 'default' : 'secondary'}>
                      {query.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(query.createdAt, 'MMM dd, yyyy')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}