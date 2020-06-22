import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockViewerComponent } from './stock-viewer.component';

describe('StockViewerComponent', () => {
  let component: StockViewerComponent;
  let fixture: ComponentFixture<StockViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
