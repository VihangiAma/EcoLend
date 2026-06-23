import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import {
  CheckCircle,
  Camera,
  CreditCard,
  Edit3,
  Grid,
  Medal,
  ShieldCheck,
  Sparkles,
  Trash2,
  User,
  UserCheck,
  Wallet,
  ArrowRight,
  Check,
  Clock3,
  Activity,
  Layers,
  Star,
} from 'lucide-react';

const badges = [
  { title: 'Carbon Saver', tone: 'bg-emerald-900/40 text-emerald-200', icon: Sparkles },
  { title: 'Super Lender', tone: 'bg-green-900/30 text-green-200', icon: ShieldCheck },
  { title: 'Community Hero', tone: 'bg-yellow-900/30 text-yellow-200', icon: Medal },
];

const initialInventory = [
  {
    id: 1,
    title: 'Premium Camping Tent',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=700&q=80',
    status: 'Available',
    subtitle: '4 person, weatherproof',
  },
  {
    id: 2,
    title: 'Professional DSLR Camera',
    image: 'https://images.unsplash.com/photo-1519183071298-a2962be90b7e?auto=format&fit=crop&w=700&q=80',
    status: 'Lent',
    subtitle: 'Canon EOS 5D Mark IV',
  },
  {
    id: 3,
    title: 'Electric Leaf Blower',
    image: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&w=700&q=80',
    status: 'Maintenance',
    subtitle: 'Battery-powered, 45 min run time',
  },
];

const initialLedger = {
  borrowed: [
    {
      id: 1,
      name: 'Garden Power Washer',
      date: 'Jun 14, 2026',
      counterparty: 'Lina Patel',
      status: 'Returned',
    },
    {
      id: 2,
      name: 'Record Player',
      date: 'May 28, 2026',
      counterparty: 'Noel Singh',
      status: 'In use',
    },
  ],
  lent: [
    {
      id: 1,
      name: 'Camping Lantern',
      date: 'Jun 10, 2026',
      counterparty: 'Mira Fernando',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Electric Drill',
      date: 'May 22, 2026',
      counterparty: 'Ashan Kumar',
      status: 'Completed',
    },
  ],
};

const statusClass = {
  Available: 'bg-emerald-500/15 text-emerald-200 border-emerald-300/20',
  Lent: 'bg-yellow-400/15 text-yellow-100 border-yellow-300/20',
  Maintenance: 'bg-red-500/10 text-red-200 border-red-400/20',
  Active: 'bg-emerald-500/15 text-emerald-200 border-emerald-300/20',
  Returned: 'bg-slate-600/35 text-slate-100 border-slate-500/20',
  Completed: 'bg-slate-500/25 text-slate-100 border-slate-500/20',
  'In use': 'bg-yellow-400/15 text-yellow-100 border-yellow-300/20',
};

