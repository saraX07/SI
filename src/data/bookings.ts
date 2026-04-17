export type BookingStatus = 'en attente' | 'en attente de paiement' | 'accepté' | 'refusé';

export interface Booking {
  id: string;
  hallName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  userId: string;
  paymentReceiptName?: string;
  refusalReason?: string;
}

export const bookings: Booking[] = [
  {
    id: 'b1',
    hallName: 'Salle Alger',
    date: '2026-06-15',
    startTime: '18:00',
    endTime: '02:00',
    status: 'accepté',
    userId: 'u1',
  },
  {
    id: 'b2',
    hallName: 'Salle Oran',
    date: '2026-07-20',
    startTime: '14:00',
    endTime: '22:00',
    status: 'en attente',
    userId: 'u1',
  },
  {
    id: 'b3',
    hallName: 'Salle Mariage',
    date: '2026-08-10',
    startTime: '19:00',
    endTime: '04:00',
    status: 'refusé',
    userId: 'u1',
    refusalReason: 'occupée',
  },
  {
    id: 'b4',
    hallName: 'Salle Alger',
    date: '2026-09-05',
    startTime: '09:00',
    endTime: '17:00',
    status: 'en attente de paiement',
    userId: 'u1',
    paymentReceiptName: 'reçu_virement.pdf',
  },
];
