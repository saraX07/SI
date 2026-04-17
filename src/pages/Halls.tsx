import React from 'react';
import HallCard from '../components/HallCard';
import { halls } from '../data/halls';
import Navbar from '../components/Navbar';

const Halls: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />
      
      {/* Festive Header Section with Background Image */}
      <section className="relative bg-blue-900 text-white py-16 md:py-32 px-6 md:px-12 overflow-hidden">
        {/* Background Image of a Hall */}
        <img 
          src="/images/hall1.png" 
          alt="Hall background" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest mb-6">
            Votre fête commence ici
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-none text-white">
            Nos <span className="text-amber-400">Salles</span>
          </h1>
          <p className="text-lg md:text-2xl text-blue-50 font-medium max-w-2xl leading-relaxed">
            Trouvez l'endroit idéal pour célébrer vos événements les plus précieux.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {halls.map((hall) => (
            <HallCard key={hall.id} hall={hall} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Halls;
