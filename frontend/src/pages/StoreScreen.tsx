// frontend/src/pages/StoreScreen.tsx

import { Wifi, ShieldCheck, Sparkles, Lock, Check } from 'lucide-react';
import { useAppContext, MOCK_SKINS } from '../data';
import { motion } from 'motion/react';

export default function StoreScreen() {
  const { t, unlockSkin, unlockedSkins, accounts } = useAppContext();

  // Выбираем "Эпический скин" для витрины (например, тот, что за 5000 мандаринок или HIGH сегмент)
  const featuredSkin = MOCK_SKINS.find(s => s.id === 'skin-high' || s.id === 'skin-cyberpunk');
  
  // Остальные скины для покупки (кроме базового)
  const boutiqueSkins = MOCK_SKINS.filter(s => s.id !== 'skin-low' && s.id !== featuredSkin?.id);

  return (
    <div className="space-y-6 pb-24">
      {/* ВЕРХНИЙ БАННЕР */}
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-yellow-300 to-orange-400 dark:from-yellow-500 dark:to-orange-600 p-6 shadow-xl flex items-center justify-between">
        <div className="relative z-10 flex-1">
          <h1 className="text-2xl font-black mb-1 text-zinc-950 uppercase tracking-tight">Маркетплейс</h1>
          <p className="text-sm text-zinc-900/70 mb-4 max-w-[200px] font-bold leading-tight">Трать мандарины на эксклюзивные награды.</p>
          <div className="inline-flex items-center bg-white/40 backdrop-blur-md rounded-2xl px-4 py-2 border border-white/30 shadow-sm">
            <span className="font-bold text-xs text-zinc-950">Баланс: {accounts?.gameBonuses.toLocaleString() || '0'} 🍊</span>
          </div>
        </div>
        <div className="w-28 h-28 flex-shrink-0 relative">
          {/* Используем твой ассет мандарина */}
          <img className="w-full h-full object-contain drop-shadow-2xl relative z-10" src="/assets/mandarin.png" alt="mandarin" />
        </div>
      </section>

      {/* РАЗДЕЛ: УСЛУГИ T-BANK (Оставляем как было) */}
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-xl font-black dark:text-white uppercase tracking-tight">Услуги T-Bank</h2>
          <span className="text-yellow-700 dark:text-yellow-400 font-bold text-xs uppercase tracking-widest bg-yellow-400/10 px-3 py-1 rounded-full">Все</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-zinc-900 rounded-[28px] p-5 shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between">
            <div className="aspect-square rounded-2xl bg-yellow-400/10 dark:bg-yellow-400/5 flex items-center justify-center mb-4">
               <Wifi className="text-yellow-600 dark:text-yellow-400 w-10 h-10" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm mb-1 dark:text-white">Интернет 5 ГБ</h3>
              <p className="text-[11px] text-zinc-400 mb-4 font-medium">Действует 30 дней</p>
              <button className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-zinc-950 rounded-xl font-black text-xs uppercase active:scale-95 transition-all">
                500 🍊
              </button>
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-[28px] p-5 shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between">
            <div className="aspect-square rounded-2xl bg-green-400/10 dark:bg-green-400/5 flex items-center justify-center mb-4">
               <ShieldCheck className="text-green-600 dark:text-green-400 w-10 h-10" />
            </div>
            <div>
               <h3 className="font-extrabold text-sm mb-1 dark:text-white">Страховка -10%</h3>
              <p className="text-[11px] text-zinc-400 mb-4 font-medium">На новый полис</p>
              <button className="w-full py-2.5 bg-yellow-400 hover:bg-yellow-300 text-zinc-950 rounded-xl font-black text-xs uppercase active:scale-95 transition-all">
                1,200 🍊
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* РАЗДЕЛ: ГАРДЕРОБ КАПИ (Скины из ассетов) */}
      <section>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="text-xl font-black dark:text-white uppercase tracking-tight">Гардероб Капи</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Эпический товар (Featured) */}
          {featuredSkin && (
            <div className="col-span-2 relative bg-zinc-950 rounded-[32px] overflow-hidden flex flex-col md:flex-row items-center border border-zinc-800 shadow-2xl group cursor-pointer"
                 onClick={() => !unlockedSkins.includes(featuredSkin.id) && unlockSkin(featuredSkin.id)}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400/10 blur-[100px] -mr-32 -mt-32"></div>
              <div className="flex-1 p-8 z-10">
                <div className="inline-flex items-center gap-2 bg-yellow-400/20 text-yellow-400 font-black px-3 py-1 rounded-lg mb-4 text-[10px] uppercase tracking-widest border border-yellow-400/30">
                  <Sparkles size={12} />
                  EPIC ITEM
                </div>
                <h3 className="text-2xl font-black mb-1 text-white uppercase tracking-tight">{t(featuredSkin.nameKey as any)}</h3>
                
                {unlockedSkins.includes(featuredSkin.id) ? (
                  <div className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-green-500/10 text-green-400 rounded-2xl font-black text-xs uppercase tracking-widest border border-green-500/20">
                    <Check size={16} /> Разблокировано
                  </div>
                ) : (
                  <button className="mt-4 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-zinc-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95">
                    5,000 🍊
                  </button>
                )}
              </div>
              <div className="p-4 z-10 group-hover:scale-110 transition-transform duration-500">
                <img className="w-40 h-40 object-contain drop-shadow-2xl" src={featuredSkin.image} alt="Featured Skin" />
              </div>
            </div>
          )}

          {/* Список обычных скинов */}
          {boutiqueSkins.map(skin => (
            <div 
              key={skin.id}
              onClick={() => !unlockedSkins.includes(skin.id) && unlockSkin(skin.id)}
              className="bg-white dark:bg-zinc-900 rounded-[28px] p-5 border border-zinc-100 dark:border-zinc-800 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="w-full aspect-square bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-yellow-400/5 transition-colors">
                <img src={skin.image} className="w-[80%] h-[80%] object-contain drop-shadow-xl group-hover:scale-110 transition-transform" alt={skin.id} />
              </div>
              <h4 className="font-extrabold text-[13px] dark:text-white mb-3 h-10 flex items-center leading-tight">
                {t(skin.nameKey as any)}
              </h4>
              
              {unlockedSkins.includes(skin.id) ? (
                 <div className="w-full py-2 bg-green-500/10 text-green-500 rounded-xl font-black text-[10px] uppercase">
                   Куплено
                 </div>
              ) : (
                <button className="w-full py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-black rounded-xl text-[10px] uppercase active:scale-95 transition-all flex items-center justify-center gap-2">
                  <Lock size={12} />
                  2,000 🍊
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}