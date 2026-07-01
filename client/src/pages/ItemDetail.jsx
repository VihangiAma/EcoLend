import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, ShieldCheck, ArrowLeft, Star, Calendar, MessageSquare, Info } from 'lucide-react';
import API from '../api/axios';
import { useLanguage } from '../contexts/LanguageContext';

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await API.get(`/items/${id}`);
        setItem(res.data);
      } catch (err) { 
        console.error("Error fetching item details:", err); 
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const startNegotiationChat = async () => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      alert("Please login to chat");
      navigate("/login");
      return;
    }
    
    const currentUser = JSON.parse(userData);
    
    if (!item || !item.owner_id) {
      alert("Item owner information not available");
      return;
    }

    if (currentUser.id === item.owner_id) {
      alert("You cannot chat with yourself");
      return;
    }

    setChatLoading(true);
    try {
      console.log('Starting chat with:', { peer_id: item.owner_id, item_id: id });
      console.log('Current user:', currentUser);
      
      const token = localStorage.getItem('token');
      console.log('Token in storage:', token ? `${token.substring(0, 20)}...` : 'NOT FOUND');
      
      // Create or get conversation
      const res = await API.post('/messages/create-conversation', {
        peer_id: item.owner_id,
        item_id: id
      });
      
      console.log('✅ Conversation created:', res.data);
      const conversationId = res.data.conversationId;
      navigate(`/messages`, { state: { selectedConversation: conversationId } });
    } catch (err) {
      console.error('❌ Full error response:', {
        status: err.response?.status,
        error: err.response?.data?.error,
        details: err.response?.data?.details,
        message: err.message
      });
      alert(`Failed to start chat: ${err.response?.data?.error || err.message}`);
    } finally {
      setChatLoading(false);
    }
  };

  // ✅ Localized Loading View Container Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center p-10">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#005A36] border-t-transparent mx-auto" />
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            {t('loadingAsset') || "Loading asset specifications..."}
          </p>
        </div>
      </div>
    );
  }

  //Logic to handle if the item is not found or has been deleted
  if (!item) {
    return (
      <div className="min-h-screen bg-[#f4f6f8] flex items-center justify-center p-10">
        <div className="bg-white p-8 rounded-3xl border border-gray-200 text-center max-w-sm shadow-sm space-y-4">
          <Info size={40} className="text-amber-600 mx-auto" />
          <h2 className="text-xl font-black text-gray-900">{t('assetNotFound') || "Asset Not Found"}</h2>
          <p className="text-xs text-gray-500 font-medium">
            {t('assetNotFoundDesc') || "This item listing may have been unlisted, rented out, or deleted from the EcoLend ecosystem database pool."}
          </p>
          <button 
            onClick={() => navigate('/')} 
            className="w-full bg-[#005A36] text-white py-3 rounded-xl text-xs font-bold hover:bg-black transition-all"
          >
            {t('backToBrowse')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-gray-900 pb-16">
      {/* Top Breadcrumb Header Context */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-gray-500 hover:text-[#005A36] transition-colors"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> 
            {t('backToBrowse')}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column Canvas: Product Media Display Showcase */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-3xl overflow-hidden border border-gray-200 bg-white shadow-sm group">
              <img 
  src={item.image_url || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop"} 
  className="w-full h-64 object-cover rounded-2xl"
  alt={item.title || "Rental Item"} 
/>
            </div>
          </div>

          {/* Right Column Specification Feed: Details & Logistics Matrix */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Meta Headers */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <span className="inline-block bg-emerald-100/70 border border-emerald-200 text-[#005A36] px-4 py-1 rounded-md text-[10px] font-black uppercase tracking-widest">
                {item.category || t('unclassifiedAsset')}
              </span>
              
              <h1 className="text-3xl sm:text-4xl font-black text-gray-950 tracking-tight leading-tight">
                {item.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-gray-100 text-gray-500 text-xs font-semibold">
                <div className="flex items-center gap-1.5 text-gray-800">
                  <MapPin size={16} className="text-[#005A36]" /> 
                  <span>{item.location_name || "Western Province, LK"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={16} className="text-amber-400 fill-amber-400" /> 
                  <span className="text-gray-800">4.9</span>
                  <span className="text-gray-400">(12 {t('reviews') || "Platform Reviews"})</span>
                </div>
              </div>
            </div>

            {/* AI Prompt Generated Specification Box */}
            <div className="p-6 sm:p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-bl-xl border-l border-b border-gray-200/40">
                {t('aiInsightSystem') || "AI Insight System"}
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider text-gray-400 mb-3">{t('assetDesc') || "Asset Description"}</h3>
              <p className="text-gray-700 leading-relaxed text-sm font-medium italic">
                "{item.description || t('noDescription')}"
              </p>
            </div>

            {/* Pricing, Verification Status Matrix, & Account Parameters Mapping Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img 
                  src={item.owner_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.owner_name || 'Lender')}&background=005A36&color=fff`} 
                  alt={item.owner_name || "Lender Profile Image"}
                  className="w-14 h-14 rounded-xl border-2 border-gray-100 shadow-xs object-cover" 
                />
                <div>
                  <p className="font-black text-gray-950 text-base">{item.owner_name || t('verifiedMember')}</p>
                  <p className="text-[11px] text-[#005A36] font-bold flex items-center gap-1 mt-0.5">
                    <ShieldCheck size={14} /> {t('verifiedLender')}[cite: 1]
                  </p>
                </div>
              </div>
              
              <div className="sm:text-right w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                <span className="text-[10px] block font-black text-gray-400 uppercase tracking-wider">{t('rentalValue') || "Rental Value"}</span>
                <span className="text-2xl font-black text-[#005A36]">
                  Rs. {item.price_per_day ? Number(item.price_per_day).toLocaleString() : "0"}
                </span>
                <span className="text-[10px] text-gray-500 font-extrabold uppercase tracking-wider block">{t('perDayRate') || "/ Per Day Rate"}</span>
              </div>
            </div>

            {/* Platform Operational Flow Actions Container */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <button className="sm:col-span-3 w-full bg-[#005A36] hover:bg-[#004227] text-white py-4 px-6 rounded-xl font-extrabold text-sm tracking-wide transition-all active:scale-[0.99] shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2">
                <Calendar size={16} /> {t('requestBorrow')}[cite: 1]
              </button>
              <button 
                onClick={startNegotiationChat}
                disabled={chatLoading || !item}
                className="sm:col-span-1 w-full bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 py-4 px-4 rounded-xl font-extrabold text-sm transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              >
                <MessageSquare size={16} className="text-gray-400" /> 
                {chatLoading ? "..." : t('chatBtn')}[cite: 1]
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}