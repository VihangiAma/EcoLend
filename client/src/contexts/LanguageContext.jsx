import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Layout & Navigation (Sidebar & Header)
    navHome: "Home",
    navBrowse: "Browse",
    navMessages: "Messages",
    navFavorites: "Favorites",
    navMyItems: "My Items",
    navProfile: "Profile",
    navSettings: "Settings",
    navLend: "List Item",
    searchPlaceholder: "Search for tools, cameras, or gear...",
    logout: "Logout",

    // Item Detail Specifications
    loadingAsset: "Loading asset specifications...",
    assetNotFound: "Asset Not Found",
    assetNotFoundDesc: "This item listing may have been unlisted, rented out, or deleted from the EcoLend ecosystem database pool.",
    backToBrowse: "Back to Browse Marketplace",
    unclassifiedAsset: "Unclassified Asset",
    reviews: "Platform Reviews",
    aiInsightSystem: "AI Insight System",
    assetDesc: "Asset Description",
    noDescription: "The owner hasn't loaded description notes parameters into this marketplace asset frame yet.",
    verifiedMember: "Verified Community Member",
    verifiedLender: "Verified Ecosystem Lender",
    rentalValue: "Rental Value",
    perDayRate: "/ Per Day Rate",
    requestBorrow: "Request to Borrow Gear",
    chatBtn: "Chat",

    // Settings Panel Keys
    settings: "Settings",
    accountSecurity: "Account Security",
    trustIdentity: "Trust & Identity",
    rentalLogistics: "Rental Logistics",
    appearance: "Appearance",
    credentialSec: "Credential Security",
    currentPass: "Current Password",
    newPass: "New Password",
    confirmPass: "Confirm New Password",
    updatePass: "Update Password",
    idMatrix: "Identity Verification Matrix",
    submitDoc: "Submit Document",
    awayMode: "Away / Vacation Mode",
    aiMatch: "AI Match Engine Alerts",
    handoffStrategy: "Preferred Asset Handoff Strategy",
    savePref: "Save Preferences",
    interfaceCustom: "Interface Customization",
    sysLang: "System Language",
    appTheme: "Application Theme",
    light: "Default Light Mode",
    dark: "Cinematic Dark Mode",
    system: "Sync with System"
  },
  si: {
    // Layout & Navigation (Sidebar & Header)
    navHome: "මුල් පිටුව",
    navBrowse: "වෙළඳපොළ ගවේෂණය",
    navMessages: "පණිවිඩ",
    navFavorites: "ප්‍රියතමයන්",
    navMyItems: "මගේ භාණ්ඩ",
    navProfile: "මගේ ගිණුම",
    navSettings: "සැකසුම්",
    navLend: "භාණ්ඩයක් එක් කරන්න",
    searchPlaceholder: "උපකරණ, කැමරා හෝ දේවල් සොයන්න...",
    logout: "ගිණුමෙන් ඉවත් වන්න",

    // Item Detail Specifications
    loadingAsset: "භාණ්ඩයේ විස්තර ලබා ගනිමින් පවතී...",
    assetNotFound: "භාණ්ඩය සොයාගත නොහැකි විය",
    assetNotFoundDesc: "මෙම භාණ්ඩය වෙළඳපොළෙන් ඉවත් කර හෝ EcoLend දත්ත ගබඩාවෙන් මකා දමා ඇත.",
    backToBrowse: "ආපසු වෙළඳපොළට යන්න",
    unclassifiedAsset: "වර්ගීකරණය නොකළ භාණ්ඩය",
    reviews: "පරිශීලක සමාලෝචන",
    aiInsightSystem: "AI තීක්ෂණ පද්ධතිය",
    assetDesc: "භාණ්ඩයේ විස්තරය",
    noDescription: "හිමිකරු තවමත් මෙම භාණ්ඩය සඳහා විස්තරයක් ඇතුළත් කර නොමැත.",
    verifiedMember: "සත්‍යාපිත සාමාජිකයා",
    verifiedLender: "සත්‍යාපිත පරිශීලක",
    rentalValue: "කුලී අගය",
    perDayRate: "/ දිනකට",
    requestBorrow: "භාණ්ඩය ඉල්ලා සිටින්න",
    chatBtn: "පණිවිඩ යවන්න",

    // Settings Panel Keys
    settings: "සැකසුම් (Settings)",
    accountSecurity: "ගිණුමේ ආරක්ෂාව",
    trustIdentity: "විශ්වාසනීයත්වය සහ අනන්‍යතාවය",
    rentalLogistics: "කුලියට දීමේ සැකසුම්",
    appearance: "පෙනුම (Appearance)",
    credentialSec: "මුරපද ආරක්ෂාව",
    currentPass: "වත්මන් මුරපදය",
    newPass: "නව මුරපදය",
    confirmPass: "නව මුරපදය තහවුරු කරන්න",
    updatePass: "මුරපදය යාවත්කාලීන කරන්න",
    idMatrix: "අනන්‍යතා සත්‍යාපනය",
    submitDoc: "ලේඛනය ඉදිරිපත් කරන්න",
    awayMode: "නිවාඩු ප්‍රකාරය (Vacation Mode)",
    aiMatch: "AI ගැලපුම් එන්ජින් ඇඟවීම්",
    handoffStrategy: "භාණ්ඩය භාරදීමේ ක්‍රමවේදය",
    savePref: "මනාප සුරකින්න",
    interfaceCustom: "පෙනුම වෙනස් කිරීම්",
    sysLang: "පද්ධති භාෂාව",
    appTheme: "යෙදුමේ තේමාව",
    light: "සාමාන්‍ය ආලෝක ප්‍රකාරය",
    dark: "අඳුරු ප්‍රකාරය (ළඟදීම)",
    system: "පද්ධති සැකසුම් අනුව"
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem('ecoLendLang') || 'en');

  useEffect(() => {
    localStorage.setItem('ecoLendLang', lang);
  }, [lang]);

  // ✅ Defensive Code: Optional chaining safely falls back to key text if missing
  const t = (key) => translations[lang]?.[key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);