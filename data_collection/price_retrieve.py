import tushare as ts

pro = ts.pro_api('f46da086266fc3c43fe6d7acdb4da906dfa99f7216c2b557258485f1')
data = pro.daily(ts_code="", trade_date="20200522")
print(data)
