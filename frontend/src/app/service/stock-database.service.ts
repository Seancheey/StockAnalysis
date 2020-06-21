import { Injectable } from '@angular/core';
import {Stock} from "./database-entity/Stock";

@Injectable({
  providedIn: 'root'
})
export class StockDatabaseService {

  constructor() { }

  async getStocks(): Promise<Stock[]> {
    return [new Stock("SZ","000001", "测试制药")]
  }
}
