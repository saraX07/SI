// ─── Booking status (reservation state) ────────────────────────────
export type BookingStatus =
  | 'en attente'
  | 'accepté'
  | 'refusé'
  | 'annulé';

// ─── Payment status (payment state, managed by admin) ───────────────
export type PaymentStatus =
  | 'payé'
  | 'en attente de paiement'
  | 'en attente de remboursement'
  | 'remboursé'
  | 'non applicable'
  | '';

export interface Booking {
  id: string;
  hallName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  paymentStatus?: PaymentStatus | string; // managed by admin
  userId: string;
  userName?: string;
  paymentReceiptName?: string;
  paymentReceiptData?: string; // base64 data URI
  refusalReason?: string;
  adminSeen?: boolean; // false = "pas traité par admin"
}

export const initialBookings: Booking[] = [
  {
    id: 'b1',
    hallName: 'Salle Alger',
    date: '2026-06-15',
    startTime: '18:00',
    endTime: '02:00',
    status: 'accepté',
    paymentStatus: 'payé',
    userId: 'u1',
    userName: 'Ahmed Benali',
    adminSeen: true,
  },
  {
    id: 'b2',
    hallName: 'Salle Oran',
    date: '2026-07-20',
    startTime: '14:00',
    endTime: '22:00',
    status: 'en attente',
    paymentStatus: 'non applicable',
    userId: 'u1',
    userName: 'Ahmed Benali',
    adminSeen: false,
  },
  {
    id: 'b3',
    hallName: 'Salle Mariage',
    date: '2026-08-10',
    startTime: '19:00',
    endTime: '04:00',
    status: 'refusé',
    paymentStatus: 'non applicable',
    userId: 'u1',
    userName: 'Ahmed Benali',
    refusalReason: 'occupée',
    adminSeen: true,
  },
  {
    id: 'b4',
    hallName: 'Salle Alger',
    date: '2026-09-05',
    startTime: '09:00',
    endTime: '17:00',
    status: 'accepté',
    paymentStatus: 'en attente de paiement',
    userId: 'u1',
    userName: 'Ahmed Benali',
    adminSeen: true,
  },
];

export const getBookings = (): Booking[] => {
  const local = localStorage.getItem('bookings');
  if (local) return JSON.parse(local);
  return initialBookings;
};

export const setBookings = (newBookings: Booking[]) => {
  localStorage.setItem('bookings', JSON.stringify(newBookings));
  window.dispatchEvent(new Event('bookingsChanged'));
};

// Legacy export kept for any remaining imports
export let bookings = getBookings();
