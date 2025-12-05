
import React, { useState } from 'react';
import { 
  ArrowLeft, Plus, Trash2, Edit2, Save, X, 
  Package, Layers, FileText, ShoppingBag,
  TrendingUp, Users, Search, Image as ImageIcon,
  CheckCircle, BarChart3, Wallet, Activity,
  AlertTriangle, DollarSign, Server, Clock,
  Gamepad2, Smartphone, Monitor, Wifi, Zap, Gift, 
  Music, Video, Book, Car, Coffee, Shirt, Watch, 
  Globe, ShoppingBasket, Headphones, Camera,
  Briefcase, Plane, Megaphone, Ban, Unlock, User,
  Bell, Info, Star, ShoppingCart, ArrowUpRight, ArrowDownRight,
  PieChart, Calendar, Flag, Tags, CircleDollarSign, RefreshCw
} from 'lucide-react';
import { View, Product, Category, TermSection, Banner, UserProfile, Announcement, Region, Denomination, Currency } from '../types';
import { PREDEFINED_REGIONS, INITIAL_CURRENCIES } from '../constants';

interface Props {
  setView: (view: View) => void;
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  terms: TermSection[];
  setTerms: React.Dispatch<React.SetStateAction<TermSection[]>>;
  banners: Banner[];
  setBanners: React.Dispatch<React.SetStateAction<Banner[]>>;
  users: UserProfile[];
  setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  currencies: Currency[];
  setCurrencies: React.Dispatch<React.SetStateAction<Currency[]>>;
}

const AVAILABLE_ICONS = [
  { id: 'gamepad', icon: Gamepad2, label: 'ألعاب' },
  { id: 'shopping', icon: ShoppingBag, label: 'متجر' },
  { id: 'basket', icon: ShoppingBasket, label: 'سلة' },
  { id: 'phone', icon: Smartphone, label: 'هاتف' },
  { id: 'wifi', icon: Wifi, label: 'إنترنت' },
  { id: 'monitor', icon: Monitor, label: 'شاشة' },
  { id: 'zap', icon: Zap, label: 'كهرباء/شحن' },
  { id: 'gift', icon: Gift, label: 'هدايا' },
  { id: 'globe', icon: Globe, label: 'عالمي' },
  { id: 'music', icon: Music, label: 'موسيقى' },
  { id: 'video', icon: Video, label: 'فيديو' },
  { id: 'book', icon: Book, label: 'كتب' },
  { id: 'car', icon: Car, label: 'نقل' },
  { id: 'coffee', icon: Coffee, label: 'مشروبات' },
  { id: 'shirt', icon: Shirt, label: 'ملابس' },
  { id: 'watch', icon: Watch, label: 'ساعات' },
  { id: 'headphones', icon: Headphones, label: 'صوتيات' },
  { id: 'camera', icon: Camera, label: 'تصوير' },
  { id: 'briefcase', icon: Briefcase, label: 'أعمال' },
  { id: 'plane', icon: Plane, label: 'سفر' },
];

