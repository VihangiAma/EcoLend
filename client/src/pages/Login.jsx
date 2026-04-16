import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";

// Reuse the SVG Pattern for consistency
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

const InputField = ({ label, type, placeholder, value, onChange, icon }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-gray-900 font-semibold text-sm tracking-tight">{label}</label>
    <div className="relative flex items-center">
      {icon && <span className="absolute left-3.5 text-gray-400">{icon}</span>}
      <input
        type={type} placeholder={placeholder} value={value} onChange={onChange}
        className="w-full pl-11 pr-4 py-3 rounded-xl border-1.5 border-gray-100 focus:border-eco-green focus:ring-4 focus:ring-eco-green/10 outline-none transition-all"
      />
    </div>
  </div>
);

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-eco-light flex items-stretch font-sans">
      {/* Left Panel */}
      <div className="hidden lg:flex w-[42%] bg-eco-green relative overflow-hidden flex-col justify-between p-12">
        <EcoPattern />
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 text-white no-underline">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-md">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2C6 2 2 8 2 12C2 16 6 22 12 22C12 22 12 15 12 2Z" fill="white"/></svg>
            </div>
            <span className="font-black text-xl tracking-tighter text-white">EcoLend</span>
          </Link>
        </div>

        <div className="relative z-10">
          <h1 className="text-white font-black text-5xl leading-tight tracking-tighter mb-6">
            Welcome <br />Back.
          </h1>
          <p className="text-white/70 text-lg max-w-xs leading-relaxed">
            Log in to access your local community and continue your sustainable journey.
          </p>
        </div>

        <div className="relative z-10 bg-white/10 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
          <p className="text-white/90 text-sm italic font-medium">"Borrowing a pressure washer for my driveway saved me $80 and stopped one more machine from ending up in a landfill."</p>
          <div className="flex items-center gap-3 mt-4">
             <div className="w-8 h-8 rounded-full bg-eco-light flex items-center justify-center text-eco-green font-bold text-xs">AM</div>
             <span className="text-white font-bold text-xs">Arjun M., Colombo</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[400px]">
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Sign In</h2>
          <p className="text-gray-500 mb-8">Welcome back! Please enter your details.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField 
              label="Email" type="email" placeholder="Enter your email" 
              value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>}
            />
            <InputField 
              label="Password" type="password" placeholder="••••••••" 
              value={form.password} onChange={(e) => setForm({...form, password: e.target.value})}
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>}
            />

            <button className="w-full bg-eco-green text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-eco-green/20 hover:bg-opacity-90 transition-all transform active:scale-[0.98]">
              Sign In
            </button>
          </form>

          <p className="text-center mt-8 text-gray-500 text-sm">
            Don't have an account? <Link to="/register" className="text-eco-green font-bold hover:underline">Register free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}