import React from 'react';
import { MapPin, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Hall } from '../data/halls';

interface HallCardProps {
  hall: Hall;
}

const HallCard: React.FC<HallCardProps> = ({ hall }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
      {/* Real Image of the Hall */}
      <div className="h-48 overflow-hidden relative group">
        <img 
          src={hall.image} 
          alt={hall.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-900 mb-2">{hall.name}</h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow">
          {hall.description}
        </p>
        
        <div className="space-y-2 mb-6 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span>{hall.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            <span>Capacité : {hall.capacity} personnes</span>
          </div>
        </div>
        
        <div className="flex justify-between items-end mt-auto pt-4 border-t border-slate-50">
          <div>
            <p className="text-xs text-slate-400 font-medium">À partir de</p>
            <p className="text-xl font-bold text-amber-600">{hall.price.toLocaleString()} DA</p>
          </div>
          
          <Link
            to={`/reservation?hall=${hall.id}`}
            className="btn-blue py-2 px-6 text-sm font-bold shadow-sm"
          >
            Réserver
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HallCard;
