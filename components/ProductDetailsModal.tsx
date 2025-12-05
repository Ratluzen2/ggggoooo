
import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingCart, CheckCircle, ArrowLeft, CreditCard, Wallet, Calendar, User, Lock } from 'lucide-react';
import { Product, CartItem } from '../types';

interface Props {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  formatPrice: (price: number) => string;
  addToCart: (item: CartItem) => void;
  userBalance?: number; 
}

const ProductDetailsModal: React.FC<Props> = ({ product, isOpen, onClose, formatPrice, addToCart, userBalance = 0 }) => {
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedDenomId, setSelectedDenomId] = useState<string>('');
  
  // Checkout Steps State
  const [currentStep, setCurrentStep] = useState<'details' | 'payment_select' | 'card_form'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card' | null>(null);

  // Reset or initialize state when product opens
  useEffect(() => {
    if (isOpen) {
        // Reset Steps
        setCurrentStep('details');
        setPaymentMethod(null);
        
        // Auto-select first Region if available
        if (product.regions && product.regions.length > 0) {
            setSelectedRegion(product.regions[0].id);
        } else {
            setSelectedRegion('');
        }
        
        // Auto-select first Denomination if available
        if (product.denominations && product.denominations.length > 0) {
            setSelectedDenomId(product.denominations[0].id);
        } else {
            setSelectedDenomId('');
        }
    }
  }, [isOpen, product]);

  if (!isOpen) return null;

  // Helpers to get full objects
  const regionObj = product.regions?.find(r => r.id === selectedRegion);
  const denomObj = product.denominations?.find(d => d.id === selectedDenomId);

  // Determine price to show: if a denomination is selected, use that, otherwise use product base price
  const currentPrice = denomObj ? denomObj.price : product.price;

  const handleAddToCart = () => {
    if (product.denominations && product.denominations.length > 0 && !selectedDenomId) {
        alert("يرجى اختيار الكمية/الفئة السعرية أولاً");
        return;
    }

    const newItem: CartItem = {
        id: Date.now().toString(),
        productId: product.id,
        name: product.name,
        price: currentPrice,
        imageUrl: product.imageUrl,
        imageColor: product.imageColor,
        selectedRegion: regionObj,
        selectedDenomination: denomObj,
        quantity: 1
    };

    addToCart(newItem);
    onClose();
    alert("تمت الإضافة إلى السلة بنجاح ✅");
  };

  const handleBuyNowClick = () => {
      if (product.denominations && product.denominations.length > 0 && !selectedDenomId) {
          alert("يرجى اختيار الكمية/الفئة السعرية أولاً");
          return;
      }
      setCurrentStep('payment_select');
  };

  const handleProceedPayment = () => {
      if (!paymentMethod) return;
      
      if (paymentMethod === 'wallet') {
        if (userBalance >= currentPrice) {
            if(confirm(`هل أنت متأكد من الشراء من رصيد المحفظة؟\nالمبلغ: ${formatPrice(currentPrice)}`)) {
                alert('تمت عملية الشراء بنجاح! (محاكاة)');
                onClose();
            }
        } else {
            alert('عذراً، رصيد المحفظة غير كافي لإتمام العملية.');
        }
      } else {
          setCurrentStep('card_form');
      }
  };

  // --- RENDER CONTENT BASED ON STEP ---
  
  const renderDetails = () => (
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 pb-4">
            {/* Header Section */}
            <div className="flex gap-5 items-start mb-6">
                 {/* Product Card Graphic */}
                <div className={`w-32 h-40 rounded-2xl bg-gradient-to-br ${product.imageColor} flex items-center justify-center shadow-lg relative overflow-hidden flex-shrink-0 border border-white/10 group`}>
                     {product.imageUrl ? (
                         <img 
                           src={product.imageUrl} 
                           alt={product.name} 
                           className="w-full h-full object-cover opacity-90"
                           referrerPolicy="no-referrer"
                           onError={(e) => {
                               const target = e.target as HTMLImageElement;
                               target.style.display = 'none';
                               target.parentElement!.classList.add('flex', 'items-center', 'justify-center');
                               const span = document.createElement('span');
                               span.className = 'text-white text-xs font-bold text-center p-2';
                               span.innerText = product.name;
                               target.parentElement!.appendChild(span);
                           }}
                         />
                     ) : (
                        <div className="w-16 h-16 bg-white/20 rounded-full backdrop-blur-sm flex items-center justify-center shadow-inner">
                           <span className="text-white text-[10px] font-bold text-center leading-tight opacity-90">{product.name}</span>
                        </div>
                     )}
                     
                     {product.tag && (
                         <div className="absolute top-2 left-2 bg-yellow-400 text-black text-[8px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                             {product.tag}
                         </div>
                     )}
                </div>

                {/* Text Info */}
                <div className="flex-1 py-2">
                    <h2 className="text-xl font-bold text-white mb-2 leading-snug">{product.name}</h2>
                    <p className="text-gray-400 text-xs mb-4 leading-relaxed whitespace-pre-line">
                        {product.description || 'تسليم إلكتروني فوري مباشر\nكود رقمي يصلك فوراً'}
                    </p>
                    
                    <div className="flex items-center gap-1 bg-[#242636] w-fit px-3 py-1.5 rounded-lg border border-gray-700 shadow-sm">
                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-yellow-400 text-xs font-bold dir-ltr pt-0.5">4.9 (128)</span>
                    </div>
                </div>
            </div>

            {/* Region Selection */}
            {product.regions && product.regions.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-right text-gray-300 text-xs font-bold mb-3">بلد الحساب</h3>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {product.regions.map((region) => (
                            <button
                                key={region.id}
                                onClick={() => setSelectedRegion(region.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all min-w-[85px] h-[42px] justify-center relative ${
                                    selectedRegion === region.id 
                                    ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg shadow-yellow-400/20' 
                                    : 'bg-[#242636] border-transparent text-gray-400 hover:border-gray-600'
                                }`}
                            >
                                <span className="text-lg leading-none pt-0.5">{region.flag}</span>
                                <span className="text-xs font-bold leading-none">{region.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Denomination Selection */}
            {product.denominations && product.denominations.length > 0 && (
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-gray-300 text-xs font-bold">اختيار كمية المنتج</h3>
                    </div>
                    
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 snap-x snap-mandatory">
                        {product.denominations.map((denom) => (
                            <button
                                key={denom.id}
                                onClick={() => setSelectedDenomId(denom.id)}
                                className={`
                                    flex items-center justify-center gap-2 px-3 py-2 rounded-xl border transition-all min-w-[85px] h-[42px] snap-center relative
                                    ${selectedDenomId === denom.id 
                                    ? 'bg-yellow-400 border-yellow-400 text-black shadow-lg shadow-yellow-400/20' 
                                    : 'bg-[#242636] border-transparent text-gray-400 hover:border-gray-600'}
                                `}
                            >
                                <span className="text-xs font-bold leading-none">{denom.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Total Price Display */}
            <div className="flex justify-between items-center mb-4 px-2 bg-[#242636] p-4 rounded-xl border border-gray-800">
                 <span className="text-white font-bold text-sm">المجموع الكلي</span>
                 <span className="text-yellow-400 font-black text-xl dir-ltr">{formatPrice(currentPrice)}</span>
            </div>
      </div>
  );

  const renderPaymentSelect = () => (
      <div className="flex-1 p-6 animate-fadeIn flex flex-col h-full">
          <div className="flex items-center gap-2 mb-6 cursor-pointer text-gray-400 hover:text-white" onClick={() => setCurrentStep('details')}>
              <ArrowLeft size={20} />
              <span className="text-sm font-bold">الرجوع للمنتج</span>
          </div>

          <div className="text-center mb-6">
             <h2 className="text-xl font-bold text-white">اختر طريقة الدفع</h2>
             <p className="text-yellow-400 font-black text-xl dir-ltr mt-1 font-mono">{formatPrice(currentPrice)}</p>
          </div>

          <div className="space-y-4 flex-1">
              {/* Wallet Option */}
              <button 
                onClick={() => {
                    if (userBalance >= currentPrice) setPaymentMethod('wallet');
                }}
                className={`w-full p-5 rounded-2xl border transition-all flex items-center justify-between group relative overflow-hidden ${
                    paymentMethod === 'wallet' 
                    ? 'bg-yellow-400/10 border-yellow-400' 
                    : 'bg-[#242636] border-gray-700 hover:border-gray-500'
                } ${userBalance < currentPrice ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                  <div className="flex items-center gap-4 relative z-10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${paymentMethod === 'wallet' ? 'bg-yellow-400 text-black' : 'bg-emerald-500/10 text-emerald-500'}`}>
                          <Wallet size={24} />
                      </div>
                      <div className="text-right">
                          <h3 className={`font-bold text-sm ${paymentMethod === 'wallet' ? 'text-yellow-400' : 'text-white'}`}>محفظتي</h3>
                          <p className="text-gray-400 text-xs mt-1 dir-ltr text-right font-mono">
                              Balance: {formatPrice(userBalance)}
                          </p>
                      </div>
                  </div>
                  {paymentMethod === 'wallet' && <div className="absolute top-5 left-5 text-yellow-400"><CheckCircle size={20} /></div>}
                  {userBalance < currentPrice && (
                      <span className="text-[10px] text-red-500 bg-red-500/10 px-2 py-1 rounded font-bold absolute top-5 left-5">رصيد غير كافي</span>
                  )}
              </button>

              {/* Card Option */}
              <button 
                onClick={() => setPaymentMethod('card')}
                className={`w-full p-5 rounded-2xl border transition-all flex items-center justify-between group relative overflow-hidden ${
                    paymentMethod === 'card' 
                    ? 'bg-yellow-400/10 border-yellow-400' 
                    : 'bg-[#242636] border-gray-700 hover:border-gray-500'
                }`}
              >
                  <div className="flex items-center gap-4 relative z-10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${paymentMethod === 'card' ? 'bg-yellow-400 text-black' : 'bg-blue-500/10 text-blue-500'}`}>
                          <CreditCard size={24} />
                      </div>
                      <div className="text-right">
                          <h3 className={`font-bold text-sm ${paymentMethod === 'card' ? 'text-yellow-400' : 'text-white'}`}>بطاقة مصرفية</h3>
                          <div className="flex gap-1 mt-1 opacity-80">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4 bg-white rounded px-1" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4 bg-white rounded px-1" />
                          </div>
                      </div>
                  </div>
                  {paymentMethod === 'card' && <div className="absolute top-5 left-5 text-yellow-400"><CheckCircle size={20} /></div>}
              </button>
          </div>

          <div className="pt-6 mt-auto">
             <button 
               onClick={handleProceedPayment}
               disabled={!paymentMethod}
               className={`w-full py-4 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95 ${
                   paymentMethod 
                   ? 'bg-yellow-400 text-black hover:bg-yellow-500 shadow-yellow-400/20' 
                   : 'bg-gray-700 text-gray-400 cursor-not-allowed'
               }`}
             >
               اكمال الدفع
             </button>
          </div>
      </div>
  );

  const renderCardForm = () => (
      <div className="flex-1 p-6 animate-fadeIn overflow-y-auto no-scrollbar">
          <div className="flex items-center gap-2 mb-6 cursor-pointer text-gray-400 hover:text-white" onClick={() => setCurrentStep('payment_select')}>
              <ArrowLeft size={20} />
              <span className="text-sm font-bold">تغيير طريقة الدفع</span>
          </div>

          <h2 className="text-lg font-bold text-white mb-6 text-center">الدفع عبر البطاقة</h2>

          <div className="space-y-4">
                 <div>
                    <label className="text-xs text-gray-400 font-bold mb-2 block text-right">رقم البطاقة</label>
                    <div className="relative">
                        <input 
                        type="text" 
                        placeholder="0000 0000 0000 0000"
                        className="w-full bg-[#242636] border border-gray-700 rounded-xl py-3 pr-10 pl-4 text-white text-right focus:border-yellow-400 focus:outline-none transition-colors font-mono"
                        />
                        <CreditCard className="absolute right-3 top-3.5 text-gray-500" size={18} />
                    </div>
                 </div>

                 <div>
                    <label className="text-xs text-gray-400 font-bold mb-2 block text-right">اسم حامل البطاقة</label>
                    <div className="relative">
                        <input 
                        type="text" 
                        placeholder="Name on Card"
                        className="w-full bg-[#242636] border border-gray-700 rounded-xl py-3 pr-10 pl-4 text-white text-right focus:border-yellow-400 focus:outline-none transition-colors"
                        />
                        <User className="absolute right-3 top-3.5 text-gray-500" size={18} />
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <div className="relative flex-1">
                        <label className="text-xs text-gray-400 font-bold mb-2 block text-right">تاريخ الانتهاء</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY"
                          className="w-full bg-[#242636] border border-gray-700 rounded-xl py-3 pr-10 pl-4 text-white text-right focus:border-yellow-400 focus:outline-none transition-colors font-mono"
                        />
                        <Calendar className="absolute right-3 top-3.5 text-gray-500" size={18} />
                    </div>
                    <div className="relative flex-1">
                        <label className="text-xs text-gray-400 font-bold mb-2 block text-right">CVV</label>
                        <input 
                          type="text" 
                          placeholder="123"
                          maxLength={3}
                          className="w-full bg-[#242636] border border-gray-700 rounded-xl py-3 pr-10 pl-4 text-white text-right focus:border-yellow-400 focus:outline-none transition-colors font-mono"
                        />
                        <Lock className="absolute right-3 top-3.5 text-gray-500" size={18} />
                    </div>
                 </div>
          </div>

          <button 
            onClick={() => { alert('تمت عملية الشراء بنجاح! (محاكاة)'); onClose(); }}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl mt-8 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
              <CheckCircle size={18} />
              دفع {formatPrice(currentPrice)}
          </button>
      </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="bg-[#1f212e] w-full max-w-md sm:rounded-3xl rounded-t-3xl relative z-10 animate-slide-up max-h-[90vh] flex flex-col shadow-2xl border-t border-gray-700 h-[85vh] sm:h-auto">
        
        {/* Close Button (X) */}
        <button 
            onClick={onClose}
            className="absolute top-4 left-4 z-50 p-2 bg-[#242636]/80 hover:bg-[#2f3245] rounded-full text-gray-400 hover:text-white border border-gray-700/50 backdrop-blur-md transition-all shadow-lg active:scale-95"
            aria-label="Close"
        >
            <X size={20} strokeWidth={2} />
        </button>

        {/* Handle Bar (Mobile feel) */}
        <div className="w-full flex justify-center pt-3 pb-1" onClick={onClose}>
            <div className="w-12 h-1.5 bg-gray-600 rounded-full opacity-50"></div>
        </div>

        {/* Dynamic Content Body */}
        {currentStep === 'details' && renderDetails()}
        {currentStep === 'payment_select' && renderPaymentSelect()}
        {currentStep === 'card_form' && renderCardForm()}

        {/* Action Buttons (Only on Details Step) */}
        {currentStep === 'details' && (
            <div className="p-4 bg-[#1f212e] border-t border-gray-800 flex gap-3 pb-safe">
                <button 
                    onClick={handleBuyNowClick}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                >
                    اشتر الآن
                </button>
                <button 
                    onClick={handleAddToCart}
                    className="flex-[1.5] bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3.5 rounded-xl shadow-lg shadow-yellow-400/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                    <ShoppingCart size={18} />
                    أضف المنتج للسلة
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetailsModal;
