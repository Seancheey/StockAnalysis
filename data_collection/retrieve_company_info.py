from data_collection.utils import pro_api, ts_date_to_sql, unique_of
from data_collection.pipeline import Pipeline, transform
from database.sql_tables import Industry, Stocks, Areas, ExchangeMarkets
from database.utils import insert_dataframe


def retrieve_company_info():
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
    insert_dataframe(stocks_df, Stocks)


if __name__ == "__main__":
    retrieve_company_info()
