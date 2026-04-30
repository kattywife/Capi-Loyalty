// frontend/src/App.tsx

import { useState } from 'react';
import { AppProvider, useAppContext } from './data';
import BottomNav from './components/BottomNav';
import TopHeader from './components/TopHeader';
import DashboardScreen from './pages/DashboardScreen';
import StoreScreen from './pages/StoreScreen';
import CollectionScreen from './pages/CollectionScreen';
import AnalyticsScreen from './pages/AnalyticsScreen';
import ChatModal from './pages/ChatModal';
import NotificationsScreen from './pages/NotificationsScreen';
import { AnimatePresence } from 'motion/react';
import { MessageSquare } from 'lucide-react'; 

function AppContent() {
  // Достаем новые переменные из контекста
  const { 
    currentUser, 
    userList, 
    loginAsUser, 
    logout, 
    isLoading, 
    t 
  } = useAppContext();
  
  const [currentTab, setCurrentTab] = useState<'home' | 'analytics' | 'store' | 'collection'>('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Если пользователь еще не выбран — показываем экран логина (Демо-стенд)
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-zinc-100 dark:bg-black flex justify-center font-body-lg transition-colors duration-300">
        <div className="w-full max-w-md bg-[#F4F4F5] dark:bg-zinc-950 min-h-screen flex flex-col items-center justify-center p-6 text-center text-zinc-900 dark:text-white shadow-2xl relative border-x border-zinc-200 dark:border-zinc-800">
          
          <h1 className="text-3xl font-bold mb-2">{t('welcome.title')}</h1>
          <p className="mb-8 text-zinc-600 dark:text-zinc-400 max-w-sm">{t('welcome.subtitle')}</p>

          <div className="flex flex-col gap-4 w-full max-w-sm">
            {isLoading ? (
              // Показываем простую анимацию загрузки, пока бэкенд отвечает
              <div className="py-10 flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-zinc-500 font-bold">Считаем мандаринки...</p>
              </div>
            ) : (
              // Список юзеров из Users.csv
              userList.map((u) => (
                <button
                  key={u.id}
                  onClick={() => loginAsUser(Number(u.id))}
                  className="px-6 py-4 rounded-xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-200 dark:border-zinc-800 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-95 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-xl overflow-hidden border-2 border-yellow-200">
                    <img src={u.avatar} alt="avatar" />
                  </div>
                  <div>
                    <div className="font-bold text-zinc-900 dark:text-white">{u.full_name}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      {t('welcome.segment')}: <span className="font-bold text-yellow-600">{u.financial_segment}</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Если пользователь выбран — показываем основное приложение
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-black flex justify-center font-body-lg text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
    {/* ИЗМЕНЕНИЕ ТУТ: overflow-y-auto вместо overflow-hidden */}
    <div className="w-full max-w-md bg-[#F4F4F5] dark:bg-zinc-950 min-h-screen relative shadow-2xl pb-32 overflow-y-auto border-x border-zinc-200 dark:border-zinc-800 scrollbar-none">
      
        
        <TopHeader onLogout={logout} onNotificationsClick={() => setIsNotificationsOpen(true)} />
        
        <main className="px-5 space-y-6 mt-4">
          {currentTab === 'home' && (
            <DashboardScreen 
              onAnalyticsClick={() => setCurrentTab('analytics')} 
              openChat={() => setIsChatOpen(true)} 
            />
          )}
          {currentTab === 'analytics' && <AnalyticsScreen onBack={() => setCurrentTab('home')} />}
          {currentTab === 'store' && <StoreScreen />}
          {currentTab === 'collection' && <CollectionScreen />}
        </main>

        {currentUser && !isChatOpen && (
          <div className="absolute bottom-28 right-6 z-40">
            <button 
              onClick={() => setIsChatOpen(true)}
              className="w-16 h-16 bg-yellow-400 text-zinc-900 rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform border-4 border-white dark:border-zinc-800"
            >
              <MessageSquare size={30} fill="currentColor" />
            </button>
          </div>
        )}

        <BottomNav currentTab={currentTab} onChange={setCurrentTab} />

        <AnimatePresence>
          {isChatOpen && (
            <div className="absolute inset-0 z-[100] overflow-hidden rounded-[inherit]">
              <ChatModal onClose={() => setIsChatOpen(false)} />
            </div>
          )}
          {isNotificationsOpen && (
            <div className="absolute inset-0 z-[100] overflow-hidden rounded-[inherit]">
              <NotificationsScreen onClose={() => setIsNotificationsOpen(false)} />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}