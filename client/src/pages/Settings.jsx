import { useState } from 'react';
import { Shield, Sliders, BadgeCheck, Save, Key, UserCheck, Eye, EyeOff } from 'lucide-react';
import API from '../api/axios';
import { useLanguage } from '../contexts/LanguageContext';


export default function Settings() {
  const { t } = useLanguage();

  const [activeTab, setActiveTab] = useState('security');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Tab 1: Password State
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });

  // Tab 2: Trust & Identity State
  const [idFile, setIdFile] = useState(null);

  // Tab 3: Logistics State
  const [preferences, setPreferences] = useState({
    is_away: false,
    preferred_handoff: 'Meetup',
    ai_matching: true
  });

  const showToast = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  // 1. Password Change Handler
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return showToast('error', 'New passwords do not match.');
    }
    setLoading(true);
    try {
      await API.put('/auth/settings/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      showToast('success', 'Security credentials updated successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast('error', err.response?.data?.error || 'Failed to alter password.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Preferences Change Handler
  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put('/auth/settings', preferences);
      showToast('success', 'Ecosystem logistics saved configuration values.');
    } catch (err) {
      showToast('error', 'Failed to update preferences matrix.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Identity Verification Handler
  const handleIdentitySubmit = async (e) => {
    e.preventDefault();
    if (!idFile) return showToast('error', 'Please drop a verification document target image first.');
    
    setLoading(true);
    const formData = new FormData();
    formData.append('identity_doc', idFile);

    try {
      await API.post('/auth/settings/verify-identity', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      showToast('success', 'Documentation uploaded successfully! Verification status: Pending Review.');
      setIdFile(null);
    } catch (err) {
      showToast('error', err.response?.data?.error || 'File submission crashed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Toast Alert Banner */}
      {message.text && (
        <div className={`p-4 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
          message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-[#005A36]' : 'bg-rose-50 border-rose-200 text-rose-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-[2rem] shadow-xs overflow-hidden flex flex-col md:flex-row min-h-[580px]">
        
        {/* Settings Navigation Sidebar */}
        <div className="w-full md:w-64 bg-gray-50 border-r border-gray-200 p-6 space-y-2 flex flex-col justify-between">
          <div className="space-y-1.5">
            <h2 className="text-xl font-black text-gray-950 mb-6 px-2">Settings</h2>
            
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'security' ? 'bg-[#005A36] text-white shadow-md shadow-emerald-900/10' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Shield size={16} /> Account Security
            </button>

            <button 
              onClick={() => setActiveTab('trust')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'trust' ? 'bg-[#005A36] text-white shadow-md shadow-emerald-900/10' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <BadgeCheck size={16} /> Trust & Identity
            </button>

            <button 
              onClick={() => setActiveTab('logistics')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === 'logistics' ? 'bg-[#005A36] text-white shadow-md shadow-emerald-900/10' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Sliders size={16} /> Rental Logistics
            </button>
          </div>
          
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-2 border-t border-gray-200/60 pt-4 hidden md:block">
            EcoLend Framework v1.2
          </div>
        </div>

        {/* Content Window Container Panel */}
        <div className="flex-1 p-8 sm:p-10">
          
          {/* TAB 1: SECURITY VIEW */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md animate-fadeIn">
              <div>
                <h3 className="text-2xl font-black text-gray-950">Credential Security</h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Modify authentication structures to safeguard asset tracking layers.</p>
              </div>

              <div className="space-y-4">
                {/* Current Password */}
                <div className="space-y-1.5 relative">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Current Password</label>
                  <input 
                    type={showPass.current ? 'text' : 'password'} 
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-hidden focus:border-[#005A36] focus:bg-white transition-all"
                  />
                  <button type="button" onClick={() => setShowPass({...showPass, current: !showPass.current})} className="absolute bottom-3.5 right-4 text-gray-400 hover:text-gray-600">
                    {showPass.current ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>

                {/* New Password */}
                <div className="space-y-1.5 relative">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">New Password</label>
                  <input 
                    type={showPass.new ? 'text' : 'password'} 
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-hidden focus:border-[#005A36] focus:bg-white transition-all"
                  />
                  <button type="button" onClick={() => setShowPass({...showPass, new: !showPass.new})} className="absolute bottom-3.5 right-4 text-gray-400 hover:text-gray-600">
                    {showPass.new ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5 relative">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Confirm New Password</label>
                  <input 
                    type={showPass.confirm ? 'text' : 'password'} 
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-hidden focus:border-[#005A36] focus:bg-white transition-all"
                  />
                  <button type="button" onClick={() => setShowPass({...showPass, confirm: !showPass.confirm})} className="absolute bottom-3.5 right-4 text-gray-400 hover:text-gray-600">
                    {showPass.confirm ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="bg-[#005A36] text-white hover:bg-black transition-all px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2"
              >
                <Key size={14}/> {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
              </button>
            </form>
          )}

          {/* TAB 2: TRUST & VERIFICATION VIEW */}
          {activeTab === 'trust' && (
            <form onSubmit={handleIdentitySubmit} className="space-y-6 max-w-lg animate-fadeIn">
              <div>
                <h3 className="text-2xl font-black text-gray-950">Identity Verification Matrix</h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Upload a legal credential artifact (NIC or Passport) to obtain Verified status tokens.</p>
              </div>

              <div className="border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-white hover:border-[#005A36] p-8 rounded-3xl text-center transition-all cursor-pointer relative group">
                <input 
                  type="file" 
                  accept="image/*,application/pdf"
                  onChange={(e) => setIdFile(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <UserCheck size={32} className="text-gray-400 mx-auto mb-3 group-hover:scale-105 transition-transform" />
                <p className="text-sm font-bold text-gray-800">
                  {idFile ? idFile.name : 'Choose file or drag here'}
                </p>
                <p className="text-[10px] text-gray-400 font-medium mt-1">Accepts high resolution JPG, PNG, or PDF formats up to 5MB.</p>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="bg-[#005A36] text-white hover:bg-black transition-all px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2"
              >
                <BadgeCheck size={14}/> {loading ? 'UPLOADING...' : 'SUBMIT DOCUMENT'}
              </button>
            </form>
          )}

          {/* TAB 3: LOGISTICS VIEW */}
          {activeTab === 'logistics' && (
            <form onSubmit={handlePreferencesSubmit} className="space-y-6 max-w-xl animate-fadeIn">
              <div>
                <h3 className="text-2xl font-black text-gray-950">Marketplace Logistics</h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Control visibility parameters and interaction states inside the marketplace pool.</p>
              </div>

              <div className="space-y-6">
                {/* Away Mode Toggle */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl bg-gray-50/50">
                  <div>
                    <p className="text-sm font-black text-gray-900">Away / Vacation Mode</p>
                    <p className="text-xs text-gray-400 font-medium">Temporarily hide all your rental assets from exploration feeds.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={preferences.is_away}
                      onChange={(e) => setPreferences({...preferences, is_away: e.target.checked})}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#005A36]"></div>
                  </label>
                </div>

                {/* AI Matching Toggle */}
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl bg-gray-50/50">
                  <div>
                    <p className="text-sm font-black text-gray-900">AI Match Engine Alerts</p>
                    <p className="text-xs text-gray-400 font-medium">Allow background algorithms to suggest asset handoffs automatically.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={preferences.ai_matching}
                      onChange={(e) => setPreferences({...preferences, ai_matching: e.target.checked})}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#005A36]"></div>
                  </label>
                </div>

                {/* Preferred Handoff Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Preferred Asset Handoff Strategy</label>
                  <select 
                    value={preferences.preferred_handoff}
                    onChange={(e) => setPreferences({...preferences, preferred_handoff: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:outline-hidden focus:border-[#005A36] focus:bg-white transition-all appearance-none cursor-pointer"
                  >
                    <option value="Meetup">In-Person Meetup Location</option>
                    <option value="Pickup Point">Designated Public Hub / Pickup Point</option>
                    <option value="Doorstep">Direct Home Doorstep Delivery</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="bg-[#005A36] text-white hover:bg-black transition-all px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2"
              >
                <Save size={14}/> {loading ? 'SAVING...' : 'SAVE PREFERENCES'}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}