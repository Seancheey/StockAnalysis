from datetime import datetime

from pandas import read_sql_query
from sqlalchemy.sql import select

from data_analysis.utils import get_highest, get_nth_high_after_highest, cross_point
from database.sql_tables import Stocks, DailyPriceSummaries
from database.utils import engine
from proto.Stock_pb2 import StockDailySummary, StockHistDailySummaries, Stock, StockPoints, StockPoint, StocksResponse


def get_stocks() -> StocksResponse:
    result = engine.execute(select([Stocks.__table__]))
    response = StocksResponse()
    for col in result:
        response.stocks.append(Stock(code=col[0], exchange=col[1], full_name=col[2]))
    return response


def __get_stock_sql(exchange: str, code: str, limit: int):
    sql = select([DailyPriceSummaries.__table__]).where(
        DailyPriceSummaries.code == code and DailyPriceSummaries.exchange == exchange).order_by(
        DailyPriceSummaries.date.desc())
    if limit > 0:
        sql = sql.limit(limit)
    return sql


def get_stock_daily_history(exchange: str, code: str, limit=1000) -> StockHistDailySummaries:
    result = engine.execute(__get_stock_sql(exchange, code, limit))
    response = StockHistDailySummaries(stock=Stock(code=code, exchange=exchange))
    for col in result:
        response.daily_summary.append(StockDailySummary(
            date=int(datetime.combine(col[DailyPriceSummaries.date.key], datetime.min.time()).timestamp()),
            open=col[DailyPriceSummaries.open.key],
            close=col[DailyPriceSummaries.close.key],
            high=col[DailyPriceSummaries.high.key],
            low=col[DailyPriceSummaries.low.key],
            volume=col[DailyPriceSummaries.volume.key],
            turnover=col[DailyPriceSummaries.volume.key],
        ))
    return response


def get_stock_high_2nd_high_cross_point(exchange: str, code: str, limit=300) -> StockPoints:
    df = read_sql_query(__get_stock_sql(exchange, code, limit), engine)
    highest = get_highest(df, DailyPriceSummaries.high.key)
    highest2 = get_nth_high_after_highest(df, DailyPriceSummaries.high.key)
    cross = cross_point(df, highest, highest2)
    response = StockPoints()
    response.stock_points.append(StockPoint(
        stock_price=highest[0],
        stock_index=highest[1],
    ))
    response.stock_points.append(StockPoint(
        stock_price=highest2[0],
        stock_index=highest2[1],
    ))
    response.stock_points.append(StockPoint(
        stock_price=cross[0],
        stock_index=cross[1],
    ))
    return response


if __name__ == "__main__":
    print(get_stock_high_2nd_high_cross_point("SZ", "000002"))
