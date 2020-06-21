import { Component, OnInit } from '@angular/core';
import {Stock} from "../service/database-entity/Stock";
import {StockDatabaseService} from "../service/stock-database.service";

@Component({
  selector: 'app-stock-selector',
  templateUrl: './stock-selector.component.html',
  styleUrls: ['./stock-selector.component.scss']
})
export class StockSelectorComponent implements OnInit {
  stocks: Stock[];

  constructor(private stockDatabaseService: StockDatabaseService) { }

  ngOnInit(): void {
    this.stockDatabaseService.getStocks().then(stocks => {
      this.stocks = stocks
    })
  }

}
