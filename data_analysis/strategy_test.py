from data_analysis.strategy import *
from data_analysis.utils import *
from database.sql_tables import DailyPriceSummaries
from datetime import date


class CustomLineStrategy(TransactionStrategy):

    def updateTransactionCall(self, context: StockContext, delta: Series, today) -> TransactionCall:
        h1, h1i = get_highest(context.stock_history, DailyPriceSummaries.high.key)
        h2, h2i = get_nth_high_after_highest(context.stock_history, DailyPriceSummaries.high.key, 1)
        date1 = context.stock_history[h1i][DailyPriceSummaries.date.key]
        date2 = context.stock_history[h2i][DailyPriceSummaries.date.key]
        trendline_slope = (h2 - h1) / (date2 - date1)
        return TransactionCall(h1 + trendline_slope * (today - h1i), context.user_data.money * 0.1)

