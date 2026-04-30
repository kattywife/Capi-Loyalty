import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isWithinInterval,
  isBefore,
  startOfDay
} from 'date-fns';
import { ru } from 'date-fns/locale';
import { useAppContext } from '../data';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (start: Date, end: Date) => void;
  initialStart?: Date;
  initialEnd?: Date;
}

export default function CalendarModal({ isOpen, onClose, onSelect, initialStart, initialEnd }: CalendarModalProps) {
  const { t } = useAppContext();
  const [startDate, setStartDate] = useState<Date | null>(initialStart || null);
  const [endDate, setEndDate] = useState<Date | null>(initialEnd || null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const months = useMemo(() => {
    // Show current month and previous month for history selection
    return [subMonths(currentMonth, 1), currentMonth];
  }, [currentMonth]);

  const handleDayClick = (day: Date) => {
    const d = startOfDay(day);
    if (!startDate || (startDate && endDate)) {
      setStartDate(d);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (isBefore(d, startDate)) {
        setStartDate(d);
        setEndDate(startDate);
      } else {
        setEndDate(d);
      }
    }
  };

  const isSelected = (day: Date) => {
    if (startDate && isSameDay(day, startDate)) return true;
    if (endDate && isSameDay(day, endDate)) return true;
    return false;
  };

  const isInRange = (day: Date) => {
    if (startDate && endDate) {
      return isWithinInterval(day, { start: startDate, end: endDate });
    }
    return false;
  };

  const renderMonth = (month: Date) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const start = startOfWeek(monthStart, { locale: ru, weekStartsOn: 1 });
    const end = endOfWeek(monthEnd, { locale: ru, weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });

    return (
      <div key={month.toString()} className="mb-6">
        <h3 className="text-base font-bold mb-4 capitalize px-2 text-zinc-900 dark:text-white">
          {format(month, 'LLLL, yyyy', { locale: ru })}
        </h3>
        <div className="grid grid-cols-7 gap-y-1">
          {days.map((day) => {
            const isCurrentMonth = isSameMonth(day, month);
            const selected = isSelected(day);
            const range = isInRange(day);
            const isStart = startDate && isSameDay(day, startDate);
            const isEnd = endDate && isSameDay(day, endDate);

            return (
              <div
                key={day.toString()}
                onClick={() => isCurrentMonth && handleDayClick(day)}
                className={`
                  relative h-10 flex items-center justify-center text-sm font-bold cursor-pointer transition-all
                  ${!isCurrentMonth ? 'opacity-0 pointer-events-none' : 'text-zinc-600 dark:text-zinc-400 font-medium'}
                  ${selected ? 'text-white z-10' : ''}
                `}
              >
                {range && !selected && isCurrentMonth && (
                  <div className="absolute inset-y-1 inset-x-0 bg-blue-500/10 dark:bg-blue-400/20" />
                )}
                {isStart && endDate && isCurrentMonth && (
                  <div className="absolute inset-y-1 right-0 w-1/2 bg-blue-500/10 dark:bg-blue-400/20" />
                )}
                {isEnd && startDate && isCurrentMonth && (
                  <div className="absolute inset-y-1 left-0 w-1/2 bg-blue-500/10 dark:bg-blue-400/20" />
                )}
                <div className={`
                  w-9 h-9 flex items-center justify-center rounded-xl transition-all
                  ${selected ? 'bg-blue-500 shadow-md shadow-blue-500/40 scale-110' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}
                `}>
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-sm sm:max-w-md bg-white dark:bg-zinc-950 rounded-t-[32px] overflow-hidden flex flex-col h-[85vh] shadow-[0_-8px_30px_rgb(0,0,0,0.12)]"
          >
            {/* Drag Handle */}
            <div className="w-full flex justify-center pt-3 pb-1">
              <div className="w-12 h-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            </div>

            {/* Header */}
            <div className="px-6 pb-4 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-white">{t('analytics.selectPeriod')}</h2>
                <button onClick={onClose} className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1 flex flex-col gap-1.5">
                  <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{t('analytics.from')}</span>
                  <div className={`h-11 flex items-center px-4 rounded-xl border-2 transition-all ${startDate ? 'border-yellow-400 bg-yellow-50/30 dark:bg-yellow-400/10' : 'border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50'}`}>
                    <span className={`text-sm font-bold ${startDate ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`}>
                      {startDate ? format(startDate, 'd MMMM', { locale: ru }) : 'Начало'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{t('analytics.to')}</span>
                  <div className={`h-11 flex items-center px-4 rounded-xl border-2 transition-all ${endDate ? 'border-yellow-400 bg-yellow-50/30 dark:bg-yellow-400/10' : 'border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50'}`}>
                    <span className={`text-sm font-bold ${endDate ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`}>
                      {endDate ? format(endDate, 'd MMMM', { locale: ru }) : 'Конец'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-7 text-center">
                {['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'].map(day => (
                  <span key={day} className="text-[10px] font-black text-zinc-400 dark:text-zinc-600 uppercase tracking-tighter">
                    {day}
                  </span>
                ))}
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 overflow-y-auto px-6 pb-28 scrollbar-none">
              <div className="flex flex-col">
                <button 
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="py-6 text-xs font-black text-zinc-400 uppercase tracking-widest hover:text-blue-500 transition-colors"
                >
                  Показать прошедшие месяцы
                </button>

                {months.map(renderMonth)}
                
                <button 
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="py-6 text-xs font-black text-zinc-400 uppercase tracking-widest hover:text-blue-500 transition-colors"
                >
                  Показать следующие месяцы
                </button>
              </div>
            </div>

            {/* Footer Action */}
            <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-white dark:from-zinc-950 via-white dark:via-zinc-950 to-transparent">
              <button
                disabled={!startDate || !endDate}
                onClick={() => startDate && endDate && onSelect(startDate, endDate)}
                className="w-full py-4 rounded-2xl bg-yellow-400 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-600 text-zinc-900 font-bold text-lg shadow-xl shadow-yellow-400/20 active:scale-[0.98] transition-all"
              >
                {t('analytics.select')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
