import {Input, OnInit} from '@angular/core';
import {ChartType, Row} from "angular-google-charts";
import {StockDailySummary} from "../service/database-entity/StockDailySummary";
import {Observable} from "rxjs";

export abstract class StockChartComponent implements OnInit {
  readonly abstract columns: google.visualization.ColumnSpec[] = [];
  readonly abstract chartType: ChartType = ChartType.LineChart;
  abstract chartOptions: Object;

  @Input() title: string = "";
  @Input() stockDailyPrices$: Observable<StockDailySummary[]>;
  @Input() lineFunctions: Record<string, ((StockDailySummary) => Row)> = {};
  googleChartData: Row[];

  abstract generateChartData(prices: StockDailySummary[]): Row[];

  abstract getChartOption(summaries: StockDailySummary[]): Object;

  ngOnInit(): void {
    this.stockDailyPrices$.subscribe(prices => {
      this.googleChartData = this.generateChartData(prices)
      this.chartOptions = this.getChartOption(prices)
    })
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
