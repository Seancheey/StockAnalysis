from sqlalchemy.schema import Column, ForeignKey
from sqlalchemy.types import VARCHAR, INTEGER, DECIMAL, DATE
from database.utils import Base

MONEY = DECIMAL(10, 2)


class ExchangeMarkets(Base):
    __tablename__ = "exchange_markets"
    exchange = Column(VARCHAR(10), primary_key=True)


class Industry(Base):
    __tablename__ = "industry"
    industry = Column(VARCHAR(20), primary_key=True)


class Areas(Base):
    __tablename__ = "areas"
    area = Column(VARCHAR(50), primary_key=True)


class Stocks(Base):
    __tablename__ = "stocks"
    code = Column(VARCHAR(10), primary_key=True)
    exchange = Column(VARCHAR(10), ForeignKey(ExchangeMarkets.exchange), primary_key=True)
    full_name = Column(VARCHAR(100), nullable=False)
    industry = Column(VARCHAR(20), ForeignKey(Industry.industry))
    area = Column(VARCHAR(50), ForeignKey(Areas.area))
    list_date = Column(DATE)


class DailyPriceSummaries(Base):
    __tablename__ = "daily_price_summaries"
    code = Column(VARCHAR(10), ForeignKey(Stocks.code), primary_key=True)
    exchange = Column(VARCHAR(10), ForeignKey(Stocks.exchange), primary_key=True)
    open = Column(MONEY, nullable=False)
    close = Column(MONEY, nullable=False)
    high = Column(MONEY, nullable=False)
    low = Column(MONEY, nullable=False)
    # 昨日收盘价
    last_day_close = Column(MONEY, nullable=False)
    # 成交量
    volume = Column(INTEGER, nullable=False)
    # 成交额
    turnover = Column(MONEY, nullable=False)


METADATA = Base.metadata
