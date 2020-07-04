import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Stock} from "../service/database-entity/Stock";
import {Observable, Subject} from "rxjs";
import {StockDatabaseService} from "../service/stock-database.service";
import {MatSelectChange} from "@angular/material/select";
import {StockDailySummary} from "../service/database-entity/StockDailySummary";
import {StockChartComponent} from "../stock-chart/stock-chart.component";
import {StockFunctionDrawer} from "../stock-function-drawers/stock-function-drawer";
import {HighToSecondHighDrawer} from "../stock-function-drawers/high-to-second-high-drawer";

@Component({
  selector: 'app-stock-viewer',
  templateUrl: './stock-viewer.component.html',
  styleUrls: ['./stock-viewer.component.scss']
})
export class StockViewerComponent implements OnInit {
  stocks$: Observable<Stock[]>;
  readonly stockDailyPrices$: Subject<StockDailySummary[]> = new Subject<StockDailySummary[]>();
  readonly highToSecondHighDrawer = new HighToSecondHighDrawer();
  readonly stockFunctionDrawers: StockFunctionDrawer[] = [this.highToSecondHighDrawer];

  @Input() selectedStock: Stock;
  @Output() selectedStockChange: EventEmitter<Stock | null> = new EventEmitter();

  constructor(private stockDatabaseService: StockDatabaseService) {
  }

  formatDate(date: Date) {
    return StockChartComponent.formatDate(date)
  }

  async updateStockChart(stock: Stock) {
    this.selectedStock = stock;
    const prices = await this.stockDatabaseService.getStockDailyHistory(stock).toPromise();
    this.stockDailyPrices$.next(prices);
  }

  changeSelectedStock(change: MatSelectChange) {
    this.selectedStockChange.emit(change.value)
  }

  ngOnInit(): void {
    this.stocks$ = this.stockDatabaseService.getStocks()
    this.selectedStockChange.subscribe(stock => this.updateStockChart(stock))
  }
}
