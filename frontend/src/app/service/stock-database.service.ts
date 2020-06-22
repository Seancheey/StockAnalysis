import {Injectable} from '@angular/core';
import "protobufjs";
import {HttpClient} from "@angular/common/http";
import {Stock} from "./database-entity/Stock";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class StockDatabaseService {

  constructor(private httpClient: HttpClient) {
  }

  getStocks(): Observable<Stock[]> {
    return this.httpClient.jsonp("http://127.0.0.1:5000/get_stocks", "callback").pipe(
      map(obj => {
        const stocks: Stock[] = []
        for (let stock of obj["stocks"]) {
          stocks.push(new Stock(stock.code, stock.exchange, stock.fullName))
        }
        return stocks
      })
    )
  }
}
