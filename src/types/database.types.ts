export type Database = {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string;
          hall_name: string;
          date: string;
          start_time: string;
          end_time: string;
          status: 'en attente' | 'accepté' | 'refusé' | 'annulé';
          payment_status: string;
          user_id: string;
          user_name: string;
          payment_receipt_name: string | null;
          payment_receipt_data: string | null;
          refusal_reason: string | null;
          admin_seen: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          hall_name: string;
          date: string;
          start_time: string;
          end_time: string;
          status?: 'en attente' | 'accepté' | 'refusé' | 'annulé';
          payment_status?: string;
          user_id: string;
          user_name: string;
          payment_receipt_name?: string | null;
          payment_receipt_data?: string | null;
          refusal_reason?: string | null;
          admin_seen?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          hall_name?: string;
          date?: string;
          start_time?: string;
          end_time?: string;
          status?: 'en attente' | 'accepté' | 'refusé' | 'annulé';
          payment_status?: string;
          user_id?: string;
          user_name?: string;
          payment_receipt_name?: string | null;
          payment_receipt_data?: string | null;
          refusal_reason?: string | null;
          admin_seen?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      halls: {
        Row: {
          id: string;
          name: string;
          capacity: number;
          price: number;
          image_letter: string;
          image: string;
          description: string;
          location: string;
          rib: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          capacity: number;
          price: number;
          image_letter: string;
          image: string;
          description: string;
          location: string;
          rib: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          capacity?: number;
          price?: number;
          image_letter?: string;
          image?: string;
          description?: string;
          location?: string;
          rib?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          created_at?: string;
        };
      };
    };
  };
};