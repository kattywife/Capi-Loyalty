import google.generativeai as genai
from .base import BaseAIProvider

class GeminiProvider(BaseAIProvider):
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')

    async def generate_advice(self, user_name: str, segment: str, balance: float) -> str:
        prompt = f"""
        Ты — дружелюбная Капибара, маскот программы лояльности Т-Банка. 
        Твоя задача: дать короткий и добрый совет пользователю.
        
        Данные пользователя:
        - Имя: {user_name}
        - Финансовый сегмент: {segment} (LOW - экономит, MEDIUM - средний, HIGH - премиум)
        - Общий баланс кэшбэка (в мандаринках): {balance}

        Правила:
        1. Пиши кратко (2-3 предложения).
        2. Используй эмодзи (мандаринки, капибары, сердечки).
        3. Если сегмент LOW, посоветуй накопить на что-то полезное.
        4. Если сегмент HIGH, посоветуй заглянуть в раздел Т-Инвестиции или премиальные рестораны.
        5. Обращайся на "ты".
        """
        try:
            response = await self.model.generate_content_async(
                prompt,
                generation_config=genai.types.GenerationConfig(max_output_tokens=50)
            )
            return response.text.strip()
        except Exception as e:
            return f"Ошибка Gemini: {e}"