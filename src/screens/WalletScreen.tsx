import React, { useState, useEffect } from 'react';
import { Ticket } from 'lucide-react';

export const WalletScreen: React.FC = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      // Placeholder: would get user from auth context
      // const tickets = await ticketsService.getTickets(userId);
      // setTickets(tickets);
      setTickets([]);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gigabyte-dark p-4">
      <h1 className="font-display text-3xl font-bold text-gigabyte-accent mb-6">My Wallet</h1>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="text-gigabyte-text-muted">Loading tickets...</div>
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12">
          <Ticket size={48} className="mx-auto text-gigabyte-text-muted mb-4 opacity-50" />
          <p className="text-gigabyte-text-muted mb-2">No tickets yet</p>
          <p className="text-sm text-gigabyte-text-muted">Book events to see them here</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-gigabyte-surface p-4 rounded-lg">
              <h3 className="font-display font-bold text-gigabyte-text">{ticket.event_title}</h3>
              <p className="text-gigabyte-text-muted text-sm">{ticket.ticket_type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
