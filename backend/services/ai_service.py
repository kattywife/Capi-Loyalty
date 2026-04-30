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

    async def get_capybara_advice(self, user_name: str, segment: str, total_balance: float):
        # 1. Подготавливаем промпт из конфига
        prompt_cfg = self.prompts["capybara_advice"]
        user_message = prompt_cfg["user_template"].format(
            user_name=user_name,
            segment=segment,
            balance=total_balance
        )

        try:
            # 2. Отправляем запрос (модель тоже берем из конфига)
            response = await self.client.chat.completions.create(
                model=self.config["active_model"],
                messages=[
                    {"role": "system", "content": prompt_cfg["system"]},
                    {"role": "user", "content": user_message}
                ],
                max_tokens=100,
                temperature=0.7
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            print(f"AI Error: {e}")
            return "Мандаринки — это радость! 🍊"

# Экспортируем готовый сервис
ai_service = UniversalAIService()