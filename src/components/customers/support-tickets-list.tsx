'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCustomerInteractions, useCreateInteraction } from '@/lib/hooks/use-customers';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function SupportTicketsList({ customerId }: { customerId: string }) {
  const { data, isLoading } = useCustomerInteractions();
  const createMutation = useCreateInteraction();
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('SUPPORT');

  const interactions = data?.data?.interactions || [];
  // Filter for this customer if the API returns all, or if API endpoint is scoped, this handles it.
  const myTickets = interactions.filter((i: any) => i.customerId === customerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(
      { customerId, subject, description, interactionType: type, priority: 'MEDIUM', status: 'OPEN' },
      {
        onSuccess: () => {
          setOpen(false);
          setSubject('');
          setDescription('');
        }
      }
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN': return <Badge variant="default" className="bg-blue-500">Open</Badge>;
      case 'IN_PROGRESS': return <Badge variant="secondary" className="bg-yellow-500 text-white">In Progress</Badge>;
      case 'RESOLVED': return <Badge variant="outline" className="text-success border-success"><CheckCircle2 className="w-3 h-3 mr-1"/>Resolved</Badge>;
      case 'CLOSED': return <Badge variant="outline">Closed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Support Tickets</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <MessageSquarePlus className="w-4 h-4 mr-2" />
              New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Topic</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPPORT">General Support</SelectItem>
                    <SelectItem value="INQUIRY">Order Inquiry</SelectItem>
                    <SelectItem value="COMPLAINT">Complaint</SelectItem>
                    <SelectItem value="FEEDBACK">Feedback</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input value={subject} onChange={e => setSubject(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} required rows={4} />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createMutation.isPending}>Submit Ticket</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4 text-muted-foreground text-sm">Loading tickets...</div>
        ) : myTickets.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-20" />
            <p className="text-sm text-muted-foreground">You don't have any support tickets yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myTickets.map((ticket: any) => (
              <div key={ticket.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{ticket.subject}</span>
                    {getStatusBadge(ticket.status)}
                  </div>
                  <div className="text-sm text-muted-foreground line-clamp-1">
                    {ticket.description}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mt-2">
                    <Clock className="w-3 h-3 mr-1" />
                    {format(new Date(ticket.createdAt), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
                <div className="shrink-0">
                  <Badge variant="secondary" className="text-xs uppercase">{ticket.interactionType}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
