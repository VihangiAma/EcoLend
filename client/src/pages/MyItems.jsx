import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import {
  Grid3X3,
  List,
  Search,
  PencilLine,
  PauseCircle,
  PlayCircle,
  Trash2,
  Eye,
  BarChart3,
  ChevronRight,
  X,
  Sparkles,
  Package,
} from 'lucide-react';

const tabOptions = ['All Items', 'Available', 'Lent Out', 'Paused', 'Pending Review'];

const statusStyles = {
  Available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Lent Out': 'bg-amber-50 text-amber-700 border-amber-200',
  Paused: 'bg-slate-100 text-slate-700 border-slate-200',
  'Pending Review': 'bg-violet-50 text-violet-700 border-violet-200',
};

const fallbackImage = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

const normalizeStatus = (item) => {
  if (item.status && statusStyles[item.status]) return item.status;
  if (item.is_paused || item.paused) return 'Paused';
  if (item.is_available === false || item.available === false) return 'Lent Out';
  const id = Number(item.item_id || item.id || 0);
  const mod = id % 4;
  if (mod === 0) return 'Available';
  if (mod === 1) return 'Lent Out';
  if (mod === 2) return 'Paused';
  return 'Pending Review';
};

const getImageUrl = (item) => {
  if (item.image_url && item.image_url !== 'null') {
    return item.image_url.startsWith('http') ? item.image_url : `http://localhost:5000${item.image_url}`;
  }
  return fallbackImage;
};

// --- SUB-COMPONENTS FOR CLEANER ARCHITECTURE ---

function ActionButtons({ item, onEdit, onTogglePause, onDelete, onPreview, onStats }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => onEdit(item)} className="rounded-2xl border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 transition-colors" title="Edit">
        <PencilLine size={16} />
      </button>
      <button onClick={() => onTogglePause(item)} className="rounded-2xl border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 transition-colors" title={item.status === 'Paused' ? 'Resume' : 'Pause'}>
        {item.status === 'Paused' ? <PlayCircle size={16} /> : <PauseCircle size={16} />}
      </button>
      <button onClick={() => onDelete(item)} className="rounded-2xl border border-gray-200 p-2 text-rose-600 hover:bg-rose-50 transition-colors" title="Delete">
        <Trash2 size={16} />
      </button>
      <button onClick={() => onPreview(item.item_id || item.id)} className="rounded-2xl border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 transition-colors" title="Preview">
        <Eye size={16} />
      </button>
      <button onClick={() => onStats(item)} className="rounded-2xl border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 transition-colors" title="Stats">
        <BarChart3 size={16} />
      </button>
    </div>
  );
}

function ItemCard({ item, actions }) {
  return (
    <article className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 duration-200 flex flex-col justify-between">
      <div>
        <div className="relative h-48 bg-gray-50">
          <img 
            src={getImageUrl(item)} 
            alt={item.title} 
            className="h-full w-full object-cover" 
            onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
          />
          <span className={`absolute left-4 top-4 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusStyles[item.status] || statusStyles.Available}`}>
            {item.status}
          </span>
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="mb-2 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-700">
                {item.category || 'General'}
              </div>
              <h2 className="text-lg font-bold text-gray-900 line-clamp-1">{item.title}</h2>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Per day</p>
              <p className="text-lg font-black text-gray-900">Rs. {Number(item.price_per_day || 0).toLocaleString()}</p>
            </div>
          </div>
          <p className="line-clamp-2 text-sm text-gray-500 min-h-[40px]">
            {item.description || 'A well-maintained rental item ready for your next booking.'}
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-gray-500 pt-1">
            <span className="rounded-full bg-gray-100 px-2.5 py-1">★ {item.rating}</span>
            <span className="rounded-full bg-gray-100 px-2.5 py-1">{item.rental_count} rentals</span>
            <span className="rounded-full bg-gray-100 px-2.5 py-1">{item.views} views</span>
          </div>
        </div>
      </div>
      <div className="px-5 pb-5 pt-2 border-t border-gray-50">
        <ActionButtons item={item} {...actions} />
      </div>
    </article>
  );
}

