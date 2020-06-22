import {Component, Input, OnInit} from '@angular/core';
import {Stock} from "../service/database-entity/Stock";

@Component({
  selector: 'app-stock-viewer',
  templateUrl: './stock-viewer.component.html',
  styleUrls: ['./stock-viewer.component.scss']
})
export class StockViewerComponent implements OnInit {
  constructor() { }
  @Input() selectedStock: Stock | null

  ngOnInit(): void {
  }

}
