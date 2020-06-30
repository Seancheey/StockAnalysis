from functools import wraps

from flask import Flask, request, current_app
from google.protobuf.json_format import MessageToJson
from proto.Stock_pb2 import Stock
from backend import query

app = Flask(__name__)


def support_jsonp(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        callback = request.args.get('callback', False)
        if callback:
            content = "{callback}({func})".format(callback=callback, func=f(*args, **kwargs))
            return current_app.response_class(content, mimetype='application/json')
        else:
            return f(*args, **kwargs)

    return decorated_function


@app.route("/get_stocks")
@support_jsonp
def get_stocks():
    return MessageToJson(query.get_stocks())


@app.route("/get_stock_hist")
@support_jsonp
def get_stock_hist():
    code = request.args.get('code')
    exchange = request.args.get('exchange')
    if code and exchange:
        return MessageToJson(query.get_stock_daily_history(exchange, code))
    else:
        return "", 405


@app.route("/get_stock_custom_strategy")
@support_jsonp
def get_stock_custom_strategy():
    code = request.args.get('code')
    exchange = request.args.get('exchange')
    if code and exchange:
        return MessageToJson(query.get_stock_high_2nd_high_cross_point(exchange, code))
    else:
        return "", 405
