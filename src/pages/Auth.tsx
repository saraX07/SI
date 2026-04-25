import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ADMIN_EMAIL = 'admin@reservasalles.dz';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userEmail', email);
    if (email.trim().toLowerCase() === ADMIN_EMAIL) {
      navigate('/admin');
    } else {
      navigate('/salles');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      
      <style>{`
        input::-ms-reveal,
        input::-ms-clear {
          display: none !important;
        }
        input::-webkit-credentials-auto-fill-button {
          visibility: hidden !important;
          display: none !important;
        }
      `}</style>

      {/* Left side */}
      <div className="md:w-1/2 relative flex flex-col items-center justify-center p-12 text-white overflow-hidden">
        <img src="/images/auth-bg.png" alt="Festive Hall" className="absolute inset-0 w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-blue-600/80 backdrop-blur-[2px]"></div>
        <div className="relative z-10 max-w-md w-full">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">RéservaSalles</h1>
          <p className="text-xl md:text-2xl text-white/80 font-medium leading-relaxed">Réservez vos salles d'événements en toute simplicité</p>
        </div>
      </div>

      {/* Right side */}
      <div className="md:w-1/2 bg-white flex items-center justify-center p-8 md:p-12 lg:p-24">
        <div className="max-w-md w-full">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{isLogin ? 'Connexion' : 'Inscription'}</h2>
            <p className="text-slate-500 font-medium">{isLogin ? 'Accédez à votre espace de réservation' : 'Créez votre compte pour commencer'}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700">Nom Complet</label>
                <input type="text" placeholder="Votre nom" className="input-field w-full" required />
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Email</label>
              <input type="email" placeholder="exemple@email.com" className="input-field w-full" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700">Mot de passe</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="input-field w-full" 
                  style={{ paddingRight: '2.5rem' }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0
                  }}
                  className="text-slate-400 hover:text-blue-600 focus:outline-none"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 013.12-4.526M9.878 9.878a3 3 0 104.243 4.243M17.657 17.657L6.343 6.343M12 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.397 2.458" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-blue w-full py-3 text-lg font-bold shadow-lg shadow-blue-100 mt-8">
              {isLogin ? 'Se connecter' : "S'inscrire"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-bold text-blue-600 hover:text-blue-700">
              {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;