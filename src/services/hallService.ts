import { supabase } from '../lib/supabase';
import type { Hall } from '../data/halls';

export const hallService = {
  async getAllHalls(): Promise<Hall[]> {
    const { data, error } = await supabase
      .from('halls')
      .select('*')
      .order('id');
    
    if (error) {
      console.error('Error fetching halls:', error);
      return [];
    }
    
    return data.map(hall => ({
      id: String(hall.id),
      name: hall.name,
      capacity: hall.capacity,
      price: hall.price,
      imageLetter: hall.image_letter,
      image: hall.image,
      description: hall.description,
      location: hall.location,
      rib: hall.rib,
    }));
  },

  async addHall(hall: Omit<Hall, 'id'>) {
    const { data, error } = await supabase
      .from('halls')
      .insert([{
        name: hall.name,
        capacity: hall.capacity,
        price: hall.price,
        image_letter: hall.imageLetter,
        image: hall.image,
        description: hall.description,
        location: hall.location,
        rib: hall.rib,
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateHall(id: number, updates: Partial<Hall>) {
    const { data, error } = await supabase
      .from('halls')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteHall(id: number) {
    const { error } = await supabase
      .from('halls')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};