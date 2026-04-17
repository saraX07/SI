import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Calendar, LayoutDashboard } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Salles', path: '/salles', icon: <Calendar className="w-4 h-4" /> },
    { name: 'Mes réservations', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-slate-100 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-slate-900 tracking-tight">
        RéservaSalles
      </Link>

      <div className="flex items-center gap-6 md:gap-10">
        <div className="hidden sm:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-blue-600 ${
                isActive(link.path) ? 'text-blue-600 font-semibold' : 'text-slate-500'
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
        </div>
        
        <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-500 transition-colors">
          <LogOut className="w-4 h-4 transform rotate-180" />
          <span className="hidden xs:inline">Déconnexion</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
