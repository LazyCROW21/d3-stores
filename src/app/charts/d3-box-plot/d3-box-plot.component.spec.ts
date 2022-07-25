import { ComponentFixture, TestBed } from '@angular/core/testing';

import { D3BoxPlotComponent } from './d3-box-plot.component';

describe('D3BoxPlotComponent', () => {
  let component: D3BoxPlotComponent;
  let fixture: ComponentFixture<D3BoxPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ D3BoxPlotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(D3BoxPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
