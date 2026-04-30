// frontend/src/data.tsx

import { ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { Language, translations, TranslationKey } from './i18n';
import { api } from './lib/api'; // Импортируем наш API клиент

// --- Типы данных (соответствуют твоим моделям в FastAPI) ---

export interface Skin {
  id: string;
  nameKey: string;
  descriptionKey: string;
  category: 'base' | 'segment' | 'loyalty' | 'ecosystem';
  image: string;
  price?: number;
  unlockedByDefault?: boolean;
}

// frontend/src/data.tsx

export const MOCK_SKINS: Skin[] = [
  { 
    id: 'skin-low', 
    nameKey: 'skin.budget', 
    descriptionKey: 'skin.budget.desc', 
    category: 'segment', 
    image: '/assets/low_segment.png', 
    unlockedByDefault: true 
  },
  { 
    id: 'skin-medium', 
    nameKey: 'skin.middle', 
    descriptionKey: 'skin.middle.desc', 
    category: 'segment', 
    image: '/assets/medium_segment.png' 
  },
  { 
    id: 'skin-high', 
    nameKey: 'skin.millionaire', 
    descriptionKey: 'skin.millionaire.desc', 
    category: 'segment', 
    image: '/assets/high_segment.png' 
  },
  { 
    id: 'skin-black', 
    nameKey: 'skin.black', 
    descriptionKey: 'skin.black.desc', 
    category: 'loyalty', 
    image: '/assets/black_card.png' // Используем картинку карты как "образ"
  },
  { 
    id: 'skin-traveler', 
    nameKey: 'skin.traveler', 
    descriptionKey: 'skin.traveler.desc', 
    category: 'ecosystem', 
    image: '/assets/travels_category.png' 
  },
];


// Добавь это в frontend/src/data.tsx (если еще нет)

export interface Quest {
  id: string;
  title: string;
  reward: number;
  progress: number;
  total: number;
  icon: 'Wallet' | 'Footprints' | 'Users';
}

// Добавь/обнови это в frontend/src/data.tsx

export const MOCK_QUESTS = [
  { 
    id: 'q1', 
    title: 'Пополни инвесткопилку', 
    reward: 500, 
    progress: 6500, 
    total: 10000, 
    icon: 'Wallet' 
  },
  { 
    id: 'q2', 
    title: 'Пригласи друга', 
    reward: 300, 
    progress: 0, 
    total: 1, 
    icon: 'Users' 
  },
  { 
    id: 'q3', 
    title: 'Пройди 10 000 шагов за день', 
    reward: 150, 
    progress: 8241, 
    total: 10000, 
    icon: 'Footprints' 
  },
];

export type UserSegment = 'LOW' | 'MEDIUM' | 'HIGH';

export interface User {
  id: string; // В БД это int, приводим к string для совместимости с твоим UI
  full_name: string;
  financial_segment: UserSegment;
  email: string;
  phone_number: string;
  avatar: string; // Будем генерировать или брать из скинов
  hasPro: boolean;
}

export interface AccountDetail {
  account_id: number;
  loyalty_program_name: string;
  current_balance: number;
  cashback_currency: string;
}

export interface Offer {
  partner_id: number;
  partner_name: string;
  short_description: string;
  logo_url: string;
  brand_color_hex: string;
  cashback_percent: number;
  financial_segment: string;
}

// Контекст приложения
type AppContextType = {
  currentUser: User | null;
  userList: User[]; // Список для экрана выбора
  isLoading: boolean;
  loginAsUser: (userId: number) => Promise<void>;
  logout: () => void;
  
  // Данные из бэкенда
  totalMandarins: number;
  accountsDetails: AccountDetail[];
  offers: Offer[];
  
  // Геймификация (оставляем локально для хакатона)
  unlockedSkins: string[];
  equippedSkinId: string;
  equipSkin: (skinId: string) => void;
  addMandarins: (amount: number) => void;
  gameBonuses: number; 

  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  language: Language;
  setLanguage: (l: Language) => void;
  t: (key: TranslationKey) => string;
};


export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userList, setUserList] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Данные текущей сессии
  const [totalMandarins, setTotalMandarins] = useState(0);
  const [accountsDetails, setAccountsDetails] = useState<AccountDetail[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [gameBonuses, setGameBonuses] = useState(0);

  // Скины
  const [unlockedSkins, setUnlockedSkins] = useState<string[]>(['skin-1']);
  const [equippedSkinId, setEquippedSkinId] = useState<string>('skin-1');

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState<Language>('ru');

  // 1. При загрузке приложения получаем список юзеров из Users.csv
  // useEffect(() => {
  //   api.getUsers().then(data => {
  //     // Маппим данные из CSV под формат User
  //     const formattedUsers = data.map((u: any) => ({
  //       ...u,
  //       id: String(u.id),
  //       name: u.full_name,
  //       // Назначаем дефолтную аватарку, если её нет
  //       avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-XchT-udWl77_jtQ8SBjYqJDc_DghHeQCaqnxBhqnRUm3e8C4i2Zi7CpEHEikzbpTcfRvt79PUv3t-1WfTxnsLoga_NLiUL9g1v_Z2c3DABXx0MIdjNa6PUysbVsBp31EzJUlZauifDpGwNgAI96S2zcohlX-a51IvImUYmu6-obWnBel0SWjXcrj0Kijfai4mE5x-5UEHd0QrabseRgWzSY9dSpRGrJzc4DdiJtb_XL3lyvxj9Jyt8orI81QgvhXJU6JUhmTVGY',
  //       hasPro: u.financial_segment === 'HIGH' // Например, у HIGH сегмента всегда Pro
  //     }));
  //     setUserList(formattedUsers);
  //   });
  // }, []);

  useEffect(() => {
  api.getUsers().then(data => {
    const formattedUsers = data.map((u: any) => {
      // Подбираем аватарку в зависимости от сегмента из папки assets
      let avatarPath = '/assets/low_segment.png';
      if (u.financial_segment === 'MEDIUM') avatarPath = '/assets/medium_segment.png';
      if (u.financial_segment === 'HIGH') avatarPath = '/assets/high_segment.png';

      return {
        ...u,
        id: String(u.id),
        full_name: u.full_name,
        avatar: avatarPath, // Теперь тут путь к локальному ассету
        hasPro: u.financial_segment === 'HIGH' || u.financial_segment === 'MEDIUM'
      };
    });
    setUserList(formattedUsers);
  });
}, []);

  // 2. Функция "Входа" — загружает данные из Дашборда
  const loginAsUser = async (userId: number) => {
    setIsLoading(true);
    try {
      const data = await api.getDashboard(userId);
      
      const userObj = {
        ...data.user,
        id: String(data.user.id),
        avatar: currentUser?.avatar || userList.find(u => u.id === String(userId))?.avatar
      };

      setCurrentUser(userObj);
      setTotalMandarins(data.total_mandarins);
      setAccountsDetails(data.accounts_details);
      setOffers(data.offers);
      setGameBonuses(0); // Сбрасываем игровые бонусы для нового юзера
      
      // Авто-разблокировка скина по сегменту
      const segmentSkin = `skin-${data.user.financial_segment.toLowerCase()}`;
      if (!unlockedSkins.includes(segmentSkin)) {
        setUnlockedSkins(prev => [...prev, segmentSkin]);
      }
    } catch (err) {
      alert("Ошибка при загрузке данных пользователя");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setAccountsDetails([]);
  };

  const addMandarins = (amount: number) => {
    setGameBonuses(prev => prev + amount);
    setTotalMandarins(prev => prev + amount);
  };

  // frontend/src/data.tsx

const equipSkin = (skinId: string) => {
  if (unlockedSkins.includes(skinId)) {
    setEquippedSkinId(skinId);
    
    // Находим данные скина, чтобы получить путь к картинке
    const newSkin = MOCK_SKINS.find(s => s.id === skinId);
    
    if (newSkin && currentUser) {
      // Обновляем текущего пользователя, меняя его аватар на картинку костюма
      setCurrentUser({
        ...currentUser,
        avatar: newSkin.image
      });
    }
  }
};
  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  // Управление темой
  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  return (
    <AppContext.Provider value={{ 
      currentUser, 
      userList,
      isLoading,
      loginAsUser,
      logout,
      totalMandarins,
      accountsDetails,
      offers,
      unlockedSkins,
      equippedSkinId,
      equipSkin,
      unlockSkin: (id) => setUnlockedSkins(prev => [...prev, id]),
      addMandarins,
      gameBonuses,
      theme, 
      setTheme, 
      language, 
      setLanguage, 
      t 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}