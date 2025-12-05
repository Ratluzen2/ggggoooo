
import React, { useState } from 'react';
import { Plus, CreditCard, X, Calendar, Lock, User } from 'lucide-react';
import { View, Transaction } from '../types';
import { TRANSACTIONS } from '../constants';

interface Props {
  setView: (view: View) => void;
  formatPrice: (price: number) => string;
  balance: number;
}

const Wallet: React.FC<Props> = ({ setView, formatPrice, balance }) => {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [showAddBalanceModal, setShowAddBalanceModal] = useState(false);

  const filters = [
    { id: 'All', label: 'الجميع' },
    { id: 'Visa', label: 'Visa' },
    { id: 'Mastercard', label: 'Mastercard' }
  ];

  const filteredTransactions = TRANSACTIONS.filter((tx) => {
    if (activeFilter === 'All') return true;
    return tx.title.toLowerCase().includes(activeFilter.toLowerCase());
  });

  return (
    <div className="min-h-screen pb-24 pt-4 relative">
      <div className="px-4 mb-4">
        <h1 className="text-xl font-bold text-white text-right">محفظتي</h1>
      </div>

      <div className="px-4 space-y-5">
        
        <div className="bg-[#242636] rounded-2xl p-0 overflow-hidden shadow-lg border border-gray-800">
           <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-8 flex flex-col items-center justify-center text-white relative shadow-inner">
              <div className="text-center z-10">
                <p className="text-sm font-bold mb-1 opacity-90 text-green-50">رصيد محفظتك الحالي</p>
                <div className="flex items-center justify-center gap-1">
                   <span className="text-4xl font-black dir-ltr tracking-wider drop-shadow-md">{formatPrice(balance)}</span>
                </div>
              </div>
              <div className="absolute top-0 left-0 w-full h-full opacity-15" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
           </div>

           <div className="flex p-4 bg-[#242636]">
              <button 
                onClick={() => setShowAddBalanceModal(true)}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black py-3.5 rounded-xl font-bold text-sm shadow-lg transition-colors flex items-center justify-center gap-2 active:scale-95 transform"
              >
                <Plus size={18} strokeWidth={3} />
                إضافة رصيد
              </button>
           </div>
        </div>

        <div>
          <h3 className="text-right font-bold text-white mb-4">تسلسل العمليات</h3>
          
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
             {filters.map((filter) => (
               <button
                 key={filter.id}
                 onClick={() => setActiveFilter(filter.id)}
                 className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm transition-all border ${
                   activeFilter === filter.id
                     ? 'bg-[#10B981] text-white border-[#10B981]' 
                     : 'bg-[#242636] text-gray-400 border-gray-700 hover:border-gray-500'
                 }`}
               >
                 {filter.label}
               </button>
             ))}
          </div>

          <div className="space-y-3">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx: Transaction) => (
                <div key={tx.id} className="bg-[#1e1f2b] p-4 rounded-xl flex items-center justify-between border border-gray-800 shadow-sm hover:border-gray-700 transition-colors animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#252836] flex items-center justify-center text-gray-400 border border-gray-700">
                       <tx.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white mb-1">{tx.title}</h4>
                      <p className="text-[10px] text-gray-500">الطلب #947995</p>
                      <p className="text-[10px] text-gray-500 dir-ltr text-right">{tx.date}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`font-bold text-sm dir-ltr ${tx.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.type === 'credit' ? '+' : ''} {formatPrice(tx.amount)}
                    </span>
                    <p className="text-[10px] text-gray-500 mt-1">تنتهي في</p>
                    <p className="text-[10px] text-gray-400">2025-11-24</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm bg-[#1e1f2b] rounded-xl border border-dashed border-gray-800">
                لا توجد عمليات {activeFilter !== 'All' ? `بواسطة ${activeFilter}` : ''}
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddBalanceModal && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center">
           <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAddBalanceModal(false)}></div>
           
           <div className="bg-[#1f212e] w-full max-w-md rounded-t-3xl p-6 relative z-10 animate-slide-up border-t border-gray-700 max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between mb-6">
                  <button onClick={() => setShowAddBalanceModal(false)} className="p-2 bg-[#242636] rounded-xl text-gray-400 hover:text-white">
                      <X size={20} />
                  </button>
                  <h2 className="text-lg font-bold text-white">إضافة رصيد</h2>
                  <div className="w-9"></div>
              </div>

              <div className="mb-6">
                 <label className="text-xs font-bold text-gray-400 mb-2 block text-right">المبلغ المراد شحنه</label>
                 <div className="relative">
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full bg-[#13141f] border border-gray-700 rounded-xl py-4 pr-4 pl-12 text-white text-xl font-bold focus:border-yellow-400 focus:outline-none transition-colors text-right dir-ltr"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">$</div>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-3 mb-2">
                     <span className="text-white font-bold text-sm">بيانات البطاقة</span>
                     <div className="flex gap-2 opacity-70">
                        <div className="bg-white px-1.5 py-0.5 rounded text-[10px] font-black text-blue-800 tracking-tighter italic">VISA</div>
                        <div className="bg-white px-1.5 py-0.5 rounded flex items-center justify-center gap-0.5">
                            <div className="w-2.5 h-2.5 bg-red-500 rounded-full opacity-80"></div>
                            <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full opacity-80 -ml-1"></div>
                        </div>
                     </div>
                 </div>

                 <div className="relative">
                    <input 
                      type="text" 
                      placeholder="0000 0000 0000 0000"
                      className="w-full bg-[#242636] border border-gray-700 rounded-xl py-3 pr-10 pl-4 text-white text-right focus:border-yellow-400 focus:outline-none transition-colors font-mono"
                    />
                    <CreditCard className="absolute right-3 top-3.5 text-gray-500" size={18} />
                 </div>

                 <div className="relative">
                    <input 
                      type="text" 
                      placeholder="اسم حامل البطاقة"
                      className="w-full bg-[#242636] border border-gray-700 rounded-xl py-3 pr-10 pl-4 text-white text-right focus:border-yellow-400 focus:outline-none transition-colors"
                    />
                    <User className="absolute right-3 top-3.5 text-gray-500" size={18} />
                 </div>

                 <div className="flex gap-4">
                    <div className="relative flex-1">
                        <input 
                          type="text" 
                          placeholder="MM/YY"
                          className="w-full bg-[#242636] border border-gray-700 rounded-xl py-3 pr-10 pl-4 text-white text-right focus:border-yellow-400 focus:outline-none transition-colors font-mono"
                        />
                        <Calendar className="absolute right-3 top-3.5 text-gray-500" size={18} />
                    </div>
                    <div className="relative flex-1">
                        <input 
                          type="text" 
                          placeholder="CVV"
                          maxLength={3}
                          className="w-full bg-[#242636] border border-gray-700 rounded-xl py-3 pr-10 pl-4 text-white text-right focus:border-yellow-400 focus:outline-none transition-colors font-mono"
                        />
                        <Lock className="absolute right-3 top-3.5 text-gray-500" size={18} />
                    </div>
                 </div>
              </div>

              <button 
                className="w-full bg-emerald-500 text-white font-bold py-4 rounded-xl mt-8 hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 active:scale-95 transform"
                onClick={() => setShowAddBalanceModal(false)}
              >
                تأكيد الدفع وشحن الرصيد
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
