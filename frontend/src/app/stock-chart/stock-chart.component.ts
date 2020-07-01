import {Component, Input, OnInit} from '@angular/core';
import {ChartType, Row} from "angular-google-charts";
import {StockDailySummary} from "../service/database-entity/StockDailySummary";
import {Observable} from "rxjs";

@Component({
  selector: 'app-stock-chart',
  templateUrl: './stock-chart.component.html',
  styleUrls: ['./stock-chart.component.scss']
})
export class StockChartComponent implements OnInit {
  readonly chartType = ChartType.CandlestickChart;
  readonly columns: google.visualization.ColumnSpec[] = [
    {type: "date", label: "日期"},
    {type: "number", label: "低点"},
    {type: "number", label: "开盘"},
    {type: "number", label: "收盘"},
    {type: "number", label: "高点"},
    {type: "string", role: "tooltip"}
  ];

  @Input() specialPoints: StockDailySummary[];
  @Input() title: string;
  @Input() stockDailyPrices$: Observable<StockDailySummary[]>;
  googleChartData: Row[];
  chartOptions: Object;

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

  private static generateChartData(prices: StockDailySummary[]): Row[] {
    return prices.map(summary => [
      summary.date,
      summary.low,
      summary.open,
      summary.close,
      summary.high,
      this.formatSummary(summary)
    ]);
  }

  private static formatSummary(summary: StockDailySummary) {
    const extra = "";
    return `${StockChartComponent.formatDate(summary.date)} ${extra}\n开盘:${summary.open} 收盘:${summary.close} 高点:${summary.high} 低点:${summary.low}`
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

  ngOnInit(): void {
    this.stockDailyPrices$.subscribe(prices => {
      this.googleChartData = StockChartComponent.generateChartData(prices)
      this.chartOptions = StockChartComponent.getChartOption(prices)
    })
  }
}
