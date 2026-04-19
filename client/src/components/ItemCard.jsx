import { Star, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom"; // 1. Import Link

export default function ItemCard({ item }) {
  return (
    // 2. Wrap the entire card in a Link tag pointing to the unique item ID
    <Link to={`/item/${item.item_id}`} className="block group">
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full">
        {/* Image Container */}
        <div className="relative h-56 w-full overflow-hidden">
          <img 
            src={item.image_url || 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?auto=format&fit=crop&q=80&w=600'} 
            alt={item.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {item.is_urgent && (
            <div className="absolute top-4 right-4 bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
              Urgent
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">{item.title}</h3>
              <p className="text-gray-400 text-xs">by {item.owner_name || "Owner"}</p>
            </div>
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold">4.8</span>
            </div>
          </div>

          {/* Location & Time Tags */}
          <div className="flex items-center gap-4 text-gray-400 text-xs">
            <div className="flex items-center gap-1">
              <MapPin size={12} />
              <span>{item.district || "Colombo"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>Today</span>
            </div>
          </div>

          {/* Price and Action */}
          <div className="flex justify-between items-center pt-2">
            <div className="flex items-baseline">
              <span className="text-green-800 text-xl font-black">Rs.{item.price_per_day}</span>
              <span className="text-gray-400 text-xs font-medium">/day</span>
            </div>
            <span className="bg-green-900 text-white px-6 py-2 rounded-full font-bold text-sm group-hover:bg-green-800 transition-colors">
              Rent
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}