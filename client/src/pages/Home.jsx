import React, { useState } from 'react';
import { MapPin, Zap, ArrowRight, ShieldCheck, Leaf, Users } from 'lucide-react';

const categories = ["All", "Tools", "Electronics", "Camping", "Garden", "Kitchen"];

const Home = () => {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="flex-grow bg-eco-light">
      {/* 1. HERO SECTION — Clean & Bold */}
      <main className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 bg-eco-green/10 text-eco-green px-4 py-2 rounded-full mb-8">
          <Leaf size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Sustainable Sharing in Colombo</span>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-[1.05] mb-8 tracking-tighter">
          Borrow what you need, <br />
          <span className="text-eco-green">Lend what you don't.</span>
        </h1>
        
        <p className="text-xl text-gray-500 mb-12 max-w-2xl font-medium leading-relaxed">
          Join <b>EcoLend</b> to share tools, electronics, and resources with your neighbors. 
          Save money, reduce waste, and build a stronger community.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <button className="bg-eco-green text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-eco-green/20 hover:-translate-y-1 transition-all flex items-center gap-2">
            Start Browsing <ArrowRight size={20} />
          </button>
          <button className="bg-white text-gray-900 border-2 border-gray-100 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all">
            How it Works
          </button>
        </div>
      </main>

      {/* 2. STATS / FEATURES BAR */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard icon={<Users className="text-eco-green" />} title="Local First" desc="Find items right in your neighborhood." />
          <FeatureCard icon={<Zap className="text-eco-green" />} title="AI Powered" desc="Smart descriptions generate in seconds." />
          <FeatureCard icon={<ShieldCheck className="text-eco-green" />} title="Secure" desc="Verified neighbors and community trust." />
        </div>
      </div>

      {/* 3. MARKETPLACE SECTION */}
      <section className="bg-white rounded-t-[4rem] py-20 shadow-2xl shadow-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Recent Listings</h2>
              <p className="text-gray-500 font-medium mt-1">Available to borrow today</p>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                    activeTab === cat 
                    ? "bg-eco-green text-white shadow-lg shadow-eco-green/20" 
                    : "bg-eco-light text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Item Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <ItemCard 
              title="Bosch Power Drill" 
              price="Free" 
              dist="0.8 km" 
              img="https://images.unsplash.com/photo-1504148455328-497c596d229f?auto=format&fit=crop&q=80&w=500"
            />
            <ItemCard 
              title="Camping Tent (4 Person)" 
              price="Rs. 500/day" 
              dist="2.1 km" 
              img="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=500"
            />
            <ItemCard 
              title="Electric Pressure Washer" 
              price="Rs. 800/day" 
              dist="1.4 km" 
              img="https://images.unsplash.com/photo-1589310621372-5bb876d0937a?auto=format&fit=crop&q=80&w=500"
            />
            <ItemCard 
              title="Kitchen Stand Mixer" 
              price="Free" 
              dist="3.5 km" 
              img="https://images.unsplash.com/photo-1594385208974-2e75f9d3bb4a?auto=format&fit=crop&q=80&w=500"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper Components
const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-[2rem] border border-gray-100 flex items-start gap-4 hover:shadow-xl hover:shadow-eco-green/5 transition-all group">
    <div className="w-12 h-12 rounded-2xl bg-eco-light flex items-center justify-center shrink-0 group-hover:bg-eco-green group-hover:text-white transition-colors">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

const ItemCard = ({ title, price, dist, img }) => (
  <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-eco-green/10 transition-all duration-500 cursor-pointer flex flex-col h-full">
    <div className="relative h-60 overflow-hidden">
      <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-eco-green border border-white">
        {price}
      </div>
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h3 className="font-black text-gray-900 leading-tight text-xl mb-2">{title}</h3>
      <div className="flex items-center gap-1 text-gray-400 text-xs font-bold uppercase tracking-wider mb-6">
        <MapPin size={14} className="text-eco-green" /> {dist} away
      </div>
      <button className="mt-auto w-full py-4 bg-eco-light text-eco-green font-black text-sm rounded-2xl group-hover:bg-eco-green group-hover:text-white transition-all transform active:scale-95">
        Request to Borrow
      </button>
    </div>
  </div>
);

export default Home;