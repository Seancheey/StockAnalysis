from data_collection.utils import pro_api, ts_date_to_sql
from data_collection.pipeline import Pipeline, transform
from database.sql_tables import Industrys, CNStocks, Areas, ExchangeMarkets
from database.utils import insert_dataframe, table_of, unique_of

_exchange_pipeline = Pipeline('ts_code', 'exchange', lambda x: x.split('.')[-1])


def retrieve_company_info():
    api = pro_api()

    df = api.stock_basic()

    industry_df = unique_of(transform(df, [Pipeline('industry', 'industry')]), 'industry')
    insert_dataframe(industry_df, table_of(Industrys))

    exchange_df = unique_of(transform(df, [_exchange_pipeline]), 'exchange')
    insert_dataframe(exchange_df, table_of(ExchangeMarkets))

    areas_df = unique_of(transform(df, [Pipeline('area', 'area')]), 'area')
    insert_dataframe(areas_df, table_of(Areas))

    stocks_df = transform(df, [
        Pipeline('symbol', 'code'),
        Pipeline('name', 'full_name'),
        _exchange_pipeline,
        Pipeline('list_date', 'list_date', ts_date_to_sql)
    ], preserve_list=['industry', 'area'])
    insert_dataframe(stocks_df, table_of(CNStocks))


if __name__ == "__main__":
    retrieve_company_info()
