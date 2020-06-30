import * as functions from 'firebase-functions';
import * as express from "express";

const app = express()

app.get("/get_stocks", (req, res) => {
    res.redirect("http://qi1.co:5000/get_stocks")
})

export const stock = functions.https.onRequest(app);

