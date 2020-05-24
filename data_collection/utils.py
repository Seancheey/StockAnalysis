import tushare
from data_collection.settings import _tushare_key
from datetime import datetime


def pro_api():
    return tushare.pro_api(_tushare_key)


def ts_date_to_sql(ts_date: str) -> str:
    return datetime(int(ts_date[:4]), int(ts_date[4:6]), int(ts_date[6:8])).strftime('%Y-%m-%d')
