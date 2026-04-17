import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowRight, CheckCircle2, Star, ShieldCheck } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Festive Hero Section with Background Image */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center overflow-hidden py-24 px-6 md:px-12">
        {/* Background Image */}
        <img
          src="/images/hero-bg.png"
          alt="Luxury Hall"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Darker Overlay for better contrast */}
        <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-[1px]"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-400 text-xs font-bold uppercase tracking-wider mb-8 border border-white/20">
            <Star className="w-3 h-3 fill-current" />
            La plateforme n°1 pour vos cérémonies
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tight text-white drop-shadow-lg">
            Célébrez vos moments <br />
            <span className="text-amber-400">inoubliables</span> en plus grand
          </h1>

          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
            Trouvez et réservez la salle parfaite pour votre fête. Luxe, confort et service d'exception avec RéservaSalles.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/salles" className="btn-gold py-4 px-10 text-lg font-bold w-full sm:w-auto">
              Explorer les salles
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/auth" className="border-2 border-white/30 text-white font-bold px-10 py-4 rounded-lg hover:bg-white/10 transition-all">
              Créer un compte
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-slate-50/50 py-24 px-6 md:px-12 border-y border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
              title: "Salles Vérifiées",
              desc: "Chaque établissement sur notre plateforme fait l'objet d'une visite rigoureuse."
            },
            {
              icon: <CheckCircle2 className="w-8 h-8 text-blue-600" />,
              title: "Réservation Instantanée",
              desc: "Consultez les disponibilités réelles et réservez en quelques clics."
            },
            {
              icon: <Star className="w-8 h-8 text-blue-600" />,
              title: "Support 24/7",
              desc: "Notre équipe est là pour vous accompagner à chaque étape du processus."
            }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-start gap-4 p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-3 bg-blue-50 rounded-xl">{item.icon}</div>
              <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
