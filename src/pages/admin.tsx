import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getBookings, setBookings } from '../data/bookings';
import type { Booking } from '../data/bookings';
import { getHalls, setHalls } from '../data/halls';
import type { Hall } from '../data/halls';
import {
  LogOut, Calendar, Clock, CheckCircle2, XCircle, CreditCard,
  Download, Eye, X, Plus, AlertCircle, LayoutDashboard,
} from 'lucide-react';

const ADMIN_EMAIL = 'admin@reservasalles.dz';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setLocalBookings] = useState<Booking[]>([]);
  const [halls, setLocalHalls] = useState<Hall[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showAddHall, setShowAddHall] = useState(false);
  const [receiptViewUrl, setReceiptViewUrl] = useState<string | null>(null);
  const [editPayStatus, setEditPayStatus] = useState('');
  const [newHall, setNewHall] = useState({
    name: '', capacity: '', price: '', location: '', description: '', rib: '',
  });

  // Guard: only admin can access
  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (!email || email.toLowerCase() !== ADMIN_EMAIL) {
      navigate('/auth');
    }
  }, [navigate]);

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

  // Keep modal in sync
  useEffect(() => {
    if (selectedBooking) {
      const updated = bookings.find((b) => b.id === selectedBooking.id);
      if (updated) {
        setSelectedBooking(updated);
        setEditPayStatus(updated.paymentStatus || '');
      }
    }
  }, [bookings]);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/auth');
  };

  const updateBooking = (id: string, changes: Partial<Booking>) => {
    const all = getBookings();
    const updated = all.map((b) => (b.id === id ? { ...b, ...changes } : b));
    setBookings(updated);
  };

  const handleConfirm = (booking: Booking) => {
    // Confirm booking; if not yet awaiting payment, set payment to awaiting
    const newPayStatus =
      booking.paymentStatus && booking.paymentStatus !== 'non applicable' && booking.paymentStatus !== ''
        ? booking.paymentStatus
        : 'en attente de paiement';
    updateBooking(booking.id, { status: 'accepté', adminSeen: true, paymentStatus: newPayStatus });
  };

  const handleRefuse = (booking: Booking) => {
    updateBooking(booking.id, { status: 'refusé', adminSeen: true, refusalReason: 'admin', paymentStatus: 'non applicable' });
  };

  const handleSavePayStatus = () => {
    if (!selectedBooking) return;
    updateBooking(selectedBooking.id, { paymentStatus: editPayStatus });
  };

  const handleAddHall = (e: React.FormEvent) => {
    e.preventDefault();
    const all = getHalls();
    const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M'];
    const hall: Hall = {
      id: String(Date.now()),
      name: newHall.name,
      capacity: parseInt(newHall.capacity) || 0,
      price: parseInt(newHall.price) || 0,
      imageLetter: newHall.name.charAt(0).toUpperCase() || letters[all.length % letters.length],
      image: '/images/hall1.png',
      description: newHall.description,
      location: newHall.location,
      rib: newHall.rib,
    };
    setHalls([...all, hall]);
    setNewHall({ name: '', capacity: '', price: '', location: '', description: '', rib: '' });
    setShowAddHall(false);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'accepté':  return 'bg-green-50 text-green-700 border-green-200';
      case 'refusé':   return 'bg-red-50 text-red-700 border-red-200';
      case 'annulé':   return 'bg-slate-100 text-slate-700 border-slate-300';
      default:         return 'bg-amber-50 text-amber-700 border-amber-200'; // en attente
    }
  };

  const getPaymentStatusStyle = (status: string) => {
    switch (status) {
      case 'payé':                         return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'en attente de paiement':       return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'en attente de remboursement':  return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'remboursé':                    return 'bg-slate-50 text-slate-700 border-slate-300';
      default:                             return 'bg-gray-50 text-gray-500 border-gray-200';
    }
  };

  const pendingCount = bookings.filter((b) => !b.adminSeen && b.status === 'en attente').length;
  const awaitingPaymentCount = bookings.filter((b) => b.paymentStatus === 'en attente de paiement').length;

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Admin Navbar */}
      <nav className="bg-white border-b border-slate-100 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="text-xl font-bold text-slate-900 tracking-tight">
          RéservaSalles <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full ml-1">Admin</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/salles" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Voir les salles</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4 rotate-180" />
            <span className="hidden xs:inline">Déconnexion</span>
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Tableau de bord Admin
          </h1>
          <p className="text-slate-500 font-medium">
            Gérez les demandes de réservation et les salles.
          </p>
        </header>

        {/* Pending badge */}
        {pendingCount > 0 && (
          <div className="mb-4 flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 font-medium text-sm px-5 py-3 rounded-xl">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            {pendingCount} demande{pendingCount > 1 ? 's' : ''} non traitée{pendingCount > 1 ? 's' : ''} en attente.
          </div>
        )}
        {awaitingPaymentCount > 0 && (
          <div className="mb-6 flex items-center gap-3 bg-blue-50 border border-blue-200 text-blue-800 font-medium text-sm px-5 py-3 rounded-xl">
            <CreditCard className="w-5 h-5 text-blue-500 shrink-0" />
            {awaitingPaymentCount} réservation{awaitingPaymentCount > 1 ? 's' : ''} en attente de paiement.
          </div>
        )}

        {/* Bookings Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-5">Client</th>
                  <th className="px-8 py-5">Salle</th>
                  <th className="px-8 py-5">Date &amp; Heures</th>
                  <th className="px-8 py-5">Statut</th>
                  <th className="px-8 py-5">Reçu</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => {
                  const unseen = !booking.adminSeen && booking.status === 'en attente';
                  return (
                    <tr key={booking.id} className={`hover:bg-slate-50/30 transition-colors ${unseen ? 'bg-amber-50/30' : ''}`}>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                            {(booking.userName || booking.userId).charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-700 text-sm">{booking.userName || booking.userId}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                            {booking.hallName.charAt(0)}
                          </div>
                          <p className="font-bold text-slate-900 text-sm">{booking.hallName}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {new Date(booking.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Clock className="w-4 h-4" />
                            {booking.startTime} - {booking.endTime}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${getStatusStyle(booking.status)}`}>
                            RÉSA : {booking.status}
                          </span>
                          {booking.paymentStatus && booking.paymentStatus !== 'non applicable' && booking.paymentStatus !== '' && (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${getPaymentStatusStyle(booking.paymentStatus)}`}>
                              PAIE : {booking.paymentStatus}
                            </span>
                          )}
                          {unseen && (
                            <p className="text-xs text-amber-600 font-semibold">non traité par admin</p>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {booking.paymentReceiptData ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setReceiptViewUrl(booking.paymentReceiptData!)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 font-medium text-xs transition-all"
                              title="Voir le reçu"
                            >
                              <Eye className="w-3.5 h-3.5" /> Voir
                            </button>
                            <a
                              href={booking.paymentReceiptData}
                              download={booking.paymentReceiptName || 'recu'}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 font-medium text-xs transition-all"
                            >
                              <Download className="w-3.5 h-3.5" /> DL
                            </a>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-300 font-medium">—</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-2">
                          {booking.status !== 'accepté' && booking.status !== 'annulé' && (
                            <button
                              onClick={() => handleConfirm(booking)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 font-bold text-xs transition-all"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Confirmer
                            </button>
                          )}
                          {booking.status !== 'refusé' && booking.status !== 'annulé' && (
                            <button
                              onClick={() => handleRefuse(booking)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-bold text-xs transition-all"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Refuser
                            </button>
                          )}
                          <button
                            onClick={() => { setSelectedBooking(booking); setEditPayStatus(booking.paymentStatus || ''); }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 font-bold text-xs transition-all border border-slate-200"
                          >
                            Détails
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {bookings.length === 0 && (
            <div className="py-20 text-center">
              <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">Aucune réservation pour le moment.</p>
            </div>
          )}
        </div>

        {/* Add Hall Button — below table */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowAddHall(true)}
            className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm shadow-blue-100 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Ajouter une salle
          </button>
        </div>
      </main>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-900">Détails de la réservation</h3>
              <button onClick={() => setSelectedBooking(null)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${getStatusStyle(selectedBooking.status)}`}>
                  {selectedBooking.status === 'accepté' || selectedBooking.status === 'payée'
                    ? <CheckCircle2 className="w-5 h-5" />
                    : selectedBooking.status === 'refusé'
                    ? <XCircle className="w-5 h-5" />
                    : <CreditCard className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{selectedBooking.hallName}</h4>
                  <p className="text-slate-500 text-sm">
                    {new Date(selectedBooking.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-slate-500 text-sm">De {selectedBooking.startTime} à {selectedBooking.endTime}</p>
                  <p className="text-slate-500 text-sm mt-1">Client : <strong>{selectedBooking.userName || selectedBooking.userId}</strong></p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className={`px-4 py-3 rounded-xl border text-sm font-medium ${getStatusStyle(selectedBooking.status)}`}>
                  Réservation : <strong>{selectedBooking.status}</strong>
                </div>
                {selectedBooking.paymentStatus && selectedBooking.paymentStatus !== 'non applicable' && selectedBooking.paymentStatus !== '' && (
                  <div className={`px-4 py-3 rounded-xl border text-sm font-medium ${getPaymentStatusStyle(selectedBooking.paymentStatus)}`}>
                    Paiement : <strong>{selectedBooking.paymentStatus}</strong>
                  </div>
                )}
              </div>

              {/* Action buttons – available unless cancelled */}
              {selectedBooking.status !== 'annulé' && (
                <div className="flex gap-3">
                  {selectedBooking.status !== 'accepté' && (
                    <button
                      onClick={() => handleConfirm(selectedBooking)}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 font-bold text-sm transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Confirmer
                    </button>
                  )}
                  {selectedBooking.status !== 'refusé' && (
                    <button
                      onClick={() => handleRefuse(selectedBooking)}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 font-bold text-sm transition-all"
                    >
                      <XCircle className="w-4 h-4" /> Refuser
                    </button>
                  )}
                </div>
              )}

              {/* Payment receipt section */}
              {(selectedBooking.paymentStatus === 'payé' || selectedBooking.paymentReceiptData) && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-3">
                  <p className="text-sm font-bold text-emerald-800">Paiement reçu</p>
                  {selectedBooking.paymentReceiptData && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setReceiptViewUrl(selectedBooking.paymentReceiptData!)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-emerald-200 rounded-lg text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" /> Voir le reçu
                      </button>
                      <a
                        href={selectedBooking.paymentReceiptData}
                        download={selectedBooking.paymentReceiptName || 'recu'}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-emerald-200 rounded-lg text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
                      >
                        <Download className="w-4 h-4" /> Télécharger
                      </a>
                    </div>
                  )}
                  {/* Editable payment status */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-emerald-900">Statut paiement (modifiable)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editPayStatus}
                        onChange={(e) => setEditPayStatus(e.target.value)}
                        placeholder="ex: vérifié, en attente vérif..."
                        className="flex-1 px-3 py-2 border border-emerald-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                      <button
                        onClick={handleSavePayStatus}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-sm transition-colors"
                      >
                        Sauvegarder
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Receipt Viewer Modal */}
      {receiptViewUrl && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Aperçu du reçu</h3>
              <button onClick={() => setReceiptViewUrl(null)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              {receiptViewUrl.startsWith('data:image') ? (
                <img src={receiptViewUrl} alt="Reçu" className="w-full rounded-lg max-h-[60vh] object-contain" />
              ) : (
                <iframe src={receiptViewUrl} title="Reçu PDF" className="w-full h-[60vh] rounded-lg border border-slate-100" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Hall Modal */}
      {showAddHall && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" /> Ajouter une salle
              </h3>
              <button onClick={() => setShowAddHall(false)} className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddHall} className="p-6 space-y-4">
              {[
                { label: 'Nom de la salle', key: 'name', placeholder: 'Salle Constantine', required: true },
                { label: 'Capacité (personnes)', key: 'capacity', placeholder: '200', required: true },
                { label: 'Prix (DA)', key: 'price', placeholder: '30000', required: true },
                { label: 'Localisation', key: 'location', placeholder: 'Centre-ville, Constantine', required: true },
                { label: 'Description', key: 'description', placeholder: 'Description de la salle...', required: false },
                { label: 'RIB', key: 'rib', placeholder: '001 00123 ...', required: false },
              ].map(({ label, key, placeholder, required }) => (
                <div key={key} className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">{label}</label>
                  <input
                    type="text"
                    placeholder={placeholder}
                    required={required}
                    value={newHall[key as keyof typeof newHall]}
                    onChange={(e) => setNewHall((prev) => ({ ...prev, [key]: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              ))}
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2 mt-2"
              >
                <Plus className="w-4 h-4" /> Ajouter la salle
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
