from database.utils import engine
from sqlalchemy.sql import select
from database.sql_tables import Stocks, DailyPriceSummaries
from proto import Stock_pb2, StockDailySummary_pb2
from datetime import datetime
from pandas import DataFrame

def get_stocks() -> Stock_pb2.StocksResponse:
    result = engine.execute(select([Stocks.__table__]))
    response = Stock_pb2.StocksResponse()
    for col in result:
        response.stocks.append(Stock_pb2.Stock(code=col[0], exchange=col[1], full_name=col[2]))
    return response


def get_stock_daily_history(exchange: str, code: str, limit=300) -> StockDailySummary_pb2.StockHistDailySummaries:
    sql = select([DailyPriceSummaries.__table__]).where(
        DailyPriceSummaries.code == code and DailyPriceSummaries.exchange == exchange)
    if limit > 0:
        sql = sql.limit(limit)
    result = engine.execute(sql)
    response = StockDailySummary_pb2.StockHistDailySummaries(stock=Stock_pb2.Stock(code=code, exchange=exchange))
    for col in result:
        response.daily_summary.append(StockDailySummary_pb2.StockDailySummary(
            date=int(datetime.combine(col[DailyPriceSummaries.date.key], datetime.min.time()).timestamp()),
            open=col[DailyPriceSummaries.open.key],
            close=col[DailyPriceSummaries.close.key],
            high=col[DailyPriceSummaries.high.key],
            low=col[DailyPriceSummaries.low.key],
            volume=col[DailyPriceSummaries.volume.key],
            turnover=col[DailyPriceSummaries.volume.key],
        ))
    return response


def get_stock_high_2nd_high_cross_point(exchange: str, code: str):

    pass


if __name__ == "__main__":
    print(get_stock_daily_history("SZ", "000001"))
