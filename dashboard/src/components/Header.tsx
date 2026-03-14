import { useState, useEffect } from 'react'
import { GoogleLogin } from '@react-oauth/google'

export default function Header() {
  const [walletConnected, setWalletConnected] = useState(false)
  const [googleUser, setGoogleUser] = useState<{ email: string, name?: string } | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [authError, setAuthError] = useState('')

  // Check existing session
  useEffect(() => {
     const token = localStorage.getItem('eggo_session_token');
     const email = localStorage.getItem('eggo_user_email');
     if (token && email) {
        setGoogleUser({ email });
     }
  }, []);

  const handleGoogleSuccess = async (credentialResponse: any) => {
      setAuthError('')
      try {
          const res = await fetch('/api/auth/google', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ credential: credentialResponse.credential })
          })
          const data = await res.json()
          
          if (res.ok) {
              setGoogleUser(data.user)
              localStorage.setItem('eggo_session_token', data.token)
              localStorage.setItem('eggo_user_email', data.user.email)
              setShowModal(false)
              window.dispatchEvent(new Event('auth_changed'));
          } else {
              setAuthError(data.error || 'Autenticación fallida')
          }
      } catch (err) {
          setAuthError('Error conectando con el servidor')
      }
  }

  const handleLogout = () => {
      setWalletConnected(false)
      setGoogleUser(null)
      localStorage.removeItem('eggo_session_token')
      localStorage.removeItem('eggo_user_email')
      window.dispatchEvent(new Event('auth_changed'));
  }

  return (
    <>
    <header className="bg-white border-b border-green-100 shadow-sm relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-eggo-green flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-6 h-6 text-white" fill="currentColor">
              <ellipse cx="16" cy="18" rx="10" ry="13" />
              <circle cx="13" cy="15" r="1.5" fill="white" />
              <circle cx="19" cy="15" r="1.5" fill="white" />
              <path d="M12 20 Q16 23 20 20" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Eggo<span className="text-eggo-green">Logic</span>
            </h1>
            <p className="text-xs text-gray-500">Portal Proveedores</p>
          </div>
        </div>

        <div>
            {googleUser ? (
                 <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-600 font-medium">{googleUser.email}</span>
                    <button onClick={handleLogout} className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 cursor-pointer">Log Out</button>
                 </div>
            ) : walletConnected ? (
                <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer bg-eggo-green/10 text-eggo-green-dark border border-eggo-green/30"
                >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="6" width="20" height="12" rx="3" />
                    <path d="M6 10h4M14 10h4M6 14h12" />
                </svg>
                0x7a3f...c821
                </button>
            ) : (
                <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer bg-eggo-green text-white hover:bg-eggo-green-dark shadow-md shadow-green-200"
                >
                Log In
                </button>
            )}
        </div>
      </div>
    </header>

    {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-green-100 relative">
                 <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                 </button>
                 <div className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-green-50 mx-auto mb-4 flex items-center justify-center text-eggo-green">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" /></svg>
                    </div>
                    <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-2">Welcome Access</h2>
                    <p className="text-xs text-gray-500 mb-6">Choose your authentication method to participate in the EggoLogic Network.</p>
                    
                    {authError && (
                        <div className="mb-4 p-2 bg-red-50 text-red-600 text-xs rounded-md border border-red-100">
                            {authError}
                        </div>
                    )}

                    <div className="space-y-3">
                        <button 
                            onClick={() => { setWalletConnected(true); setShowModal(false); window.dispatchEvent(new Event('auth_changed')); }}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-slate-200 hover:border-eggo-green hover:bg-green-50 text-slate-700 font-semibold text-sm transition-all"
                        >
                            <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                            Log in with wallet
                        </button>

                        <div className="relative py-2">
                           <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                           <div className="relative flex justify-center text-xs"><span className="bg-white px-2 text-gray-400">or</span></div>
                        </div>

                        <div className="flex justify-center flex-col items-center">
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => setAuthError('Carga de Google Auth fallida')}
                                useOneTap={false}
                                shape="pill"
                                theme="outline"
                            />
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    )}
    </>
  )
}
