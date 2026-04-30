from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List

# Импортируем нашу логику и схемы
from services.data_manager import data_manager
from models.schemas import UserSchema, DashboardResponse, AnalyticsItem
from services.ai_service import ai_service
from pydantic import BaseModel

app = FastAPI(
    title="Капи-Лояльность API",
    description="Backend сервис для объединения программ лояльности Т-Банка",
    version="1.0.0"
)

class ChatRequest(BaseModel):
    user_id: int
    message: str

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Health Check"])
def read_root():
    return {"status": "ok", "message": "API Капи-Лояльность запущено"}

@app.get("/api/users", response_model=List[UserSchema], tags=["Users"])
def get_users():
    """Возвращает список всех пользователей для экрана выбора (демо-стенд)"""
    return data_manager.get_users_list()

# Добавляем новый эндпоинт в main.py

@app.get("/api/ai-advice/{user_id}", tags=["Core"])
async def get_ai_advice(user_id: int):
    """Отдельный быстрый запрос для ИИ совета"""
    data = data_manager.get_user_dashboard(user_id)
    if not data:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Запускаем асинхронно
    advice = await ai_service.get_capybara_advice(
        data["user"]["full_name"], 
        data["user"]["financial_segment"], 
        data["total_mandarins"]
    )
    return {"advice": advice}

# А в основном эндпоинте убираем ожидание ИИ
@app.get("/api/dashboard/{user_id}", response_model=DashboardResponse, tags=["Core"])
async def get_dashboard(user_id: int):
    data = data_manager.get_user_dashboard(user_id)
    if not data:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Теперь отдаем сразу заглушку, фронт подтянет совет вторым запросом
    data["ai_advice"] = "Загружаю мудрость капибары..."
    return data

@app.get("/api/analytics/{user_id}", response_model=List[AnalyticsItem], tags=["Core"])
def get_analytics(user_id: int):
    """Возвращает историю выплат кэшбэка для построения графиков"""
    data = data_manager.get_user_analytics(user_id)
    if not data:
        # Если истории нет, возвращаем пустой список, а не ошибку
        return []
    return data

# Добавь сам эндпоинт
@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    # Используем твой существующий ai_service
    # Мы можем адаптировать его метод под свободный чат
    # Для хакатона можно просто переиспользовать генерацию совета с новым промптом
    response_text = await ai_service.get_capybara_advice(
        user_name=f"User ID {request.user_id}", # Можно подтянуть имя из data_manager
        segment="DYNAMIC",
        total_balance=0 # Или реальный баланс
    )
    # Или, если хочешь честный чат, вызови ai_service напрямую:
    # response_text = await ai_service.client.chat.completions.create(...)
    
    return {"response": response_text}

if __name__ == "__main__":
    import uvicorn
    # Запуск сервера на порту 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)