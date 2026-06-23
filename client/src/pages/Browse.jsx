import { useState, useEffect } from 'react';
import { SlidersHorizontal, MapPin, Star, RotateCcw } from 'lucide-react';
import API from '../api/axios';

const categories = ['All', 'Photography', 'Appliances', 'Electronics', 'Camping', 'Tools'];

export default function Browse() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState('relevance');

  // Fetch filtered items directly from your backend API router
  useEffect(() => {
    const fetchFilteredItems = async () => {
      try {
        setLoading(true);
        
        const params = new URLSearchParams();
        if (selectedCategory) params.append('category', selectedCategory);
        if (maxPrice) params.append('maxPrice', maxPrice);
        if (sortBy) params.append('sortBy', sortBy);

        const res = await API.get(`/items/all?${params.toString()}`);
        setItems(res.data);
      } catch (err) {
        console.error('Error fetching data from browse endpoint:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredItems();
  }, [selectedCategory, maxPrice, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setMaxPrice(5000);
    setSortBy('relevance');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-gray-950 tracking-tight">Explore Marketplace</h1>
            <p className="text-sm text-gray-500 mt-0.5">Premium gear ready to rent from community members</p>
          </div>
          
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <span className="text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl hidden md:inline">
              {items.length} options available
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-2.5 text-xs font-bold text-gray-700 outline-none cursor-pointer focus:border-[#005A36] focus:bg-white transition-all shadow-xs"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Dual Column Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
          
          {/* Filters Sidebar */}
          <aside className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6 lg:sticky lg:top-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 inline-flex items-center gap-2">
                <SlidersHorizontal size={14} /> Workspace Filters
              </h2>
              <button 
                onClick={handleResetFilters}
                className="text-xs font-bold text-[#005A36] flex items-center gap-1 hover:opacity-80 transition"
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400">Category</label>
              <div className="flex flex-col gap-1">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                      selectedCategory === category
                        ? 'bg-[#005A36] text-white shadow-sm font-bold scale-[1.01]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Slider */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Max Budget</label>
                <span className="text-xs font-bold text-gray-900">Rs.{maxPrice}/day</span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#005A36] bg-gray-100 h-1 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                <span>Rs.100</span>
                <span>Rs.5000+</span>
              </div>
            </div>
          </aside>

          {/* Results Dynamic Grid */}
          <main>
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#005A36] border-t-transparent" />
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white rounded-[2rem] border border-gray-100 p-16 text-center max-w-md mx-auto mt-6 shadow-xs">
                <p className="text-base font-bold text-gray-900">No items match filters</p>
                <p className="text-xs text-gray-400 mt-1">Try expanding your budget parameters or changing category filters.</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-5 inline-flex items-center gap-1.5 bg-[#005A36] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs hover:opacity-90 transition"
                >
                  Clear Active Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <article 
                    key={item.item_id} 
                    className="group relative bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                  >
                    {/* Image Wrapper Container */}
                    <div className="relative overflow-hidden m-3 rounded-[1.5rem] bg-gray-100 aspect-4/3">
                      <img 
                        src={item.image_url ? `http://localhost:5000${item.image_url}` : 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80'} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                      {/* Floating Pricing Pill Badge overlaying image */}
                      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-sm border border-gray-100">
                        <p className="text-xs font-black text-[#005A36]">
                          Rs.{parseFloat(item.price_per_day || 0).toFixed(0)}
                          <span className="text-[10px] text-gray-400 font-normal">/day</span>
                        </p>
                      </div>
                    </div>

                    {/* Metadata Details Area */}
                    <div className="px-5 pb-5 pt-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-base font-bold text-gray-900 tracking-tight line-clamp-1 group-hover:text-[#005A36] transition-colors">
                            {item.title}
                          </h3>
                          <span className="inline-flex items-center gap-0.5 text-xs font-bold text-gray-800 shrink-0 bg-amber-50 px-2 py-0.5 rounded-lg">
                            <Star className="fill-amber-400 text-amber-400" size={12} /> 
                            {item.rating || '4.8'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                          <MapPin size={13} className="text-gray-300" />
                          <span>{item.location_name || 'Colombo'}</span>
                        </div>
                      </div>

                      {/* Footer CTA and Owner Section */}
                      <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-50">
                        <div className="max-w-[60%]">
                          <p className="text-[10px] uppercase font-bold tracking-wider text-gray-300">Lender</p>
                          <p className="text-xs font-semibold text-gray-600 truncate">{item.owner_name || 'Member'}</p>
                        </div>
                        <button
                          type="button"
                          className="bg-[#005A36] hover:bg-[#004428] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-all active:scale-95 group-hover:px-5"
                        >
                          Rent Now
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}