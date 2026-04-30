from .base import BaseAIProvider
import asyncio

class MockProvider(BaseAIProvider):
    async def generate_advice(self, user_name: str, segment: str, balance: float) -> str:
        # Имитируем небольшую задержку
        await asyncio.sleep(0.5)
        return f"Привет, {user_name}! Я временная Капибара. Твои {balance} мандаринок в безопасности! 🍊"