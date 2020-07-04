import {Component} from "@angular/core";
import {StockChartComponent} from "./stock-chart.component";
import {ChartType, Row} from "angular-google-charts";
import {StockDailySummary} from "../service/database-entity/StockDailySummary";

@Component({
  selector: 'app-stock-chart-candlestick',
  templateUrl: './stock-chart.component.html',
  styleUrls: ['./stock-chart.component.scss']
})
export class StockChartCandlestickComponent extends StockChartComponent {
  readonly chartType: ChartType = ChartType.CandlestickChart;

  generateChartData(price: StockDailySummary): Row {
    return [
      price.date,
      price.low,
      price.open,
      price.close,
      price.high,
      this.formatSummary(price)
    ];
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
      },
      legend: 'none'
    };
  }

  getColumns(): google.visualization.ColumnSpec[] {
    return [
      {type: "date", label: "日期"},
      {type: "number", label: "低点"},
      {type: "number", label: "开盘"},
      {type: "number", label: "收盘"},
      {type: "number", label: "高点"},
      {type: "string", role: "tooltip"}
    ];
  }

}
