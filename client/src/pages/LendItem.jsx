import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, DollarSign, MapPin, Upload, Navigation, CheckCircle, FileText, Tag, Camera, Eye, Info, ArrowRight } from "lucide-react";
import API from "../api/axios";

export default function LendItem() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isOther, setIsOther] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "Tools",
    price_per_day: "",
    location_name: "", 
    description: "",
    image_file: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  // 0. Token Authentication Check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first to list an item!");
      navigate("/login");
    }
  }, [navigate]);

  const categories = ["Tools", "Electronics", "Kitchen", "Camping", "Photography", "Sports", "Outdoor", "Garden", "Home", "Other"];
  
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "Other") {
      setIsOther(true);
      setFormData({ ...formData, category: "" });
    } else {
      setIsOther(false);
      setFormData({ ...formData, category: value });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image_file: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 1. Groq AI Generation 
  const handleGenerateAI = async () => {
    if (!formData.title) return alert("Please enter a title first so AI knows what to describe!");
    setAiLoading(true);
    try {
      const res = await API.post("/ai/generate-description", { title: formData.title });
      setFormData({ ...formData, description: res.data.description });
    } catch (err) {
      console.error("AI Generation failed", err);
      alert("AI failed to generate. Check your Groq API key.");
    } finally {
      setAiLoading(false);
    }
  };

  // 2. Fetch City Name (Reverse Geocoding)
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const city = data.address.city || data.address.town || data.address.village || "Unknown City";
          setFormData({ ...formData, location_name: city });
        } catch (err) { 
          alert("Could not fetch city name."); 
        }
      });
    }
  };

  // 3. Submit Form with Image File
  // Replace your handleSubmit function inside LendItem.jsx with this:
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const data = new FormData();
  data.append("title", formData.title);
  data.append("category", formData.category);
  data.append("price_per_day", formData.price_per_day);
  data.append("location_name", formData.location_name);
  data.append("description", formData.description);
  data.append("image", formData.image_file);

  try {
    // 1. Fetch your user session token safely from storage context
    const token = localStorage.getItem("token");

    // 2. Transmit the payload with explicit authorization parameter tracking headers
    await API.post("/items/add", data, {
      headers: { 
        "Content-Type": "multipart/form-data",
        // This attaches the missing token context to your verifyToken middleware on the backend
        "Authorization": `Bearer ${token}` 
      }
    });

    setSuccess(true);
    setTimeout(() => navigate("/"), 2000);
  } catch (err) {
    console.error("Submission failed details:", err.response?.data || err.message);
    alert("Submission Error: " + (err.response?.data?.error || err.message));
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-gray-900 pb-16">
      {/* High-Contrast Page Header */}
      <div className="bg-gradient-to-r from-[#003B23] to-[#005A36] text-white py-12 px-4 sm:px-6 lg:px-8 mb-8 shadow-md">
        <div className="mx-auto max-w-5xl">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-300 bg-white/10 px-3 py-1 rounded-md border border-emerald-500/20">
            Marketplace Upload Portal
          </span>
          <h1 className="text-3xl font-black tracking-tight mt-2 text-white">Lend Your Item</h1>
          <p className="text-sm text-emerald-100/80 mt-1 max-w-xl">
            EcoLend: Fast, AI-powered community sharing platform.
          </p>
        </div>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left / Center: Main Listing Entry Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            
            {/* Step 1: Media Workspace Assets drop panel */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <span className="w-6 h-6 rounded-md bg-[#005A36] text-white font-extrabold text-xs flex items-center justify-center">1</span>
                <label className="text-xs font-black uppercase tracking-wider text-gray-700">Visual Media Identification</label>
              </div>
              
              <div className="relative group border-2 border-dashed border-gray-300 hover:border-[#005A36] rounded-xl transition-all overflow-hidden bg-[#fafafa] aspect-video max-h-[240px] flex flex-col items-center justify-center cursor-pointer">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Upload asset preview" className="w-full h-full object-cover" />
                    <label htmlFor="file-upload" className="absolute bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg cursor-pointer flex items-center gap-2 hover:bg-black transition">
                      <Camera size={14} /> Replace Photo
                    </label>
                  </>
                ) : (
                  <label htmlFor="file-upload" className="w-full h-full flex flex-col items-center justify-center p-8 text-center cursor-pointer">
                    <div className="h-12 w-12 rounded-xl bg-gray-100 text-gray-500 group-hover:bg-emerald-50 group-hover:text-[#005A36] flex items-center justify-center mb-3 shadow-xs border border-gray-200 transition-colors">
                      <Upload size={20} />
                    </div>
                    <span className="text-sm font-black text-gray-800">Upload high-resolution image</span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG, or WebP up to 5MB</span>
                  </label>
                )}
                <input id="file-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" required />
              </div>
            </div>

            {/* Step 2: Form Input Parameters */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                <span className="w-6 h-6 rounded-md bg-[#005A36] text-white font-extrabold text-xs flex items-center justify-center">2</span>
                <label className="text-xs font-black uppercase tracking-wider text-gray-700">Asset Parameters & Context</label>
              </div>

              {/* Title Field Block */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-700 flex items-center gap-1.5">
                  <FileText size={14} className="text-gray-500" /> Item Title / Model Name
                </label>
                <input
                  type="text"
                  placeholder="Item Title (e.g., Professional DSLR Camera)"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#fafafa] border border-gray-300 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:border-[#005A36] focus:bg-white focus:ring-4 focus:ring-[#005A36]/10 transition-all text-gray-900 placeholder-gray-400"
                  required
                />
              </div>

              {/* Description & AI Textarea Block */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-widest">Description</label>
                  <button
                    type="button"
                    onClick={handleGenerateAI}
                    disabled={aiLoading}
                    className="bg-yellow-400 text-black text-[10px] font-black px-4 py-2 rounded-full flex items-center gap-1.5 hover:bg-yellow-500 transition-all active:scale-95 disabled:bg-gray-200"
                  >
                    <Sparkles size={14} /> {aiLoading ? "GROQ IS THINKING..." : "GENERATE WITH AI"}
                  </button>
                </div>
                <textarea
                  value={formData.description}
                  placeholder="Write or generate a detailed description explaining condition, inclusions, and rental parameters..."
                  rows="4"
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#fafafa] border border-gray-300 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:border-[#005A36] focus:bg-white focus:ring-4 focus:ring-[#005A36]/10 transition-all text-gray-900 placeholder-gray-400 resize-none leading-relaxed"
                />
              </div>

              {/* Row: Location & Price */}
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
                {/* Location Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-700 flex items-center gap-1.5">
                    <MapPin size={14} className="text-gray-500" /> Operational Handoff Location
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="City (e.g., Kalutara)"
                      value={formData.location_name}
                      onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
                      className="flex-1 bg-[#fafafa] border border-gray-300 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:border-[#005A36] focus:bg-white focus:ring-4 focus:ring-[#005A36]/10 transition-all text-gray-900 placeholder-gray-400"
                      required
                    />
                    <button 
                      type="button" 
                      onClick={handleGetLocation} 
                      className="px-4 bg-green-100 text-green-900 rounded-xl hover:bg-green-200 border border-green-200 transition-colors shrink-0"
                    >
                      <Navigation size={18} />
                    </button>
                  </div>
                </div>

                {/* Base Rate Price Field */}
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-gray-700 flex items-center gap-1.5">
                    <DollarSign size={14} className="text-gray-500" /> Base Rate (LKR / Day)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-xs font-extrabold text-gray-400">Rs.</span>
                    <input
                      type="number"
                      placeholder="Price per day"
                      value={formData.price_per_day}
                      onChange={(e) => setFormData({ ...formData, price_per_day: e.target.value })}
                      className="w-full bg-[#fafafa] border border-gray-300 rounded-xl pl-10 pr-4 py-3.5 text-sm font-extrabold outline-none focus:border-[#005A36] focus:bg-white focus:ring-4 focus:ring-[#005A36]/10 transition-all text-gray-900 placeholder-gray-300"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Category Options Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-gray-700 flex items-center gap-1.5">
                  <Tag size={14} className="text-gray-500" /> Catalog Classification
                </label>
                <div className="relative">
                  <select 
                    onChange={handleCategoryChange}
                    className="w-full bg-[#fafafa] border border-gray-300 rounded-xl px-4 py-3.5 text-sm font-bold text-gray-800 outline-none cursor-pointer focus:border-[#005A36] focus:bg-white focus:ring-4 focus:ring-[#005A36]/10 transition-all appearance-none"
                  >
                    <option value="">Select a Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-xs text-gray-500">
                    ▼
                  </div>
                </div>

                {isOther && (
                  <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <input
                      type="text"
                      placeholder="Enter your custom category (e.g., Musical Instruments)"
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-green-50/50 border border-green-300 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-[#005A36] focus:bg-white transition-all text-gray-900 placeholder-gray-400"
                      required
                    />
                    <p className="text-[10px] text-[#005A36] mt-1.5 ml-1 font-black uppercase tracking-widest">Custom Category Active</p>
                  </div>
                )}
              </div>

            </div>

            {/* Footer Operations Controls Container */}
            <div className="pt-6 flex items-center justify-end gap-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-3 rounded-xl border border-gray-300 text-xs font-extrabold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                Discard Form
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#005A36] hover:bg-[#004227] text-white text-xs font-extrabold px-8 py-3.5 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-40 flex items-center gap-2 group"
              >
                {loading ? (
                  <>
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Saving to EcoLend...
                  </>
                ) : (
                  <>
                    Confirm Listing <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Right Column: Live Mirror Card Feed Preview Area */}
          <div className="sticky top-6 space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-gray-500 uppercase tracking-wider px-1">
              <Eye size={14} className="text-[#005A36]" /> Card Feed Compilation Preview
            </div>
            
            <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden shadow-md transition-all">
              {/* Asset Media Canvas Preview */}
              <div className="bg-gray-200 aspect-[4/3] w-full relative overflow-hidden flex items-center justify-center border-b border-gray-100">
                {imagePreview ? (
                  <img src={imagePreview} alt="Live verification feed compilation" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400 flex flex-col items-center gap-1 p-6 text-center">
                    <Camera size={36} strokeWidth={1.5} className="text-gray-300" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">No visual file selected</span>
                  </div>
                )}
                {formData.category && (
                  <span className="absolute top-3 left-3 bg-[#005A36] text-white text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-md shadow-md border border-emerald-500/20">
                    {formData.category}
                  </span>
                )}
              </div>

              {/* Card Meta Content Breakdown */}
              <div className="p-5 space-y-4 bg-white">
                <div>
                  <h3 className="text-base font-black text-gray-950 truncate max-w-full">
                    {formData.title || "Untitled Marketplace Asset"}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 min-h-[32px] leading-relaxed">
                    {formData.description || "Fill in fields or tap generate with AI on the main workspace dashboard to mirror feed variables..."}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3.5 border-t border-gray-200">
                  <div className="flex items-center gap-1 text-gray-700 max-w-[55%]">
                    <MapPin size={13} className="shrink-0 text-[#005A36]" />
                    <span className="text-[11px] font-bold truncate">
                      {formData.location_name || "Unspecified Zone"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] block font-black text-gray-400 uppercase tracking-wider">Per Day Rate</span>
                    <span className="text-base font-black text-[#005A36]">
                      Rs. {formData.price_per_day ? Number(formData.price_per_day).toLocaleString() : "0"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Informational Policy Deck */}
            <div className="bg-amber-50 border-2 border-amber-200/70 rounded-xl p-4 flex gap-3 shadow-xs">
              <Info size={18} className="text-amber-700 shrink-0 mt-0.5" />
              <div className="text-[11px] text-amber-950 leading-relaxed font-medium">
                <strong>Verification Policy:</strong> Listings are cross-referenced with your active regional zone settings to guarantee matching logistics.
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Success Handoff Modal overlay canvas */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-xs">
          <div className="bg-white p-10 rounded-[2rem] text-center space-y-4 shadow-2xl animate-in zoom-in duration-200 border border-gray-100 max-w-sm mx-4">
            <CheckCircle size={64} className="text-[#005A36] mx-auto" />
            <h2 className="text-2xl font-black text-gray-950 tracking-tight">Item Listed!</h2>
            <p className="text-gray-500 text-xs font-medium">Your gear has been cataloged inside the shared ecosystem pool. Redirecting you to the home feed...</p>
          </div>
        </div>
      )}
    </div>
  );
}