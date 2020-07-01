from functools import wraps

from flask import Flask, request, current_app, jsonify, make_response, Response
from flask_cors import CORS, cross_origin
from google.protobuf.json_format import MessageToJson

from backend import query

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


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
@cross_origin()
def get_stocks():
    return MessageToJson(query.get_stocks())


@app.route("/get_stock_hist")
@cross_origin()
def get_stock_hist():
    code = request.args.get('code')
    exchange = request.args.get('exchange')
    if code and exchange:
        return MessageToJson(query.get_stock_daily_history(exchange, code))
    else:
        return "", 405


@app.route("/get_stock_custom_strategy")
@cross_origin()
def get_stock_custom_strategy():
    code = request.args.get('code')
    exchange = request.args.get('exchange')
    if code and exchange:
        return MessageToJson(query.get_stock_high_2nd_high_cross_point(exchange, code))
    else:
        return "", 405
