import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, User, LogIn, Sparkles, ShieldCheck } from 'lucide-react';

const Login = ({ setActivePage }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
      const payload = isSignUp ? { name, email, password } : { email, password };
      
      const response = await axios.post(`http://localhost:8000${endpoint}`, payload);
      
      if (response.data.token) {
        localStorage.setItem('autoverse_token', response.data.token);
        localStorage.setItem('autoverse_user', JSON.stringify(response.data.user));
        
        // Redirect to predict page
        setActivePage('predict');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    
    // Simulate a secure Google popup response
    const mockGoogleUser = {
      email: email || 'user.demo@autoverse.ai',
      name: name || 'Aero Rider',
      googleId: 'g_1029384756'
    };

    if (mockGoogleUser.email === 'admin@autoverse.ai') {
      mockGoogleUser.name = 'AutoVerse Administrator';
    }

    try {
      const response = await axios.post('http://localhost:8000/api/auth/google', mockGoogleUser);
      if (response.data.token) {
        localStorage.setItem('autoverse_token', response.data.token);
        localStorage.setItem('autoverse_user', JSON.stringify(response.data.user));
        setActivePage('predict');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Google Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card rounded-3xl p-8 relative overflow-hidden border border-white/10">
        {/* Glow orbs in card */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-autoverseSecondary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-autoversePrimary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-autoverseSecondary to-autoversePrimary shadow-neonPrimary mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-gray-400">
            {isSignUp ? 'Join the AutoVerse AI market platform' : 'Enter the neural pricing platform'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative">
          {isSignUp && (
            <div className="flex flex-col">
              <label className="text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  required
                  placeholder="Alex Mercer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-autoversePrimary focus:shadow-neonPrimary transition-all text-sm"
                />
              </div>
            </div>
          )}

          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
              <input
                type="email"
                required
                placeholder="alex@autoverse.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-autoversePrimary focus:shadow-neonPrimary transition-all text-sm"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-wider text-gray-400 mb-1.5 font-semibold">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-autoversePrimary focus:shadow-neonPrimary transition-all text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-autoverseSecondary to-autoversePrimary hover:brightness-110 active:scale-95 text-white font-bold rounded-xl text-sm transition-all shadow-neonPrimary flex items-center justify-center gap-2 mt-6 cursor-pointer"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>{isSignUp ? 'Sign Up' : 'Neural Login'}</span>
              </>
            )}
          </button>
        </form>

        <div className="relative my-6 text-center">
          <hr className="border-white/10" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 bg-autoverseBg text-[9px] uppercase tracking-widest text-gray-500">
            OR CONNECT VIA
          </span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <span>Google Neural Sign-In</span>
        </button>

        {/* Tip for easy Admin Access */}
        <div className="mt-4 p-2 rounded bg-autoversePrimary/5 border border-autoversePrimary/10 text-center">
          <p className="text-[10px] text-autoversePrimary/80 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tip: Enter <strong>admin@autoverse.ai</strong> to test admin metrics/retrain.</span>
          </p>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-xs text-autoversePrimary hover:underline cursor-pointer"
          >
            {isSignUp ? 'Already registered? Login here' : 'New to AutoVerse? Create account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
