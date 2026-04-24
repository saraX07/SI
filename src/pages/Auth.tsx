import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login
    navigate('/salles');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side: Blue Branding with Background Image */}
      <div className="md:w-1/2 relative flex flex-col items-center justify-center p-12 text-white overflow-hidden">
        {/* Background Image */}
        <img 
          src="/images/auth-bg.png" 
          alt="Festive Hall" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Blue Overlay */}
        <div className="absolute inset-0 bg-blue-600/80 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 max-w-md w-full">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            RéservaSalles
          </h1>
          <p className="text-xl md:text-2xl text-white/80 font-medium leading-relaxed">
            Réservez vos salles d'événements en toute simplicité
          </p>
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="md:w-1/2 bg-white flex items-center justify-center p-8 md:p-12 lg:p-24">
        <div className="max-w-md w-full">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
              {isLogin ? 'Connexion' : 'Inscription'}
            </h2>
            <p className="text-slate-500 font-medium">
              {isLogin ? 'Accédez à votre espace de réservation' : 'Créez votre compte pour commencer'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Nom Complet</label>
                <input 
                  type="text" 
                  placeholder="Votre nom" 
                  className="input-field"
                  required
                />
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Email</label>
              <input 
                type="email" 
                placeholder="exemple@email.com" 
                className="input-field"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Mot de passe</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="input-field pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-blue w-full py-3 text-lg font-bold shadow-lg shadow-blue-100 mt-8">
              {isLogin ? 'Se connecter' : 'S\'inscrire'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-bold text-blue-600 hover:text-blue-700"
            >
              {isLogin ? 'Pas encore de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
