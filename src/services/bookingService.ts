import { supabase } from '../lib/supabase';
import type { Booking } from '../data/bookings';

export const bookingService = {
  async getUserBookings(userId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return [];
    }

    return data.map(booking => ({
      id: booking.id,
      hallName: booking.hall_name,
      date: booking.date,
      startTime: booking.start_time,
      endTime: booking.end_time,
      status: booking.status,
      paymentStatus: booking.payment_status,
      userId: booking.user_id,
      userName: booking.user_name,
      paymentReceiptName: booking.payment_receipt_name,
      paymentReceiptData: booking.payment_receipt_url,
      refusalReason: booking.refusal_reason,
      adminSeen: booking.admin_seen,
    }));
  },

  async getAllBookings(): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all bookings:', error);
      return [];
    }

    return data.map(booking => ({
      id: booking.id,
      hallName: booking.hall_name,
      date: booking.date,
      startTime: booking.start_time,
      endTime: booking.end_time,
      status: booking.status,
      paymentStatus: booking.payment_status,
      userId: booking.user_id,
      userName: booking.user_name,
      paymentReceiptName: booking.payment_receipt_name,
      paymentReceiptData: booking.payment_receipt_url,
      refusalReason: booking.refusal_reason,
      adminSeen: booking.admin_seen,
    }));
  },

  async createBooking(booking: Omit<Booking, 'id'>) {
    const { data, error } = await supabase
      .from('bookings')
      .insert([{
        user_id: booking.userId,
        user_name: booking.userName,
        hall_name: booking.hallName,
        date: booking.date,
        start_time: booking.startTime,
        end_time: booking.endTime,
        status: booking.status,
        payment_status: booking.paymentStatus || 'non applicable',
        admin_seen: false,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBooking(id: string, updates: Partial<Booking>) {
    const dbUpdates: Record<string, string | boolean> = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.paymentStatus !== undefined) dbUpdates.payment_status = updates.paymentStatus;
    if (updates.adminSeen !== undefined) dbUpdates.admin_seen = updates.adminSeen;
    if (updates.refusalReason !== undefined) dbUpdates.refusal_reason = updates.refusalReason;
    if (updates.userName !== undefined) dbUpdates.user_name = updates.userName;

    const { data, error } = await supabase
      .from('bookings')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async uploadReceipt(bookingId: string, file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${bookingId}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('receipts')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('receipts')
      .getPublicUrl(fileName);

    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        payment_receipt_url: publicUrl,  
        payment_receipt_name: file.name,
        payment_status: 'payé',
        status: 'accepté',               
      })
      .eq('id', bookingId);

    if (updateError) throw updateError;

    return { publicUrl, fileName };
  },
};