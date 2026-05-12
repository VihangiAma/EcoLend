import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf, Users, TrendingUp, ArrowRight, User, Mail, Lock, Phone, UploadCloud } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = e => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('full_name', form.full_name);
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('phone', form.phone);
      if (file) formData.append('profile_img', file);

      await axios.post('http://localhost:5000/api/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert('Registration successful!');
      navigate('/login');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
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
          
          {/* Left Side: Branding (Visible on large screens) */}
          <div className="space-y-8 hidden lg:block">
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl px-6 py-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2D5A27] to-[#4A8F3F] rounded-xl flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">EcoLend</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl font-bold leading-tight">
                Join the<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2D5A27] via-[#4A8F3F] to-[#F9C80E]">
                  Movement.
                </span>
              </h1>
              <p className="text-xl text-white/70 max-w-md">
                Build a circular economy with your community. Start lending and borrowing today.
              </p>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-6">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-[#1A1A1A] bg-[#2D5A27] flex items-center justify-center text-xs font-bold">
                    {i === 3 ? "10k+" : <User size={16} />}
                  </div>
                ))}
              </div>
              <div className="text-sm text-white/60 font-medium">
                Over <span className="text-white font-bold">10,000 users</span> sharing locally.
              </div>
            </div>
          </div>

          {/* Right Side: Register Form */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2 text-white text-center lg:text-left">Create Account</h2>
              <p className="text-white/60 text-center lg:text-left">Register to start your sustainable journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* --- MODERN IMAGE UPLOAD --- */}
              <div className="flex flex-col items-center justify-center pb-2">
                <label className="cursor-pointer group relative">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden bg-white/5 transition-all group-hover:border-[#F9C80E] group-hover:bg-white/10 shadow-inner">
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <UploadCloud className="text-white/20 group-hover:text-[#F9C80E] transition-colors" size={32} />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[#2D5A27] p-1.5 rounded-full border border-white/20 text-white shadow-lg">
                    <UploadCloud size={14} />
                  </div>
                </label>
                <span className="text-[10px] uppercase tracking-widest mt-2 text-white/40 font-bold">Profile Photo</span>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-white/50 uppercase ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input
                    name="full_name"
                    placeholder="Ama Nishshanka"
                    onChange={handleChange}
                    className="w-full pl-12 pr-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#2D5A27] outline-none transition-all text-sm text-white placeholder-white/20"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-white/50 uppercase ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    onChange={handleChange}
                    className="w-full pl-12 pr-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#2D5A27] outline-none transition-all text-sm text-white placeholder-white/20"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-white/50 uppercase ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    onChange={handleChange}
                    className="w-full pl-12 pr-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#2D5A27] outline-none transition-all text-sm text-white placeholder-white/20"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-white/50 uppercase ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                  <input
                    name="phone"
                    placeholder="+94 77 123 4567"
                    onChange={handleChange}
                    className="w-full pl-12 pr-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#2D5A27] outline-none transition-all text-sm text-white placeholder-white/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="group w-full bg-gradient-to-r from-[#2D5A27] to-[#4A8F3F] text-white py-4 rounded-2xl font-bold hover:shadow-2xl hover:shadow-[#2D5A27]/50 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-lg mt-4"
              >
                Sign Up
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm font-medium">
                Already have an account?{' '}
                <Link to="/login" className="text-[#F9C80E] font-bold hover:underline underline-offset-4">
                  Sign in
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
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}