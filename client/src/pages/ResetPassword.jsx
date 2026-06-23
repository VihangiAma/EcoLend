import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Leaf, Lock, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ResetPassword() {
  const { token } = useParams(); // Grabs the token from the URL
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [strength, setStrength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password Strength Logic
  const handlePasswordChange = (val) => {
    setPassword(val);
    let s = 0;
    if (val.length > 7) s++; 
    if (/[A-Z]/.test(val)) s++; 
    if (/[0-9]/.test(val)) s++; 
    if (/[^A-Za-z0-9]/.test(val)) s++; 
    setStrength(s);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert("Passwords do not match!");
    if (strength < 2) return alert("Please use a stronger password.");

    setLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000); // Auto redirect after 3 seconds
    } catch (err) {
      alert(err.response?.data?.message || "Invalid or expired link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white overflow-hidden relative font-sans flex items-center justify-center px-6">
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D5A27] via-[#1A1A1A] to-[#1A1A1A]" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#2D5A27] rounded-full blur-[120px] opacity-20" />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
          
          {!isSuccess ? (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
                  <ShieldCheck className="text-[#F9C80E]" size={32} />
                </div>
                <h2 className="text-3xl font-bold">New Password</h2>
                <p className="text-white/60 mt-2 text-sm">Create a strong password to protect your EcoLend account.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New Password */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-white/50 uppercase ml-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      className="w-full pl-12 pr-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#2D5A27] outline-none text-white"
                      placeholder="••••••••"
                    />
                  </div>
                  {/* Strength Meter */}
                  <div className="flex gap-1 mt-2 px-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-1 w-full rounded-full transition-all duration-500 ${i < strength ? (strength <= 2 ? 'bg-red-500' : strength === 3 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-white/10'}`} />
                    ))}
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-white/50 uppercase ml-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-12 pr-5 py-3.5 bg-white/5 border ${confirmPassword && password !== confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-2xl focus:ring-2 focus:ring-[#2D5A27] outline-none text-white`}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#2D5A27] to-[#4A8F3F] text-white py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                >
                  {loading ? "Updating..." : "Update Password"}
                  <ArrowRight size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle className="text-green-500" size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Success!</h2>
              <p className="text-white/60 mb-6">Your password has been updated. Redirecting you to login...</p>
              <Link to="/login" className="text-[#F9C80E] font-bold hover:underline">Click here if not redirected</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}