import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Stock} from "../service/database-entity/Stock";
import {Observable} from "rxjs";
import {StockDatabaseService} from "../service/stock-database.service";
import {MatSelectChange} from "@angular/material/select";
import {StockDailySummary} from "../service/database-entity/StockDailySummary";
import {ChartType, Row} from "angular-google-charts";
import {StockPoint} from "../service/database-entity/StockPoint";

@Component({
  selector: 'app-stock-viewer',
  templateUrl: './stock-viewer.component.html',
  styleUrls: ['./stock-viewer.component.scss']
})
export class StockViewerComponent implements OnInit {
  readonly columns = ["date", "低点", "开盘", "收盘", "高点"];
  readonly chartType = ChartType.CandlestickChart;
  $stocks: Observable<Stock[]>;
  strategyPoints: StockPoint[];

  selectedStock: Stock;
  chartOptions: Object;
  stockDailyPrices: StockDailySummary[];
  googleChartData: Row[];
  report: string;

  @Output() selectedStockChange: EventEmitter<Stock | null> = new EventEmitter();

  constructor(private stockDatabaseService: StockDatabaseService) {
  }

  private static toGoogleChartData(summaries: StockDailySummary[]): Row[] {
    return summaries.map(summary => [summary.date, summary.low, summary.open, summary.close, summary.high]);
  }

  private static formatDate(date: Date) {
    return `${date.getFullYear()}年${date.getMonth()}月${date.getDay()}日`
  }

  private static getChartOption(summaries: StockDailySummary[]): Object {
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

  changeSelectedStock(change: MatSelectChange) {
    this.selectedStockChange.emit(change.value)
  }

  async updateStockChart(stock: Stock) {
    this.selectedStock = stock;
    this.stockDailyPrices = await this.stockDatabaseService.getStockDailyHistory(stock).toPromise()
    this.googleChartData = StockViewerComponent.toGoogleChartData(this.stockDailyPrices)
    this.chartOptions = StockViewerComponent.getChartOption(this.stockDailyPrices)
    this.strategyPoints = await this.stockDatabaseService.getStockStrategyPoint(stock).toPromise()
    this.report = `
      最高点：${this.strategyPoints[0].price}元
      第二高点：${this.strategyPoints[1].price}元
    `
  }

  ngOnInit(): void {
    this.$stocks = this.stockDatabaseService.getStocks()
    this.selectedStockChange.subscribe(stock => this.updateStockChart(stock))
  }
}
