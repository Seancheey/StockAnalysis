import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate(
    "/Users/seancheey/Documents/workspace/Python/StockAnalysis/stock-analysis-e8593-5f916f932c8b.json")
firebase_admin.initialize_app(cred)

db = firestore.client()
