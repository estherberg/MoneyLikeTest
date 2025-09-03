import { useEffect } from 'react';

export default function LogoutPage() {
  useEffect(() => {
    
    fetch('/api/logout', { method: 'POST' }).catch(() => {});

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();


    window.location.replace('/login');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <p className="text-lg">🚪 Déconnexion…</p>
    </div>
  );
}
