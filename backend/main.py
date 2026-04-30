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

@app.get("/api/ai-advice/{user_id}", tags=["Core"])
async def get_ai_advice(user_id: int):
    user_data = data_manager.get_user_dashboard(user_id)
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Собираем контекст из истории и офферов (segment, top_program, best_partners)
    opt_context = data_manager.get_optimization_context(user_id)
    
    # Передаем всё в ИИ
    advice = await ai_service.get_capybara_advice(
        user_name=user_data["user"]["full_name"],
        balance=user_data["total_mandarins"],
        **opt_context 
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


@app.post("/api/chat", tags=["Core"])
async def chat_with_capy(request: ChatRequest):
    user_data = data_manager.get_user_dashboard(request.user_id)
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Получаем тот же крутой контекст, что и для советов
    opt_context = data_manager.get_optimization_context(request.user_id)
    
    response = await ai_service.get_chat_response(
        user_name=user_data["user"]["full_name"],
        balance=user_data["total_mandarins"],
        user_message=request.message,
        **opt_context
    )
    
    return {"response": response}

if __name__ == "__main__":
    import uvicorn
    # Запуск сервера на порту 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)