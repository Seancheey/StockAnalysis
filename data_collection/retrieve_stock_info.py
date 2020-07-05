from data_collection.sources.tushare.dataframe_requester import retrieve_company_info
from database.sql_tables import Stocks
from database.utils import insert_dataframe

if __name__ == "__main__":
    insert_dataframe(retrieve_company_info(), Stocks)
