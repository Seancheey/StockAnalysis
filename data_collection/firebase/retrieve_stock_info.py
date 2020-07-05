from data_collection.firebase import db
from data_collection.sources.tushare.dataframe_requester import retrieve_company_info
from database.firebase import STOCKS_COLLECTION
from database.sql_tables import Stocks


def main():
    company_info = retrieve_company_info()
    collection = db.collection(STOCKS_COLLECTION)
    for i, info in company_info.iterrows():
        values = info.to_dict()
        collection.document(info[Stocks.exchange.key] + info[Stocks.code.key]).set(values)


if __name__ == "__main__":
    main()
