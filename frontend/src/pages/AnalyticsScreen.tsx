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
  parseISO, startOfDay, getDaysInMonth 
} from 'date-fns';
import { ru } from 'date-fns/locale';

const CHART_COLORS = ['#FACC15', '#FB923C', '#34C759', '#60A5FA'];

export default function AnalyticsScreen({ onBack }: { onBack: () => void }) {
  const { currentUser, totalMandarins, accountsDetails } = useAppContext();
  const [allHistory, setAllHistory] = useState<any[]>([]);
  const [insight, setInsight] = useState<string>('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const [dateRange, setDateRange] = useState({ 
    start: startOfMonth(new Date()), 
    end: endOfMonth(new Date()) 
  });

  const [activeTab, setActiveTab] = useState<'Все' | 'Мили' | 'Баллы' | 'Рубли' | 'Мандаринки'>('Все');

  useEffect(() => {
    if (currentUser) {
      api.getAnalytics(Number(currentUser.id)).then(setAllHistory);
      api.getAiAdvice(Number(currentUser.id)).then(setInsight);
    }
  }, [currentUser]);

  // --- ЛОГИКА ФИЛЬТРАЦИИ ---
  const filteredData = useMemo(() => {
    const programMap: Record<string, string> = {
      'All Airlines': 'Мили',
      'Bravo': 'Баллы',
      'Black': 'Рубли'
    };

    return allHistory.filter(item => {
      const itemDate = startOfDay(parseISO(item.payout_date));
      const inRange = isWithinInterval(itemDate, { 
        start: startOfDay(dateRange.start), 
        end: endOfDay(dateRange.end) 
      });
      if (!inRange) return false;
      if (activeTab === 'Все' || activeTab === 'Мандаринки') return true;
      return programMap[item.loyalty_program_name] === activeTab;
    });
  }, [allHistory, activeTab, dateRange]);

  // Данные для Pie Chart (распределение по программам)
  const pieData = useMemo(() => {
    const agg: Record<string, number> = {};
    filteredData.forEach(item => {
      const name = item.loyalty_program_name;
      agg[name] = (agg[name] || 0) + item.cashback_amount;
    });
    return Object.entries(agg).map(([name, value]) => ({ name, value }));
  }, [filteredData]);

  // Данные для Bar Chart (по дням)
  const barData = useMemo(() => {
    return filteredData.map(item => ({
      name: format(parseISO(item.payout_date), 'd MMM', { locale: ru }),
      value: item.cashback_amount
    }));
  }, [filteredData]);

  const earnedInPeriod = useMemo(() => {
    return filteredData.reduce((sum, item) => sum + item.cashback_amount, 0);
  }, [filteredData]);

  // Прогноз на 30 дней
  const forecast = useMemo(() => {
    const dailyRate = earnedInPeriod / 30;
    const next30DaysAmount = Math.round(dailyRate * 30);
    return { next30DaysAmount, futureTotal: totalMandarins + next30DaysAmount };
  }, [earnedInPeriod, totalMandarins]);

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* ХЕДЕР И СЕЛЕКТОР */}
      <header className="space-y-4 mt-2">
        <h1 className="font-bold text-2xl dark:text-white">Аналитика</h1>
        <button onClick={() => setIsCalendarOpen(true)} className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
          <CalendarIcon size={16} className="text-yellow-500" />
          <span className="text-sm font-bold">
            {format(dateRange.start, 'd апр.', { locale: ru })} — {format(dateRange.end, 'd апр.', { locale: ru })}
          </span>
          <ChevronDown size={14} className="text-zinc-400" />
        </button>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
          {['Все', 'Мили', 'Баллы', 'Рубли', 'Мандаринки'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-5 py-2.5 rounded-2xl whitespace-nowrap text-sm font-bold transition-all ${activeTab === tab ? 'bg-yellow-400 text-yellow-900 shadow-md' : 'bg-white dark:bg-zinc-900 text-zinc-400'}`}>
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* ТЕКУЩИЙ БАЛАНС */}
      <section className="flex justify-between items-start px-1">
        <div>
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">ТЕКУЩИЙ БАЛАНС</p>
          <div className="flex items-center gap-2">
            <span className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-white">{totalMandarins}</span>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-yellow-500 bg-yellow-200">
               <img src={currentUser?.avatar} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">НАЧИСЛЕНО В ПЕРИОДЕ</p>
          <p className="text-2xl font-black text-green-500">+{earnedInPeriod}</p>
        </div>
      </section>

      {/* КАРТОЧКА ПРОГНОЗА */}
      <section className="bg-[#1C1C1E] rounded-[32px] p-6 text-white relative overflow-hidden shadow-xl">
        <Zap className="absolute right-[-10px] bottom-[-10px] w-32 h-32 text-white opacity-5 rotate-12" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-yellow-400 p-2 rounded-xl"><TrendingUp size={20} className="text-black" /></div>
            <h3 className="font-black text-sm uppercase tracking-widest">ПРОГНОЗ НА 30 ДНЕЙ</h3>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-zinc-500 text-[10px] font-black uppercase mb-2">Вы накопите еще</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-yellow-400">+{forecast.next30DaysAmount}</span>
                <img src="/assets/mandarin.png" className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-zinc-500 text-[10px] font-black uppercase mb-2">Будущий баланс</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black">~{forecast.futureTotal}</span>
                <img src="/assets/mandarin.png" className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* СЕКЦИЯ ГРАФИКОВ С ПОДПИСЯМИ (ОТКУДА ПРИШЛО) */}
      <section className="bg-white dark:bg-zinc-900 rounded-[32px] p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold dark:text-white">Источники выгоды</h3>
          <div className="flex bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl">
            <button onClick={() => setChartType('pie')} className={`p-1.5 rounded-lg ${chartType === 'pie' ? 'bg-white shadow-sm' : 'text-zinc-400'}`}><PieChartIcon size={16}/></button>
            <button onClick={() => setChartType('bar')} className={`p-1.5 rounded-lg ${chartType === 'bar' ? 'bg-white shadow-sm' : 'text-zinc-400'}`}><BarChart3 size={16}/></button>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'pie' ? (
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} dataKey="value" stroke="none" paddingAngle={5}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', fontWeight: 'bold'}} />
              </PieChart>
            ) : (
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis dataKey="name" fontSize={10} tickLine={false} />
                <YAxis fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none'}} />
                <Bar dataKey="value" fill="#FACC15" radius={[4, 4, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Легенда графиков (Подписи: откуда пришло) */}
        {chartType === 'pie' && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 text-[11px] font-bold text-zinc-500">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }} />
                <span>{entry.name}: {entry.value} 🍊</span>
              </div>
            ))}
          </div>
        )}

        {/* ПЛАШКА: РАЗДЕЛЫ ПО КАТЕГОРИЯМ БУДУТ ПОЗЖЕ */}
        <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-start gap-3">
          <Info size={16} className="text-zinc-400 shrink-0 mt-0.5" />
          <p className="text-[10px] font-bold text-zinc-400 leading-tight uppercase tracking-wider">
            Аналитика по категориям (еда, транспорт, развлечения) появится в следующем обновлении.
          </p>
        </div>
      </section>

      {/* СОВЕТ ИИ */}
      <section className="bg-yellow-50 dark:bg-yellow-400/10 p-6 rounded-[32px] border border-yellow-200 flex gap-4">
        <div className="flex-1 text-sm font-bold dark:text-zinc-200">
          <div className="flex items-center gap-2 mb-2 text-yellow-700 uppercase text-[10px] font-black">
            <ShieldCheck size={14} /> Капибара-аналитик
          </div>
          {insight || "Анализирую данные..."}
        </div>
      </section>

      {/* СПИСОК ТРАНЗАКЦИЙ */}
      <section className="space-y-3 pb-10">
        <h3 className="font-bold px-1 dark:text-white uppercase text-xs tracking-widest opacity-50">История начислений</h3>
        {filteredData.map((item, i) => (
          <div key={i} className="bg-white dark:bg-zinc-900 p-4 rounded-[24px] border border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500"><ShoppingBag size={18} /></div>
              <div>
                <p className="font-bold text-sm dark:text-white">{item.loyalty_program_name}</p>
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

// Хелпер для форматирования дат в истории (если нужно)
function endOfDay(date: Date) {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
}