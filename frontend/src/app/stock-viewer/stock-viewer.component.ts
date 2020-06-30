import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Stock} from "../service/database-entity/Stock";
import {Observable} from "rxjs";
import {StockDatabaseService} from "../service/stock-database.service";
import {MatSelectChange} from "@angular/material/select";
import {StockDailySummary} from "../service/database-entity/StockDailySummary";
import {ChartType, Row} from "angular-google-charts";

@Component({
  selector: 'app-stock-viewer',
  templateUrl: './stock-viewer.component.html',
  styleUrls: ['./stock-viewer.component.scss']
})
export class StockViewerComponent implements OnInit {
  readonly columns: google.visualization.ColumnSpec[] = [
    {type: "date", label: "日期"},
    {type: "number", label: "低点"},
    {type: "number", label: "开盘"},
    {type: "number", label: "收盘"},
    {type: "number", label: "高点"},
    {type: "string", role: "tooltip"}
  ];
  readonly chartType = ChartType.CandlestickChart;
  $stocks: Observable<Stock[]>;

  selectedStock: Stock;
  chartOptions: Object;
  stockDailyPrices: StockDailySummary[];
  googleChartData: Row[];
  highestPoint: StockDailySummary;
  secondHighestPoint: StockDailySummary;
  report: string;

  @Output() selectedStockChange: EventEmitter<Stock | null> = new EventEmitter();

  constructor(private stockDatabaseService: StockDatabaseService) {
  }

  private static getHighAndSecondHigh(summaries: StockDailySummary[]): [StockDailySummary, StockDailySummary] {
    const highestPoint = summaries.reduce((a, b) => a.high > b.high ? a : b)
    let sortedRestData = summaries
      .filter(val => val.date > highestPoint.date)
      .sort((a, b) => a.date.getTime() - b.date.getTime())

    for (let i = 1; i < sortedRestData.length - 1; i = i + 1) {
      if (sortedRestData[i].high < sortedRestData[i - 1].high && sortedRestData[i].high < sortedRestData[i + 1].high) {
        sortedRestData = sortedRestData.splice(i - sortedRestData.length)
      }
    }
    const secondHighestPoint = sortedRestData.reduce((a, b) => a.high > b.high ? a : b)
    return [highestPoint, secondHighestPoint]
  }

  private static formatDate(date: Date) {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDay()}日`
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
      },
      tooltip: {
        isHtml: true,
      },
      legend: 'none'
    };
  }

  formatDate(date: Date) {
    return StockViewerComponent.formatDate(date)
  }

  async updateStockChart(stock: Stock) {
    this.selectedStock = stock;
    this.stockDailyPrices = await this.stockDatabaseService.getStockDailyHistory(stock).toPromise()
    const list = StockViewerComponent.getHighAndSecondHigh(this.stockDailyPrices)
    this.highestPoint = list[0]
    this.secondHighestPoint = list[1]
    this.googleChartData = this.generateChartData()
    this.chartOptions = StockViewerComponent.getChartOption(this.stockDailyPrices)
  }

  private generateChartData(): Row[] {
    return this.stockDailyPrices.map(summary => [
      summary.date,
      summary.low,
      summary.open,
      summary.close,
      summary.high,
      this.formatSummary(summary)
    ]);
  }

  changeSelectedStock(change: MatSelectChange) {
    this.selectedStockChange.emit(change.value)
  }

  private formatSummary(summary: StockDailySummary) {
    const extra = summary.date == this.highestPoint.date ? "最高点" : (summary.date == this.secondHighestPoint.date) ? "第二高点" : "";
    return `${StockViewerComponent.formatDate(summary.date)} ${extra}\n开盘:${summary.open} 收盘:${summary.close} 高点:${summary.high} 低点:${summary.low}`
  }

  ngOnInit(): void {
    this.$stocks = this.stockDatabaseService.getStocks()
    this.selectedStockChange.subscribe(stock => this.updateStockChart(stock))
  }
}
