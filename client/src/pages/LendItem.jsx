import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Package, DollarSign, MapPin, Upload, Navigation, CheckCircle, X } from "lucide-react";
import API from "../api/axios";

export default function LendItem() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "Tools",
    price_per_day: "",
    location_name: "", 
    description: "",
    image_file: null
  });

  // 1. Groq AI Generation (Keep this!)
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
        } catch (err) { alert("Could not fetch city name."); }
      });
    }
  };

  // 3. Submit Form with Image File
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("price_per_day", formData.price_per_day);
    data.append("location_name", formData.location_name);
    data.append("description", formData.description);
    data.append("image", formData.image_file); // This must match upload.single('image') in backend

    try {
      await API.post("/items/add", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setSuccess(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      alert("Database error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 p-4">
      {/* Success Modal */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 backdrop-blur-sm">
          <div className="bg-white p-10 rounded-[3rem] text-center space-y-4 shadow-2xl animate-in zoom-in duration-300">
            <CheckCircle size={80} className="text-green-600 mx-auto" />
            <h2 className="text-3xl font-black">Item Listed!</h2>
            <p className="text-gray-500 font-medium">Redirecting you to the home feed...</p>
          </div>
        </div>
      )}

      <h1 className="text-4xl font-black text-gray-900 mb-2">Create New Listing</h1>
      <p className="text-gray-400 mb-10 font-medium tracking-tight">EcoLend: Fast, AI-powered community sharing.</p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Left Column */}
        <div className="space-y-6">
          <input
            type="text"
            placeholder="Item Title (e.g., Professional DSLR Camera)"
            className="w-full p-5 bg-gray-50 rounded-3xl outline-none border-2 border-transparent focus:border-green-800 transition-all"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="City (e.g., Kalutara)"
              value={formData.location_name}
              className="flex-1 p-5 bg-gray-50 rounded-3xl outline-none"
              onChange={(e) => setFormData({ ...formData, location_name: e.target.value })}
              required
            />
            <button type="button" onClick={handleGetLocation} className="p-5 bg-green-100 text-green-900 rounded-3xl hover:bg-green-200 transition-colors">
              <Navigation size={22} />
            </button>
          </div>

          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="number"
              placeholder="Price per day"
              className="w-full p-5 pl-12 bg-gray-50 rounded-3xl outline-none"
              onChange={(e) => setFormData({ ...formData, price_per_day: e.target.value })}
              required
            />
          </div>

          <select 
            className="w-full p-5 bg-gray-50 rounded-3xl outline-none appearance-none font-bold text-gray-600"
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {['Tools', 'Electronics', 'Kitchen', 'Camping', 'Photography'].map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="relative">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-2">Description</label>
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
              placeholder="Write or generate a description..."
              rows="5"
              className="w-full p-6 bg-gray-50 rounded-[2rem] outline-none focus:ring-2 focus:ring-green-800 resize-none italic text-gray-600"
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Device Image Upload */}
          <div className="relative group border-4 border-dashed border-gray-100 rounded-[2.5rem] p-10 text-center hover:border-green-800 transition-all cursor-pointer bg-gray-50/50">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => setFormData({ ...formData, image_file: e.target.files[0] })}
            />
            {formData.image_file ? (
              <div className="flex flex-col items-center">
                <CheckCircle className="text-green-600 mb-2" size={32} />
                <p className="text-sm font-bold text-gray-700">{formData.image_file.name}</p>
              </div>
            ) : (
              <>
                <Upload className="mx-auto text-gray-300 mb-3" size={40} />
                <p className="text-sm text-gray-400 font-bold">CLICK TO UPLOAD FROM DEVICE</p>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-900 text-white py-6 rounded-full font-black text-xl hover:bg-black transition-all shadow-2xl shadow-green-200 active:scale-95 disabled:bg-gray-400"
          >
            {loading ? "SAVING TO ECOLEND..." : "CONFIRM LISTING"}
          </button>
        </div>
      </form>
    </div>
  );
}