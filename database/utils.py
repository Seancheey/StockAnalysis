from pandas import DataFrame
from sqlalchemy import Table
from sqlalchemy import create_engine
from sqlalchemy.dialects.mysql import insert
from sqlalchemy.ext.declarative import declarative_base

from database.settings import __sql_url, schema

engine = create_engine(__sql_url + schema)
Base = declarative_base(bind=engine)


def table_of(table_base: Base) -> Table:
    return table_base.__table__


def insert_dataframe(df: DataFrame, table_base: Base, duplicate_update=True):
    with engine.connect() as connection:
        for i, row in df.iterrows():
            statement = insert(table_of(table_base)).values(row)
            if duplicate_update:
                connection.execute(statement.on_duplicate_key_update(row.to_dict()))
            else:
                connection.execute(statement.prefix_with("IGNORE"))

