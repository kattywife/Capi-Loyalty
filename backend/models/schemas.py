from pydantic import BaseModel
from typing import List, Optional

# Схема базовой информации о пользователе
class UserSchema(BaseModel):
    id: int
    email: str
    phone_number: str
    full_name: str
    financial_segment: str

# Схема деталей счета (уже объединенная с программой лояльности)
class AccountDetailSchema(BaseModel):
    account_id: int
    user_id: int
    loyalty_program_id: int
    current_balance: float
    loyalty_program_name: str
    cashback_currency: str

# Схема рекламного предложения (оффера)
class OfferSchema(BaseModel):
    partner_id: int
    partner_name: str
    short_description: str
    logo_url: str
    brand_color_hex: str
    cashback_percent: int
    financial_segment: str

# Главная схема для Дашборда (всё вместе)
class DashboardResponse(BaseModel):
    user: UserSchema
    total_mandarins: float
    accounts_details: List[AccountDetailSchema]
    offers: List[OfferSchema]
    ai_advice: Optional[str] = "Капибара думает над советом..."

# Схема для элемента графика аналитики
class AnalyticsItem(BaseModel):
    payout_date: str
    cashback_amount: float