// frontend/src/pages/CollectionScreen.tsx

import { Star, Lock, Check, Sparkles } from 'lucide-react';
import { useAppContext, MOCK_SKINS, Skin } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

export default function CollectionScreen() {
  const { t, equippedSkinId, equipSkin, unlockedSkins, currentUser } = useAppContext();
  const [activeCategory, setActiveCategory] = useState<Skin['category'] | 'all'>('all');
  
  // Берем данные текущего надетого скина
  const equippedSkin = MOCK_SKINS.find(s => s.id === equippedSkinId) || MOCK_SKINS[0];

  const categories: { id: Skin['category'] | 'all', label: string }[] = [
    { id: 'all', label: 'Все' },
    { id: 'segment', label: 'Статус' },
    { id: 'loyalty', label: 'Карты' },
    { id: 'ecosystem', label: 'Спец' },
  ];

  const filteredSkins = activeCategory === 'all' 
    ? MOCK_SKINS 
    : MOCK_SKINS.filter(s => s.category === activeCategory);

  return (
    <div className="space-y-6 pb-24">
      {/* Active Preview - Теперь показывает текущую "основную" капибару */}
      <section className="relative w-full aspect-[4/3] rounded-[32px] overflow-hidden bg-white dark:bg-zinc-900 shadow-sm border border-white/40 dark:border-zinc-800 flex flex-col items-center justify-center pt-4">
        {/* Фоновый мандарин для стиля */}
        <img className="absolute inset-0 w-full h-full object-cover opacity-5 dark:opacity-10 pointer-events-none" src="/assets/mandarin.png" />
        
        <div className="relative flex flex-col items-center justify-center w-full h-full">
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentUser?.avatar} // Анимация срабатывает при смене аватара
              initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotate: 5 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-52 h-52 z-10 drop-shadow-[0_20px_30px_rgba(0,0,0,0.1)] object-contain mb-2" 
              src={currentUser?.avatar} 
            />
          </AnimatePresence>

          <div className="mt-4 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm px-6 py-2.5 rounded-full flex items-center gap-3 border border-slate-100 dark:border-zinc-700 shadow-lg z-20">
            <div className="flex items-center gap-1.5">
              <Star className="text-yellow-500 w-4 h-4 fill-yellow-500" />
              <span className="font-bold text-sm dark:text-white">Уровень 12</span>
            </div>
            <div className="h-4 w-[1px] bg-slate-200 dark:bg-zinc-700"></div>
            <span className="text-sm font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">
              ОБРАЗ: <span className="text-yellow-600 dark:text-yellow-400">{t(equippedSkin.nameKey as any)}</span>
            </span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="sticky top-0 z-30 -mx-4 px-4 py-2 bg-[#F4F4F5]/80 dark:bg-black/80 backdrop-blur-md">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-2xl whitespace-nowrap text-xs font-black uppercase tracking-widest transition-all ${
                activeCategory === cat.id 
                  ? 'bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-400/20' 
                  : 'bg-white dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section>
        <div className="grid grid-cols-2 gap-4">
          {filteredSkins.map(skin => {
            const isUnlocked = unlockedSkins.includes(skin.id) || skin.unlockedByDefault;
            const isEquipped = equippedSkinId === skin.id;
            
            return (
              <motion.div 
                layout
                key={skin.id} 
                onClick={() => isUnlocked && equipSkin(skin.id)}
                className={`flex flex-col p-5 rounded-[32px] transition-all relative group ${
                  isUnlocked 
                    ? isEquipped
                      ? 'bg-white dark:bg-zinc-900 ring-4 ring-yellow-400 shadow-xl'
                      : 'bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md cursor-pointer'
                    : 'bg-zinc-100 dark:bg-zinc-900/50 grayscale opacity-60'
                }`}
              >
                {!isUnlocked && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center">
                    <div className="p-2 bg-zinc-900/80 backdrop-blur-md rounded-xl">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}

                {isEquipped && (
                  <div className="absolute top-4 right-4 z-20 bg-yellow-400 p-1.5 rounded-xl shadow-md">
                    <Check className="w-3 h-3 text-yellow-900" strokeWidth={4} />
                  </div>
                )}
                
                <div className={`aspect-square rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                  isEquipped ? 'bg-yellow-50 dark:bg-yellow-400/5' : 'bg-zinc-50 dark:bg-zinc-800'
                }`}>
                  <img src={skin.image} className="w-[80%] h-[80%] object-contain drop-shadow-lg" />
                </div>
                
                <div className="px-1 text-center">
                  <h4 className="font-extrabold text-[13px] dark:text-white truncate mb-1">{t(skin.nameKey as any)}</h4>
                  
                  {isUnlocked ? (
                    <div className={`text-[9px] font-black uppercase tracking-tighter mt-2 ${isEquipped ? 'text-yellow-600' : 'text-zinc-400'}`}>
                      {isEquipped ? 'Надето' : 'Выбрать'}
                    </div>
                  ) : (
                    <div className="text-[9px] font-black uppercase text-zinc-400 mt-2">Заблокировано</div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}