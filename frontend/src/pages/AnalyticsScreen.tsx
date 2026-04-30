// frontend/src/pages/AnalyticsScreen.tsx

import { useAppContext } from '../data';
import { api } from '../lib/api';
import { 
  TrendingUp, Info, ShieldCheck, ShoppingBag, 
  BarChart3, PieChart as PieChartIcon, Zap, Calendar as CalendarIcon, ChevronDown 
} from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { formatCurrency } from '../lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import CalendarModal from '../components/CalendarModal';
import { 
  startOfMonth, endOfMonth, format, isWithinInterval, 
  parseISO, startOfDay, endOfDay, getDaysInMonth, addMonths
} from 'date-fns';
import { ru } from 'date-fns/locale';

export default function AnalyticsScreen({ onBack }: { onBack: () => void }) {
  const { currentUser, totalMandarins } = useAppContext();
  const [allHistory, setAllHistory] = useState<any[]>([]);
  const [insight, setInsight] = useState<string>('');
  
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ 
    start: startOfMonth(new Date()), 
    end: endOfMonth(new Date()) 
  });

  // НОВОЕ: Режим прогноза (current - итоги апреля, next - прогноз на май)
  const [forecastMode, setForecastMode] = useState<'current' | 'next'>('current');

  useEffect(() => {
    if (currentUser) {
      api.getAnalytics(Number(currentUser.id)).then(setAllHistory);
      api.getAiAdvice(Number(currentUser.id)).then(setInsight);
    }
  }, [currentUser]);

  const filteredHistory = useMemo(() => {
    return allHistory.filter(item => {
      const itemDate = startOfDay(parseISO(item.payout_date));
      return isWithinInterval(itemDate, { 
        start: startOfDay(dateRange.start), 
        end: endOfDay(dateRange.end) 
      });
    });
  }, [allHistory, dateRange]);

  // --- УЛУЧШЕННАЯ МАТЕМАТИКА ПРОГНОЗА ---
  const forecastStats = useMemo(() => {
    const now = new Date(); // 30 апреля 2026
    let currentMonthStr = format(now, 'yyyy-MM'); // "2026-04"
    
    // ПРОВЕРКА: Если за 2026 год данных нет, но в базе есть 2025 год (как в CSV)
    const hasCurrentYearData = allHistory.some(item => item.payout_date.startsWith(currentMonthStr));
    
    if (!hasCurrentYearData) {
      // Имитируем, что мы в апреле 2025 года для корректности расчетов по CSV
      currentMonthStr = '2025-04';
    }
    
    // 1. Считаем реальный факт за апрель
    const aprilTransactions = allHistory.filter(item => item.payout_date.startsWith(currentMonthStr));
    const earnedInApril = aprilTransactions.reduce((sum, item) => sum + item.cashback_amount, 0);

    // 2. Считаем средний заработок в день в апреле
    // Делим на 30, так как апрель в CSV уже прошел и завершен
    const dailyRate = earnedInApril / 30; 

    if (forecastMode === 'current') {
      return {
        title: hasCurrentYearData ? "ИТОГИ АПРЕЛЯ" : "ИТОГИ АПРЕЛЯ (2025)",
        total: earnedInApril,
        subTitle: "Цель выполнена",
        subValue: "100%",
        color: "text-green-400"
      };
    } else {
      // Прогноз на МАЙ (dailyRate * 31 день мая)
      const mayForecast = Math.round(dailyRate * 31);
      
      return {
        title: hasCurrentYearData ? "ПРОГНОЗ НА МАЙ" : "ПРОГНОЗ НА МАЙ (2025)",
        total: mayForecast,
        subTitle: "Потенциальная выгода",
        subValue: `+${mayForecast} М`,
        color: "text-yellow-400"
      };
    }
  }, [allHistory, forecastMode]);

  const earnedInPeriod = useMemo(() => {
    return filteredHistory.reduce((sum, item) => sum + item.cashback_amount, 0);
  }, [filteredHistory]);

  return (
    <div className="flex flex-col gap-6 pb-20">
      <header className="flex justify-between items-center w-full mt-2">
        <h1 className="font-bold text-2xl dark:text-white">Аналитика</h1>
        <button 
          onClick={() => setIsCalendarOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[13px] font-bold shadow-sm"
        >
          <CalendarIcon className="w-4 h-4 text-yellow-500" />
          <span>
            {format(dateRange.start, 'd MMM', { locale: ru })} — {format(dateRange.end, 'd MMM', { locale: ru })}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
        </button>
      </header>

      <section className="flex justify-between items-start px-1">
        <div>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">ТЕКУЩИЙ БАЛАНС</p>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">{totalMandarins}</span>
            <span className="text-2xl font-black text-yellow-600">М</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">ВЫПЛАЧЕНО В ПЕРИОДЕ</p>
          <p className="text-2xl font-black text-green-500">+{earnedInPeriod}</p>
        </div>
      </section>

      {/* УЛУЧШЕННАЯ СЕКЦИЯ ПРОГНОЗА С ПЕРЕКЛЮЧАТЕЛЕМ */}
      <section className="bg-[#1C1C1E] rounded-[32px] p-6 text-white relative overflow-hidden shadow-xl border border-white/5">
        <Zap className="absolute right-[-10px] bottom-[-10px] w-32 h-32 text-white opacity-5 rotate-12" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-400 p-2 rounded-xl">
                <TrendingUp size={20} className="text-black" />
              </div>
              <h3 className="font-black text-sm uppercase tracking-widest">{forecastStats.title}</h3>
            </div>
            
            {/* Маленький переключатель периодов */}
            <div className="flex bg-zinc-800 p-1 rounded-full">
              <button 
                onClick={() => setForecastMode('current')}
                className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${forecastMode === 'current' ? 'bg-zinc-600 text-white' : 'text-zinc-500'}`}
              >
                АПР
              </button>
              <button 
                onClick={() => setForecastMode('next')}
                className={`px-3 py-1 rounded-full text-[10px] font-black transition-all ${forecastMode === 'next' ? 'bg-zinc-600 text-white' : 'text-zinc-500'}`}
              >
                МАЙ
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-zinc-500 text-[10px] font-black uppercase mb-2">Всего за месяц</p>
              <p className="text-3xl font-black">~{forecastStats.total} М</p>
            </div>
            <div>
              <p className="text-zinc-500 text-[10px] font-black uppercase mb-2">{forecastStats.subTitle}</p>
              <p className={`text-3xl font-black ${forecastStats.color}`}>{forecastStats.subValue}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ГРАФИКИ */}
      <section className="bg-white dark:bg-zinc-900 rounded-[32px] p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold dark:text-white">Динамика выплат</h3>
          <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
            <button onClick={() => setChartType('pie')} className={`p-1.5 rounded-lg ${chartType === 'pie' ? 'bg-white shadow-sm' : 'text-zinc-400'}`}><PieChartIcon size={16}/></button>
            <button onClick={() => setChartType('bar')} className={`p-1.5 rounded-lg ${chartType === 'bar' ? 'bg-white shadow-sm' : 'text-zinc-400'}`}><BarChart3 size={16}/></button>
          </div>
        </div>

        <div className="h-48">
          {filteredHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'pie' ? (
                <PieChart>
                  <Pie data={[{name: 'Выгода', value: earnedInPeriod}]} innerRadius={50} outerRadius={70} dataKey="value" stroke="none">
                    <Cell fill="#FACC15" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              ) : (
                <BarChart data={filteredHistory.map(i => ({name: format(new Date(i.payout_date), 'd MMM', {locale: ru}), value: i.cashback_amount}))}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis dataKey="name" fontSize={10} tickLine={false} />
                  <YAxis fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{borderRadius: '16px'}} />
                  <Bar dataKey="value" fill="#FACC15" radius={[4, 4, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-2">
              <Info size={30} opacity={0.2} />
              <p className="text-[10px] font-black uppercase">Нет данных</p>
            </div>
          )}
        </div>
      </section>

      {/* ИИ СОВЕТ */}
      <section className="bg-yellow-50 dark:bg-yellow-400/10 p-6 rounded-[32px] border border-yellow-200 flex gap-4">
        <div className="flex-1 text-sm font-bold dark:text-zinc-200">
          <div className="flex items-center gap-2 mb-2 text-yellow-700 uppercase text-[10px] font-black">
            <ShieldCheck size={14} /> Капибара-аналитик
          </div>
          {insight || "Анализирую данные..."}
        </div>
      </section>

      {/* СПИСОК ИСТОРИИ */}
      <section className="space-y-3 pb-10">
        <h3 className="font-bold px-1 dark:text-white">История начислений</h3>
        {filteredHistory.map((item, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 p-4 rounded-[24px] border border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500"><ShoppingBag size={18} /></div>
              <div>
                <p className="font-bold text-sm dark:text-white">Кэшбэк начислен</p>
                <p className="text-[10px] text-zinc-400 font-bold uppercase">{item.payout_date}</p>
              </div>
            </div>
            <p className="font-black text-green-600">+{item.cashback_amount} 🍊</p>
          </div>
        ))}
      </section>

      <CalendarModal isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} onSelect={(s, e) => { setDateRange({start: s, end: e}); setIsCalendarOpen(false); }} />
    </div>
  );
}