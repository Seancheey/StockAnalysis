from abc import ABC, abstractmethod
from pandas import DataFrame, Series


class User:
    __slots__ = ('token', 'money', 'stocks')

    def __init__(self, money):
        self.money = money
        self.stocks = {}

    def trade_stock(self, stock_code, unit_price, num):
        if self.money < unit_price * num:
            raise ValueError("user doesn't have enough money")
        self.stocks[stock_code] = self.stocks[stock_code] or 0
        self.stocks[stock_code] += num
        self.money -= unit_price * num

    def buy_stock(self, stock_code, unit_price, num):
        self.trade_stock(stock_code, unit_price, num)

    def sell_stock(self, stock_code, unit_price, num):
        self.trade_stock(stock_code, unit_price, -num)


class TransactionCall:

    def __init__(self, price: float, amount: float):
        self.price = price
        self.amount = amount


class StockContext:

    def __init__(self, stock_history: DataFrame, user_data: User):
        self.stock_history = stock_history
        self.user_data = user_data


class TransactionStrategy(ABC):
    __slots__ = ("call",)

    @abstractmethod
    def updateTransactionCall(self, context: StockContext, delta: Series, today) -> TransactionCall:
        pass
