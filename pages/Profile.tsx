
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, HelpCircle, FileText, 
  LogOut, Star, Trash2, Bell, Wallet, ClipboardList, Headset,
  CircleDollarSign, Check, Camera, User as UserIcon, Phone, Mail, X, Save, Edit2,
  Send, ShieldAlert
} from 'lucide-react';
import { View, TermSection, UserProfile, Currency } from '../types';

interface Props {
  setView: (view: View) => void;
  currentCurrency: string;
  onCurrencyChange: (code: string) => void;
  terms: TermSection[];
  user?: UserProfile;
  currencies: Currency[];
}

const Profile: React.FC<Props> = ({ setView, currentCurrency, onCurrencyChange, terms, user, currencies }) => {
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  
  // Local Edit State
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    if (user) {
        setEditForm({
            name: user.name,
            phone: user.phone,
            email: user.email
        });
    }
  }, [user]);

  const menuItems = [
    { icon: CircleDollarSign, label: 'العملة', action: () => setShowCurrencyModal(true) },
    { icon: Bell, label: 'الإشعارات', action: () => setView(View.NOTIFICATIONS) },
    { icon: ClipboardList, label: 'طلباتي', action: () => setView(View.ORDERS) },
    { icon: Wallet, label: 'محفظتي', action: () => setView(View.WALLET) },
    { icon: HelpCircle, label: 'الأسئلة الشائعة', action: () => {} },
    { icon: FileText, label: 'الشروط والأحكام', action: () => setShowTermsModal(true) },
    { icon: Star, label: 'تقييم التطبيق', action: () => {} },
    { icon: Headset, label: 'الدعم الفني', action: () => setShowSupportModal(true) },
  ];

  const handleCurrencySelect = (code: string) => {
    onCurrencyChange(code);
    setShowCurrencyModal(false);
  };

  const handleOpenEdit = () => {
    if (user) {
        setEditForm({ name: user.name, phone: user.phone, email: user.email });
        setShowEditProfile(true);
    }
  };

  const handleAdminAccess = () => {
    if (adminPin === '0000') {
      setShowAdminLogin(false);
      setAdminPin('');
      setView(View.ADMIN);
    } else {
      alert('رمز الدخول خاطئ');
      setAdminPin('');
    }
  };

  // If user is banned, maybe show a warning?
  if (user?.status === 'banned') {
      return (
          <div className="min-h-screen bg-[#13141f] flex flex-col items-center justify-center p-6 text-center">
              <ShieldAlert size={64} className="text-red-500 mb-4" />
              <h1 className="text-2xl font-bold text-white mb-2">تم حظر حسابك</h1>
              <p className="text-gray-400">يرجى التواصل مع الدعم الفني لاستعادة الوصول.</p>
              <button onClick={() => setShowSupportModal(true)} className="mt-6 bg-red-600 text-white px-6 py-3 rounded-xl font-bold">الدعم الفني</button>
               {/* Support Modal (Included even when banned) */}
               {showSupportModal && (
                    <div className="fixed inset-0 z-[60] flex items-end justify-center">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSupportModal(false)}></div>
                        <div className="bg-[#1f212e] w-full max-w-md rounded-t-3xl p-6 relative z-10 animate-slide-up border-t border-gray-700">
                           <h2 className="text-xl font-bold mb-4 text-center text-white">الدعم الفني</h2>
                           <div className="grid grid-cols-2 gap-4 mb-6">
                             <button onClick={() => window.open('https://wa.me/9647763410970', '_blank')} className="bg-[#242636] p-5 rounded-2xl flex flex-col items-center gap-3 border border-gray-700 text-white font-bold">واتس اب</button>
                             <button onClick={() => window.open('https://t.me/Ratluzen', '_blank')} className="bg-[#242636] p-5 rounded-2xl flex flex-col items-center gap-3 border border-gray-700 text-white font-bold">تيليجرام</button>
                           </div>
                           <button onClick={() => setShowSupportModal(false)} className="w-full bg-gray-700 text-white font-bold py-3.5 rounded-xl">إغلاق</button>
                        </div>
                    </div>
               )}
          </div>
      );
  }

  return (
    <div className="min-h-screen pb-24 bg-[#13141f] relative pt-6">
      
      {/* User Info Card */}
      <button 
        onClick={handleOpenEdit}
        className="w-full px-4 mb-8 flex items-center gap-4 text-right group transition-transform active:scale-98 outline-none"
      >
         <div className="relative">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-[3px] border-yellow-400 shadow-lg group-hover:shadow-yellow-400/20 transition-all">
                <div className="w-full h-full bg-[#cbd5e1] flex items-center justify-center text-gray-500">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-14 h-14 mt-2">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 bg-[#242636] text-yellow-400 p-1 rounded-full border border-gray-700 shadow-sm">
                <Edit2 size={10} />
            </div>
         </div>
         <div className="flex-1 flex flex-col items-end">
            <div className="flex items-center gap-2">
                <h2 className="text-white font-bold text-xl group-hover:text-yellow-400 transition-colors">{user?.name || 'زائر'}</h2>
            </div>
            <p className="text-gray-500 text-sm font-bold mt-0.5" dir="ltr">ID: {user?.id || '---'}</p>
         </div>
         <ChevronLeft className="text-gray-600 w-5 h-5 group-hover:text-yellow-400 transition-colors" strokeWidth={1.5} />
      </button>

      {/* Menu List */}
      <div className="px-4 space-y-3">
        {menuItems.map((item, idx) => (
          <button 
            key={idx} 
            onClick={item.action}
            className="w-full bg-[#1e1f2b] p-4 rounded-xl flex items-center justify-between border border-gray-800/50 hover:bg-[#252836] transition-colors shadow-sm group"
          >
            <div className="flex items-center gap-4">
               <div className="text-gray-200 group-hover:text-yellow-400 transition-colors">
                 <item.icon size={22} strokeWidth={1.5} />
               </div>
               <span className="font-bold text-sm text-white">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
                {item.label === 'العملة' && (
                    <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded">
                        {currentCurrency}
                    </span>
                )}
                <ChevronLeft className="text-gray-600 w-5 h-5" strokeWidth={1.5} />
            </div>
          </button>
        ))}

        {/* Admin Button (Moved here) */}
         <button 
           onClick={() => setShowAdminLogin(true)}
           className="w-full bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 p-4 rounded-xl flex items-center justify-between border border-yellow-500/30 hover:bg-yellow-500/30 transition-colors shadow-sm group"
         >
            <div className="flex items-center gap-4">
               <div className="text-yellow-400">
                 <ShieldAlert size={22} strokeWidth={1.5} />
               </div>
               <span className="font-bold text-sm text-yellow-400">الإدارة (Admin)</span>
            </div>
            <ChevronLeft className="text-yellow-500/50 w-5 h-5" strokeWidth={1.5} />
         </button>

        {/* Logout */}
        <button className="w-full bg-[#1e1f2b] p-4 rounded-xl flex items-center justify-between border border-gray-800/50 hover:bg-[#252836] transition-colors mt-6 shadow-sm">
            <div className="flex items-center gap-4">
               <LogOut size={22} className="text-red-500" strokeWidth={1.5} />
               <span className="font-bold text-sm text-red-500">تسجيل الخروج</span>
            </div>
            <ChevronLeft className="text-gray-600 w-5 h-5" strokeWidth={1.5} />
        </button>

         {/* Delete Account */}
         <button className="w-full bg-[#1e1f2b] p-4 rounded-xl flex items-center justify-between border border-gray-800/50 hover:bg-[#252836] transition-colors shadow-sm">
            <div className="flex items-center gap-4">
               <Trash2 size={22} className="text-red-500" strokeWidth={1.5} />
               <span className="font-bold text-sm text-red-500">حذف الحساب</span>
            </div>
            <ChevronLeft className="text-gray-600 w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>

       {/* Version */}
       <div className="text-center text-gray-600 text-[10px] mt-8 mb-4 font-mono tracking-widest opacity-60">
         v3.3.6
       </div>

       {/* Admin Login Modal */}
       {showAdminLogin && (
         <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#1f212e] w-full max-w-sm rounded-2xl p-6 border border-yellow-400/30 shadow-2xl animate-fadeIn">
               <h3 className="text-xl font-bold text-center text-white mb-4">دخول المسؤول</h3>
               <p className="text-center text-gray-400 text-sm mb-6">أدخل رمز الوصول للوحة التحكم</p>
               <input 
                 type="password" 
                 maxLength={4}
                 placeholder="****"
                 className="w-full bg-[#13141f] border border-gray-700 rounded-xl p-4 text-center text-2xl font-bold tracking-[1em] mb-6 focus:border-yellow-400 outline-none text-white"
                 value={adminPin}
                 onChange={(e) => setAdminPin(e.target.value)}
               />
               <button onClick={handleAdminAccess} className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl mb-3">دخول</button>
               <button onClick={() => setShowAdminLogin(false)} className="w-full bg-gray-700 text-white font-bold py-3 rounded-xl">إلغاء</button>
               <p className="text-center text-[10px] text-gray-600 mt-4">Default PIN: 0000</p>
            </div>
         </div>
       )}

       {/* Edit Profile Modal (Visual only in this version as real update logic is in admin/mock) */}
       {showEditProfile && (
           <div className="fixed inset-0 z-[70] bg-[#13141f] animate-fadeIn flex flex-col">
               <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
                   <button onClick={() => setShowEditProfile(false)} className="p-2 bg-[#242636] rounded-xl text-gray-400 hover:text-white">
                       <X size={20} />
                   </button>
                   <h2 className="text-lg font-bold text-white">تعديل الملف الشخصي</h2>
                   <div className="w-9"></div>
               </div>

               <div className="flex-1 overflow-y-auto p-6">
                   <div className="flex flex-col items-center mb-8">
                       <div className="relative mb-3">
                           <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-yellow-400">
                                <div className="w-full h-full bg-[#cbd5e1] flex items-center justify-center text-gray-500">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-20 h-20 mt-3">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                                    </svg>
                                </div>
                           </div>
                           <button className="absolute bottom-0 right-0 bg-[#242636] p-2 rounded-full border border-gray-700 text-yellow-400 shadow-md">
                               <Camera size={16} />
                           </button>
                       </div>
                   </div>

                   <div className="space-y-4">
                       <div className="space-y-1.5">
                           <label className="text-xs font-bold text-gray-400 mr-1 block text-right">الاسم</label>
                           <div className="relative">
                               <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full bg-[#1e1f2b] border border-gray-700 rounded-xl py-3 pr-10 pl-4 text-white text-right focus:border-yellow-400 focus:outline-none transition-colors" />
                               <UserIcon className="absolute right-3 top-3.5 text-gray-500" size={18} />
                           </div>
                       </div>
                       <div className="space-y-1.5">
                           <label className="text-xs font-bold text-gray-400 mr-1 block text-right">رقم الهاتف</label>
                           <div className="relative">
                               <input type="tel" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="w-full bg-[#1e1f2b] border border-gray-700 rounded-xl py-3 pr-10 pl-4 text-white text-right focus:border-yellow-400 focus:outline-none transition-colors dir-rtl" />
                               <Phone className="absolute right-3 top-3.5 text-gray-500" size={18} />
                           </div>
                       </div>
                       <div className="space-y-1.5">
                           <label className="text-xs font-bold text-gray-400 mr-1 block text-right">البريد الإلكتروني</label>
                           <div className="relative">
                               <input type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="w-full bg-[#1e1f2b] border border-gray-700 rounded-xl py-3 pr-10 pl-4 text-white text-right focus:border-yellow-400 focus:outline-none transition-colors" />
                               <Mail className="absolute right-3 top-3.5 text-gray-500" size={18} />
                           </div>
                       </div>
                   </div>
               </div>

               <div className="p-4 border-t border-gray-800/50 bg-[#13141f]">
                   <button onClick={() => setShowEditProfile(false)} className="w-full bg-yellow-400 text-black font-bold py-3.5 rounded-xl hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 shadow-lg">
                       <Save size={18} /> حفظ التغييرات
                   </button>
               </div>
           </div>
       )}

       {/* Currency Modal (Bottom Sheet) */}
       {showCurrencyModal && (
         <div className="fixed inset-0 z-[60] flex items-end justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCurrencyModal(false)}></div>
            <div className="bg-[#1f212e] w-full max-w-md rounded-t-3xl p-6 relative z-10 animate-slide-up border-t border-gray-700 max-h-[85vh] flex flex-col">
               <h2 className="text-xl font-bold mb-6 text-center text-white">العملة</h2>
               <div className="overflow-y-auto no-scrollbar space-y-2 mb-4 flex-1">
                 {currencies.map((currency) => (
                    <button key={currency.code} onClick={() => handleCurrencySelect(currency.code)} className={`w-full bg-[#13141f] rounded-xl border p-3 flex items-center justify-between transition-all ${currentCurrency === currency.code ? 'border-yellow-400 bg-yellow-400/5' : 'border-gray-700 hover:border-gray-500'}`}>
                        <div className="flex items-center gap-3"><span className="text-2xl">{currency.flag}</span><div className="text-right"><p className={`font-bold text-sm ${currentCurrency === currency.code ? 'text-yellow-400' : 'text-white'}`}>{currency.name}</p><p className="text-[10px] text-gray-500 text-right dir-ltr uppercase">{currency.code}</p></div></div>
                        {currentCurrency === currency.code && <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"><Check size={14} className="text-black" strokeWidth={3} /></div>}
                    </button>
                 ))}
               </div>
               <button onClick={() => setShowCurrencyModal(false)} className="w-full bg-gray-700 text-white font-bold py-3.5 rounded-xl">إغلاق</button>
            </div>
         </div>
       )}

       {showSupportModal && (
         <div className="fixed inset-0 z-[60] flex items-end justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSupportModal(false)}></div>
            <div className="bg-[#1f212e] w-full max-w-md rounded-t-3xl p-6 relative z-10 animate-slide-up border-t border-gray-700">
               <h2 className="text-xl font-bold mb-6 text-center text-white">الدعم الفني</h2>
               <div className="grid grid-cols-2 gap-4 mb-6">
                 <button onClick={() => window.open('https://wa.me/9647763410970', '_blank')} className="bg-[#242636] p-5 rounded-2xl flex flex-col items-center gap-3 border border-gray-700 text-white font-bold">
                    {/* WhatsApp Icon */}
                    <svg viewBox="0 0 24 24" width="24" height="24" fill="#25D366">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    واتس اب
                 </button>
                 <button onClick={() => window.open('https://t.me/Ratluzen', '_blank')} className="bg-[#242636] p-5 rounded-2xl flex flex-col items-center gap-3 border border-gray-700 text-white font-bold">
                    <Send size={24} className="text-blue-400" />
                    تيليجرام
                 </button>
               </div>
               <button onClick={() => setShowSupportModal(false)} className="w-full bg-gray-700 text-white font-bold py-3.5 rounded-xl">إغلاق</button>
            </div>
         </div>
       )}

       {showTermsModal && (
           <div className="fixed inset-0 z-[70] bg-[#13141f] animate-fadeIn flex flex-col">
               <div className="flex items-center justify-between p-4 border-b border-gray-800/50">
                   <button onClick={() => setShowTermsModal(false)} className="p-2 bg-[#242636] rounded-xl text-gray-400 hover:text-white"><X size={20} /></button>
                   <h2 className="text-lg font-bold text-white">الشروط والأحكام</h2><div className="w-9"></div>
               </div>
               <div className="flex-1 overflow-y-auto p-6 text-gray-300">
                   <div className="space-y-6 text-right">
                       <div className="text-center mb-6"><h3 className="text-xl font-bold text-yellow-400 mb-2">الشروط والأحكام</h3></div>
                       <div className="space-y-4">
                           {terms.map((section) => (
                             <div key={section.id}><h4 className="text-white font-bold text-sm mb-1">{section.titleAr}</h4><ul className="list-disc list-inside text-xs space-y-1 pr-2">{section.contentAr.map((point, idx) => <li key={idx}>{point}</li>)}</ul></div>
                           ))}
                       </div>
                   </div>
                   <div className="my-8 border-t border-gray-700/50"></div>
                   <div className="space-y-6 text-left dir-ltr">
                       <div className="text-center mb-6"><h3 className="text-xl font-bold text-yellow-400 mb-2">Terms and Conditions</h3></div>
                       <div className="space-y-4">
                           {terms.map((section) => (
                             <div key={section.id}><h4 className="text-white font-bold text-sm mb-1">{section.titleEn}</h4><ul className="list-disc list-inside text-xs space-y-1 pl-2">{section.contentEn.map((point, idx) => <li key={idx}>{point}</li>)}</ul></div>
                           ))}
                       </div>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};

export default Profile;
