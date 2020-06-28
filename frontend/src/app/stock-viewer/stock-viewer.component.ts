import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Stock} from "../service/database-entity/Stock";
import {Observable} from "rxjs";
import {StockDatabaseService} from "../service/stock-database.service";
import {MatSelectChange} from "@angular/material/select";
import {StockDailySummary} from "../service/database-entity/StockDailySummary";
import {of} from "rxjs";
import {map, switchMap} from "rxjs/operators";
import {GoogleChartInterface} from "ng2-google-charts";

@Component({
  selector: 'app-stock-viewer',
  templateUrl: './stock-viewer.component.html',
  styleUrls: ['./stock-viewer.component.scss']
})
export class StockViewerComponent implements OnInit {
  chartType: string = "CandlestickChart";
  stocks: Observable<Stock[]>;
  selectedStock: Observable<Stock|null>;
  prices: Observable<StockDailySummary[]|null>;
  @Output() selectedStockChange: EventEmitter<Stock|null> = new EventEmitter();

  public getGoogleChart(): Observable<GoogleChartInterface> {
    return this.prices.pipe(
      map(prices => {
        return {
          chartType: this.chartType,
          dataTable: this.toGoogleChartData(prices),
          options: {
            title: "Stock Price",
            allowHtml: true,
            allowCollapse: true
          }
        };
      })
    )
  }

  constructor(private stockDatabaseService: StockDatabaseService) { }

  ngOnInit(): void {
    this.stocks = this.stockDatabaseService.getStocks()
    this.selectedStock = this.selectedStockChange.asObservable()
    this.prices = this.selectedStockChange.pipe(
      switchMap((stock) => {
        if (stock) {
          return this.stockDatabaseService.getStockDailyHistory(stock)
        } else {
          return of(null)
        }
      })
    )
  }

  changeSelection(change: MatSelectChange) {
    this.selectedStockChange.emit(change.value)
  }

  toGoogleChartData(summaries: StockDailySummary[]) {
    return summaries.map(summary => [summary.date, summary.low, summary.open, summary.close, summary.high])
  }
}
