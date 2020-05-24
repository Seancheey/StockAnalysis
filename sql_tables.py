from sqlalchemy.schema import Column
from sqlalchemy.types import VARCHAR, INTEGER, DECIMAL
from settings import Base

_MONEY_TYPE = DECIMAL(10, 2)


class CNStocks(Base):
    __tablename__ = "stocks"
    code = Column(VARCHAR(10), primary_key=True)
    exchange_market = Column(VARCHAR(10), primary_key=True)
    full_name = Column(VARCHAR(100))
    industry = Column(VARCHAR(20))
    area = Column(VARCHAR(50))


class ExchangeMarkets(Base):
    __tablename__ = "exchange_markets"
    exchange_name = Column(VARCHAR(10), primary_key=True)


class Industrys(Base):
    __tablename__ = "industry"
    industry = Column(VARCHAR(20), primary_key=True)


class Areas(Base):
    __tablename__ = "areas"
    area = Column(VARCHAR(50), primary_key=True)


class DailyPriceSummaries(Base):
    __tablename__ = "daily_price_summaries"
    code = Column(VARCHAR(10), primary_key=True)
    exchange_market = Column(VARCHAR(10), primary_key=True)
    open = Column(_MONEY_TYPE)
    close = Column(_MONEY_TYPE)
    high = Column(_MONEY_TYPE)
    low = Column(_MONEY_TYPE)
    # 昨日收盘价
    last_day_close = Column(_MONEY_TYPE)
    # 成交量
    volume = Column(INTEGER)
    # 成交额
    turnover = Column(_MONEY_TYPE)
