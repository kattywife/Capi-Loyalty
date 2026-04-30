// frontend/src/pages/DashboardScreen.tsx

import { useAppContext, MOCK_QUESTS } from '../data';
import { api } from '../lib/api';
import { formatCurrency } from '../lib/utils';

import { 
  ChevronDown, 
  TrendingUp, 
  Wallet, 
  Target, 
  Footprints, 
  MessageSquare, 
  Users, 
  ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

export default function DashboardScreen({ onAnalyticsClick, openChat }: { onAnalyticsClick: () => void, openChat: () => void }) {
  const { currentUser, totalMandarins, accountsDetails, offers, addMandarins, t } = useAppContext();

  const [walletOpen, setWalletOpen] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string>("Загружаю мудрость капибары...");
  const [treeHasMandarins, setTreeHasMandarins] = useState(true);
  const [harvestedAmount, setHarvestedAmount] = useState<number | null>(null);

  useEffect(() => {
    if (currentUser) {
      api.getAiAdvice(Number(currentUser.id)).then(advice => setAiAdvice(advice));
    }
  }, [currentUser]);

  const handleHarvestTree = () => {
    if (!treeHasMandarins) return;
    const amount = Math.floor(Math.random() * 3) + 1;
    setHarvestedAmount(amount);
    addMandarins(amount);
    setTreeHasMandarins(false);
    setTimeout(() => setHarvestedAmount(null), 3000);
  };

  return (
    <>
      {/* Капибара и совет */}
      <section className="relative w-full rounded-[32px] overflow-hidden bg-gradient-to-b from-blue-100/50 to-orange-100/50 dark:from-blue-900/20 dark:to-orange-900/20 shadow-sm p-6 mt-4 flex flex-col items-center">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="z-10 relative mb-6 w-full">
          <div className="bg-white/95 dark:bg-zinc-800/95 backdrop-blur-sm p-4 rounded-2xl shadow-md border border-white/50 dark:border-zinc-700 relative">
            <p className="text-[13px] text-zinc-900 dark:text-white font-bold leading-relaxed">{aiAdvice}</p>
            <div className="absolute -bottom-2 left-10 w-4 h-4 bg-white/95 dark:bg-zinc-800 rotate-45 border-r border-b border-white/50 dark:border-zinc-700"></div>
          </div>
        </motion.div>

        <div className="flex items-end justify-between w-full min-h-[140px] relative">
          <div className="w-36 h-36 relative z-10">
            <img className="w-full h-full object-contain drop-shadow-2xl scale-110" src={currentUser?.avatar} alt="Capy" />
          </div>
          <div className="relative w-32 h-32 flex items-end justify-center">
            <button onClick={handleHarvestTree} className="relative active:scale-95 transition-transform text-5xl">
               <div className={treeHasMandarins ? 'filter drop-shadow-lg' : 'opacity-50'}>🌳</div>
               {treeHasMandarins && <div className="absolute top-0 right-0 text-2xl animate-bounce">🍊</div>}
            </button>
          </div>
        </div>
      </section>

      {/* Баланс */}
      <section className="bg-yellow-400 dark:bg-zinc-900 p-6 rounded-[32px] shadow-lg">
        <button onClick={() => setWalletOpen(!walletOpen)} className="w-full flex justify-between items-center text-yellow-900 dark:text-white">
          <div className="text-left">
            <p className="text-[10px] uppercase font-black opacity-60">Твой капитал</p>
            <h2 className="text-4xl font-black tracking-tighter">{formatCurrency(totalMandarins)} 🍊</h2>
          </div>
          <motion.div animate={{ rotate: walletOpen ? 180 : 0 }}><ChevronDown /></motion.div>
        </button>
        <AnimatePresence>
          {walletOpen && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
              <div className="mt-6 pt-6 border-t border-black/10 grid gap-3">
                {accountsDetails.map((acc) => (
                  <div key={acc.account_id} className="flex justify-between font-bold">
                    <span>{acc.loyalty_program_name}</span>
                    <span>{formatCurrency(acc.current_balance)} {acc.cashback_currency === 'rub' ? '₽' : acc.cashback_currency}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Офферы */}
      <section className="space-y-4">
        <h3 className="text-xl font-black dark:text-white px-2 uppercase">Специально для тебя</h3>
        <div className="flex overflow-x-auto gap-4 hide-scrollbar -mx-5 px-5">
          {offers.map(offer => (
            <div key={offer.partner_id} className="min-w-[150px] bg-white dark:bg-zinc-900 p-5 rounded-[28px] border border-zinc-100 dark:border-zinc-800 flex flex-col items-center gap-2">
              <img src={offer.logo_url} className="w-10 h-10 object-contain" />
              <div className="bg-green-100 text-green-700 font-black text-[10px] px-2 py-0.5 rounded-full">{offer.cashback_percent}%</div>
              <p className="font-bold text-[11px] dark:text-white">{offer.partner_name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* СЕКЦИЯ КВЕСТОВ (MOCK) */}
    <section className="space-y-4 pb-20">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-xl font-black dark:text-white uppercase tracking-tight">Активные задания</h3>
      </div>
      
      <div className="space-y-3">
        {MOCK_QUESTS.map((quest) => {
          const progressPercent = (quest.progress / quest.total) * 100;
          
          return (
            <div key={quest.id} className="bg-white dark:bg-zinc-900 p-5 rounded-[28px] border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all active:scale-[0.98]">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-400/10 rounded-2xl flex items-center justify-center text-yellow-600">
                    {quest.icon === 'Wallet' && <Wallet size={24} />}
                    {quest.icon === 'Footprints' && <Footprints size={24} />}
                    {quest.icon === 'Users' && <Users size={24} />}
                  </div>
                  <div>
                    <p className="font-extrabold text-[15px] dark:text-white leading-tight">{quest.title}</p>
                    <p className="text-green-600 dark:text-green-400 font-black text-xs mt-1">+{quest.reward} 🍊</p>
                  </div>
                </div>
                <ChevronRight className="text-zinc-300" size={20} />
              </div>

              {/* Прогресс-бар */}
              <div className="space-y-2">
                <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className="h-full bg-yellow-400 dark:bg-yellow-500 rounded-full"
                  />
                </div>
                <div className="flex justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  <span>Прогресс: {Math.round(progressPercent)}%</span>
                  <span>{quest.progress} / {quest.total}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>

      {/* КНОПКА ЧАТА (ФИКС) */}
      <div className="fixed bottom-28 right-6 z-[60]">
        <button 
          onClick={openChat}
          className="w-16 h-16 bg-yellow-400 text-zinc-900 rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform border-4 border-white dark:border-zinc-800"
        >
          <MessageSquare size={30} fill="currentColor" />
        </button>
      </div>
    </>
  );
}