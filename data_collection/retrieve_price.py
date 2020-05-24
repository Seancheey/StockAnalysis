from data_collection.utils import pro_api

pro = pro_api()

data = pro.daily(ts_code="", trade_date="20200522")
