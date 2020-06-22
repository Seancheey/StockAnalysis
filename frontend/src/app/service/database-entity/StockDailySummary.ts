export class StockDailySummary {
  constructor(
    public date: Date,
    public open: number,
    public close: number,
    public high: number,
    public low: number,
    public volume: number,
    public turnover: number,
  ) {}
}
