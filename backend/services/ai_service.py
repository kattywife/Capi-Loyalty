import json
import os
from openai import AsyncOpenAI

class UniversalAIService:
    def __init__(self):
        self.config = self._load_json("config/providers.json")
        self.prompts = self._load_json("config/prompts.json")
        self.client = self._init_client()

    def _load_json(self, path):
        full_path = os.path.join(os.path.dirname(__file__), "..", path)
        with open(full_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _init_client(self):
        # Берем настройки активного провайдера
        p_name = self.config["active_provider"]
        p_config = self.config["providers"][p_name]

        extra_headers = {}
        if p_name == "openrouter":
            extra_headers = {
                "HTTP-Referer": "http://localhost:3000", # Твой сайт
                "X-Title": "Capy Loyalty T-Bank",        # Название проекта
            }
        
        return AsyncOpenAI(
            base_url=p_config["baseUrl"],
            api_key=p_config["apiKey"],
            default_headers=extra_headers 
        )
    
    async def get_capybara_advice(self, **kwargs):
        """Универсальный метод с защитой от лишних символов"""
        prompt_cfg = self.prompts["capybara_advice"]
        
        try:
            # Подставляем данные в шаблон
            user_message = prompt_cfg["user_template"].format(**kwargs)

            response = await self.client.chat.completions.create(
                model=self.config["active_model"],
                messages=[
                    {"role": "system", "content": prompt_cfg["system"]},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=80,
                temperature=0.6 # Снизили температуру для большей строгости
            )
            
            raw_advice = response.choices[0].message.content.strip()
            
            # --- ОЧИСТКА ОТ СИМВОЛОВ Markdown ---
            # Удаляем звездочки, решетки и подчеркивания
            clean_advice = raw_advice.replace("*", "").replace("#", "").replace("_", "")
            
            return clean_advice

        except Exception as e:
            print(f"AI Error: {e}")
            return "Твои мандаринки растут! Проверь новые акции в разделе партнеров. 🍊"
        
    async def get_chat_response(self, **kwargs):
        """Метод для полноценного диалога в чате"""
        prompt_cfg = self.prompts["capybara_chat"]
        try:
            user_message_filled = prompt_cfg["user_template"].format(**kwargs)

            response = await self.client.chat.completions.create(
                model=self.config["active_model"],
                messages=[
                    {"role": "system", "content": prompt_cfg["system"]},
                    {"role": "user", "content": user_message_filled}
                ],
                max_tokens=150,
                temperature=0.7
            )
            
            raw_text = response.choices[0].message.content.strip()
            return raw_text.replace("*", "").replace("#", "").replace("_", "")
        except Exception as e:
            print(f"Chat AI Error: {e}")
            return "Прости, я немного задумался о мандаринках. Повтори вопрос? 🍊"

# Экспортируем готовый сервис
ai_service = UniversalAIService()