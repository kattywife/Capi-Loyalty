import { ArrowLeft, Trees, Sparkles, Gift, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppContext } from '../data';

export default function NotificationsScreen({ onClose }: { onClose: () => void }) {
  const { t } = useAppContext();

  return (
    <div className="absolute inset-0 z-[100] pointer-events-none">
      <motion.div 
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full h-full bg-[#F4F4F5] dark:bg-zinc-950 font-body-lg text-zinc-900 flex flex-col shadow-2xl pointer-events-auto transition-colors"
      >
      <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 dark:border-zinc-800 flex items-center w-full px-5 py-4 shrink-0 transition-colors">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-yellow-500 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors rounded-full p-2 active:scale-95">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white">{t('notifications.title')}</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-32">
        {/* Capi Avatar Message Section */}
        <section className="mb-6 flex items-start gap-4 bg-yellow-100/50 dark:bg-yellow-400/10 p-4 rounded-xl border border-yellow-200/50 dark:border-yellow-400/20">
          <div className="relative flex-shrink-0">
            <img 
              alt="Capybara Mascot" 
              className="w-12 h-12 rounded-full border-2 border-yellow-400 dark:border-yellow-500 object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtWt8dqaTMvGKcqYoBkXSM-izcF0VOS93-Fz8_1weU68AiSYD-dTIdfMAljcpIVeaa4TDoSQvgBTpLrSGpLbY-Lqazg7eIyA6FE_0BgOOMQCD6i2D8IvhrksAVyekAj5XAAVyvsF3LrjjRmjOEDVOeq-_d47xZxroZl30GYIV2SXeaagxQqDDmQFBqA4a7eNdoC6uzFuplgq17XjLk1mXtPSOiNgzcEDpI93Kx_YqKGlBSYbbK4bBkGj3bDn3bxwup9AcZRhtAg88"
            />
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-zinc-900"></div>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-bold text-yellow-900 dark:text-yellow-400 text-[16px]">{t('notifications.morning')}</p>
            <p className="text-sm text-yellow-900/80 dark:text-yellow-100/80">{t('notifications.morningText')}</p>
          </div>
        </section>

        {/* Notifications List */}
        <div className="flex flex-col gap-4">
          {/* Notification 1: Time to Harvest */}
          <div className="bg-white dark:bg-zinc-900 rounded-[20px] p-4 shadow-sm border border-zinc-100 dark:border-zinc-800 active:scale-95 transition-all duration-200">
            <div className="flex gap-4">
              <div className="bg-orange-100 dark:bg-orange-400/20 p-3 rounded-2xl flex items-center justify-center self-start">
                <Trees className="text-orange-500 dark:text-orange-400 w-6 h-6" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-zinc-900 dark:text-white">{t('notifications.harvest')}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">2m</span>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('notifications.harvestText')}</p>
                <button className="mt-2 self-start text-[11px] font-bold tracking-wider uppercase text-yellow-700 dark:text-yellow-400 py-1.5 px-4 bg-yellow-100 dark:bg-yellow-400/20 rounded-full active:scale-95 transition-transform">{t('notifications.collectNow')}</button>
              </div>
            </div>
          </div>

          {/* Notification 2: Emotional Cashback */}
          <div className="bg-white dark:bg-zinc-900 rounded-[20px] p-4 shadow-sm border border-zinc-100 dark:border-zinc-800 active:scale-95 transition-all duration-200">
            <div className="flex gap-4">
              <div className="bg-green-100 dark:bg-green-400/20 p-3 rounded-2xl flex items-center justify-center self-start">
                <Sparkles className="text-green-600 dark:text-green-400 w-6 h-6" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-zinc-900 dark:text-white">{t('notifications.surprise')}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">1h</span>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('notifications.surpriseText')}</p>
              </div>
            </div>
          </div>

          {/* Notification 3: Secret Gift */}
          <div className="bg-white dark:bg-zinc-900 rounded-[20px] p-4 shadow-sm border border-zinc-100 dark:border-zinc-800 active:scale-95 transition-all duration-200">
            <div className="flex gap-4">
              <div className="bg-yellow-100 dark:bg-yellow-400/20 p-3 rounded-2xl flex items-center justify-center self-start">
                <Gift className="text-yellow-600 dark:text-yellow-500 w-6 h-6" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-zinc-900 dark:text-white">{t('notifications.secretGift')}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">3h</span>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{t('notifications.secretGiftText')}</p>
              </div>
            </div>
          </div>

          {/* Yesterday Divider */}
          <div className="flex items-center gap-4 py-4">
            <div className="h-[1px] flex-1 bg-zinc-200 dark:bg-zinc-800"></div>
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{t('notifications.yesterday')}</span>
            <div className="h-[1px] flex-1 bg-zinc-200 dark:bg-zinc-800"></div>
          </div>

          {/* Notification 4: Quest Completed */}
          <div className="bg-white/60 dark:bg-zinc-900/60 rounded-[20px] p-4 border border-zinc-100 dark:border-zinc-800 opacity-80 transition-colors">
            <div className="flex gap-4">
              <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-2xl flex items-center justify-center self-start">
                <CheckCircle className="text-zinc-400 dark:text-zinc-500 w-6 h-6" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-zinc-500 dark:text-zinc-400">{t('notifications.questComplete')}</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">1d</span>
                </div>
                <p className="text-sm text-zinc-400 dark:text-zinc-500">{t('notifications.questCompleteText')}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      </motion.div>
    </div>
  );
}
