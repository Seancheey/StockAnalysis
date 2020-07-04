import {Input, OnInit} from '@angular/core';
import {ChartType, Row} from "angular-google-charts";
import {StockDailySummary} from "../service/database-entity/StockDailySummary";
import {Observable} from "rxjs";
import {StockFunctionDrawer} from "../stock-function-drawers/stock-function-drawer";

export abstract class StockChartComponent implements OnInit {
  columns: google.visualization.ColumnSpec[] = [];
  chartOptions: Object;
  googleChartData: Row[];
  @Input() title: string = "";
  @Input() stockDailyPrices$: Observable<StockDailySummary[]>;
  @Input() stockFunctionDrawers: StockFunctionDrawer[];

  readonly abstract chartType: ChartType = ChartType.LineChart;

  abstract generateChartData(price: StockDailySummary): Row;

  abstract getChartOption(summaries: StockDailySummary[]): Object;

  abstract getColumns(): google.visualization.ColumnSpec[];

  ngOnInit(): void {
    this.stockDailyPrices$.subscribe(prices => {
      this.stockFunctionDrawers.forEach(drawer => {
        drawer.load(prices)
      })
      this.googleChartData = prices.map(price => {
        return this.generateChartData(price).concat(
          this.stockFunctionDrawers.map(drawer => drawer.draw(price.date))
        )
      })
      this.chartOptions = this.getChartOption(prices)
    })
    this.columns = this.getColumns().concat(this.stockFunctionDrawers.map(drawer => {
        return {type: "number", label: drawer.functionName}
      }
    ))
  }

  static formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }


  protected formatSummary(summary: StockDailySummary) {
    return `${StockChartComponent.formatDate(summary.date)}\n开盘:${summary.open} 收盘:${summary.close} 高点:${summary.high} 低点:${summary.low}`
  }
}
