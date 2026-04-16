import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Sparkles, ArrowRight, Phone } from "lucide-react"; // Added Phone icon
import API from "../api/axios";

// 1. Decorative Pattern Component
const EcoPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="leaf" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M30 5 C15 5, 5 15, 5 30 C5 45, 15 55, 30 55 C30 55, 30 30, 30 5Z" fill="#2D5A27"/>
        <path d="M30 5 C45 5, 55 15, 55 30 C55 45, 45 55, 30 55 C30 55, 30 30, 30 5Z" fill="#2D5A27" opacity="0.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#leaf)" />
  </svg>
);

// 2. Modular Input Component
const InputField = ({ label, type, placeholder, value, onChange, icon, rightElement }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-gray-900 font-semibold text-sm tracking-tight ml-1">{label}</label>
    <div className="relative flex items-center">
      {icon && <span className="absolute left-4 text-gray-400 pointer-events-none">{icon}</span>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-gray-100 focus:border-eco-green focus:ring-4 focus:ring-eco-green/10 outline-none transition-all text-[15px] text-gray-900 shadow-sm"
      />
      {rightElement && <div className="absolute right-4">{rightElement}</div>}
    </div>
  </div>
);

export default function Register() {
  // UPDATED STATE: Added 'phone' to match MySQL schema
  const [form, setForm] = useState({ 
    full_name: "", 
    email: "", 
    password: "", 
    phone: "" 
  });
  
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  // 1. Generate an auto-avatar using the user's name and your Eco-Green color (#2D5A27)
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(form.full_name)}&background=2D5A27&color=fff&bold=true`;

  try {
    // 2. Spread the form and add the profile_img_url field
    const registrationData = { 
      ...form, 
      profile_img_url: avatarUrl 
    };

    await API.post("/auth/register", registrationData);
    
    alert("Registration Successful!");
    navigate("/login");
  } catch (err) {
    alert(err.response?.data?.message || "Registration failed.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-stretch bg-eco-light font-sans">
      
      {/* LEFT PANEL — BRANDING */}
      <div className="hidden lg:flex w-[42%] bg-eco-green relative overflow-hidden flex-col justify-between p-12">
        <EcoPattern />
        
        <div className="absolute w-[400px] h-[400px] rounded-full border border-white/10 -top-20 -right-20" />
        <div className="absolute w-[300px] h-[300px] rounded-full border border-white/5 -bottom-20 -left-20" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 no-underline group">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition">
                <Sparkles className="text-white" size={20} />
            </div>
            <span className="text-white font-black text-2xl tracking-tighter">EcoLend</span>
          </Link>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 backdrop-blur-md border border-white/10 mb-6">
            <span className="text-xs font-bold text-white/90 tracking-wide uppercase">🌱 Circular Economy</span>
          </div>
          <h1 className="text-white font-black text-5xl leading-[1.1] tracking-tighter mb-6">
            Share More.<br />Waste Less.<br />Live Better.
          </h1>
          <p className="text-white/70 text-lg max-w-sm leading-relaxed">
            Join Sri Lanka's fastest growing hyper-local sharing network. Borrow tools, share equipment, and build a sustainable community.
          </p>
        </div>

        <div className="relative z-10 bg-white/10 p-6 rounded-[2rem] border border-white/10 backdrop-blur-md">
          <div className="flex gap-12 mb-2">
            <div>
              <div className="text-white font-black text-2xl">12K+</div>
              <div className="text-white/50 text-xs font-bold uppercase tracking-widest">Active Lenders</div>
            </div>
            <div>
              <div className="text-white font-black text-2xl">40T</div>
              <div className="text-white/50 text-xs font-bold uppercase tracking-widest">CO₂ Saved</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — FORM */}
      <div className="flex-1 flex items-center justify-center p-8 bg-eco-light">
        <div className="w-full max-w-[420px]">
          
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Create Account</h2>
            <p className="text-gray-500 font-medium">Be part of the neighborhood resource revolution.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField 
              label="Full Name" type="text" placeholder="Ama Vihangi" 
              value={form.full_name} onChange={update("full_name")}
              icon={<User size={18} />}
            />

            <InputField 
              label="Email Address" type="email" placeholder="ama@example.com" 
              value={form.email} onChange={update("email")}
              icon={<Mail size={18} />}
            />

            {/* NEW FIELD: Phone Number (MySQL Schema: phone VARCHAR(20)) */}
            <InputField 
              label="Phone Number" type="tel" placeholder="+94 7X XXX XXXX" 
              value={form.phone} onChange={update("phone")}
              icon={<Phone size={18} />}
            />

            <InputField 
              label="Password" 
              type={showPass ? "text" : "password"} 
              placeholder="Min. 8 characters" 
              value={form.password} onChange={update("password")}
              icon={<Lock size={18} />}
              rightElement={
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)}
                  className="text-xs font-bold text-gray-400 hover:text-eco-green transition"
                >
                  {showPass ? "HIDE" : "SHOW"}
                </button>
              }
            />

            <button 
              disabled={loading}
              className="w-full bg-eco-green text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-opacity-95 hover:-translate-y-1 active:scale-[0.98] transition-all shadow-xl shadow-eco-green/20 mt-4 disabled:opacity-70"
            >
              {loading ? "Creating Account..." : "Create Free Account"}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <p className="text-center mt-10 text-gray-500 font-medium">
            Already have an account? 
            <Link to="/login" className="text-eco-green font-bold ml-2 hover:underline">Sign In</Link>
          </p>
        </div>
      </div>

    </div>
  );
}