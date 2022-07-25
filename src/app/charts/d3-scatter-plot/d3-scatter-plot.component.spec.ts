import { ComponentFixture, TestBed } from '@angular/core/testing';

import { D3ScatterPlotComponent } from './d3-scatter-plot.component';

describe('D3ScatterPlotComponent', () => {
  let component: D3ScatterPlotComponent;
  let fixture: ComponentFixture<D3ScatterPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ D3ScatterPlotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(D3ScatterPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
