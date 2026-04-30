import pandas as pd
import os

class DataManager:
    def __init__(self, data_path: str = "data"):
        self.data_path = data_path
        self.load_data()

    def load_data(self):
        """Загрузка всех CSV файлов в память"""
        self.users = pd.read_csv(os.path.join(self.data_path, "Users.csv"))
        self.accounts = pd.read_csv(os.path.join(self.data_path, "Accounts.csv"))
        self.programs = pd.read_csv(os.path.join(self.data_path, "LoyaltyPrograms.csv"))
        self.offers = pd.read_csv(os.path.join(self.data_path, "Offers.csv"))
        self.history = pd.read_csv(os.path.join(self.data_path, "LoyaltyHistory.csv"))

    def get_users_list(self):
        """Возвращает список всех пользователей для экрана выбора"""
        return self.users.to_dict(orient="records")

    def get_user_dashboard(self, user_id: int):
        """Собирает все данные для главного экрана пользователя"""
        # 1. Информация о пользователе
        user_row = self.users[self.users['id'] == user_id]
        if user_row.empty:
            return None
        user_info = user_row.iloc[0].to_dict()

        # 2. Балансы (Соединяем Accounts и LoyaltyPrograms)
        user_accounts = self.accounts[self.accounts['user_id'] == user_id]
        # Делаем аналог SQL Join: приклеиваем название программы и валюту к счету
        merged_accounts = user_accounts.merge(self.programs, on='loyalty_program_id')
        
        # Считаем суммарный баланс (Мандаринки)
        total_balance = merged_accounts['current_balance'].sum()

        # 3. Офферы (Фильтруем по финансовому сегменту пользователя)
        user_segment = user_info['financial_segment']
        # Сначала те, что идеально подходят по сегменту, затем остальные
        relevant_offers = self.offers[self.offers['financial_segment'] == user_segment]
        
        return {
            "user": user_info,
            "total_mandarins": round(total_balance, 2),
            "accounts_details": merged_accounts.to_dict(orient="records"),
            "offers": relevant_offers.to_dict(orient="records")
        }

    def get_user_analytics(self, user_id: int):
        """Данные для графиков на основе истории транзакций"""
        # Находим все ID счетов пользователя
        user_acc_ids = self.accounts[self.accounts['user_id'] == user_id]['account_id'].tolist()
        
        # Фильтруем историю транзакций
        user_history = self.history[self.history['account_id'].isin(user_acc_ids)].copy()
        
        # Преобразуем дату в формат datetime для сортировки
        user_history['payout_date'] = pd.to_datetime(user_history['payout_date'])
        user_history = user_history.sort_values(by='payout_date')
        
        # Группируем по датам, чтобы фронтенд мог построить график
        chart_data = user_history.groupby('payout_date')['cashback_amount'].sum().reset_index()
        
        # Возвращаем данные, превращая дату обратно в строку для JSON
        chart_data['payout_date'] = chart_data['payout_date'].dt.strftime('%Y-%m-%d')
        
        return chart_data.to_dict(orient="records")

# Создаем экземпляр для экспорта
data_manager = DataManager()