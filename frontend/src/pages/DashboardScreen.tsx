// frontend/src/pages/DashboardScreen.tsx

import { useAppContext, MOCK_QUESTS } from '../data';
import { api } from '../lib/api';
import { formatCurrency } from '../lib/utils';
import { 
  ChevronDown, TrendingUp, Coffee, ShoppingBasket, 
  Plane, Wallet, Footprints, Target, Sparkles,
  Users, ChevronRight // Добавили недостающие иконки
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

// Маппинг иконок для категорий из Offers.csv (опционально)
const CATEGORY_ICONS: Record<string, any> = {
  'Клининговый сервис': Sparkles,
  'Бытовой ремонт': Target,
  'Электрика и сантехника': Target,
  'Прачечная и химчистка': ShoppingBasket,
  'Cafe': Coffee,
  'Travel': Plane,
};

export default function DashboardScreen({ onAnalyticsClick, openChat }: { onAnalyticsClick: () => void, openChat: () => void }) {
  const { 
    currentUser, 
    totalMandarins, 
    accountsDetails, 
    offers, 
    addMandarins, 
    t,
    gameBonuses // Достаем из контекста для точности
  } = useAppContext();

  const [walletOpen, setWalletOpen] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<string>("Загружаю мудрость капибары...");
  const [treeHasMandarins, setTreeHasMandarins] = useState(true);
  const [harvestedAmount, setHarvestedAmount] = useState<number | null>(null);

  // --- 1. Загрузка ИИ-совета из Бэкенда ---
  useEffect(() => {
    if (currentUser) {
      api.getAiAdvice(Number(currentUser.id)).then(advice => {
        setAiAdvice(advice);
      });
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

  const capyAvatar = currentUser?.avatar;

  return (
    <>
      {/* Секция с Капибарой и AI советом */}
      <section className="relative w-full rounded-[32px] overflow-hidden bg-gradient-to-b from-blue-100/50 to-orange-100/50 dark:from-zinc-900 dark:to-zinc-800 shadow-sm p-6 mt-4 flex flex-col items-center">
        {/* Совет ИИ */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="z-10 relative mb-6 w-full">
          <div className="bg-white/95 dark:bg-zinc-800/95 p-4 rounded-2xl shadow-md border border-white/50 relative">
            <p className="text-[13px] font-bold leading-relaxed">{aiAdvice}</p>
            <div className="absolute -bottom-2 left-10 w-4 h-4 bg-white rotate-45 border-r border-b border-white/50"></div>
          </div>
        </motion.div>

        <div className="flex items-end justify-between w-full min-h-[140px] relative">
          {/* Маскот Капибары (зависит от сегмента) */}
          <div className="w-36 h-36 relative z-10">
            <img className="w-full h-full object-contain drop-shadow-2xl scale-110" src={currentUser?.avatar} alt="Capy" />
          </div>

          {/* ИНТЕРАКТИВНОЕ ДЕРЕВО (ИЗ АССЕТОВ) */}
          <div className="relative w-32 h-32 flex items-end justify-center">
            <button onClick={handleHarvestTree} className="relative active:scale-95 transition-transform">
               <img 
                 src={treeHasMandarins ? '/assets/tree_with_fruits.png' : '/assets/tree_empty.png'} 
                 className="w-28 h-28 object-contain" 
               />
               <AnimatePresence>
                {harvestedAmount && (
                  <motion.div initial={{y:0, opacity:1}} animate={{y:-60, opacity:0}} className="absolute top-0 flex items-center gap-1 font-black text-orange-500">
                    +{harvestedAmount} <img src="/assets/mandarin.png" className="w-5 h-5" />
                  </motion.div>
                )}
               </AnimatePresence>
            </button>
          </div>
        </div>
      </section>

      {/* Копилка — Стилизация строго по скриншоту */}
       <section className="bg-yellow-400 p-6 rounded-[32px] shadow-lg text-yellow-900">
        <button onClick={() => setWalletOpen(!walletOpen)} className="w-full flex justify-between items-start mb-2">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-300/50 p-2.5 rounded-2xl"><TrendingUp size={24} /></div>
            <div className="text-left">
              <p className="text-[10px] uppercase font-black opacity-60 mb-1">ОБЩИЙ БАЛАНС</p>
              <div className="flex items-center gap-2">
                <h2 className="text-5xl font-black tracking-tighter">{formatCurrency(totalMandarins)}</h2>
                <img src="/assets/mandarin.png" className="w-10 h-10" />
              </div>
            </div>
          </div>
          <motion.div animate={{ rotate: walletOpen ? 0 : 180 }}><ChevronDown size={28} /></motion.div>
        </button>

        <AnimatePresence>
          {walletOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0 }} className="overflow-hidden">
              <div className="mt-6 pt-6 border-t border-black/10 grid grid-cols-2 gap-y-6">
                <div className="flex items-center gap-3">
                  <img src="/assets/black_card.png" className="w-8 h-8 object-contain" />
                  <div>
                    <p className="text-[10px] font-black opacity-50 uppercase">Black</p>
                    <p className="text-lg font-bold">₽ {formatCurrency(accountsDetails.find(a => a.loyalty_program_name === 'Black')?.current_balance || 0)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <img src="/assets/all_airlines.png" className="w-8 h-8 object-contain" />
                  <div>
                    <p className="text-[10px] font-black opacity-50 uppercase">Airlines</p>
                    <p className="text-lg font-bold">{formatCurrency(accountsDetails.find(a => a.loyalty_program_name === 'All Airlines')?.current_balance || 0)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <img src="/assets/bravo.png" className="w-8 h-8 object-contain" />
                  <div>
                    <p className="text-[10px] font-black opacity-50 uppercase">Браво</p>
                    <p className="text-lg font-bold">{formatCurrency(accountsDetails.find(a => a.loyalty_program_name === 'Bravo')?.current_balance || 0)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <img src="/assets/mandarin.png" className="w-8 h-8 object-contain" />
                  <div>
                    <p className="text-[10px] font-black opacity-50 uppercase">Игровые</p>
                    <p className="text-lg font-bold">{formatCurrency(useAppContext().gameBonuses)}</p>
                  </div>
                </div>
              </div>
              
              {/* Прогресс бар */}
              <div className="mt-8 pt-6 border-t border-black/10 space-y-3">
                <div className="flex justify-between items-end">
                  <h4 className="font-extrabold text-lg">Копим на Сочи</h4>
                  <p className="text-[11px] font-black">40%</p>
                </div>
                <div className="w-full h-2.5 bg-black/10 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600 w-[40%]"></div>
                </div>
              </div>

              <button onClick={onAnalyticsClick} className="mt-8 w-full py-4 bg-yellow-300/60 rounded-2xl font-black uppercase text-xs">Аналитика</button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>


      {/* Персональные офферы */}
       <section className="space-y-4">
        <h3 className="text-xl font-black px-2 uppercase">Специально для тебя</h3>
        <div className="flex overflow-x-auto gap-4 hide-scrollbar -mx-5 px-5 pb-4">
          {offers.map((offer, idx) => {
             // Мапим иконки из ассетов по индексу или имени для демо
             const catImages = ['/assets/food_category.png', '/assets/travels_category.png', '/assets/shops_category.png', '/assets/movies_category.png'];
             const img = catImages[idx % catImages.length];

             return (
              <div key={offer.partner_id} className="min-w-[160px] bg-white dark:bg-zinc-900 p-5 rounded-[28px] border border-zinc-100 flex flex-col items-center gap-3">
                <img src={img} className="w-12 h-12 object-contain" />
                <div className="bg-green-100 text-green-700 font-black text-[10px] px-3 py-1 rounded-full uppercase">-{offer.cashback_percent}%</div>
                <p className="font-bold text-xs">{offer.partner_name}</p>
              </div>
             )
          })}
        </div>
      </section>

      {/* --- НОВАЯ СЕКЦИЯ КВЕСТОВ --- */}
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
    </>
  );
}