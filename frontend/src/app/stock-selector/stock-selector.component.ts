import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Stock} from "../service/database-entity/Stock";
import {StockDatabaseService} from "../service/stock-database.service";
import {Observable} from "rxjs";
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'app-stock-selector',
  templateUrl: './stock-selector.component.html',
  styleUrls: ['./stock-selector.component.scss']
})
export class StockSelectorComponent implements OnInit {
  stocks: Observable<Stock[]>;
  @Output() selectedStock: EventEmitter<Stock|null> = new EventEmitter();

  constructor(private stockDatabaseService: StockDatabaseService) { }

  ngOnInit(): void {
    this.stocks = this.stockDatabaseService.getStocks()
  }

  changeSelection(change: MatSelectChange) {
    this.selectedStock.emit(change.value)
  }
}
