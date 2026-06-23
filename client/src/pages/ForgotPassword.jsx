import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Leaf, ArrowLeft, Mail, Send, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setSubmitted(true);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* The h-screen and min-h-screen classes ensure this covers the entire page, 
       acting as its own layout without needing your app's standard nav/header. */
    <div className="min-h-screen bg-[#1A1A1A] text-white overflow-hidden relative font-sans flex items-center justify-center px-6">
      
      {/* Background Decorations (Matching Login) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2D5A27] via-[#1A1A1A] to-[#1A1A1A]" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F9C80E] rounded-full blur-[150px] opacity-10" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[#2D5A27] to-[#4A8F3F] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#2D5A27]/20">
            <Leaf className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">EcoLend</h1>
        </div>

        {/* Glass Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {!submitted ? (
            <>
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold mb-2">Reset Password</h2>
                <p className="text-white/60">Enter your email and we'll send you a link to reset your password.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/80 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#2D5A27] outline-none transition-all text-white placeholder-white/20"
                      placeholder="ama@example.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#2D5A27] to-[#4A8F3F] text-white py-4 rounded-2xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg shadow-[#2D5A27]/20"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-500" size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Check your Email</h2>
              <p className="text-white/60 mb-8">
                We've sent a password reset link to <br />
                <span className="text-white font-semibold">{email}</span>
              </p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-white/60 hover:text-[#F9C80E] transition-colors text-sm font-medium"
            >
              <ArrowLeft size={16} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}