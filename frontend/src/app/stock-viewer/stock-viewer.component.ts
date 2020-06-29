import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Stock} from "../service/database-entity/Stock";
import {Observable, of} from "rxjs";
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
export class StockViewerComponent implements OnInit {
  readonly columns = ["date", "low", "open", "close", "high"]
  readonly chartType = ChartType.CandlestickChart;
  stocks: Observable<Stock[]>;
  selectedStock: Observable<Stock>;
  prices: Observable<StockDailySummary[] | null>;
  data: Observable<Row[]>;
  chartOptions: Object;
  @Output() selectedStockChange: EventEmitter<Stock | null> = new EventEmitter();

  constructor(private stockDatabaseService: StockDatabaseService) {
  }

  private static toGoogleChartData(summaries: StockDailySummary[]): Row[] {
    return summaries.map(summary => [summary.date, summary.low, summary.open, summary.close, summary.high]);
  }

  changeSelection(change: MatSelectChange) {
    this.selectedStockChange.emit(change.value)
  }

  ngOnInit(): void {
    this.stocks = this.stockDatabaseService.getStocks()
    this.prices = this.selectedStockChange.pipe(
      switchMap((stock) => {
        if (stock) {
          return this.stockDatabaseService.getStockDailyHistory(stock)
        } else {
          return of(null)
        }
      })
    )
    this.selectedStock = this.selectedStockChange.pipe(
      switchMap(stock => {
        return of(stock)
      })
    )
    this.data = this.prices.pipe(
      switchMap(prices => {
        this.chartOptions = this.getChartOption(prices)
        return of(StockViewerComponent.toGoogleChartData(prices));
      })
    )
  }

  getChartOption(summaries: StockDailySummary[]): Object {
    console.log("getChartOption");
    return {
      animation: {
        duration: 200,
        startup: true,
      },
      explorer: {
        axis: 'horizontal',
      },
      bar: {
        groupWidth: '100%',
      },
      candlestick: {
        fallingColor: {
          fill: "#00FF00",
          stroke: "#000000",
          strokeWidth: 0.5,
        },
        risingColor: {
          fill: "#FF0000",
          stroke: "#000000",
          strokeWidth: 0.5,
        },
      },
      hAxis: {
        format: "yy年MM月dd日",
        viewWindow: {
          min: summaries[summaries.length / 4].date,
          max: summaries[summaries.length * 3 / 4].date,
        }
      }
    };
  }
}
