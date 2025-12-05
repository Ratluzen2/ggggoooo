
import React, { useState, useEffect } from 'react';
import { View, Product, Category, TermSection, Banner, UserProfile, Announcement, CartItem, Currency } from './types';
import Home from './pages/Home';
import SearchPage from './pages/Search';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Admin from './pages/Admin';
import BottomNav from './components/BottomNav';
import TopHeader from './components/TopHeader';
import CheckoutModal from './components/CheckoutModal';
import { ShoppingBag, ShoppingCart, Trash2, ArrowLeft, CheckCircle, CreditCard } from 'lucide-react';
import { INITIAL_CURRENCIES, PRODUCTS as INITIAL_PRODUCTS, CATEGORIES as INITIAL_CATEGORIES, INITIAL_TERMS, INITIAL_BANNERS, MOCK_USERS } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [isLoading, setIsLoading] = useState(true);
  const [currencyCode, setCurrencyCode] = useState<string>('IQD');
  
  // --- Global App State (Lifted for Admin Control) ---
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [terms, setTerms] = useState<TermSection[]>(INITIAL_TERMS);
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>(INITIAL_CURRENCIES);
  
  // --- Cart State ---
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeCheckoutItem, setActiveCheckoutItem] = useState<CartItem | null>(null);

  // Current User (simulated as the first mock user for now, but in reality would be auth based)
  const currentUser = users.find(u => u.id === '123456');
  const balanceUSD = currentUser ? currentUser.balance : 0.00;

  // Simulate App Loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); 
    return () => clearTimeout(timer);
  }, []);

  const handleSetView = (view: View) => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(5);
    }
    setCurrentView(view);
  };

  const formatPrice = (amountInUSD: number): string => {
    // Use the dynamic currencies state instead of the constant
    const currency = currencies.find(c => c.code === currencyCode) || currencies[0];
    const convertedAmount = amountInUSD * currency.rate;
    const formatter = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${currency.symbol} ${formatter.format(convertedAmount)}`;
  };

  // --- Cart Logic ---
  const addToCart = (item: CartItem) => {
    setCartItems(prev => [...prev, item]);
    // Optional: Vibrate or show toast could be triggered here
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleBuyItem = (item: CartItem) => {
      setActiveCheckoutItem(item);
  };

  const handleCheckoutSuccess = () => {
      if (activeCheckoutItem) {
          alert('تمت عملية الشراء بنجاح! تجد الكود في قائمة طلباتي.');
          removeFromCart(activeCheckoutItem.id);
          setActiveCheckoutItem(null);
      }
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const renderView = () => {
    switch (currentView) {
      case View.HOME:
        return (
          <Home 
            setView={handleSetView} 
            formatPrice={formatPrice} 
            products={products} 
            categories={categories} 
            banners={banners}
            announcements={announcements.filter(a => a.isActive)}
            addToCart={addToCart}
            userBalance={balanceUSD}
          />
        );
      case View.SEARCH:
        return (
            <SearchPage 
                setView={handleSetView} 
                formatPrice={formatPrice} 
                categories={categories} 
                addToCart={addToCart}
                userBalance={balanceUSD}
            />
        );
      case View.WALLET:
        return <Wallet setView={handleSetView} formatPrice={formatPrice} balance={balanceUSD} />;
      case View.PROFILE:
        return (
          <Profile 
            setView={handleSetView} 
            currentCurrency={currencyCode} 
            onCurrencyChange={setCurrencyCode}
            terms={terms} 
            user={currentUser}
            currencies={currencies}
          />
        );
      case View.ADMIN:
        return (
          <Admin 
            setView={handleSetView}
            products={products}
            setProducts={setProducts}
            categories={categories}
            setCategories={setCategories}
            terms={terms}
            setTerms={setTerms}
            banners={banners}
            setBanners={setBanners}
            users={users}
            setUsers={setUsers}
            announcements={announcements}
            setAnnouncements={setAnnouncements}
            currencies={currencies}
            setCurrencies={setCurrencies}
          />
        );
      case View.NOTIFICATIONS:
        return <Notifications setView={handleSetView} formatPrice={formatPrice} announcements={announcements} />;
      case View.CART:
        return (
          <div className="min-h-screen pb-24 bg-[#13141f] relative pt-4">
             {/* Header */}
             <div className="px-4 mb-4 flex items-center justify-between">
                <button onClick={() => handleSetView(View.HOME)}><ArrowLeft className="text-white" /></button>
                <h1 className="text-xl font-bold text-white">سلة المشتريات</h1>
                <div className="w-6"></div>
             </div>

             {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center pt-16 text-center px-6 animate-fadeIn">
                    <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center mb-4 relative shadow-lg shadow-yellow-400/20">
                        <ShoppingCart size={48} className="text-black" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-xl font-bold mb-2 text-white">قائمة مشترياتك فارغة</h2>
                    <p className="text-gray-400 text-sm mb-8">لم تقم باضافه شيئ الى السلة</p>
                    <button onClick={() => handleSetView(View.HOME)} className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:bg-yellow-500 transition-colors active:scale-95 transform">
                        تصفح المنتجات
                    </button>
                </div>
             ) : (
                <div className="px-4 space-y-4 animate-slide-up">
                    
                    {/* Summary (Moved to Top) */}
                    <div className="bg-[#242636] p-4 rounded-2xl border border-gray-700 shadow-lg mb-2">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-sm">عدد العناصر</span>
                            <span className="text-white font-bold">{cartItems.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">الإجمالي الكلي</span>
                            <span className="text-yellow-400 font-black text-xl dir-ltr">{formatPrice(cartTotal)}</span>
                        </div>
                    </div>

                    {/* Cart Items List */}
                    <div className="space-y-3">
                        {cartItems.map((item) => (
                            <div key={item.id} className="bg-[#242636] p-3 rounded-xl border border-gray-700 shadow-sm relative overflow-hidden group">
                                <div className="flex items-start gap-3">
                                    {/* Image */}
                                    <div className={`w-20 h-24 rounded-lg bg-gradient-to-br ${item.imageColor} flex-shrink-0 relative overflow-hidden flex items-center justify-center`}>
                                        {item.imageUrl ? (
                                             <img 
                                               src={item.imageUrl} 
                                               alt={item.name} 
                                               className="w-full h-full object-cover opacity-90"
                                               referrerPolicy="no-referrer"
                                               onError={(e) => {
                                                  const target = e.target as HTMLImageElement;
                                                  target.style.display = 'none';
                                                  target.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                                                  const span = document.createElement('span');
                                                  span.className = 'text-white text-[10px] font-bold';
                                                  span.innerText = item.name.slice(0, 5);
                                                  target.parentElement!.appendChild(span);
                                               }}
                                             />
                                        ) : (
                                             <span className="text-white text-[10px] font-bold">{item.name.slice(0,5)}</span>
                                        )}
                                    </div>
                                    
                                    {/* Info */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-sm font-bold text-white line-clamp-1">{item.name}</h3>
                                        </div>
                                        
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {item.selectedRegion && (
                                                <span className="text-[10px] bg-[#13141f] text-gray-300 px-1.5 py-0.5 rounded border border-gray-700 flex items-center gap-1">
                                                    {item.selectedRegion.flag} {item.selectedRegion.name}
                                                </span>
                                            )}
                                            {item.selectedDenomination && (
                                                <span className="text-[10px] bg-yellow-400/10 text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-400/30">
                                                    {item.selectedDenomination.label}
                                                </span>
                                            )}
                                        </div>
                                        
                                        <p className="text-lg font-black text-yellow-400 dir-ltr font-mono leading-none mb-3">{formatPrice(item.price)}</p>
                                    </div>
                                </div>

                                {/* Actions Row */}
                                <div className="flex gap-2 mt-2 pt-2 border-t border-gray-700/50">
                                    <button 
                                        onClick={() => handleBuyItem(item)}
                                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-lg text-xs shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                                    >
                                        <CheckCircle size={14} />
                                        شراء الآن
                                    </button>
                                    <button 
                                        onClick={() => removeFromCart(item.id)}
                                        className="px-3 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center active:scale-95"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
             )}

             {/* Checkout Modal for Cart */}
             <CheckoutModal 
                isOpen={!!activeCheckoutItem}
                onClose={() => setActiveCheckoutItem(null)}
                itemName={activeCheckoutItem?.name || ''}
                price={activeCheckoutItem?.price || 0}
                userBalance={balanceUSD}
                onSuccess={handleCheckoutSuccess}
                formatPrice={formatPrice}
             />
          </div>
        );
      case View.ORDERS:
        return (
          <div className="flex flex-col items-center justify-center pt-20 pb-24 text-center px-6 animate-fadeIn">
             <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center mb-4 text-black shadow-lg shadow-yellow-400/20">
                <ShoppingBag size={48} strokeWidth={1.5} />
             </div>
             <h2 className="text-xl font-bold mb-2 text-white">لا توجد طلبات</h2>
             <p className="text-gray-500 text-sm">لم تقم بأي عملية شراء حتى الآن</p>
             <button onClick={() => handleSetView(View.HOME)} className="mt-6 bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform">
               تصفح المنتجات
             </button>
          </div>
        );
      default:
        return (
          <Home 
            setView={handleSetView} 
            formatPrice={formatPrice} 
            products={products} 
            categories={categories} 
            banners={banners}
            announcements={announcements.filter(a => a.isActive)}
            addToCart={addToCart}
            userBalance={balanceUSD}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#13141f] flex flex-col items-center justify-center z-[100]">
        <div className="relative mb-6">
          <div className="w-24 h-24 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center font-black text-3xl text-white pb-1">R</div>
        </div>
        <h1 className="text-3xl font-black text-yellow-400 tracking-widest uppercase">RATLUZEN</h1>
        <p className="text-gray-500 text-xs mt-2 font-mono tracking-widest">SERVICES</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center h-[100dvh] bg-[#000000] overflow-hidden">
      <div className="w-full h-full bg-[#13141f] text-white font-cairo sm:max-w-[430px] sm:h-[900px] sm:my-auto sm:rounded-[3rem] sm:border-[8px] sm:border-[#2d2d2d] shadow-2xl relative overflow-hidden ring-1 ring-white/10 flex flex-col">
        
        {/* Persistent Top Header (Hidden in Admin View & Cart View for cleaner look) */}
        {currentView !== View.ADMIN && currentView !== View.CART && (
          <TopHeader 
            setView={handleSetView} 
            formattedBalance={formatPrice(balanceUSD)} 
            cartItemCount={cartItems.length}
          />
        )}

        {/* Scrollable Content Area */}
        <div className={`flex-1 overflow-y-auto no-scrollbar scroll-smooth ${currentView !== View.ADMIN && currentView !== View.CART ? 'pb-24 pt-14' : ''}`}>
          {renderView()}
        </div>

        {/* Persistent Bottom Nav (Hidden in Admin View) */}
        {currentView !== View.ADMIN && (
          <BottomNav currentView={currentView} setView={handleSetView} cartItemCount={cartItems.length} />
        )}
        
        <div className="hidden sm:block absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-[#2d2d2d] rounded-b-2xl z-[60]"></div>
      </div>
    </div>
  );
};

export default App;