const Admin: React.FC<Props> = ({ 
  setView, 
  products, setProducts, 
  categories, setCategories,
  terms, setTerms,
  banners, setBanners,
  users, setUsers,
  announcements, setAnnouncements,
  currencies, setCurrencies
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'terms' | 'users' | 'banners' | 'announcements' | 'currencies'>('dashboard');
  
  // Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Product Form State
  const [prodForm, setProdForm] = useState<Partial<Product>>({
    name: '', category: 'Games', price: 0, tag: '', imageColor: 'from-gray-700 to-gray-900', imageUrl: '', description: '',
    regions: [], denominations: []
  });
  
  // Temp State for adding denominations inside modal
  const [tempDenomLabel, setTempDenomLabel] = useState('');
  const [tempDenomPrice, setTempDenomPrice] = useState('');

  // Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState<{name: string, icon: any}>({ name: '', icon: Gamepad2 });

  // Banner Modal State
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [bannerForm, setBannerForm] = useState<Partial<Banner>>({ title: '', subtitle: '', desc: '', bg: 'from-blue-900 to-indigo-900', imageUrl: '' });

  // User Management State
  const [searchUserId, setSearchUserId] = useState('');
  const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
  const [amountToAdd, setAmountToAdd] = useState('');

  // Announcement State
  const [announceTitle, setAnnounceTitle] = useState('');
  const [announceMsg, setAnnounceMsg] = useState('');
  const [announceType, setAnnounceType] = useState<'offer' | 'alert' | 'info'>('info');

  // --- Deep Analytics Mock Data ---
  const salesData = [
    { day: 'السبت', value: 45 },
    { day: 'الأحد', value: 67 },
    { day: 'الأثنين', value: 52 },
    { day: 'الثلاثاء', value: 89 },
    { day: 'الأربعاء', value: 34 },
    { day: 'الخميس', value: 76 },
    { day: 'الجمعة', value: 92 },
  ]; 

  const recentOrders = [
    { id: '#94801', user: 'Ahmed Ali', item: 'شدات ببجي 60', price: '$0.99', status: 'completed', time: 'منذ دقيقتين' },
    { id: '#94802', user: 'Sarah M.', item: 'بطاقة آيتونز $10', price: '$10.00', status: 'completed', time: 'منذ 15 دقيقة' },
    { id: '#94803', user: 'User_123', item: 'رصيد سوا 20', price: '$5.50', status: 'pending', time: 'منذ ساعة' },
    { id: '#94804', user: 'Gamer_X', item: 'جواهر فري فاير', price: '$1.50', status: 'completed', time: 'منذ ساعتين' },
  ];

  const topProducts = [
    { name: 'شدات ببجي 60', sold: 1240, revenue: '$1,227', growth: '+12%' },
    { name: 'بطاقة آيتونز $10', sold: 850, revenue: '$8,500', growth: '+5%' },
    { name: 'جواهر فري فاير', sold: 620, revenue: '$930', growth: '-2%' },
    { name: 'رصيد سوا 20', sold: 410, revenue: '$10,865', growth: '+8%' },
  ];

  // --- Product Logic ---
  const handleSaveProduct = () => {
    if (!prodForm.name || !prodForm.price) return;
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...prodForm } as Product : p));
    } else {
      const newProduct: Product = {
        id: Math.random().toString(36).substr(2, 9),
        name: prodForm.name!,
        category: prodForm.category || 'Games',
        price: Number(prodForm.price),
        imageColor: prodForm.imageColor || 'from-gray-700 to-gray-900',
        imageUrl: prodForm.imageUrl,
        tag: prodForm.tag,
        description: prodForm.description,
        regions: prodForm.regions || [],
        denominations: prodForm.denominations || []
      };
      setProducts(prev => [...prev, newProduct]);
    }
    setShowProductModal(false);
    setEditingProduct(null);
    setProdForm({ name: '', category: 'Games', price: 0, tag: '', imageColor: 'from-gray-700 to-gray-900', imageUrl: '', description: '', regions: [], denominations: [] });
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const toggleRegion = (region: Region) => {
      const currentRegions = prodForm.regions || [];
      const exists = currentRegions.find(r => r.id === region.id);
      if (exists) {
          setProdForm({ ...prodForm, regions: currentRegions.filter(r => r.id !== region.id) });
      } else {
          setProdForm({ ...prodForm, regions: [...currentRegions, region] });
      }
  };

  const addDenomination = () => {
      if (!tempDenomLabel || !tempDenomPrice) return;
      const newDenom: Denomination = {
          id: Date.now().toString(),
          label: tempDenomLabel,
          price: parseFloat(tempDenomPrice)
      };
      setProdForm({ ...prodForm, denominations: [...(prodForm.denominations || []), newDenom] });
      setTempDenomLabel('');
      setTempDenomPrice('');
  };

  const removeDenomination = (id: string) => {
      setProdForm({ ...prodForm, denominations: (prodForm.denominations || []).filter(d => d.id !== id) });
  };

  // --- Category Logic ---
  const handleSaveCategory = () => {
    if (!catForm.name) return;
    if (editingCategory) {
      setCategories(prev => prev.map(c => c.id === editingCategory.id ? { ...c, name: catForm.name, icon: catForm.icon } : c));
    } else {
      const newCat: Category = {
        id: Math.random().toString(36).substr(2, 9),
        name: catForm.name,
        icon: catForm.icon
      };
      setCategories(prev => [...prev, newCat]);
    }
    setShowCategoryModal(false);
    setEditingCategory(null);
    setCatForm({ name: '', icon: Gamepad2 });
  };

  const handleDeleteCategory = (id: string) => {
    if (id === 'all') {
        alert('لا يمكن حذف الفئة الرئيسية (الجميع)');
        return;
    }
    if (confirm('هل أنت متأكد من حذف هذه الفئة؟ سيتم إخفاؤها من القائمة.')) {
        setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  // --- Banner Logic ---
  const handleSaveBanner = () => {
    if (!bannerForm.imageUrl && !bannerForm.title) {
        alert("يجب إضافة عنوان أو صورة على الأقل");
        return;
    }

    const newBanner: Banner = {
      id: Date.now(),
      title: bannerForm.title || '',
      subtitle: bannerForm.subtitle || '',
      desc: bannerForm.desc || '',
      bg: bannerForm.bg || 'from-blue-900 to-indigo-900',
      imageUrl: bannerForm.imageUrl,
      pattern: 'radial-gradient(circle, #ffffff 1px, transparent 1px)'
    };
    setBanners(prev => [...prev, newBanner]);
    setShowBannerModal(false);
    setBannerForm({ title: '', subtitle: '', desc: '', bg: 'from-blue-900 to-indigo-900', imageUrl: '' });
  };

  const handleDeleteBanner = (id: number) => {
      setBanners(prev => prev.filter(b => b.id !== id));
  };

  // --- User Logic ---
  const handleSearchUser = () => {
    const user = users.find(u => u.id === searchUserId);
    if (user) {
      setFoundUser(user);
    } else {
      setFoundUser(null);
      alert('لم يتم العثور على مستخدم بهذا الـ ID');
    }
  };

  const handleUpdateBalance = (type: 'add' | 'deduct') => {
    if (!foundUser) return;
    const val = parseFloat(amountToAdd);
    if (isNaN(val) || val <= 0) return;
    
    const newBal = type === 'add' ? foundUser.balance + val : Math.max(0, foundUser.balance - val);
    
    // Update global state
    setUsers(prev => prev.map(u => u.id === foundUser.id ? { ...u, balance: newBal } : u));
    setFoundUser({ ...foundUser, balance: newBal });
    setAmountToAdd('');
    alert(`تم ${type === 'add' ? 'إضافة' : 'خصم'} الرصيد بنجاح`);
  };

  const handleBanUser = () => {
      if (!foundUser) return;
      const newStatus = foundUser.status === 'active' ? 'banned' : 'active';
      setUsers(prev => prev.map(u => u.id === foundUser.id ? { ...u, status: newStatus } : u));
      setFoundUser({ ...foundUser, status: newStatus });
      alert(newStatus === 'banned' ? 'تم حظر المستخدم بنجاح' : 'تم رفع الحظر عن المستخدم');
  };

  // --- Announcement Logic ---
  const handleSendAnnouncement = () => {
      if (!announceMsg || !announceTitle) {
        alert("يرجى تعبئة العنوان ونص الإشعار");
        return;
      }
      const newAnn: Announcement = {
          id: Date.now().toString(),
          title: announceTitle,
          message: announceMsg,
          type: announceType,
          date: new Date().toLocaleDateString(),
          isActive: true
      };
      setAnnouncements(prev => [newAnn, ...prev]);
      setAnnounceMsg('');
      setAnnounceTitle('');
      alert('تم إرسال الإشعار لجميع المستخدمين بنجاح');
  };

  const handleDeleteAnnouncement = (id: string) => {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  // --- Currency Logic ---
  const handleUpdateRate = (code: string, newRate: string) => {
      const rate = parseFloat(newRate);
      if (isNaN(rate) || rate <= 0) return;
      
      setCurrencies(prev => prev.map(c => 
          c.code === code ? { ...c, rate: rate } : c
      ));
  };

  const handleResetCurrencies = () => {
      if (confirm('هل أنت متأكد من استعادة الأسعار الافتراضية؟')) {
          setCurrencies(INITIAL_CURRENCIES);
      }
  };

  return (
    <div className="min-h-screen bg-[#13141f] pb-24 text-white">
      {/* Header */}
      <div className="p-4 bg-[#1f212e] shadow-md flex items-center justify-between sticky top-0 z-40 border-b border-gray-800">
        <button onClick={() => setView(View.PROFILE)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-yellow-400">لوحة القيادة</span>
            <span className="text-xs bg-yellow-400 text-black px-2 py-0.5 rounded font-mono">PRO</span>
        </h1>
        <div className="w-10"></div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto p-4 gap-2 no-scrollbar border-b border-gray-800 bg-[#13141f]">
        {[
          { id: 'dashboard', label: 'الرئيسية', icon: Activity },
          { id: 'currencies', label: 'العملات', icon: CircleDollarSign }, // New Tab
          { id: 'users', label: 'المستخدمين', icon: Users },
          { id: 'announcements', label: 'الإشعارات', icon: Bell },
          { id: 'banners', label: 'البانرات', icon: ImageIcon },
          { id: 'products', label: 'المنتجات', icon: ShoppingBag },
          { id: 'categories', label: 'الفئات', icon: Layers },
          { id: 'terms', label: 'الشروط', icon: FileText },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' 
                : 'bg-[#242636] text-gray-400 hover:bg-[#2f3245]'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 animate-fadeIn">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
            <div className="space-y-6">
                
                {/* 1. KPI Cards Row */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Revenue */}
                    <div className="bg-[#242636] p-4 rounded-2xl border border-gray-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl -mr-5 -mt-5"></div>
                        <div className="flex justify-between items-start mb-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><DollarSign size={20} /></div>
                            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                                <TrendingUp size={10} /> +12%
                            </span>
                        </div>
                        <p className="text-gray-400 text-xs font-bold mb-1">صافي الأرباح</p>
                        <p className="text-2xl font-black text-white dir-ltr text-right">$3,450.00</p>
                    </div>

                    {/* Orders */}
                    <div className="bg-[#242636] p-4 rounded-2xl border border-gray-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/5 rounded-full blur-2xl -mr-5 -mt-5"></div>
                        <div className="flex justify-between items-start mb-3">
                            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500"><ShoppingCart size={20} /></div>
                            <span className="text-[10px] text-yellow-400 font-bold flex items-center gap-0.5 bg-yellow-500/10 px-1.5 py-0.5 rounded-md">
                                <TrendingUp size={10} /> +5%
                            </span>
                        </div>
                        <p className="text-gray-400 text-xs font-bold mb-1">الطلبات الكلية</p>
                        <p className="text-2xl font-black text-white dir-ltr text-right">948</p>
                    </div>

                    {/* Users */}
                    <div className="bg-[#242636] p-4 rounded-2xl border border-gray-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl -mr-5 -mt-5"></div>
                        <div className="flex justify-between items-start mb-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Users size={20} /></div>
                             <span className="text-[10px] text-blue-400 font-bold flex items-center gap-0.5 bg-blue-500/10 px-1.5 py-0.5 rounded-md">
                                <Users size={10} /> Active
                            </span>
                        </div>
                        <p className="text-gray-400 text-xs font-bold mb-1">المستخدمين</p>
                        <p className="text-2xl font-black text-white dir-ltr text-right">{users.length}</p>
                    </div>

                    {/* Products */}
                    <div className="bg-[#242636] p-4 rounded-2xl border border-gray-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-full blur-2xl -mr-5 -mt-5"></div>
                        <div className="flex justify-between items-start mb-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><Package size={20} /></div>
                            <span className="text-[10px] text-purple-400 font-bold flex items-center gap-0.5 bg-purple-500/10 px-1.5 py-0.5 rounded-md">
                                <Layers size={10} /> Stock
                            </span>
                        </div>
                        <p className="text-gray-400 text-xs font-bold mb-1">المنتجات</p>
                        <p className="text-2xl font-black text-white dir-ltr text-right">{products.length}</p>
                    </div>
                </div>

                {/* 2. Charts Section */}
                <div className="grid grid-cols-1 gap-4">
                    {/* Sales Chart */}
                    <div className="bg-[#242636] p-5 rounded-2xl border border-gray-800">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-bold text-white text-sm flex items-center gap-2"><BarChart3 size={18} className="text-yellow-400" /> تحليل المبيعات</h3>
                                <p className="text-[10px] text-gray-500 mt-0.5">آخر 7 أيام</p>
                            </div>
                        </div>
                        <div className="flex items-end justify-between h-32 gap-3 pb-2 border-b border-gray-700/50">
                            {salesData.map((data, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end flex-1 group">
                                    <div className="w-full bg-[#1e1f2b] rounded-t-md relative h-full flex items-end overflow-hidden">
                                        <div className="w-full bg-yellow-400/80 group-hover:bg-yellow-400 transition-all rounded-t-md" style={{ height: `${data.value}%` }}></div>
                                    </div>
                                    <span className="text-[8px] text-gray-500 font-bold">{data.day.slice(0,1)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Category Distribution */}
                    <div className="bg-[#242636] p-5 rounded-2xl border border-gray-800">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-white text-sm flex items-center gap-2"><PieChart size={18} className="text-blue-400" /> توزيع الفئات</h3>
                        </div>
                        <div className="space-y-4">
                            {categories.slice(1, 5).map((cat, idx) => {
                                const count = products.filter(p => cat.id === 'all' || p.category === cat.id).length;
                                const percentage = Math.min(100, Math.round((count / products.length) * 100)) || 0;
                                return (
                                    <div key={idx} className="space-y-1">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-gray-300 flex items-center gap-2"><cat.icon size={12} /> {cat.name}</span>
                                            <span className="text-white">{percentage}%</span>
                                        </div>
                                        <div className="h-2 bg-[#1e1f2b] rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* 3. Recent Orders Feed */}
                <div className="bg-[#242636] rounded-2xl border border-gray-800 overflow-hidden">
                    <div className="p-4 border-b border-gray-700/50 flex justify-between items-center bg-[#2a2d3e]">
                         <h3 className="font-bold text-white text-sm flex items-center gap-2"><Clock size={16} className="text-orange-400" /> أحدث العمليات</h3>
                         <button className="text-[10px] text-blue-400">عرض الكل</button>
                    </div>
                    <div className="divide-y divide-gray-700/50">
                        {recentOrders.map((order, idx) => (
                            <div key={idx} className="p-3 flex items-center justify-between hover:bg-[#2a2d3e] transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#1f212e] flex items-center justify-center border border-gray-700">
                                        {order.status === 'completed' ? <CheckCircle size={14} className="text-green-500" /> : <Clock size={14} className="text-yellow-500" />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white">{order.item}</p>
                                        <p className="text-[10px] text-gray-500">{order.user} • {order.time}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-white dir-ltr">{order.price}</p>
                                    <p className="text-[9px] text-gray-500 font-mono">{order.id}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 4. Top Selling Products */}
                <div className="bg-[#242636] rounded-2xl border border-gray-800 overflow-hidden mb-6">
                    <div className="p-4 border-b border-gray-700/50 bg-[#2a2d3e]">
                         <h3 className="font-bold text-white text-sm flex items-center gap-2"><AwardIcon /> الأكثر مبيعاً</h3>
                    </div>
                    <table className="w-full text-right">
                        <thead className="bg-[#1e1f2b] text-[10px] text-gray-400 uppercase">
                            <tr>
                                <th className="px-4 py-3 font-bold">المنتج</th>
                                <th className="px-4 py-3 font-bold text-center">المبيعات</th>
                                <th className="px-4 py-3 font-bold text-left">الإيرادات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/50">
                            {topProducts.map((prod, idx) => (
                                <tr key={idx} className="text-xs hover:bg-[#2a2d3e] transition-colors">
                                    <td className="px-4 py-3 text-white font-medium">{prod.name}</td>
                                    <td className="px-4 py-3 text-gray-400 text-center">{prod.sold}</td>
                                    <td className="px-4 py-3 text-emerald-400 font-bold text-left dir-ltr">
                                        {prod.revenue}
                                        <span className={`block text-[9px] ${prod.growth.includes('+') ? 'text-green-500' : 'text-red-500'}`}>{prod.growth}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* CURRENCIES TAB (NEW) */}
        {activeTab === 'currencies' && (
           <div className="space-y-6">
               <div className="bg-[#242636] p-5 rounded-2xl border border-gray-700 shadow-lg">
                   <div className="flex justify-between items-center mb-6">
                       <div>
                           <h2 className="text-lg font-bold text-white flex items-center gap-2"><CircleDollarSign size={20} className="text-yellow-400" /> إدارة أسعار الصرف</h2>
                           <p className="text-gray-400 text-xs mt-1">تحديد سعر الصرف مقابل 1 دولار أمريكي (USD)</p>
                       </div>
                       <button onClick={handleResetCurrencies} className="text-xs bg-[#1f212e] text-gray-300 hover:text-white px-3 py-2 rounded-lg border border-gray-600 flex items-center gap-1">
                           <RefreshCw size={12} /> استعادة الافتراضي
                       </button>
                   </div>

                   <div className="space-y-3">
                       {currencies.map((curr) => (
                           <div key={curr.code} className="bg-[#13141f] p-3 rounded-xl border border-gray-700 flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                   <span className="text-2xl">{curr.flag}</span>
                                   <div>
                                       <p className="text-sm font-bold text-white">{curr.name}</p>
                                       <p className="text-[10px] text-gray-500 font-mono">{curr.code}</p>
                                   </div>
                               </div>

                               <div className="flex items-center gap-2">
                                   <span className="text-xs text-gray-500 font-bold">1 USD = </span>
                                   <input 
                                     type="number"
                                     step="0.01"
                                     disabled={curr.code === 'USD'}
                                     value={curr.rate}
                                     onChange={(e) => handleUpdateRate(curr.code, e.target.value)}
                                     className={`w-24 bg-[#1e1f2b] text-white text-center font-bold py-1.5 px-2 rounded-lg border focus:border-yellow-400 outline-none dir-ltr text-sm ${curr.code === 'USD' ? 'border-transparent opacity-50' : 'border-gray-600'}`}
                                   />
                                   <span className="text-xs text-yellow-400 font-bold w-8 text-center">{curr.symbol}</span>
                               </div>
                           </div>
                       ))}
                   </div>
                   <p className="text-[10px] text-gray-500 mt-4 text-center">سيتم تحديث الأسعار في التطبيق فوراً عند التعديل.</p>
               </div>
           </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
           <div className="space-y-6">
              <div className="bg-[#242636] p-6 rounded-2xl border border-gray-700">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Search size={20} className="text-yellow-400" /> البحث عن مستخدم</h2>
                <div className="flex gap-2 mb-6">
                    <input 
                        type="text" 
                        placeholder="أدخل ID المستخدم" 
                        className="flex-1 bg-[#13141f] border border-gray-600 rounded-xl p-3 text-right text-white focus:border-yellow-400 outline-none font-mono"
                        value={searchUserId}
                        onChange={(e) => setSearchUserId(e.target.value)}
                    />
                    <button onClick={handleSearchUser} className="bg-yellow-400 text-black font-bold px-6 rounded-xl hover:bg-yellow-500">بحث</button>
                </div>

                {foundUser && (
                    <div className="bg-[#1f212e] rounded-xl p-4 border border-gray-600 animate-slide-up relative overflow-hidden">
                        {foundUser.status === 'banned' && (
                             <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
                        )}
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-3">
                                <div className="w-14 h-14 bg-gray-700 rounded-full flex items-center justify-center">
                                    <User size={30} className="text-gray-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        {foundUser.name}
                                        {foundUser.status === 'banned' && <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded">محظور</span>}
                                    </h3>
                                    <p className="text-sm text-gray-400 font-mono">ID: {foundUser.id}</p>
                                    <p className="text-xs text-gray-500 mt-1">{foundUser.email}</p>
                                    <p className="text-xs text-gray-500 dir-ltr text-right">{foundUser.phone}</p>
                                </div>
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-gray-400">الرصيد</p>
                                <p className="text-2xl font-black text-green-400 font-mono">${foundUser.balance.toFixed(2)}</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <button onClick={() => handleUpdateBalance('add')} className="bg-[#242636] hover:bg-green-900/20 border border-gray-700 text-green-400 py-2 rounded-lg text-xs font-bold flex justify-center gap-1"><Plus size={14} /> شحن</button>
                            <button onClick={() => handleUpdateBalance('deduct')} className="bg-[#242636] hover:bg-red-900/20 border border-gray-700 text-red-400 py-2 rounded-lg text-xs font-bold flex justify-center gap-1"><Trash2 size={14} /> خصم</button>
                        </div>
                        <input type="number" value={amountToAdd} onChange={(e) => setAmountToAdd(e.target.value)} placeholder="المبلغ ($)" className="w-full bg-[#13141f] border border-gray-700 rounded-lg p-2 text-center text-white mb-4 text-sm" />

                        <button onClick={handleBanUser} className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${foundUser.status === 'active' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'}`}>
                            {foundUser.status === 'active' ? <><Ban size={18} /> حظر المستخدم</> : <><Unlock size={18} /> رفع الحظر</>}
                        </button>
                    </div>
                )}
              </div>
           </div>
        )}

        {/* ANNOUNCEMENTS TAB */}
        {activeTab === 'announcements' && (
            <div className="space-y-6">
                <div className="bg-[#242636] p-5 rounded-2xl border border-gray-700">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Megaphone size={20} className="text-yellow-400" /> إرسال إشعار للمستخدمين</h3>
                    
                    <div className="mb-4">
                       <label className="text-xs text-gray-400 font-bold mb-1 block">نوع الإشعار</label>
                       <div className="flex gap-2">
                           <button onClick={() => setAnnounceType('info')} className={`flex-1 py-2 rounded-lg text-xs font-bold border ${announceType === 'info' ? 'bg-blue-600/20 text-blue-400 border-blue-600' : 'bg-[#13141f] border-gray-600 text-gray-400'}`}>معلومة</button>
                           <button onClick={() => setAnnounceType('offer')} className={`flex-1 py-2 rounded-lg text-xs font-bold border ${announceType === 'offer' ? 'bg-yellow-600/20 text-yellow-400 border-yellow-600' : 'bg-[#13141f] border-gray-600 text-gray-400'}`}>عرض خاص</button>
                           <button onClick={() => setAnnounceType('alert')} className={`flex-1 py-2 rounded-lg text-xs font-bold border ${announceType === 'alert' ? 'bg-red-600/20 text-red-400 border-red-600' : 'bg-[#13141f] border-gray-600 text-gray-400'}`}>تنبيه</button>
                       </div>
                    </div>

                    <div className="mb-4">
                       <label className="text-xs text-gray-400 font-bold mb-1 block">عنوان الإشعار</label>
                       <input 
                         className="w-full bg-[#13141f] border border-gray-600 rounded-xl p-3 text-white focus:border-yellow-400 outline-none"
                         placeholder="مثال: خصم 50% لفترة محدودة!"
                         value={announceTitle}
                         onChange={(e) => setAnnounceTitle(e.target.value)}
                       />
                    </div>

                    <textarea 
                        className="w-full bg-[#13141f] border border-gray-600 rounded-xl p-3 text-white focus:border-yellow-400 outline-none min-h-[100px] mb-4"
                        placeholder="تفاصيل الإشعار..."
                        value={announceMsg}
                        onChange={(e) => setAnnounceMsg(e.target.value)}
                    />
                    <button onClick={handleSendAnnouncement} className="w-full bg-yellow-400 text-black font-bold py-3 rounded-xl hover:bg-yellow-500">إرسال الإشعار</button>
                </div>

                <div className="space-y-3">
                    {announcements.map(ann => (
                        <div key={ann.id} className="bg-[#242636] p-4 rounded-xl border border-gray-700 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                {ann.type === 'offer' && <Star size={20} className="text-yellow-400" />}
                                {ann.type === 'alert' && <AlertTriangle size={20} className="text-red-400" />}
                                {ann.type === 'info' && <Info size={20} className="text-blue-400" />}
                                <div>
                                    <p className="text-white text-sm font-bold">{ann.title}</p>
                                    <p className="text-[10px] text-gray-500">{ann.date}</p>
                                </div>
                            </div>
                            <button onClick={() => handleDeleteAnnouncement(ann.id)} className="text-red-500 bg-red-500/10 p-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={16} /></button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* BANNERS TAB */}
        {activeTab === 'banners' && (
            <div className="space-y-6">
                <button onClick={() => setShowBannerModal(true)} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg">
                    <Plus size={20} /> إضافة بانر إعلاني جديد
                </button>
                <div className="space-y-4">
                    {banners.map((banner, index) => (
                        <div key={index} className={`relative h-32 w-full rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-r ${banner.bg} border border-gray-700`}>
                            {banner.imageUrl && <img src={banner.imageUrl} alt={banner.title} className="absolute inset-0 w-full h-full object-cover z-0" />}
                            <div className="z-10 text-center relative">
                                {/* Add background overlay if image is present for readability */}
                                {banner.imageUrl && (banner.title || banner.subtitle) && <div className="absolute inset-0 bg-black/40 -z-10 blur-xl"></div>}
                                {banner.title && <h3 className="text-xl font-black text-yellow-400 drop-shadow-md">{banner.title}</h3>}
                                {banner.subtitle && <p className="text-white text-sm font-bold drop-shadow-md">{banner.subtitle}</p>}
                            </div>
                            <button onClick={() => handleDeleteBanner(banner.id)} className="absolute top-2 left-2 bg-red-600 text-white p-1.5 rounded-lg z-20 shadow-md hover:scale-105 transition-transform"><Trash2 size={14} /></button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-4">
             <button 
               onClick={() => { setEditingProduct(null); setProdForm({}); setShowProductModal(true); }}
               className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-4 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg hover:shadow-yellow-400/20 transition-all"
             >
               <Plus size={20} /> إضافة منتج جديد
             </button>
             <div className="space-y-3">
               {products.map(p => (
                 <div key={p.id} className="bg-[#242636] p-3 rounded-xl flex items-center gap-3 border border-gray-700 hover:border-gray-500 transition-colors group">
                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-br ${p.imageColor} flex-shrink-0 relative overflow-hidden`}>
                        {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-sm text-white">{p.name}</h4>
                            <span className="text-xs font-mono font-bold text-yellow-400">${p.price}</span>
                        </div>
                        <p className="text-[10px] text-gray-400">{p.category}</p>
                    </div>
                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingProduct(p); setProdForm(p); setShowProductModal(true); }} className="p-1.5 bg-blue-500/20 text-blue-400 rounded-lg"><Edit2 size={14} /></button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 bg-red-500/20 text-red-400 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {activeTab === 'categories' && (
           <div className="space-y-4">
              <button 
                onClick={() => { setEditingCategory(null); setCatForm({ name: '', icon: Gamepad2 }); setShowCategoryModal(true); }}
                className="w-full bg-[#242636] hover:bg-[#2f3245] border border-gray-700 hover:border-yellow-400 text-white p-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all border-dashed"
              >
                <Plus size={20} className="text-yellow-400" /> إضافة فئة جديدة
              </button>
              {categories.map(c => (
                 <div key={c.id} className="bg-[#242636] p-4 rounded-xl flex items-center justify-between border border-gray-700 group">
                    <div className="flex items-center gap-3">
                       <span className="p-2 bg-[#13141f] rounded-lg text-gray-300 group-hover:text-yellow-400 transition-colors"><c.icon size={20} /></span>
                       <span className="font-bold text-sm">{c.name}</span>
                    </div>
                    {/* EDIT & DELETE ACTIONS */}
                    <div className="flex items-center gap-2">
                         <button 
                            onClick={() => { setEditingCategory(c); setCatForm({ name: c.name, icon: c.icon }); setShowCategoryModal(true); }}
                            className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
                         >
                             <Edit2 size={16} />
                         </button>
                         {c.id !== 'all' && (
                            <button 
                                onClick={() => handleDeleteCategory(c.id)}
                                className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                         )}
                    </div>
                 </div>
              ))}
           </div>
        )}

        {/* TERMS TAB */}
        {activeTab === 'terms' && (
          <div className="space-y-6">
             {terms.map((term, i) => (
               <div key={term.id} className="bg-[#242636] p-5 rounded-xl border border-gray-700 shadow-sm">
                  <h3 className="font-bold text-yellow-400 mb-2">البند #{i+1}</h3>
                  <textarea className="w-full bg-[#13141f] p-3 rounded-lg text-sm text-gray-300 min-h-[80px] border border-gray-700 focus:border-green-400 outline-none text-right mb-2" value={term.contentAr.join('\n')} onChange={(e) => { const newTerms = [...terms]; newTerms[i].contentAr = e.target.value.split('\n'); setTerms(newTerms); }} />
                  <textarea className="w-full bg-[#13141f] p-3 rounded-lg text-sm text-gray-300 min-h-[80px] border border-gray-700 focus:border-blue-400 outline-none text-left dir-ltr" value={term.contentEn.join('\n')} onChange={(e) => { const newTerms = [...terms]; newTerms[i].contentEn = e.target.value.split('\n'); setTerms(newTerms); }} />
               </div>
             ))}
             <button className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold mt-4 shadow-lg transition-colors" onClick={() => alert('تم الحفظ')}>
                <Save className="inline-block ml-2" size={18} /> حفظ
             </button>
          </div>
        )}
      </div>

      {/* Banner Modal */}
      {showBannerModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-[#1f212e] w-full max-w-sm rounded-2xl p-6 border border-gray-700 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-4">إضافة بانر جديد</h2>
                <div className="mb-4">
                  <label className="text-xs text-gray-400 font-bold mb-1 block">رابط الصورة (URL) - اختياري</label>
                  <input className="w-full bg-[#13141f] p-3 rounded-xl border border-gray-700 text-white focus:border-yellow-400 outline-none text-left dir-ltr" placeholder="https://example.com/banner.jpg" value={bannerForm.imageUrl || ''} onChange={e => setBannerForm({...bannerForm, imageUrl: e.target.value})} />
                  <p className="text-[10px] text-gray-500 mt-1">إذا وضعت صورة، ستظهر بدلاً من الخلفية الملونة.</p>
                </div>
                <div className="border-t border-gray-700/50 my-4"></div>
                <input className="w-full bg-[#13141f] p-3 rounded-xl border border-gray-700 text-white mb-3 focus:border-yellow-400 outline-none" placeholder="العنوان الرئيسي (اختياري مع الصورة)" value={bannerForm.title} onChange={e => setBannerForm({...bannerForm, title: e.target.value})} />
                <input className="w-full bg-[#13141f] p-3 rounded-xl border border-gray-700 text-white mb-3 focus:border-yellow-400 outline-none" placeholder="العنوان الفرعي" value={bannerForm.subtitle} onChange={e => setBannerForm({...bannerForm, subtitle: e.target.value})} />
                <input className="w-full bg-[#13141f] p-3 rounded-xl border border-gray-700 text-white mb-3 focus:border-yellow-400 outline-none" placeholder="الوصف" value={bannerForm.desc} onChange={e => setBannerForm({...bannerForm, desc: e.target.value})} />
                <div className="flex gap-2 mt-4">
                    <button onClick={() => setShowBannerModal(false)} className="flex-1 bg-gray-700 text-white py-3 rounded-xl font-bold">إلغاء</button>
                    <button onClick={handleSaveBanner} className="flex-1 bg-yellow-400 text-black py-3 rounded-xl font-bold">حفظ</button>
                </div>
            </div>
          </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
           <div className="bg-[#1f212e] w-full max-w-lg rounded-2xl p-6 border border-gray-700 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-white">{editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}</h2>
                 <button onClick={() => setShowProductModal(false)} className="bg-[#242636] p-2 rounded-full text-gray-400 hover:text-white"><X size={20}/></button>
              </div>
              <div className="space-y-4">
                 <div><label className="text-xs text-gray-400 mb-1 block font-bold">اسم المنتج</label><input className="w-full bg-[#13141f] p-3 rounded-xl border border-gray-700 text-white focus:border-yellow-400 outline-none" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} /></div>
                 <div><label className="text-xs text-gray-400 mb-1 block font-bold">رابط الصورة (URL)</label><input className="w-full bg-[#13141f] p-3 rounded-xl border border-gray-700 text-white text-left dir-ltr focus:border-yellow-400 outline-none" value={prodForm.imageUrl || ''} onChange={e => setProdForm({...prodForm, imageUrl: e.target.value})} /></div>
                 
                 {/* New Description Field */}
                 <div>
                    <label className="text-xs text-gray-400 mb-1 block font-bold">وصف المنتج (يظهر تحت الاسم)</label>
                    <textarea 
                        className="w-full bg-[#13141f] p-3 rounded-xl border border-gray-700 text-white focus:border-yellow-400 outline-none h-20" 
                        value={prodForm.description || ''} 
                        onChange={e => setProdForm({...prodForm, description: e.target.value})}
                        placeholder="مثال: تسليم فوري - كود رقمي"
                    />
                 </div>

                 <div className="flex gap-4">
                    <div className="flex-1"><label className="text-xs text-gray-400 mb-1 block font-bold">السعر الأساسي ($)</label><input type="number" className="w-full bg-[#13141f] p-3 rounded-xl border border-gray-700 text-white focus:border-yellow-400 outline-none" value={prodForm.price} onChange={e => setProdForm({...prodForm, price: parseFloat(e.target.value)})} /></div>
                    <div className="flex-1"><label className="text-xs text-gray-400 mb-1 block font-bold">Tag</label><input className="w-full bg-[#13141f] p-3 rounded-xl border border-gray-700 text-white focus:border-yellow-400 outline-none" value={prodForm.tag || ''} onChange={e => setProdForm({...prodForm, tag: e.target.value})} /></div>
                 </div>
                 <div><label className="text-xs text-gray-400 mb-1 block font-bold">الفئة</label><select className="w-full bg-[#13141f] p-3 rounded-xl border border-gray-700 text-white focus:border-yellow-400 outline-none" value={prodForm.category} onChange={e => setProdForm({...prodForm, category: e.target.value})}>{categories.map(c => <option key={c.id} value={c.id === 'all' ? 'Games' : c.id}>{c.name}</option>)}</select></div>
                 
                 {/* Regions Builder */}
                 <div className="pt-4 border-t border-gray-800">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Flag size={14} className="text-blue-400"/> الدول المتاحة</h3>
                    <div className="flex flex-wrap gap-2">
                        {PREDEFINED_REGIONS.map(region => {
                            const isSelected = prodForm.regions?.some(r => r.id === region.id);
                            return (
                                <button 
                                    key={region.id}
                                    onClick={() => toggleRegion(region)}
                                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${isSelected ? 'bg-blue-600/20 text-blue-400 border-blue-500' : 'bg-[#13141f] text-gray-400 border-gray-700'}`}
                                >
                                    <span>{region.flag}</span>
                                    {region.name}
                                </button>
                            );
                        })}
                    </div>
                 </div>

                 {/* Denominations Builder */}
                 <div className="pt-4 border-t border-gray-800">
                    <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Tags size={14} className="text-yellow-400"/> الكميات / الفئات السعرية</h3>
                    
                    {/* Add New Denom */}
                    <div className="flex gap-2 mb-3">
                        <input className="flex-[2] bg-[#13141f] p-2.5 rounded-xl border border-gray-700 text-white text-xs focus:border-yellow-400 outline-none" placeholder="الاسم (مثلاً: 100 جوهرة)" value={tempDenomLabel} onChange={e => setTempDenomLabel(e.target.value)} />
                        <input className="flex-1 bg-[#13141f] p-2.5 rounded-xl border border-gray-700 text-white text-xs focus:border-yellow-400 outline-none dir-ltr" type="number" placeholder="السعر" value={tempDenomPrice} onChange={e => setTempDenomPrice(e.target.value)} />
                        <button onClick={addDenomination} className="bg-yellow-400 text-black px-3 rounded-xl hover:bg-yellow-500"><Plus size={18} /></button>
                    </div>

                    {/* List */}
                    <div className="space-y-2">
                        {prodForm.denominations && prodForm.denominations.length > 0 ? (
                            prodForm.denominations.map(denom => (
                                <div key={denom.id} className="bg-[#13141f] p-2 rounded-lg flex items-center justify-between border border-gray-700/50">
                                    <span className="text-xs text-white font-bold">{denom.label}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-yellow-400 font-mono">${denom.price}</span>
                                        <button onClick={() => removeDenomination(denom.id)} className="text-red-500 hover:text-red-400"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-[10px] text-gray-500 text-center py-2">لا توجد فئات مضافة، سيتم استخدام السعر الأساسي فقط.</p>
                        )}
                    </div>
                 </div>

              </div>
              <div className="flex gap-3 mt-8 pt-4 border-t border-gray-800">
                 <button onClick={() => setShowProductModal(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl font-bold text-white transition-colors">إلغاء</button>
                 <button onClick={handleSaveProduct} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black py-3 rounded-xl font-bold transition-colors">حفظ المنتج</button>
              </div>
           </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
           <div className="bg-[#1f212e] w-full max-w-sm rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <h2 className="text-lg font-bold text-white mb-6">{editingCategory ? 'تعديل فئة' : 'فئة جديدة'}</h2>
              <input className="w-full bg-[#13141f] p-3 rounded-xl border border-gray-700 text-white focus:border-yellow-400 outline-none mb-4" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} placeholder="أدخل اسم الفئة" />
              <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
                  {AVAILABLE_ICONS.map((item) => (
                      <button key={item.id} onClick={() => setCatForm({...catForm, icon: item.icon})} className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 border transition-all ${catForm.icon === item.icon ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-[#13141f] text-gray-400 border-gray-700'}`}><item.icon size={20} /></button>
                  ))}
              </div>
              <div className="flex gap-3 mt-6">
                 <button onClick={() => setShowCategoryModal(false)} className="flex-1 bg-gray-700 text-white py-3 rounded-xl font-bold">إلغاء</button>
                 <button onClick={handleSaveCategory} className="flex-1 bg-yellow-400 text-black py-3 rounded-xl font-bold">حفظ</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Helper for award icon since it's not in standard Lucide import used above
const AwardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
);

export default Admin;
