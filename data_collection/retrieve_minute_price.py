import json
from datetime import time
from urllib.parse import urlencode
from urllib.request import urlopen

from pandas import DataFrame

from data_collection.pipeline import transform, Pipeline
from database.sql_tables import IntervalPriceSummary
from database.utils import insert_dataframe


def retrieve_interval_price_summaries(market: str, code: str, interval_minute: int, data_num: int = 1023):
    params = {
        "symbol": market + str(code),
        "scale": interval_minute,
        "datalen": data_num,
        "ma": "no",
    }
    url = "http://money.finance.sina.com.cn/quotes_service/api/json_v2.php/CN_MarketData.getKLineData"
    with urlopen("%s?%s" % (url, urlencode(params))) as response:
        page = response.read()
        result = json.loads(page)
        df = DataFrame(result)
        price_df = transform(df, [
            Pipeline([], IntervalPriceSummary.code.key, lambda: code),
            Pipeline([], IntervalPriceSummary.exchange.key, lambda: market),
            Pipeline("day", IntervalPriceSummary.time.key,
                     lambda day_str: day_str.replace(" ", "T")),
            Pipeline([], IntervalPriceSummary.interval_len.key, lambda: time(minute=interval_minute)),
        ], ["open", "close", "high", "low", "volume"])
        insert_dataframe(price_df, IntervalPriceSummary)

