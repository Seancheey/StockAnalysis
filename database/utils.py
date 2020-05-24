from pandas import DataFrame
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Table
from database.settings import __sql_url, schema
from sqlalchemy.dialects.mysql import insert

engine = create_engine(__sql_url + schema)
Base = declarative_base(bind=engine)


def table_of(table_base: Base) -> Table:
    return table_base.__table__


def unique_of(df: DataFrame, col_name: str) -> DataFrame:
    return df.groupby(col_name).first().reset_index()


def insert_dataframe(df: DataFrame, table: Table):
    with engine.connect() as connection:
        for i, row in df.iterrows():
            statement = insert(table).values(row).on_duplicate_key_update(row.to_dict())
            connection.execute(statement)
