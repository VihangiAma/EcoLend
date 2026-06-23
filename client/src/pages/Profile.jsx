import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import {
  Camera,
  Edit3,
  Medal,
  ShieldCheck,
  Sparkles,
  Trash2,
  UserCheck,
  ArrowRight,
  Check,
  Clock3,
  Star,
} from 'lucide-react';

const badges = [
  { title: 'Carbon Saver', tone: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: Sparkles },
  { title: 'Super Lender', tone: 'bg-green-50 text-green-700 border-green-100', icon: ShieldCheck },
  { title: 'Community Hero', tone: 'bg-amber-50 text-amber-700 border-amber-100', icon: Medal },
];

const statusClass = {
  Available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Lent: 'bg-amber-50 text-amber-700 border-amber-200',
  Maintenance: 'bg-rose-50 text-rose-700 border-rose-200',
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Returned: 'bg-gray-100 text-gray-600 border-gray-200',
  Completed: 'bg-gray-100 text-gray-600 border-gray-200',
  'In use': 'bg-amber-50 text-amber-700 border-amber-200',
};

const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);
const validatePhone = (value) => /^\+?[0-9]{9,15}$/.test(value);

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [ledger] = useState({
    borrowed: [
      { id: 1, name: 'Garden Power Washer', date: 'Jun 14, 2026', counterparty: 'Lina Patel', status: 'Returned' },
      { id: 2, name: 'Record Player', date: 'May 28, 2026', counterparty: 'Noel Singh', status: 'In use' },
    ],
    lent: [
      { id: 1, name: 'Camping Lantern', date: 'Jun 10, 2026', counterparty: 'Mira Fernando', status: 'Active' },
      { id: 2, name: 'Electric Drill', date: 'May 22, 2026', counterparty: 'Ashan Kumar', status: 'Completed' },
    ],
  });
  const [editMode, setEditMode] = useState(false);
  const [formState, setFormState] = useState({ fullName: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [uploadPreview, setUploadPreview] = useState('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80');
  const [optimisticSaving, setOptimisticSaving] = useState(false);
  const [hoveringAvatar, setHoveringAvatar] = useState(false);
  const [loading, setLoading] = useState(true);

  const activeInventory = useMemo(() => inventory, [inventory]);
  const tabs = ['Overview', 'My Inventory', 'Transaction Ledger'];

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const [profileRes, itemsRes] = await Promise.all([
          API.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
          API.get('/items/my', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const profile = profileRes.data.user;
        const avatarUrl = profile.profile_img_url
          ? profile.profile_img_url.startsWith('http')
            ? profile.profile_img_url
            : `http://localhost:5000${profile.profile_img_url}`
          : uploadPreview;

        setUser({
          avatar: avatarUrl,
          fullName: profile.fullName || profile.name || 'EcoLend Member',
          location: profile.location || 'Colombo',
          memberSince: profile.memberSince || 'Feb 2025',
          ecoScore: profile.ecoScore || 4.8,
          transactions: profile.transactions || 20,
          verified: profile.verified ?? true,
          bio: profile.bio || 'Sharing responsibly and building community.',
          email: profile.email || '',
          phone: profile.phone || '',
        });

        setFormState({ fullName: profile.fullName || profile.name || '', email: profile.email || '', phone: profile.phone || '' });
        setUploadPreview(avatarUrl);
        setInventory(itemsRes.data || []);
      } catch (err) {
        console.error('Profile load error', err.response?.data || err.message);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleAvatarUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploadPreview(reader.result);
      setUser((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleInventoryStatus = (id, nextStatus) => {
    setInventory((current) =>
      current.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
    );
  };

  const handleDeleteItem = (id) => {
    setInventory((current) => current.filter((item) => item.id !== id));
  };

  const handleFormChange = (key, value) => {
    setFormState((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
  };

  const handleSave = async () => {
    const nextErrors = {};
    if (!formState.fullName.trim()) nextErrors.fullName = 'Name is required.';
    if (!validateEmail(formState.email)) nextErrors.email = 'Enter a valid email.';
    if (!validatePhone(formState.phone)) nextErrors.phone = 'Enter a valid phone number.';

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setOptimisticSaving(true);
    setUser((current) => ({ ...current, ...formState }));

    try {
      const res = await API.put(
        '/auth/me',
        { full_name: formState.fullName, email: formState.email, phone: formState.phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const profile = res.data.user;
      const avatarUrl = user?.avatar || uploadPreview;
      const updatedUser = {
        ...user,
        avatar: avatarUrl,
        fullName: profile.fullName || profile.name || formState.fullName,
        email: profile.email,
        phone: profile.phone,
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify({ ...updatedUser, profile_img_url: avatarUrl }));
    } catch (err) {
      console.error('Update profile error', err.response?.data || err.message);
      setErrors({ general: err.response?.data?.error || 'Failed to save changes.' });
    } finally {
      setOptimisticSaving(false);
      setEditMode(false);
    }
  };

  const handleCancel = () => {
    if (user) setFormState({ fullName: user.fullName, email: user.email, phone: user.phone });
    setErrors({});
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 text-gray-500">
        <div className="space-y-2 text-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#005A36] border-t-transparent mx-auto" />
          <p className="text-sm">Loading your EcoLend profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <section className="min-h-screen bg-gray-50 text-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        
        {/* Profile Info Row */}
        <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <img
                    src={uploadPreview}
                    alt="Profile avatar"
                    className="h-24 w-24 rounded-full object-cover border border-gray-100 shadow-sm"
                    onMouseEnter={() => setHoveringAvatar(true)}
                    onMouseLeave={() => setHoveringAvatar(false)}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 text-white transition-all duration-300 ${
                      hoveringAvatar ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <Camera size={16} className="mr-1" />
                    Edit
                  </label>
                  <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </div>

                <div className="space-y-1">
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900">{user.fullName}</h1>
                  <div className="flex flex-col gap-1 text-sm text-gray-500">
                    <span>{user.location}</span>
                    <span className="inline-flex items-center gap-1.0 mt-1 text-xs text-gray-400">
                      <Clock3 size={12} /> Member since {user.memberSince}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Block */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Eco-Score</p>
                  <div className="mt-2 flex items-center justify-center gap-1 text-2xl font-bold text-gray-900">
                    <Star className="fill-amber-400 text-amber-400" size={20} /> {user.ecoScore}
                  </div>
                  <p className="mt-1 text-xs text-gray-400">{user.transactions}+ exchanges</p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Verification</p>
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
                    <UserCheck size={14} /> Verified Member
                  </div>
                  <p className="mt-1 text-xs text-gray-400">Community approved account</p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Bio</p>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">{user.bio}</p>
              
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {badges.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <div key={badge.title} className={`flex items-center justify-center gap-2 rounded-xl border p-3 ${badge.tone}`}>
                      <Icon size={16} />
                      <span className="text-xs font-medium">{badge.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Configuration Form Card */}
          <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900">Account Details</h2>
            <p className="text-xs text-gray-400 mt-0.5">Keep your transaction details current</p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Full Name</label>
                <input
                  value={formState.fullName}
                  onChange={(e) => handleFormChange('fullName', e.target.value)}
                  disabled={!editMode}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-[#005A36] disabled:bg-gray-50 disabled:text-gray-400"
                />
                {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email Address</label>
                <input
                  value={formState.email}
                  onChange={(e) => handleFormChange('email', e.target.value)}
                  disabled={!editMode}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-[#005A36] disabled:bg-gray-50 disabled:text-gray-400"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Phone Number</label>
                <input
                  value={formState.phone}
                  onChange={(e) => handleFormChange('phone', e.target.value)}
                  disabled={!editMode}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-all focus:border-[#005A36] disabled:bg-gray-50 disabled:text-gray-400"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                {!editMode ? (
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50"
                  >
                    <Edit3 size={14} /> Modify Data
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={optimisticSaving}
                      className="inline-flex items-center gap-1 rounded-full bg-[#005A36] px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:opacity-90"
                    >
                      <Check size={14} /> {optimisticSaving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-500 transition-all hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Segmented Tab Interface */}
        <div className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Activity Hub</h2>
            </div>
            <div className="flex flex-wrap gap-1.5 bg-gray-100 p-1 rounded-full">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            {activeTab === 'Overview' && (
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Milestone Badges</p>
                  <div className="space-y-2">
                    {badges.map((badge) => {
                      const Icon = badge.icon;
                      return (
                        <div key={badge.title} className={`flex items-center gap-3 rounded-xl border p-3 bg-white`}>
                          <div className="rounded-lg bg-gray-50 p-2 text-gray-600">
                            <Icon size={16} />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-900">{badge.title}</p>
                            <p className="text-[10px] text-gray-400">System verified reward</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-5 lg:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Performance Insights</p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                      <p className="text-xs text-gray-400">Aggregated Score</p>
                      <p className="mt-2 text-2xl font-bold text-gray-900">{user.ecoScore} / 5.0</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                      <p className="text-xs text-gray-400">Total Asset Base</p>
                      <p className="mt-2 text-2xl font-bold text-gray-900">{inventory.length} Listed</p>
                    </div>
                    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                      <p className="text-xs text-gray-400">Active Pipeline</p>
                      <p className="mt-2 text-2xl font-bold text-gray-900">{user.transactions} Items</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'My Inventory' && (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {activeInventory.map((item) => (
                  <article key={item.id} className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5">
                    <div className="relative">
                      <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
                      <span className={`absolute left-3 top-3 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusClass[item.status]}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">{item.subtitle || 'by Sumudu Silva'}</p>
                      </div>
                      <div className="flex items-center gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => handleInventoryStatus(item.id, item.status === 'Available' ? 'Maintenance' : 'Available')}
                          className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 shadow-sm transition-all hover:bg-gray-50"
                        >
                          <ArrowRight size={12} /> Toggle
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-600 transition-all hover:bg-rose-100"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {activeTab === 'Transaction Ledger' && (
              <div className="grid gap-6 xl:grid-cols-2">
                {/* Borrowed Panel */}
                <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">Items Borrowed</h3>
                    <span className="rounded-full bg-amber-50 border border-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">In Progress</span>
                  </div>
                  <div className="space-y-3">
                    {ledger.borrowed.map((entry) => (
                      <div key={entry.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-gray-200">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-[10px] text-gray-400">{entry.date}</p>
                            <p className="text-sm font-bold text-gray-900 mt-0.5">{entry.name}</p>
                          </div>
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusClass[entry.status]}`}>
                            {entry.status}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-gray-400">Lender contact: {entry.counterparty}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lent Panel */}
                <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">Items Lent</h3>
                    <span className="rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">Completed</span>
                  </div>
                  <div className="space-y-3">
                    {ledger.lent.map((entry) => (
                      <div key={entry.id} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-gray-200">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-[10px] text-gray-400">{entry.date}</p>
                            <p className="text-sm font-bold text-gray-900 mt-0.5">{entry.name}</p>
                          </div>
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusClass[entry.status]}`}>
                            {entry.status}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-gray-400">Borrower contact: {entry.counterparty}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}