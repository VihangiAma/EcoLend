import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, ShieldCheck, ArrowLeft, Star } from 'lucide-react';
import API from '../api/axios';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await API.get(`/items/${id}`);
        setItem(res.data);
      } catch (err) { console.error(err); }
    };
    fetchItem();
  }, [id]);

  if (!item) return <div className="p-10 text-gray-400">Loading item details...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-green-800 transition-colors">
        <ArrowLeft size={20} /> <span className="font-medium">Back to Browse</span>
      </button>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: Product Image */}
        <div className="flex-1">
          <div className="sticky top-28">
            <img src={item.image_url || 'https://via.placeholder.com/600'} 
                 alt={item.title}
                 className="w-full h-[550px] object-cover rounded-[2rem] shadow-xl border border-gray-100" />
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <span className="bg-green-100 text-green-800 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              {item.category}
            </span>
            <h1 className="text-5xl font-black text-gray-900 leading-tight">{item.title}</h1>
            
            <div className="flex items-center gap-6 text-gray-500 text-sm">
              <div className="flex items-center gap-1.5"><MapPin size={18} className="text-green-700"/> <span>Western Province, LK</span></div>
              <div className="flex items-center gap-1.5"><Star size={18} className="text-yellow-400 fill-yellow-400"/> <span>4.9 (12 Reviews)</span></div>
            </div>
          </div>

          {/* AI Description Box */}
          <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-100 relative">
            <div className="absolute -top-3 left-8 bg-green-900 text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase">
              AI Insight
            </div>
            <p className="text-gray-600 leading-relaxed text-lg italic">
              "{item.description}"
            </p>
          </div>

          {/* Pricing & Owner Card */}
          <div className="p-6 border border-gray-200 rounded-[2rem] flex items-center justify-between">
             <div className="flex items-center gap-4">
                <img src={item.owner_avatar || "https://ui-avatars.com/api/?name=" + item.owner_name} 
                     className="w-14 h-14 rounded-full border-2 border-white shadow-md" />
                <div>
                  <p className="font-bold text-gray-900 text-lg">{item.owner_name}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1"><ShieldCheck size={12}/> Verified Lender</p>
                </div>
             </div>
             <div className="text-right">
                <p className="text-3xl font-black text-green-900">Rs. {item.price_per_day}</p>
                <p className="text-xs text-gray-400 font-bold uppercase">Per Day</p>
             </div>
          </div>

          {/* CTA Button */}
          <button className="w-full bg-green-900 text-white py-5 rounded-full font-black text-xl hover:bg-black transition-all shadow-2xl shadow-green-200 active:scale-95">
            Request to Borrow
          </button>
        </div>
      </div>
    </div>
  );
}