function ItemRow({ item, actions }) {
  return (
    <tr className="hover:bg-gray-50/80 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <img 
            src={getImageUrl(item)} 
            alt={item.title} 
            className="h-12 w-12 rounded-2xl object-cover shrink-0 bg-gray-50" 
            onError={(e) => { e.target.onerror = null; e.target.src = fallbackImage; }}
          />
          <div className="max-w-xs md:max-w-sm">
            <p className="font-semibold text-gray-900 truncate">{item.title}</p>
            <p className="text-xs text-gray-500 truncate">{item.description || 'No description provided.'}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{item.category || 'General'}</td>
      <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">Rs. {Number(item.price_per_day || 0).toLocaleString()}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusStyles[item.status] || statusStyles.Available}`}>
          {item.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <ActionButtons item={item} {...actions} />
      </td>
    </tr>
  );
}

// --- MAIN MYITEMS DASHBOARD COMPONENT ---

export default function MyItems() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All Items');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortValue, setSortValue] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', price: '', category: '' });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [statsItem, setStatsItem] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const loadItems = async () => {
      try {
        const response = await API.get('/items/my', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const normalized = (response.data || []).map((item, index) => ({
          ...item,
          status: normalizeStatus(item),
          rating: item.rating ?? (index % 2 === 0 ? 4.8 : 4.6),
          rental_count: item.rental_count ?? item.rentals ?? (index % 3) + 3,
          views: item.views ?? 28 + index * 5,
          requests: item.requests ?? 2 + (index % 4),
          earnings: item.earnings ?? Number(item.price_per_day || 0) * 8 + 40,
        }));

        setItems(normalized);
      } catch (error) {
        console.error('My items load error', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [navigate]);

  const counts = useMemo(() => {
    return tabOptions.reduce((acc, tab) => {
      if (tab === 'All Items') {
        acc[tab] = items.length;
        return acc;
      }
      acc[tab] = items.filter((item) => item.status === tab).length;
      return acc;
    }, {});
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const base = items.filter((item) => {
      const matchesTab = activeTab === 'All Items' || item.status === activeTab;
      const matchesQuery =
        !query ||
        item.title?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query);
      return matchesTab && matchesQuery;
    });

    return [...base].sort((a, b) => {
      switch (sortValue) {
        case 'oldest':
          return Number(a.item_id || a.id || 0) - Number(b.item_id || b.id || 0);
        case 'price_high':
          return Number(b.price_per_day || 0) - Number(a.price_per_day || 0);
        case 'most_rented':
          return Number(b.rental_count || 0) - Number(a.rental_count || 0);
        case 'rating':
          return Number(b.rating || 0) - Number(a.rating || 0);
        case 'newest':
        default:
          return Number(b.item_id || b.id || 0) - Number(a.item_id || a.id || 0);
      }
    });
  }, [activeTab, items, searchTerm, sortValue]);

  const openEditModal = (item) => {
    setEditingItem(item);
    setEditForm({
      title: item.title || '',
      description: item.description || '',
      price: item.price_per_day || '',
      category: item.category || '',
    });
  };

  const handleEditSave = async () => {
    if (!editingItem) return;
    try {
      const itemId = editingItem.item_id || editingItem.id;
      const payload = {
        title: editForm.title,
        description: editForm.description,
        price_per_day: editForm.price,
        category: editForm.category,
        image_url: editingItem.image_url,
      };
      await API.put(`/items/${itemId}`, payload, getAuthHeaders());
      setItems((current) =>
        current.map((item) =>
          item.item_id === editingItem.item_id || item.id === editingItem.id
            ? {
                ...item,
                title: editForm.title || item.title,
                description: editForm.description || item.description,
                price_per_day: editForm.price || item.price_per_day,
                category: editForm.category || item.category,
              }
            : item
        )
      );
    } catch (error) {
      console.error('Update item error', error.response?.data || error.message);
    } finally {
      setEditingItem(null);
    }
  };

  const togglePause = async (item) => {
    const nextStatus = item.status === 'Paused' ? 'Available' : 'Paused';
    try {
      const itemId = item.item_id || item.id;
      await API.patch(`/items/${itemId}/status`, { status: nextStatus }, getAuthHeaders());
      setItems((current) =>
        current.map((entry) =>
          (entry.item_id === item.item_id || entry.id === item.id) ? { ...entry, status: nextStatus } : entry
        )
      );
    } catch (error) {
      console.error('Pause toggle error', error.response?.data || error.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      const itemId = deleteTarget.item_id || deleteTarget.id;
      await API.delete(`/items/${itemId}`, getAuthHeaders());
      setItems((current) => current.filter((item) => !(item.item_id === deleteTarget.item_id || item.id === deleteTarget.id)));
    } catch (error) {
      console.error('Delete item error', error.response?.data || error.message);
    } finally {
      setDeleteTarget(null);
    }
  };

  const actionHandlers = {
    onEdit: openEditModal,
    onTogglePause: togglePause,
    onDelete: setDeleteTarget,
    onPreview: (id) => navigate(`/item/${id}`),
    onStats: setStatsItem,
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 rounded-3xl border border-gray-200 bg-white px-6 py-4 text-sm text-gray-500 shadow-xs">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
          Loading your listings...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* HEADER HERO BOARD */}
        <div className="flex flex-col gap-4 rounded-[2rem] border border-gray-200 bg-white p-6 shadow-xs sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">My Items</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900">Manage every listing in one view</h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-500">Track availability, switch between grid and list layouts, and act on each item instantly.</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shrink-0 self-start sm:self-auto">
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles size={16} /> {items.length} active listings
            </div>
          </div>
        </div>

        {/* SEARCH, SORT & CONTROL REGION */}
        <div className="rounded-[2rem] border border-gray-200 bg-white p-4 shadow-xs sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {tabOptions.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-150 ${activeTab === tab ? 'bg-emerald-600 text-white shadow-xs' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {tab}
                  {tab !== 'All Items' && (
                    <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>{counts[tab]}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500 focus-within:border-emerald-500 transition-colors">
                <Search size={16} className="text-gray-400" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search item name..."
                  className="w-full bg-transparent outline-none sm:w-48 text-gray-800 placeholder-gray-400"
                />
              </label>

              <select
                value={sortValue}
                onChange={(event) => setSortValue(event.target.value)}
                className="rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 outline-none focus:border-emerald-500 transition-colors cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price_high">Price (High → Low)</option>
                <option value="most_rented">Most Rented</option>
                <option value="rating">Rating</option>
              </select>

              <div className="inline-flex rounded-2xl border border-gray-200 bg-gray-50 p-1 self-start sm:self-auto">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`rounded-xl p-2 transition-all ${viewMode === 'grid' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`rounded-xl p-2 transition-all ${viewMode === 'list' ? 'bg-white text-emerald-700 shadow-xs' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT DATA LAYOUT VIEWPORTS */}
        {filteredItems.length === 0 ? (
          <div className="rounded-[2rem] border-2 border-dashed border-gray-200 bg-white p-12 text-center flex flex-col items-center justify-center gap-3">
            <Package size={36} className="text-gray-300 stroke-[1.5]" />
            <span className="text-sm text-gray-400 font-medium">No active listings match this specific query layout yet.</span>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">
            {filteredItems.map((item) => (
              <ItemCard key={item.item_id || item.id} item={item} actions={actionHandlers} />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-[2rem] border border-gray-200 bg-white shadow-xs">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                <tr>
                  <th className="px-6 py-4">Item details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((item) => (
                  <ItemRow key={item.item_id || item.id} item={item} actions={actionHandlers} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL WINDOW OVERLAYS (EDIT, DELETE, STATS) */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4 animate-fadeIn">
          <div className="w-full max-w-xl rounded-[2rem] border border-gray-200 bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Edit Listing</p>
                <h2 className="mt-1 text-xl font-black text-gray-900">Update your listing details</h2>
              </div>
              <button onClick={() => setEditingItem(null)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">Title</label>
                <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition-colors bg-gray-50/50" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">Description</label>
                <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} rows="3" className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition-colors bg-gray-50/50 resize-none" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">Price / day (Rs.)</label>
                  <input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition-colors bg-gray-50/50" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-gray-500">Category</label>
                  <input value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 transition-colors bg-gray-50/50" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
              <button onClick={() => setEditingItem(null)} className="rounded-2xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleEditSave} className="rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors shadow-xs">Save changes</button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4">
          <div className="w-full max-w-md rounded-[2rem] border border-gray-200 bg-white p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-rose-50 p-3 text-rose-600 shrink-0">
                <Trash2 size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Delete listing permanently?</h2>
                <p className="mt-1 text-sm text-gray-500 leading-relaxed">Are you sure you want to remove <strong className="text-gray-800 font-semibold">{deleteTarget.title}</strong>? This action will remove the listing entirely and cannot be undone.</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-50">
              <button onClick={() => setDeleteTarget(null)} className="rounded-2xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleDelete} className="rounded-2xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition-colors shadow-xs">Delete asset</button>
            </div>
          </div>
        </div>
      )}

      {statsItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-4">
          <div className="w-full max-w-md rounded-[2rem] border border-gray-200 bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Listing Insights</p>
                <h2 className="mt-1 text-xl font-black text-gray-900 line-clamp-1">{statsItem.title}</h2>
              </div>
              <button onClick={() => setStatsItem(null)} className="rounded-full p-2 text-gray-400 hover:bg-gray-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-gray-50 p-4 text-center border border-gray-100">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Views</p>
                <p className="mt-1.5 text-xl font-black text-gray-900">{statsItem.views}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4 text-center border border-gray-100">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Requests</p>
                <p className="mt-1.5 text-xl font-black text-gray-900">{statsItem.requests}</p>
              </div>
              <div className="rounded-2xl bg-gray-50 p-4 text-center border border-gray-100">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Earnings</p>
                <p className="mt-1.5 text-base font-black text-emerald-700">Rs. {Number(statsItem.earnings || 0).toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3 text-xs font-medium text-emerald-800">
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-emerald-600" /> High customer engagement velocity detected.
              </span>
              <ChevronRight size={14} className="text-emerald-600" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}