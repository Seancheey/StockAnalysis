from data_collection.pipeline import transform, Pipeline
from data_collection.utils import unique_of, ts_date_to_sql
from database.sql_tables import Stocks, DailyPriceSummaries, ExchangeMarkets


def ts_daily_to_stocks_transform(df):
    return transform(df, [
        Pipeline('ts_code', Stocks.exchange.key, lambda x: x.split('.')[-1]),
        Pipeline('ts_code', Stocks.code.key, lambda x: x.split('.')[0]),
    ])


def ts_daily_to_daily_price_summaries_table(df, trade_date=None):
    if trade_date:
        trade_date_pipeline = Pipeline([], DailyPriceSummaries.date.key, lambda: trade_date)
    else:
        trade_date_pipeline = Pipeline("trade_date", DailyPriceSummaries.date.key, ts_date_to_sql)
    return transform(df, [
        Pipeline('ts_code', DailyPriceSummaries.exchange.key, lambda x: x.split('.')[-1]),
        Pipeline('ts_code', DailyPriceSummaries.code.key, lambda x: x.split('.')[0]),
        Pipeline('pre_close', DailyPriceSummaries.last_day_close.key),
        Pipeline('vol', DailyPriceSummaries.volume.key),
        Pipeline('amount', DailyPriceSummaries.turnover.key),
        trade_date_pipeline
    ], ['open', 'close', 'high', 'low'])


def ts_daily_to_exchange_table(df):
    return unique_of(transform(df, [
        Pipeline('ts_code', ExchangeMarkets.exchange.key, lambda x: x.split('.')[-1]),
    ]), Stocks.exchange.key)
