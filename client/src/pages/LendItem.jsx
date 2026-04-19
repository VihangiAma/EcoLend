import { useState } from "react";
import { Sparkles, Package, DollarSign, MapPin, Upload, Navigation } from "lucide-react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function LendItem() {
  const [formData, setFormData] = useState({
    title: "",
    category: "Tools", // Matches ENUM
    price_per_day: "",
    description: "",
    image_url: "",
    location_lat: null,
    location_lng: null
  });
  const [loading, setLoading] = useState(false);

  // Function to get Geo-location coordinates
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData({
          ...formData,
          location_lat: position.coords.latitude,
          location_lng: position.coords.longitude
        });
        alert("Location captured!");
      });
    }
  };

  const handleGenerateAI = async () => {
    if (!formData.title) return alert("Please enter a title first!");
    setLoading(true);
    try {
      const res = await API.post("/ai/generate-description", { title: formData.title });
      setFormData({ ...formData, description: res.data.description });
    } catch (err) {
      console.error("AI Generation failed", err);
    } finally {
      setLoading(false);
    }
  };
const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await API.post("/items/add", formData);
    if (res.data.success) {
      // Navigate to home after successful listing
      navigate("/"); 
    }
  } catch (err) {
    alert("Listing failed. Check your connection.");
  }
};

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 leading-tight">Lend an Item</h1>
        <p className="text-gray-400 font-medium">Match your gear with the community needs.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Left: General Details */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Package size={16} className="text-green-800" /> Title
            </label>
            <input
              type="text"
              maxLength="150" // Matches VARCHAR(150)
              className="w-full p-4 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-green-800 outline-none"
              placeholder="What are you lending?"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Category</label>
            <select 
              className="w-full p-4 bg-gray-50 border-none rounded-3xl outline-none appearance-none"
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              value={formData.category}
            >
              {['Tools', 'Electronics', 'Kitchen', 'Camping', 'Photography'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <DollarSign size={16} className="text-green-800" /> Price Per Day (Rs.)
            </label>
            <input
              type="number"
              step="0.01" // Matches DECIMAL(10,2)
              className="w-full p-4 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-green-800 outline-none"
              placeholder="0.00"
              onChange={(e) => setFormData({ ...formData, price_per_day: e.target.value })}
              required
            />
          </div>

          {/* Geo-Location Section */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Navigation size={16} className="text-green-800" /> Coordinates (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                placeholder="Lat"
                value={formData.location_lat || ""}
                className="w-1/2 p-4 bg-gray-100 border-none rounded-3xl text-xs"
              />
              <input
                type="text"
                readOnly
                placeholder="Lng"
                value={formData.location_lng || ""}
                className="w-1/2 p-4 bg-gray-100 border-none rounded-3xl text-xs"
              />
            </div>
            <button 
              type="button" 
              onClick={handleGetLocation}
              className="w-full py-2 text-xs font-bold text-green-800 hover:underline"
            >
              Fetch Current Location
            </button>
          </div>
        </div>

        {/* Right: AI Description & Media */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-700">Description</label>
              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={loading}
                className="text-[10px] font-black uppercase flex items-center gap-1 bg-yellow-400 px-3 py-1 rounded-full shadow-sm hover:scale-105 transition-transform"
              >
                <Sparkles size={12} /> {loading ? "Crafting..." : "Groq AI"}
              </button>
            </div>
            <textarea
              rows="6"
              value={formData.description}
              className="w-full p-5 bg-gray-50 border-none rounded-[2rem] focus:ring-2 focus:ring-green-800 outline-none resize-none leading-relaxed"
              placeholder="AI can help you describe this item..."
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <Upload size={16} className="text-green-800" /> Image URL
            </label>
            <input
              type="text"
              className="w-full p-4 bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-green-800 outline-none"
              placeholder="Paste link to image"
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-900 text-white py-5 rounded-full font-black text-lg hover:bg-black transition-all shadow-xl shadow-green-100"
          >
            Create Listing
          </button>
        </div>
      </form>
    </div>
  );
}