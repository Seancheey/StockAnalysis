import {Injectable} from '@angular/core';
import "protobufjs";
import {HttpClient} from "@angular/common/http";
import {Stock} from "./database-entity/Stock";
import {Observable, of} from "rxjs";
import {switchMap} from "rxjs/operators";
import {StockDailySummary} from "./database-entity/StockDailySummary";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class StockDatabaseService {

  constructor(private httpClient: HttpClient) {
  }

  getStocks(): Observable<Stock[]> {
    return this.httpClient.jsonp(`${environment.server_url}/get_stocks`, "callback").pipe(
      switchMap(obj => {
        const stocks: Stock[] = []
        for (let stock of obj["stocks"]) {
          stocks.push(new Stock(stock.code, stock.exchange, stock.fullName))
        }
        return of(stocks)
      })
    )
  }

  getStockDailyHistory(stock: Stock): Observable<StockDailySummary[]> {
    return this.httpClient.jsonp(`${environment.server_url}/get_stock_hist?exchange=${stock.exchange}&code=${stock.code}`, "callback").pipe(
      switchMap(obj => {
        const summaries: StockDailySummary[] = []
        for (let summary of obj["dailySummary"]) {
          summaries.push(new StockDailySummary(
            new Date(summary["date"] * 1000),
            summary["open"],
            summary["close"],
            summary["high"],
            summary["low"],
            summary["volume"],
            summary["turnover"],
          ))
        }
        return of(summaries)
      })
    )
  }
}
