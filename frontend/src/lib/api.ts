// frontend/src/lib/api.ts

const API_BASE = "http://localhost:8000/api";

export const api = {
  /**
   * Получает список всех пользователей из бэкенда (Users.csv)
   */
  getUsers: async () => {
    try {
      const response = await fetch(`${API_BASE}/users`);
      if (!response.ok) throw new Error("Failed to fetch users");
      return await response.json();
    } catch (error) {
      console.error("API Error (getUsers):", error);
      return [];
    }
  },

  /**
   * Получает полные данные дашборда для конкретного пользователя
   * (Баланс, счета, отфильтрованные офферы)
   */
  getDashboard: async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE}/dashboard/${userId}`);
      if (!response.ok) throw new Error("User not found");
      return await response.json();
    } catch (error) {
      console.error("API Error (getDashboard):", error);
      throw error;
    }
  },

  /**
   * Получает историю транзакций для графиков (LoyaltyHistory.csv)
   */
  getAnalytics: async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE}/analytics/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return await response.json();
    } catch (error) {
      console.error("API Error (getAnalytics):", error);
      return [];
    }
  },

  /**
   * Запрашивает совет у Капибары (через AI на бэкенде)
   */
  getAiAdvice: async (userId: number) => {
    try {
      const response = await fetch(`${API_BASE}/ai-advice/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch AI advice");
      const data = await response.json();
      return data.advice;
    } catch (error) {
      console.error("API Error (getAiAdvice):", error);
      return "Мандаринки — это радость! Попробуй накопить еще немного. 🍊";
    }
  },

  /**
   * Отправляет сообщение в чат бэкенду
   */
  sendChatMessage: async (userId: number, message: string) => {
    try {
      const response = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, message })
      });
      if (!response.ok) throw new Error("Failed to get chat response");
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("API Error (sendChatMessage):", error);
      return "Ой, что-то пошло не так. Но мои мандаринки всё ещё на месте! 🍊";
    }
  },
};