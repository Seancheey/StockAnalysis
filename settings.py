from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
import logging

__sql_url = "mysql+pymysql://root@localhost:3306/"

# choose between production schema and test schema
schema = "stock_analysis"

# engine for sql connection
engine = create_engine(__sql_url + schema)

Base = declarative_base(bind=engine)