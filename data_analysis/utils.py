from pandas import DataFrame


def get_highest(df: DataFrame, col: str):
    """

    :param df:
    :param col:
    :return:
    >>> get_highest(DataFrame({"c":[10,5,6,7,3]}), "c")
    (10, 0)
    """
    return df[col].max(), df[col].idxmax()


def get_nth_high_after_highest(df: DataFrame, col: str, n: int = 1):
    """

    :param df:
    :param col:
    :param n:
    :return:
    >>> get_nth_high_after_highest(DataFrame({"c":[10,5,6,7,3]}), "c", 1)
    (7, 3)
    >>> get_nth_high_after_highest(DataFrame({"c":[10,5,6,7]}), "c", 1)
    (None, -1)
    >>> get_nth_high_after_highest(DataFrame({"c":[1,10,9,2,8,7]}), "c", 1)
    (8, 4)
    """
    if n == 1:
        _, max_i = get_highest(df, col)
    else:
        _, max_i = get_nth_high_after_highest(df, col, n - 1)
    max_convex_i = -1
    max_convex = None
    num_left = None
    num_mid = None
    for i, num_right in enumerate(df[col][max_i:], max_i):
        if num_mid and num_left and num_mid > num_left and num_mid > num_right and (not max_convex or num_mid > max_convex):
            max_convex = num_mid
            max_convex_i = i - 1
        num_left = num_mid
        num_mid = num_right
    return max_convex, max_convex_i
