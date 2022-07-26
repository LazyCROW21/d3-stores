import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3-scatter-plot',
  templateUrl: './d3-scatter-plot.component.html',
  styleUrls: ['./d3-scatter-plot.component.css']
})
export class D3ScatterPlotComponent implements OnInit {
  @ViewChild('chart')
  chartContainer!: ElementRef;

  @Input('xField')
  xField = 'Area';

  @Input('yField')
  yField = 'Sales';

  @Input('data')
  data: {
    max: number;
    min: number;
    lq: number;
    uq: number;
    med: number;
  } = {
    max: 100,
    min: 10,
    med: 40,
    lq: 30,
    uq: 50
  };

  constructor() { }

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
      L: 50, R: 50, T: 5, B: 50
    };

    const range = this.data.max - this.data.min;

    const dataPadding = Math.round(range/10);
    
    let chart = d3.select(chartContainer);
    let chartSVG = chart.append('svg').attr("width", width).attr("height", height);

    let xScale = d3.scaleLinear()
    .domain([this.data.min - dataPadding, this.data.max + dataPadding])
    .range([margin.L, width - margin.R]);
    let xAxis = d3.axisBottom(xScale);

    let yScale = d3.scaleLinear()
    .domain([this.data.min - Math.round(range/10), this.data.max + Math.round(range/10)])
    .range([height - margin.B, margin.T]);
    let yAxis = d3.axisLeft(yScale);

    chartSVG.append('g').attr('transform', `translate(0, ${height - margin.B})`).call(xAxis);
    chartSVG.append('g').attr('transform', `translate(${margin.L}, 0)`).call(yAxis);

    const pxScale = (height - margin.B - margin.T) / (range + (2 * dataPadding));
    
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

    // add dots
    const dots = [
      { area: 50.5, sale: 50.5 },
      { area: 51, sale: 51 },
      { area: 20, sale: 20 },
      { area: 30, sale: 30 }
    ]

    chartSVG.append('g')
    .selectAll("dot")
    .data(dots)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return xScale(d.area); } )
      .attr("cy", function (d) { return yScale(d.sale); } )
      .attr("r", 2 * width / 300)
      .style("opacity", "0.75")
      .style("fill", "#69b3a2")
  }

  ngOnInit(): void { }

}
