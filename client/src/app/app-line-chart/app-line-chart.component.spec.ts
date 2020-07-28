import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppLineChartComponent } from './app-line-chart.component';

describe('AppLineChartComponent', () => {
  let component: AppLineChartComponent;
  let fixture: ComponentFixture<AppLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
