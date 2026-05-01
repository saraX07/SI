import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { bookingService } from '../services/bookingService';
import { hallService } from '../services/hallService';
import type { Booking } from '../data/bookings';
import type { Hall } from '../data/halls';



interface SupabaseContextType {
  bookings: Booking[];
  halls: Hall[];
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const useSupabase = () => {
  const context = useContext(SupabaseContext)
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider')
  }
  return context
}

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [halls, setHalls] = useState<Hall[]>([]);

  useEffect(() => {
    // Initial load
    const loadData = async () => {
      const allBookings = await bookingService.getAllBookings();
      const allHalls = await hallService.getAllHalls();
      setBookings(allBookings);
      setHalls(allHalls);
    };
    loadData();

    // Subscribe to real-time changes
    const bookingsSubscription = supabase
      .channel('bookings_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' },
        async () => {
          const updatedBookings = await bookingService.getAllBookings();
          setBookings(updatedBookings);
          window.dispatchEvent(new Event('bookingsChanged'));
        }
      )
      .subscribe();

    const hallsSubscription = supabase
      .channel('halls_changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'halls' },
        async () => {
          const updatedHalls = await hallService.getAllHalls();
          setHalls(updatedHalls);
          window.dispatchEvent(new Event('hallsChanged'));
        }
      )
      .subscribe();

    return () => {
      bookingsSubscription.unsubscribe();
      hallsSubscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider value={{ bookings, halls }}>
      {children}
    </SupabaseContext.Provider>
  );
};