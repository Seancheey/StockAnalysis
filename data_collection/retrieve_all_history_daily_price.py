import sched

from sqlalchemy import select

from data_collection.sources.tushare.dataframe_requester import retrieve_history_daily_price
from database.sql_tables import Stocks, DailyPriceSummaries
from database.utils import table_of, engine, insert_dataframe


def retrieve_all_history_daily_price(max_req_per_min=499):
    scheduler = sched.scheduler()
    delay = 1 / (max_req_per_min / 60)

    def insert_df(ts_code: str):
        daily_df = retrieve_history_daily_price(ts_code)
        insert_dataframe(daily_df, DailyPriceSummaries)

    with engine.connect() as connection:
        stocks = connection.execute(select([table_of(Stocks)]))
        for i, row in enumerate(stocks):
            scheduler.enter(delay * i, 1, insert_df,
                            argument=("%s.%s" % (row[Stocks.code.key], row[Stocks.exchange.key]),))
    scheduler.run()


if __name__ == "__main__":
    retrieve_all_history_daily_price()
