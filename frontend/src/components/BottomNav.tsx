import { Home, LineChart, ShoppingBag, Box } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAppContext } from '../data';

type Tab = 'home' | 'analytics' | 'store' | 'collection';

export default function BottomNav({ currentTab, onChange }: { currentTab: Tab, onChange: (t: Tab) => void }) {
  const { t } = useAppContext();
  
  const tabs = [
    { id: 'home', label: t('nav.home'), icon: Home },
    { id: 'analytics', label: t('nav.analytics'), icon: LineChart },
    { id: 'store', label: t('nav.store'), icon: ShoppingBag },
    { id: 'collection', label: t('nav.collection'), icon: Box },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-md left-1/2 -translate-x-1/2 z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white dark:bg-zinc-900 rounded-t-[20px] shadow-[0_-4px_12px_rgba(0,0,0,0.05)] border-t border-zinc-100 dark:border-zinc-800">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id as Tab)}
            className={cn(
              "flex flex-col items-center justify-center px-4 py-1.5 transition-all active:scale-90 duration-200",
              isActive ? "bg-yellow-400 text-black rounded-[16px]" : "text-zinc-400 dark:text-zinc-500 hover:text-yellow-500"
            )}
          >
            <Icon className={cn("w-6 h-6", isActive && "fill-black stroke-black opacity-90")} />
            <span className="text-[11px] font-bold font-inter uppercase tracking-wider mt-1">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
