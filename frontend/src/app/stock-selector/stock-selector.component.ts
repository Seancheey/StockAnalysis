import { Component, OnInit } from '@angular/core';
import {Stock} from "../service/database-entity/Stock";
import {StockDatabaseService} from "../service/stock-database.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-stock-selector',
  templateUrl: './stock-selector.component.html',
  styleUrls: ['./stock-selector.component.scss']
})
export class StockSelectorComponent implements OnInit {
  stocks: Observable<Stock[]>;

  constructor(private stockDatabaseService: StockDatabaseService) { }

  ngOnInit(): void {
    this.stocks = this.stockDatabaseService.getStocks()
  }

}
