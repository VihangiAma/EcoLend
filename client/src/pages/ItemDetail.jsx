import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Calendar, User, ShieldCheck } from 'lucide-react';
import API from '../api/axios';

export default function ItemDetail() {
  const { id } = useParams();
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

  if (!item) return <div className="p-10">Loading item details...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Image */}
        <div className="flex-1">
          <img src={item.image_url || 'https://via.placeholder.com/600'} 
               className="w-full h-[500px] object-cover rounded-3xl shadow-lg" />
        </div>

        {/* Right: Info */}
        <div className="flex-1 space-y-6">
          <div className="badge bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold uppercase">
            {item.category}
          </div>
          <h1 className="text-4xl font-black text-gray-900">{item.title}</h1>
          
          <div className="flex items-center gap-4 text-gray-500">
            <div className="flex items-center gap-1"><MapPin size={18}/> <span>Colombo, LK</span></div>
            <div className="flex items-center gap-1"><Calendar size={18}/> <span>Available Now</span></div>
          </div>

          <div className="p-6 bg-gray-50 rounded-3xl">
            <p className="text-gray-600 leading-relaxed italic">"{item.description}"</p>
          </div>

          <div className="flex justify-between items-center p-4 border border-gray-100 rounded-3xl">
            <div className="flex items-center gap-3">
              <img src={item.owner_avatar} className="w-12 h-12 rounded-full border-2 border-green-500" />
              <div>
                <p className="font-bold text-gray-900">{item.owner_name}</p>
                <p className="text-xs text-gray-400">Trusted Lender</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-green-800">Rs. {item.price_per_day}</p>
              <p className="text-xs text-gray-400">per day</p>
            </div>
          </div>

          <button className="w-full bg-green-900 text-white py-4 rounded-full font-bold text-lg hover:bg-green-800 transition-all shadow-xl shadow-green-100">
            Request to Borrow
          </button>
        </div>
      </div>
    </div>
  );
}