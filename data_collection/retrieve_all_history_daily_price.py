from data_collection.utils import *
from database.utils import table_of, engine, insert_dataframe
from database.sql_tables import Stocks, DailyPriceSummaries
from data_collection.transforms import ts_daily_to_daily_price_summaries_table
from sqlalchemy import select
import sched


def retrieve_all_history_daily_price(max_req_per_min=499):
    scheduler = sched.scheduler()
    delay = 1 / (max_req_per_min / 60)
    with engine.connect() as connection:
        stocks = connection.execute(select([table_of(Stocks)]))
        for i, row in enumerate(stocks):
            scheduler.enter(delay * i, 1, retrieve_history_daily_price,
                            argument=("%s.%s" % (row[Stocks.code.key], row[Stocks.exchange.key]),))
    scheduler.run()


def retrieve_history_daily_price(ts_code: str):
    df = pro_api().daily(ts_code=ts_code)
    daily_df = ts_daily_to_daily_price_summaries_table(df)
    insert_dataframe(daily_df, DailyPriceSummaries)


if __name__ == "__main__":
    retrieve_all_history_daily_price()
