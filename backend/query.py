from database.utils import engine
from sqlalchemy.sql import select
from database.sql_tables import Stocks
from proto.out import stock_pb2


def get_stocks() -> stock_pb2.StocksResponse:
    result = engine.execute(select([Stocks.__table__]))
    response = stock_pb2.StocksResponse()
    for col in result:
        response.stocks.append(stock_pb2.Stock(code=col[0], exchange=col[1], full_name=col[2]))
    return response


if __name__ == "__main__":
    print(get_stocks())
