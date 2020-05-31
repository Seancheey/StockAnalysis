from typing import List, Union, Callable
from pandas import DataFrame, Series


# Pipeline helper that maps 0-2 series to a new series
class Pipeline:
    __slots__ = ("from_series", "to_series", "map_func")

    def __init__(self, from_series: Union[str, List[str]], to_series: str, map_func: Callable = None):
        self.from_series = from_series if type(from_series) == list else [from_series]
        if len(self.from_series) > 2:
            raise ValueError("from series allows only up to two elements.")
        self.to_series = to_series
        self.map_func = map_func if map_func else lambda x: x

    def execute(self, from_df: DataFrame) -> Series:
        if len(self.from_series) == 1:
            return from_df[self.from_series[0]].map(self.map_func)
        elif len(self.from_series) == 0:
            return Series(data=[self.map_func()] * len(from_df), name=self.to_series)
        else:
            return from_df[self.from_series[0]].combine(from_df[self.from_series[1]], self.map_func)


# transforms a data frame using pipelines from one to another new data frame
def transform(df: DataFrame, pipelines: List[Pipeline], preserve_list: list = None) -> DataFrame:
    new_df = DataFrame()
    for pipeline in pipelines:
        new_df[pipeline.to_series] = pipeline.execute(df)
    if preserve_list:
        new_df[preserve_list] = df[preserve_list]
    return new_df
