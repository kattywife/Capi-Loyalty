from abc import ABC, abstractmethod

class BaseAIProvider(ABC):
    @abstractmethod
    async def generate_advice(self, user_name: str, segment: str, balance: float) -> str:
        """Метод, который должен реализовать каждый провайдер"""
        pass