const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);
const validatePhone = (value) => /^\+?[0-9]{9,15}$/.test(value);

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [ledger] = useState(initialLedger);
  const [editMode, setEditMode] = useState(false);
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});
  const [uploadPreview, setUploadPreview] = useState('https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80');
  const [optimisticSaving, setOptimisticSaving] = useState(false);
  const [deletedItem, setDeletedItem] = useState(null);
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
          location: profile.location || 'Your neighborhood',
          memberSince: profile.memberSince || 'Feb 2022',
          ecoScore: profile.ecoScore || 4.9,
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
      current.map((item) =>
        item.id === id ? { ...item, status: nextStatus } : item
      )
    );
  };

  const handleDeleteItem = (id) => {
    setDeletedItem(inventory.find((item) => item.id === id));
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
        {
          full_name: formState.fullName,
          email: formState.email,
          phone: formState.phone,
        },
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
    if (user) {
      setFormState({ fullName: user.fullName, email: user.email, phone: user.phone });
    }
    setErrors({});
    setEditMode(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1A1A1A] flex items-center justify-center px-4 text-slate-300">
        <div className="space-y-3 rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-2xl shadow-black/30">
          <div className="h-3 w-48 animate-pulse rounded-full bg-slate-600" />
          <p className="text-sm text-slate-400">Loading your EcoLend profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <section className="min-h-screen bg-[#1A1A1A] text-white py-8 px-4 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl shadow-black/30 transition-all duration-300">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <img
                    src={uploadPreview}
                    alt="Profile avatar"
                    className="h-28 w-28 rounded-full object-cover border-2 border-emerald-600/40 shadow-lg"
                    onMouseEnter={() => setHoveringAvatar(true)}
                    onMouseLeave={() => setHoveringAvatar(false)}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/45 text-white transition-all duration-300 ${
                      hoveringAvatar ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <Camera size={18} className="mr-2" />
                    Change Photo
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.4em] text-emerald-200/60">EcoLend Member</p>
                    <h1 className="text-4xl font-black tracking-tight text-white">{user.fullName}</h1>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                    <span>{user.location}</span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      <Clock3 size={14} /> Member since {user.memberSince}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 text-center shadow-inner shadow-black/20">
                  <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Eco-Score</p>
                  <div className="mt-4 flex items-center justify-center gap-2 text-4xl font-black text-emerald-100">
                    <Star className="text-yellow-400" /> {user.ecoScore}
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{user.transactions}+ community exchanges</p>
                </div>
                <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 text-center shadow-inner shadow-black/20">
                  <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Trust Badge</p>
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-900/20 px-4 py-2 text-sm font-semibold text-emerald-200">
                    <UserCheck size={18} /> Verified Member
                  </div>
                  <p className="mt-2 text-sm text-slate-400">Responsive, reliable, community-first.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[2rem] border border-white/10 bg-black/20 p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.4em] text-emerald-200/70">Bio</p>
                  <p className="mt-3 max-w-2xl text-slate-300 leading-7">{user.bio}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {badges.map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <div key={badge.title} className={`rounded-3xl border ${badge.tone} border-white/10 p-4 text-center`}>
                        <Icon className="mx-auto mb-3 text-xl" />
                        <p className="text-sm font-semibold text-slate-100">{badge.title}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl shadow-black/30">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Account Settings</p>
                <h2 className="mt-3 text-2xl font-black text-white">Manage profile</h2>
              </div>
              <div className="inline-flex rounded-full border border-white/10 bg-green-900/20 px-4 py-2 text-sm font-semibold text-emerald-200">
                Optimistic save enabled
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div className="grid gap-4">
                <div className="rounded-[1.75rem] border border-white/10 bg-black/15 p-5 shadow-inner shadow-black/20">
                  <label className="block text-xs uppercase tracking-[0.35em] text-slate-500 mb-3">Full Name</label>
                  <input
                    value={formState.fullName}
                    onChange={(e) => handleFormChange('fullName', e.target.value)}
                    disabled={!editMode}
                    className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition-all duration-300 focus:border-emerald-600"
                  />
                  {errors.fullName && <p className="mt-2 text-sm text-red-400">{errors.fullName}</p>}
                </div>

                <div className="rounded-[1.75rem] border border-white/10 bg-black/15 p-5 shadow-inner shadow-black/20">
                  <label className="block text-xs uppercase tracking-[0.35em] text-slate-500 mb-3">Email Address</label>
                  <input
                    value={formState.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                    disabled={!editMode}
                    className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition-all duration-300 focus:border-emerald-600"
                  />
                  {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
                </div>

                <div className="rounded-[1.75rem] border border-white/10 bg-black/15 p-5 shadow-inner shadow-black/20">
                  <label className="block text-xs uppercase tracking-[0.35em] text-slate-500 mb-3">Phone Number</label>
                  <input
                    value={formState.phone}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                    disabled={!editMode}
                    className="w-full rounded-3xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none transition-all duration-300 focus:border-emerald-600"
                  />
                  {errors.phone && <p className="mt-2 text-sm text-red-400">{errors.phone}</p>}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Edit3 size={16} /> Edit Profile
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!editMode || optimisticSaving}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#2D5A27] to-[#4A8F3F] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Check size={16} /> {optimisticSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={!editMode}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-200 transition-all duration-300 hover:bg-white/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl shadow-black/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.38em] text-emerald-200/70">Activity Hub</p>
              <h2 className="mt-2 text-3xl font-black text-white">Your dashboard</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-[#2D5A27] to-[#4A8F3F] text-white shadow-lg shadow-green-900/20'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            {activeTab === 'Overview' && (
              <div className="space-y-8">
                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="rounded-[2rem] border border-white/10 bg-black/15 p-6">
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Eco Achievements</p>
                    <div className="mt-6 grid gap-4">
                      {badges.map((badge) => {
                        const Icon = badge.icon;
                        return (
                          <div key={badge.title} className={`flex items-center gap-4 rounded-3xl border ${badge.tone} border-white/10 p-4`}>
                            <div className="rounded-2xl bg-white/10 p-3 text-slate-300">
                              <Icon size={20} />
                            </div>
                            <div>
                              <p className="font-semibold text-white">{badge.title}</p>
                              <p className="text-sm text-slate-400">Reward unlocked</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="rounded-[2rem] border border-white/10 bg-black/15 p-6 lg:col-span-2">
                    <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Quick Overview</p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                        <p className="text-sm text-slate-400">Verified Score</p>
                        <p className="mt-3 text-3xl font-black text-white">{user.ecoScore}/5</p>
                      </div>
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                        <p className="text-sm text-slate-400">Active Listings</p>
                        <p className="mt-3 text-3xl font-black text-white">{inventory.length}</p>
                      </div>
                      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                        <p className="text-sm text-slate-400">Community Trust</p>
                        <p className="mt-3 text-3xl font-black text-white">{user.transactions}+ txns</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'My Inventory' && (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {activeInventory.map((item) => (
                  <article key={item.id} className="group overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <div className="relative overflow-hidden">
                      <img src={item.image} alt={item.title} className="h-56 w-full object-cover transition-all duration-300 group-hover:scale-105" />
                      <span className={`absolute left-4 top-4 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusClass[item.status]}`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="space-y-4 p-5">
                      <div>
                        <p className="text-sm text-slate-400 uppercase tracking-[0.3em]">Listing</p>
                        <h3 className="mt-2 text-xl font-black text-white">{item.title}</h3>
                        <p className="mt-2 text-sm text-slate-400">{item.subtitle}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleInventoryStatus(item.id, item.status === 'Available' ? 'Maintenance' : 'Available')}
                          className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm font-semibold text-slate-200 transition-all duration-300 hover:bg-white/10"
                        >
                          <ArrowRight size={16} /> Toggle Status
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition-all duration-300 hover:bg-red-500/20"
                        >
                          <Trash2 size={16} /> Remove
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {activeTab === 'Transaction Ledger' && (
              <div className="space-y-6">
                <div className="grid gap-6 xl:grid-cols-2">
                  <div className="rounded-[2rem] border border-white/10 bg-black/15 p-6">
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Items Borrowed</p>
                        <h3 className="mt-2 text-2xl font-black text-white">Borrowed</h3>
                      </div>
                      <div className="rounded-full bg-yellow-500/10 px-4 py-2 text-sm font-semibold text-yellow-100">2 active</div>
                    </div>
                    <div className="space-y-4">
                      {ledger.borrowed.map((entry) => (
                        <div key={entry.id} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-emerald-500/20">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm text-slate-400">{entry.date}</p>
                              <p className="mt-2 text-lg font-bold text-white">{entry.name}</p>
                            </div>
                            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass[entry.status]}`}>
                              {entry.status}
                            </span>
                          </div>
                          <p className="mt-3 text-sm text-slate-400">From: {entry.counterparty}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[2rem] border border-white/10 bg-black/15 p-6">
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Items Lent</p>
                        <h3 className="mt-2 text-2xl font-black text-white">Lent</h3>
                      </div>
                      <div className="rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-200">{ledger.lent.length} total</div>
                    </div>
                    <div className="space-y-4">
                      {ledger.lent.map((entry) => (
                        <div key={entry.id} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4 transition-all duration-300 hover:border-emerald-500/20">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-sm text-slate-400">{entry.date}</p>
                              <p className="mt-2 text-lg font-bold text-white">{entry.name}</p>
                            </div>
                            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${statusClass[entry.status]}`}>
                              {entry.status}
                            </span>
                          </div>
                          <p className="mt-3 text-sm text-slate-400">To: {entry.counterparty}</p>
                        </div>
                      ))}
                    </div>
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
