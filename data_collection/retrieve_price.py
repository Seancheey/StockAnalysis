from data_collection.utils import *
from data_collection.pipeline import Pipeline, transform
from database.utils import insert_dataframe
from datetime import datetime, timedelta
from database.sql_tables import ExchangeMarkets, Stocks, DailyPriceSummaries
import argparse


def retrieve_price(trade_date: datetime.date = None):
    if not trade_date:
        trade_date = datetime.now().date()
    # use api to get daily stock summaries
    df = pro_api().daily(trade_date=date_to_ts(trade_date))

    # make sure exchange dependency met
    exchange_df = unique_of(transform(df, [
        Pipeline('ts_code', Stocks.exchange.key, lambda x: x.split('.')[-1]),
    ]), Stocks.exchange.key)
    insert_dataframe(exchange_df, ExchangeMarkets)

    # make sure stock dependency met
    stocks_df = transform(df, [
        Pipeline('ts_code', Stocks.exchange.key, lambda x: x.split('.')[-1]),
        Pipeline('ts_code', Stocks.code.key, lambda x: x.split('.')[0]),
    ])
    insert_dataframe(stocks_df, Stocks, duplicate_update=False)

    # put daily stock data in
    daily_price_summary_df = transform(df, [
        Pipeline('ts_code', DailyPriceSummaries.exchange.key, lambda x: x.split('.')[-1]),
        Pipeline('ts_code', DailyPriceSummaries.code.key, lambda x: x.split('.')[0]),
        Pipeline('pre_close', DailyPriceSummaries.last_day_close.key),
        Pipeline('vol', DailyPriceSummaries.volume.key),
        Pipeline('amount', DailyPriceSummaries.turnover.key),
        Pipeline([], DailyPriceSummaries.date.key, lambda: trade_date)
    ], ['open', 'close', 'high', 'low'])
    insert_dataframe(daily_price_summary_df, DailyPriceSummaries)


def parse_arg():
    parser = argparse.ArgumentParser(description="Retrieve daily candle chart summary")
    parser.add_argument("--date_diff", type=int, help="trade date difference from today to get data from", default=0)
    return parser.parse_args()


if __name__ == '__main__':
    retrieve_price(datetime.now().date() - timedelta(days=parse_arg().date_diff))
