import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stock-selector',
  templateUrl: './stock-selector.component.html',
  styleUrls: ['./stock-selector.component.scss']
})
export class StockSelectorComponent implements OnInit {
  stocks: String[] = ["a", "b"];

  constructor() { }

  ngOnInit(): void {
  }

}
