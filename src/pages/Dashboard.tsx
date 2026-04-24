import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { getBookings, setBookings } from '../data/bookings';
import type { Booking } from '../data/bookings';
import { getHalls } from '../data/halls';

import { Calendar, Clock, AlertCircle, Download, CheckCircle2, XCircle, X, ChevronRight, Upload } from 'lucide-react';

const generateAlternativeSlots = (dateStr: string) => {
  const baseDate = new Date(dateStr);
  const slots = [];
  
  // Same day alternative
  slots.push({
    date: new Date(baseDate),
    startTime: '08:00',
    endTime: '14:00',
    label: 'Matinée',
  });
  
  // Next day alternative
  const nextDay = new Date(baseDate);
  nextDay.setDate(nextDay.getDate() + 1);
  slots.push({
    date: nextDay,
    startTime: '18:00',
    endTime: '02:00',
    label: 'Même horaire (Lendemain)',
  });
  
  // Day after next alternative
  const dayAfter = new Date(baseDate);
  dayAfter.setDate(dayAfter.getDate() + 2);
  slots.push({
    date: dayAfter,
    startTime: '14:00',
    endTime: '22:00',
    label: 'Après-midi (+2 jours)',
  });

  return slots;
};

const Dashboard: React.FC = () => {
  const [localBookings, setLocalBookings] = useState<Booking[]>([]);
  const [halls, setLocalHalls] = useState(getHalls());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);

  /* Live sync with admin changes */
  const refresh = useCallback(() => {
    setLocalBookings(getBookings());
    setLocalHalls(getHalls());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener('bookingsChanged', refresh);
    window.addEventListener('hallsChanged', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('bookingsChanged', refresh);
      window.removeEventListener('hallsChanged', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [refresh]);

  /* Keep modal in sync when bookings change externally (e.g. admin action) */
  useEffect(() => {
    if (selectedBooking) {
      const updated = localBookings.find((b) => b.id === selectedBooking.id);
      if (updated) setSelectedBooking(updated);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localBookings]);

  useEffect(() => {
    if (selectedBooking && modalContentRef.current) {
      setTimeout(() => {
        modalContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 50);
    }
  }, [selectedBooking]);

  const handleCancel = (id: string) => {
    if (window.confirm("Êtes-vous sûr d'annuler cette réservation ?")) {
      const all = getBookings();
      const updated = all.map((b) => {
        if (b.id !== id) return b;
        let newPaymentStatus: string = b.paymentStatus ?? '';
        if (b.paymentStatus === 'payé') newPaymentStatus = 'en attente de remboursement';
        else if (b.paymentStatus === 'en attente de paiement') newPaymentStatus = 'non applicable';
        return { ...b, status: 'annulé' as const, paymentStatus: newPaymentStatus };
      });
      setBookings(updated);
    }
  };

  const handleReceiptUpload = (booking: Booking, file: File) => {
    setUploadingId(booking.id);
    setUploadSuccess(false);
    const reader = new FileReader();
    reader.onload = () => {
      const all = getBookings();
      const updated = all.map((b) =>
        b.id === booking.id
          ? {
              ...b,
              paymentReceiptName: file.name,
              paymentReceiptData: reader.result as string,
              status: 'payée' as const,
              paymentStatus: 'payé',
            }
          : b,
      );
      setBookings(updated);
      setUploadingId(null);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    };
    reader.readAsDataURL(file);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'accepté': return 'bg-green-50 text-green-700 border-green-200';
      case 'refusé': return 'bg-red-50 text-red-700 border-red-200';
      case 'annulé': return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'payée': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  const getPaymentStatusStyle = (status: string) => {
    switch (status) {
      case 'payé': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'en attente de remboursement': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'remboursé': return 'bg-slate-50 text-slate-700 border-slate-300';
      case 'en attente de paiement': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepté':
      case 'payée': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'refusé': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'annulé': return <XCircle className="w-5 h-5 text-slate-600" />;
      default: return <Clock className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <header className="mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Mes Réservations
          </h1>
          <p className="text-slate-500 font-medium">
            Suivez l'état de vos demandes et gérez vos événements.
          </p>
        </header>

        {uploadSuccess && (
          <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium text-sm px-5 py-3 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            Reçu envoyé avec succès. Statut mis à jour en <strong>payée</strong>.
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-5">Salle</th>
                  <th className="px-8 py-5">Date & Heures</th>
                  <th className="px-8 py-5">Statuts</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {localBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-lg">
                          {booking.hallName.charAt(0)}
                        </div>
                        <p className="font-bold text-slate-900">{booking.hallName}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {new Date(booking.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Clock className="w-4 h-4" />
                          {booking.startTime} - {booking.endTime}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2 items-start">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${getStatusStyle(booking.status)}`}>
                          RÉSA: {booking.status}
                        </span>
                        {booking.paymentStatus !== 'non applicable' && (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${getPaymentStatusStyle(booking.paymentStatus)}`}>
                            PAIE: {booking.paymentStatus}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {booking.status !== 'annulé' && booking.status !== 'refusé' && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-sm rounded-lg transition-colors shadow-sm border border-red-100"
                          >
                            Annuler
                          </button>
                        )}
                        {booking.paymentReceiptData ? (
                          <a
                            href={booking.paymentReceiptData}
                            download={booking.paymentReceiptName || 'recu'}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 font-medium text-sm transition-all"
                            title="Télécharger le reçu"
                          >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Reçu</span>
                          </a>
                        ) : (
                          <button
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 font-medium text-sm transition-all"
                            title="Télécharger le reçu"
                          >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Reçu</span>
                          </button>
                        )}
                        <button 
                          onClick={() => setSelectedBooking(booking)}
                          className="text-blue-600 font-bold text-sm hover:underline"
                        >
                          Détails
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {localBookings.length === 0 && (
            <div className="py-20 text-center">
              <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">Vous n'avez aucune réservation pour le moment.</p>
            </div>
          )}
        </div>
      </main>

      {/* Détails Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                Détails de la réservation
              </h3>
              <button 
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="mb-6 flex items-start gap-4">
                <div className={`p-3 rounded-full ${getStatusStyle(selectedBooking.status).replace('border', '')}`}>
                  {getStatusIcon(selectedBooking.status)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{selectedBooking.hallName}</h4>
                  <p className="text-slate-500 text-sm">
                    {new Date(selectedBooking.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-slate-500 text-sm">
                    De {selectedBooking.startTime} à {selectedBooking.endTime}
                  </p>
                </div>
              </div>

              {selectedBooking.status === 'refusé' && (
                <div className="space-y-6">
                  <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-100 text-sm font-medium">
                    {selectedBooking.refusalReason === 'occupée' 
                      ? 'Désolé, cette salle est déjà réservée pour ce créneau.' 
                      : 'Cette demande a été refusée par l\'administrateur.'}
                  </div>
                  
                  {selectedBooking.refusalReason === 'occupée' && (
                    <div>
                      <h5 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        Créneaux libres suggérés
                      </h5>
                      <div className="space-y-2">
                        {generateAlternativeSlots(selectedBooking.date).map((slot, idx) => (
                          <button key={idx} className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                            <div className="text-left">
                              <p className="text-sm font-bold text-slate-900 group-hover:text-blue-900">
                                {slot.label}
                              </p>
                              <p className="text-xs text-slate-500 group-hover:text-blue-700">
                                {slot.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} • {slot.startTime} - {slot.endTime}
                              </p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {selectedBooking.paymentStatus === 'en attente de paiement' && selectedBooking.status !== 'annulé' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h5 className="text-sm font-bold text-blue-900 mb-2">Paiement requis</h5>
                    <p className="text-sm text-blue-800/80 mb-4 leading-relaxed">
                      Votre réservation est pré-approuvée. Veuillez effectuer le paiement pour confirmer.<br />
                      <span className="font-bold text-red-600">Important :</span> Il faut payer avant 48 heures sinon votre réservation sera annulée.
                    </p>
                    
                    <div className="bg-white p-3 rounded-lg border border-blue-200/60 mb-4">
                      <p className="text-xs text-slate-500 font-medium mb-1">RIB de la salle :</p>
                      <p className="font-mono text-sm text-slate-900 font-bold">
                        {halls.find(h => h.name === selectedBooking.hallName)?.rib || 'Non spécifié'}
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      <label className="text-sm font-bold text-blue-900">Envoyer le reçu de paiement</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Upload className="w-4 h-4 text-blue-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          disabled={!!uploadingId}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleReceiptUpload(selectedBooking, file);
                          }}
                          className="block w-full text-sm text-slate-500
                            file:mr-4 file:py-2.5 file:px-4
                            file:rounded-lg file:border-0
                            file:text-sm file:font-bold
                            file:bg-blue-600 file:text-white
                            hover:file:bg-blue-700
                            bg-white border border-blue-200 rounded-lg
                            pl-10 py-2.5 cursor-pointer file:cursor-pointer transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <p className="text-xs text-blue-600/80 font-medium">Format accepté : PDF ou Image. La taille max est de 5Mo.</p>
                      {uploadingId === selectedBooking.id && (
                        <p className="text-sm text-blue-600 font-medium animate-pulse">Envoi en cours…</p>
                      )}
                      <button className="mt-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4 text-white" />
                        Envoyer le reçu
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Paid (payée) ── */}
              {selectedBooking.status === 'payée' && (
                <div className="space-y-3">
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-sm font-medium text-emerald-800">
                    Votre paiement a été reçu.
                    {selectedBooking.paymentStatus && (
                      <span> Statut admin : <strong>{selectedBooking.paymentStatus}</strong></span>
                    )}
                  </div>
                  {selectedBooking.paymentReceiptData && (
                    <a
                      href={selectedBooking.paymentReceiptData}
                      download={selectedBooking.paymentReceiptName || 'recu'}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 rounded-xl text-sm font-bold text-slate-700 hover:text-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger mon reçu
                    </a>
                  )}
                </div>
              )}

              {selectedBooking.paymentStatus === 'en attente de remboursement' && (
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 shadow-sm">
                  <h5 className="text-sm font-bold text-orange-900 mb-2">Remboursement en cours</h5>
                  <p className="text-sm text-orange-800 mb-3 leading-relaxed">
                    Votre demande d'annulation est acceptée. Le montant payé est de <strong>{halls.find(h => h.name === selectedBooking.hallName)?.price?.toLocaleString()} DA</strong> et le remboursement est en cours de traitement. Vous serez remboursé(e) à <strong>80%</strong>.
                  </p>
                  <div className="text-sm text-orange-800 font-medium bg-orange-100/50 p-3 rounded-lg flex items-center gap-2">
                    Pour plus de questions, vous pouvez nous contacter via ce numéro de téléphone : <strong className="text-orange-900 text-base tracking-wide font-mono">07 77 12 34 56</strong>
                  </div>
                </div>
              )}

              {/* ── Pending / accepted (no special payment condition) ── */}
              {(selectedBooking.status === 'en attente' || selectedBooking.status === 'accepté') && selectedBooking.paymentStatus !== 'en attente de remboursement' && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    {selectedBooking.status === 'accepté' 
                      ? 'Votre réservation est confirmée. Vous pouvez télécharger votre reçu.'
                      : 'Votre demande est en cours d\'examen par l\'administration.'}
                  </p>
                </div>
              )}

              {/* ── Cancelled ── */}
              {selectedBooking.status === 'annulé' &&
                selectedBooking.paymentStatus !== 'en attente de remboursement' && (
                <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    Cette réservation a été annulée.
                  </p>
                </div>
              )}

              <div ref={modalContentRef} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
