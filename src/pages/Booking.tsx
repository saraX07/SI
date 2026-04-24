import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { halls } from '../data/halls';
import { getBookings, setBookings } from '../data/bookings';
import { Calendar, Clock, MapPin, CheckCircle2, ArrowLeft } from 'lucide-react';

const Booking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const hallId = searchParams.get('hall');
  const hall = halls.find(h => h.id === hallId) || halls[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newBooking = {
      id: `b${Date.now()}`,
      hallName: hall.name,
      date,
      startTime,
      endTime,
      status: 'en attente de paiement' as const,
      userId: localStorage.getItem('userEmail') || 'user_demo',
    };

    const currentBookings = getBookings();
    setBookings([newBooking, ...currentBookings]);

    setIsSubmitted(true);
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6 text-center">
        <div className="max-w-md w-full animate-in zoom-in duration-300">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2 tracking-tight">Demande envoyée !</h2>
          <p className="text-slate-500 mb-8 font-medium">Votre réservation est en attente de confirmation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 md:px-12 py-16">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold text-sm mb-12 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Form */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-8 tracking-tight">Réserver {hall.name}</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Date souhaitée</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="date" 
                    required 
                    className="input-field pl-10" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Début</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="time" 
                      required 
                      className="input-field pl-10" 
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Fin</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="time" 
                      required 
                      className="input-field pl-10" 
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>



              <div className="pt-4">
                <button type="submit" className="btn-blue w-full py-4 font-bold shadow-lg shadow-blue-100">
                  Confirmer la demande
                </button>
              </div>
            </form>
          </div>

          {/* Hall Meta */}
          <div className="space-y-8 pt-4">
            <div className="p-8 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-200">
              <h3 className="text-xl font-bold mb-4">Détails de la salle</h3>
              <p className="text-white/80 mb-6 leading-relaxed font-medium">
                {hall.description}
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-white/50" />
                  <span className="font-bold">{hall.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold">{hall.price.toLocaleString()} DA</div>
                  <span className="text-white/50 text-sm">/ jour</span>
                </div>
              </div>
            </div>

            <p className="text-slate-400 text-xs text-center px-4 font-medium leading-relaxed">
              Une fois votre demande soumise, un administrateur examinera votre dossier et vous contactera dans les plus brefs délais.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Booking;
