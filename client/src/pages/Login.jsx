import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Users, TrendingUp, ArrowRight, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user)); 
      navigate('/home');
      window.location.reload();
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.error || 'Server error'));
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white overflow-hidden relative font-sans">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D5A27] via-[#1A1A1A] to-[#1A1A1A]" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#F9C80E] rounded-full blur-[150px] opacity-10 animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#2D5A27] rounded-full blur-[150px] opacity-20 animate-pulse-slower" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Branding & Stats */}
          <div className="space-y-8 hidden lg:block">
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl px-6 py-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2D5A27] to-[#4A8F3F] rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">EcoLend</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl font-bold leading-tight">
                Share.<br />
                Save.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2D5A27] via-[#4A8F3F] to-[#F9C80E]">
                  Sustain.
                </span>
              </h1>
              <p className="text-xl text-white/70 max-w-md">
                Join thousands of neighbors building a circular economy, one item at a time.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#2D5A27]/20 border border-[#2D5A27]/30 flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#2D5A27]" />
                </div>
                <div className="text-3xl font-bold text-[#F9C80E]">10K+</div>
                <div className="text-sm text-white/60">Active Members</div>
              </div>
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#F9C80E]/20 border border-[#F9C80E]/30 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#F9C80E]" />
                </div>
                <div className="text-3xl font-bold text-[#F9C80E]">50K+</div>
                <div className="text-sm text-white/60">Items Shared</div>
              </div>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-2 text-white">Welcome Back</h2>
              <p className="text-white/60">Sign in to continue your journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    onChange={handleChange}
                    className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#2D5A27] outline-none transition-all text-white placeholder-white/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-white/80 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#2D5A27] outline-none transition-all text-white placeholder-white/20"
                    required
                  />
                </div>
                
                {/* --- ADDED FORGOT PASSWORD LINK --- */}
                <div className="flex justify-end pr-1">
                  <Link 
                    to="/forgot-password" 
                    className="text-xs font-semibold text-[#F9C80E] hover:text-white transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                className="group w-full bg-gradient-to-r from-[#2D5A27] to-[#4A8F3F] text-white py-4 rounded-2xl font-bold hover:shadow-2xl hover:shadow-[#2D5A27]/50 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg"
              >
                Sign In
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-white/60 text-sm font-medium">
                Don’t have an account?{' '}
                <Link to="/register" className="text-[#F9C80E] font-bold hover:underline underline-offset-4">
                  Sign up
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.15; }
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.25; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        .animate-pulse-slower {
          animation: pulse-slower 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}