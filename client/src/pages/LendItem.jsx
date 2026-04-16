import { useState } from "react";
import { Sparkles, Package, Tag, MapPin, ArrowRight, Loader2 } from "lucide-react";
import API from "../api/axios";

export default function LendItem() {
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Schema-aligned state
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Tools", // ENUM: 'Tools', 'Electronics', 'Kitchen', 'Camping', 'Photography'
    price_per_day: 0.00, // DECIMAL(10,2)
    location_name: "Colombo", // For frontend UI
    location_lat: 6.9271,
    location_lng: 79.8612,
    image_url: "https://images.unsplash.com/photo-1581235720704-06d3acfc1366?auto=format&fit=crop&q=80&w=400" // Default placeholder
  });

  // Helper to update location coordinates based on District
  const handleLocationChange = (district) => {
    const coords = {
      Colombo: { lat: 6.9271, lng: 79.8612 },
      Gampaha: { lat: 7.0840, lng: 80.0098 },
      Kalutara: { lat: 6.5854, lng: 79.9607 }
    };
    
    setForm({
      ...form,
      location_name: district,
      location_lat: coords[district].lat,
      location_lng: coords[district].lng
    });
  };

  const handleAiGenerate = async () => {
    if (!form.title) return alert("Please enter an item name first!");
    setAiGenerating(true);
    try {
      const res = await API.post("/ai/generate-description", { itemName: form.title });
      setForm({ ...form, description: res.data.description });
    } catch (err) {
      if (err.response?.status === 429) {
        alert("AI is a bit busy! Please wait 60 seconds.");
      } else {
        alert("AI generation failed.");
      }
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description) return alert("Please add a description.");
    
    setLoading(true);
    try {
      // Sends to your MySQL backend route
      await API.post("/items/add", form);
      alert("Success! Your item is listed in the Western Province network.");
      // Reset form logic could go here
    } catch (err) {
      console.error(err);
      alert("Failed to list item. Ensure your backend and MySQL are running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-eco-light py-12 px-6 font-sans">
      <div className="max-w-3xl mx-auto">
        
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic">EcoLend</h1>
          <p className="text-gray-500 font-medium mt-2">Western Province Sustainable Sharing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Item Details */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-eco-green/10 rounded-xl text-eco-green"><Package size={20}/></div>
              <h2 className="font-bold text-xl text-gray-800">Item Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-sm ml-1 text-gray-600">Item Name</label>
                <input 
                  type="text" required placeholder="e.g. DSLR Camera" 
                  className="w-full px-5 py-4 rounded-2xl bg-eco-light border-none focus:ring-2 focus:ring-eco-green/20 outline-none font-medium"
                  value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-sm ml-1 text-gray-600">Category (MySQL Enum)</label>
                <select 
                  className="w-full px-5 py-4 rounded-2xl bg-eco-light border-none focus:ring-2 focus:ring-eco-green/20 outline-none font-medium appearance-none"
                  value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}
                >
                  <option value="Tools">Tools</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Camping">Camping</option>
                  <option value="Photography">Photography</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="font-bold text-sm text-gray-600">Description</label>
                <button 
                  type="button" onClick={handleAiGenerate} disabled={aiGenerating}
                  className="text-xs font-bold text-eco-green flex items-center gap-1 hover:text-green-700 disabled:opacity-50 transition-colors"
                >
                  {aiGenerating ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12}/>}
                  {aiGenerating ? "Generating..." : "Generate with Gemini AI"}
                </button>
              </div>
              <textarea 
                rows="4" required
                placeholder="Describe your item's condition..."
                className="w-full px-5 py-4 rounded-2xl bg-eco-light border-none focus:ring-2 focus:ring-eco-green/20 outline-none font-medium resize-none"
                value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}
              />
            </div>
          </div>

          {/* Section 2: Location & Pricing */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-sm flex items-center gap-1 ml-1 text-gray-600">
                <MapPin size={14} className="text-eco-green"/> District
              </label>
              <select 
                className="w-full px-5 py-4 rounded-2xl bg-eco-light border-none focus:ring-2 focus:ring-eco-green/20 outline-none font-medium"
                value={form.location_name} 
                onChange={(e) => handleLocationChange(e.target.value)}
              >
                <option value="Colombo">Colombo</option>
                <option value="Gampaha">Gampaha</option>
                <option value="Kalutara">Kalutara</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-sm flex items-center gap-1 ml-1 text-gray-600">
                <Tag size={14} className="text-eco-green"/> Price Per Day (LKR)
              </label>
              <input 
                type="number" step="0.01"
                className="w-full px-5 py-4 rounded-2xl bg-eco-light border-none focus:ring-2 focus:ring-eco-green/20 outline-none font-medium"
                value={form.price_per_day} 
                onChange={(e) => setForm({...form, price_per_day: parseFloat(e.target.value) || 0})}
              />
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-eco-green text-white py-5 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-eco-green/30 hover:-translate-y-1 transition-all disabled:opacity-70"
          >
            {loading ? "Saving to Database..." : "List Your Item Now"}
            {!loading && <ArrowRight />}
          </button>
        </form>
      </div>
    </div>
  );
}