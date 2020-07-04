import {StockChartComponent} from "./stock-chart.component";
import {ChartType, Row} from "angular-google-charts";
import {StockDailySummary} from "../service/database-entity/StockDailySummary";
import {Component} from "@angular/core";

@Component({
  selector: 'app-stock-chart-line',
  templateUrl: './stock-chart.component.html',
  styleUrls: ['./stock-chart.component.scss']
})
export class StockChartLineComponent extends StockChartComponent {
  chartOptions: Object;
  readonly chartType: ChartType = ChartType.LineChart;
  readonly columns: google.visualization.ColumnSpec[] = [
    {type: "date", label: "日期"},
    {type: "number", label: "低点"},
    {type: "number", label: "高点"}
  ];

  generateChartData(prices: StockDailySummary[]): Row[] {
    return prices.map(summary => [
      summary.date,
      summary.low,
      summary.high
    ]);
  }

  getChartOption(summaries: StockDailySummary[]): Object {
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
      }
    };
  }

}
