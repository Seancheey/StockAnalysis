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
    return this.httpClient.get(`${environment.server_url}/get_stocks`).pipe(
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
    return this.httpClient.get(`${environment.server_url}/get_stock_hist?exchange=${stock.exchange}&code=${stock.code}`).pipe(
      switchMap(obj =>
        of(obj["dailySummary"]
            .map(summary =>
              new StockDailySummary(
                new Date(summary["date"] * 1000),
                summary["open"],
                summary["close"],
                summary["high"],
                summary["low"],
                summary["volume"],
                summary["turnover"],
              ))
          // .sort((a, b) =>
          //   a.date.getTime() - b.data.getTime()
          // )
        )
      )
    )
  }

  // getStockStrategyPoint(stock: Stock): Observable<StockPoint[]> {
  //   return this.httpClient.jsonp(`${environment.server_url}/get_stock_custom_strategy?exchange=${stock.exchange}&code=${stock.code}`, "callback").pipe(
  //     switchMap(obj => {
  //       return of(obj["stockPoints"].map(sub => new StockPoint(sub["stockIndex"], sub["stockPrice"])));
  //     })
  //   );
  // }
}
