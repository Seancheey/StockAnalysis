from flask import Flask
from backend import query

app = Flask(__name__)


@app.route("/get_stocks")
def get_stocks():
    return query.get_stocks().SerializeToString()
