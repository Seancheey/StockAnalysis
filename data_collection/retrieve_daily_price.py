from data_collection.transforms import ts_daily_to_stocks_transform, ts_daily_to_daily_price_summaries_table, \
    ts_daily_to_exchange_table
from data_collection.utils import *
from database.utils import insert_dataframe
from datetime import datetime, timedelta
from database.sql_tables import ExchangeMarkets, Stocks, DailyPriceSummaries
import argparse


def retrieve_daily_price_summaries(trade_date: datetime.date = None):
    if not trade_date:
        trade_date = datetime.now().date()
    # use api to get daily stock summaries
    df = pro_api().daily(trade_date=date_to_ts(trade_date))

    # make sure exchange dependency met
    exchange_df = ts_daily_to_exchange_table(df)
    insert_dataframe(exchange_df, ExchangeMarkets)

    # make sure stock dependency met
    stocks_df = ts_daily_to_stocks_transform(df)
    insert_dataframe(stocks_df, Stocks, duplicate_update=False)

    # put daily stock data in
    daily_price_summary_df = ts_daily_to_daily_price_summaries_table(df, trade_date)
    insert_dataframe(daily_price_summary_df, DailyPriceSummaries)


def parse_arg():
    parser = argparse.ArgumentParser(description="Retrieve daily candle chart summary")
    parser.add_argument("--date_diff", type=int, help="trade date difference from today to get data from", default=0)
    parser.add_argument("--all", help="get all trade data")
    return parser.parse_args()


def main():
    args = parse_arg()
    retrieve_daily_price_summaries(datetime.now().date() - timedelta(days=args.date_diff))


if __name__ == '__main__':
    main()
