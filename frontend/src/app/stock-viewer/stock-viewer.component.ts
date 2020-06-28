import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {Stock} from "../service/database-entity/Stock";
import {Observable, of, Subscription} from "rxjs";
import {StockDatabaseService} from "../service/stock-database.service";
import {MatSelectChange} from "@angular/material/select";
import {StockDailySummary} from "../service/database-entity/StockDailySummary";
import {switchMap} from "rxjs/operators";
import {ChartType, Row} from "angular-google-charts";

@Component({
  selector: 'app-stock-viewer',
  templateUrl: './stock-viewer.component.html',
  styleUrls: ['./stock-viewer.component.scss']
})
export class StockViewerComponent implements OnInit, OnDestroy {
  readonly columns = ["date", "low", "open", "close", "high"]
  readonly chartType = ChartType.CandlestickChart;

  stocks: Observable<Stock[]>;
  prices: Observable<StockDailySummary[] | null>;
  selectedStock: Stock;
  data: Row[];

  @Output() selectedStockChange: EventEmitter<Stock | null> = new EventEmitter();

  private priceSubscription: Subscription;

  constructor(private stockDatabaseService: StockDatabaseService) {
  }

  ngOnInit(): void {
    this.stocks = this.stockDatabaseService.getStocks()
    this.prices = this.selectedStockChange.pipe(
      switchMap((stock) => {
        if (stock) {
          this.selectedStock = stock
          console.log("select stock change:" + stock.full_name)
          return this.stockDatabaseService.getStockDailyHistory(stock)
        } else {
          return of(null)
        }
      })
    )
    this.priceSubscription = this.prices.subscribe(prices => {
      this.data = this.toGoogleChartData(prices);
    })
  }

  changeSelection(change: MatSelectChange) {
    this.selectedStockChange.emit(change.value)
  }

  toGoogleChartData(summaries: StockDailySummary[]): Row[] {
    console.log("toGoogleChartData")
    return summaries.map(summary => [summary.date, summary.low, summary.open, summary.close, summary.high]);
  }

  ngOnDestroy(): void {
    this.priceSubscription.unsubscribe();
  }
}
