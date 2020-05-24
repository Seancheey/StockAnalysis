import tushare
from pandas import DataFrame

from data_collection.settings import _tushare_key
from datetime import datetime


def pro_api():
    return tushare.pro_api(_tushare_key)


def ts_date_to_sql(ts_date: str) -> str:
    return datetime(int(ts_date[:4]), int(ts_date[4:6]), int(ts_date[6:8])).strftime('%Y-%m-%d')


def date_to_ts(date: datetime) -> str:
    """
    :param date: python date
    :return: tushare date format
    >>> date_to_ts(datetime(1920,4,20))
    '19200420'
    """
    return date.strftime('%Y%m%d')


def unique_of(df: DataFrame, col_name: str) -> DataFrame:
    return df.groupby(col_name).first().reset_index()