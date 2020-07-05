from pandas import DataFrame

from data_collection.pipeline import transform, Pipeline
from data_collection.transforms import ts_daily_to_daily_price_summaries_table
from data_collection.utils import pro_api, unique_of, ts_date_to_sql
from database.sql_tables import Industry, ExchangeMarkets, Areas, Stocks
from database.utils import insert_dataframe


def retrieve_history_daily_price(ts_code: str) -> DataFrame:
    df = pro_api().daily(ts_code=ts_code)
    daily_df = ts_daily_to_daily_price_summaries_table(df)
    return daily_df


def retrieve_company_info() -> DataFrame:
    df = pro_api().stock_basic()

    industry_df = unique_of(transform(df, [Pipeline('industry', Industry.industry.key)]), Industry.industry.key)
    insert_dataframe(industry_df, Industry)

    exchange_df = unique_of(transform(df, [
        Pipeline('ts_code', ExchangeMarkets.exchange.key, lambda x: x.split('.')[-1]),
    ]), ExchangeMarkets.exchange.key)
    insert_dataframe(exchange_df, ExchangeMarkets)

    areas_df = unique_of(transform(df, [Pipeline('area', Areas.area.key)]), Areas.area.key)
    insert_dataframe(areas_df, Areas)

    stocks_df = transform(df, [
        Pipeline('symbol', Stocks.code.key),
        Pipeline('name', Stocks.full_name.key),
        Pipeline('ts_code', Stocks.exchange.key, lambda x: x.split('.')[-1]),
        Pipeline('list_date', Stocks.list_date.key, ts_date_to_sql)
    ], preserve_list=['industry', 'area'])

    return stocks_df
