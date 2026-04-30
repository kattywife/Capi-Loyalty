import { useAppContext } from '../data';
import { LogOut, Bell, Moon, Sun } from 'lucide-react';

export default function TopHeader({ onLogout, onNotificationsClick }: { onLogout: () => void, onNotificationsClick: () => void }) {
  const { currentUser, theme, setTheme, language, setLanguage, t } = useAppContext();

  return (
    <header className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md font-bold text-lg tracking-tight shadow-sm border-b border-zinc-100 dark:border-zinc-800 sticky top-0 flex justify-between items-center w-full px-5 py-3 z-50 transition-colors duration-300">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container">
          <img src={currentUser?.avatar} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <span className="text-xl font-black text-zinc-900 dark:text-white uppercase tracking-tighter">{t('header.title')}</span>
      </div>
      <div className="flex gap-1">
        <button onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors active:scale-95 duration-200 text-sm font-bold text-zinc-600 dark:text-zinc-300">
          {language.toUpperCase()}
        </button>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors active:scale-95 duration-200">
          {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-zinc-900" />}
        </button>
        <button onClick={onNotificationsClick} className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors active:scale-95 duration-200">
          <Bell className="w-5 h-5 text-zinc-900 dark:text-white" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-zinc-950"></span>
        </button>
        <button onClick={onLogout} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors active:scale-95 duration-200">
          <LogOut className="w-5 h-5 text-zinc-900 dark:text-white" />
        </button>
      </div>
    </header>
  );
}
