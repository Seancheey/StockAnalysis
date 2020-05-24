from data_collection.utils import pro_api, ts_date_to_sql
from data_collection.pipeline import Pipeline, transform
from database.sql_tables import Industrys, CNStocks, Areas, ExchangeMarkets
from database.utils import insert_dataframe, unique_of


def retrieve_company_info():
    df = pro_api().stock_basic()

    industry_df = unique_of(transform(df, [Pipeline('industry', Industrys.industry.key)]), Industrys.industry.key)
    insert_dataframe(industry_df, Industrys)

    _exchange_pipeline = Pipeline('ts_code', ExchangeMarkets.exchange.key, lambda x: x.split('.')[-1])
    exchange_df = unique_of(transform(df, [_exchange_pipeline]), ExchangeMarkets.exchange.key)
    insert_dataframe(exchange_df, ExchangeMarkets)

    areas_df = unique_of(transform(df, [Pipeline('area', Areas.area.key)]), Areas.area.key)
    insert_dataframe(areas_df, Areas)

    stocks_df = transform(df, [
        Pipeline('symbol', CNStocks.code.key),
        Pipeline('name', CNStocks.full_name.key),
        _exchange_pipeline,
        Pipeline('list_date', CNStocks.list_date.key, ts_date_to_sql)
    ], preserve_list=['industry', 'area'])
    insert_dataframe(stocks_df, CNStocks)


if __name__ == "__main__":
    retrieve_company_info()
