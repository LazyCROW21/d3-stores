import { Component, DoCheck, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { ChartService } from 'src/app/chart-service/chart.service';
import { Filter, StoreKey } from 'src/app/common/common.type';

@Component({
  selector: 'app-d3-scatter-plot',
  templateUrl: './d3-scatter-plot.component.html',
  styleUrls: ['./d3-scatter-plot.component.css']
})
export class D3ScatterPlotComponent implements OnInit, DoCheck, OnDestroy {
  @ViewChild('chart')
  chartContainer!: ElementRef;

  @Input('xField')
  xField: StoreKey = 'AREA';

  @Input('yField')
  yField: StoreKey = 'SALES';

  @Input('filter')
  filter: Filter = {
    AREA: {
      value: 1500,
      highValue: 2000,
      options: {}
    },
    AVAILABLE_ITEMS: {
      value: 0,
      highValue: 0,
      options: {}
    },
    DAILY_CUSTOMER_COUNT: {
      value: 0,
      highValue: 0,
      options: {}
    },
    SALES: {
      value: 60000,
      highValue: 110000,
      options: {}
    }
  };

  lastFilter: Filter = {
    AREA: {
      value: 1500,
      highValue: 2000,
      options: {}
    },
    AVAILABLE_ITEMS: {
      value: 0,
      highValue: 0,
      options: {}
    },
    DAILY_CUSTOMER_COUNT: {
      value: 0,
      highValue: 0,
      options: {}
    },
    SALES: {
      value: 60000,
      highValue: 110000,
      options: {}
    }
  };
  
  data: {
    x: number;
    y: number;
  }[] = [
    { x: 10, y: 10},
    { x: 20, y: 10},
    { x: 30, y: 15},
    { x: 40, y: 20}
  ];

  maxX: number = 100;
  minX: number = 0;
  maxY: number = 0;
  minY: number = 100;

  changeSmoother: any;

  constructor(private chartService: ChartService) {
    this.getData();
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    if(this.changeSmoother) {
      clearTimeout(this.changeSmoother);
    }
  }

  ngDoCheck(): void {
    if(!this.compareFilters()) {
      if(this.changeSmoother) {
        clearTimeout(this.changeSmoother);
      }
      // setTimeout alternative
      this.changeSmoother = setTimeout(() => {
        this.getData();
        if(this.chartContainer) {
          const chartContainer = this.chartContainer.nativeElement;
          chartContainer.innerHTML = '';
          this.render();
        }
        this.copyFilter();
      }, 250);
    }
  }

  getData() {
    this.data = this.chartService.getScatterData(this.xField, this.yField, this.filter);
    this.maxX = d3.max(d3.map(this.data, d => d.x)) ?? 100;
    this.minX = d3.min(d3.map(this.data, d => d.x)) ?? 0;
    this.maxY = d3.max(d3.map(this.data, d => d.y)) ?? 100;
    this.minY = d3.min(d3.map(this.data, d => d.y)) ?? 0;
  }

  ngAfterViewInit(): void {
    this.render();
    window.addEventListener('resize', () => {
      const chartContainer = this.chartContainer.nativeElement;
      chartContainer.innerHTML = '';
      this.render();
    })
  }

  render() {
    const chartContainer = this.chartContainer.nativeElement;
    const width = chartContainer.offsetWidth;
    const height = width * 5 / 8;
    const margin = {
      L: 70, R: 50, T: 5, B: 50
    };

    const rangeX = this.maxX - this.minX;
    const rangeY = this.maxY - this.minY;

    const dataPaddingX = Math.round(rangeX/10);
    const dataPaddingY = Math.round(rangeY/10);
    
    let chart = d3.select(chartContainer);
    let chartSVG = chart.append('svg').attr("width", width).attr("height", height);

    let xScale = d3.scaleLinear()
    .domain([this.minX - dataPaddingX, this.maxX + dataPaddingX])
    .range([margin.L, width - margin.R]);
    let xAxis = d3.axisBottom(xScale);

    let yScale = d3.scaleLinear()
    .domain([this.minY - dataPaddingY, this.maxY + dataPaddingY])
    .range([height - margin.B, margin.T]);
    let yAxis = d3.axisLeft(yScale);

    chartSVG.append('g').attr('transform', `translate(0, ${height - margin.B})`).call(xAxis);
    chartSVG.append('g').attr('transform', `translate(${margin.L}, 0)`).call(yAxis);

    // x-axis title
    chartSVG.append('text')
    .text(this.xField)
    .attr('x', (width - (this.xField.length * 12))/2)
    .attr('y', height - margin.T);
    // (height - (this.yField.length * 12))/2
    chartSVG.append('text')
    .text(this.yField)
    .attr('x', -(height - (this.yField.length * 12))/2)
    .attr('y', 15)
    .style('position', 'absolute')
    .style('transform', 'rotate(-90deg)');

    // tooltip
    const tooltip = chart.append('div')
      .attr('class', 'scatter-tooltip')
      .style('display', 'none');

    const xLabel = this.xField;
    const yLabel = this.yField;
    // add dots
    chartSVG.append('g')
    .selectAll("dot")
    .data(this.data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return xScale(d.x); } )
      .attr("cy", function (d) { return yScale(d.y); } )
      .attr("r", 2 * width / 300)
      .style("opacity", "0.75")
      .style("fill", "#69b3a2")
      .on('mouseover', function(d) {
        const dx = Math.round(xScale.invert(d.target.cx.animVal.value));
        const dy = Math.round(yScale.invert(d.target.cy.animVal.value));
        tooltip
        .html(`${xLabel}: ${dx}, ${yLabel}: ${dy}`)
        .transition()
        .duration(200)
        .style('top', d.clientY + 'px')
        .style('left', d.clientX + 'px')
        .style('display', 'inline');
      })
      .on('mouseleave', function(d) {
        tooltip
        .transition()
        .duration(200)
        .style('display', 'none');
      });
  }

  compareFilters(): boolean {
    const keys = ['AREA', 'AVAILABLE_ITEMS', 'DAILY_CUSTOMER_COUNT', 'SALES'];
    for (let j = 0; j < keys.length; j++) {
      if (this.filter[keys[j] as StoreKey].value !== this.lastFilter[keys[j] as StoreKey].value) {
        return false;
      }
      if (this.filter[keys[j] as StoreKey].highValue !== this.lastFilter[keys[j] as StoreKey].highValue) {
        return false;
      }
    }
    return true;
  }

  copyFilter() {
    const keys = ['AREA', 'AVAILABLE_ITEMS', 'DAILY_CUSTOMER_COUNT', 'SALES'];
    for (let j = 0; j < keys.length; j++) {
      this.lastFilter[keys[j] as StoreKey].value = this.filter[keys[j] as StoreKey].value;
      this.lastFilter[keys[j] as StoreKey].highValue = this.filter[keys[j] as StoreKey].highValue; 
    }
  }
}
