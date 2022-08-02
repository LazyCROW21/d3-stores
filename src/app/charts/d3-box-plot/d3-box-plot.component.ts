import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3-box-plot',
  templateUrl: './d3-box-plot.component.html',
  styleUrls: ['./d3-box-plot.component.css']
})
export class D3BoxPlotComponent implements OnInit, AfterViewInit {

  @ViewChild('chart')
  chartContainer!: ElementRef;

  @Input('title')
  chartTitle = 'My Box Plot';

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
    const height = width * 8 / 5;
    const margin = {
      L: 50, R: 50, T: 5, B: 50
    };

    const range = this.data.max - this.data.min;

    const dataPadding = Math.round(range/10);
    
    let chart = d3.select(chartContainer);
    let chartSVG = chart.append('svg').attr("width", width).attr("height", height);

    // let xScale = d3.scaleLinear()
    // .domain([this.data.min - dataPadding, this.data.max + dataPadding])
    // .range([margin.L, width - margin.R]);
    // let xAxis = d3.axisBottom(xScale);

    let yScale = d3.scaleLinear()
    .domain([this.data.min - Math.round(range/10), this.data.max + Math.round(range/10)])
    .range([height - margin.B, margin.T]);
    let yAxis = d3.axisLeft(yScale);

    // chartSVG.append('g').attr('transform', `translate(0, ${height - margin.B})`).call(xAxis);
    chartSVG.append('g').attr('transform', `translate(${margin.L}, 0)`).call(yAxis);

    const pxScale = (height - margin.B - margin.T) / (range + (2 * dataPadding));

    const dataStrArr = [
      'Max: ' + this.data.max,
      'Upr Q: ' + this.data.uq,
      'Med: ' + this.data.med,
      'Low Q: ' + this.data.lq,
      'Min: ' + this.data.min
    ]
    const dataStr = dataStrArr.join('<br>');

    // tooltip
    const tooltip = chart.append('div')
      .html(dataStr)
      .attr('class', 'chart-tooltip')
      .style('display', 'none')
      .style('left', ((width - 50) / 2) + 'px')
      .style('top', '0px');

    // Center Range Line
    chartSVG.append('svg').append('line')
    .attr('x1', width / 2)
    .attr('y1', pxScale * dataPadding + 5)
    .attr('x2', width / 2)
    .attr('y2', pxScale * (dataPadding + range) + 5)
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .on('mouseover', function(d){
      tooltip
      .transition()
      .duration(200)
      .style('display', 'inline');
    })
    .on('mouseleave', function(d){
      if(d.toElement.tagName === "div") {
        return;
      }
      tooltip
      .transition()
      .duration(200)
      .style('display', 'none');
    });

    // Maxima Line (whisker)
    chartSVG.append('svg').append('line')
    .attr('x1', width / 3)
    .attr('y1', pxScale * dataPadding + 5)
    .attr('x2', width * 2 / 3)
    .attr('y2', pxScale * dataPadding + 5)
    .attr('stroke', 'black')
    .attr('stroke-width', 2).on('mouseover', function(d){
      tooltip
      .transition()
      .duration(200)
      .style('display', 'inline');
    })
    .on('mouseleave', function(d){
      if(d.toElement.tagName === "div") {
        return;
      }
      tooltip
      .transition()
      .duration(200)
      .style('display', 'none');
    });

    // Minima Line (whisker)
    chartSVG.append('svg').append('line')
    .attr('x1', width / 3)
    .attr('y1', pxScale * (dataPadding + range) + 5)
    .attr('x2', width * 2 / 3)
    .attr('y2', pxScale * (dataPadding + range) + 5)
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .on('mouseover', function(d){
      tooltip
      .transition()
      .duration(200)
      .style('display', 'inline');
    })
    .on('mouseleave', function(d){
      if(d.toElement.tagName === "div") {
        return;
      }
      tooltip
      .transition()
      .duration(200)
      .style('display', 'none');
    });

    // Box
    chartSVG
    .append('rect')
    .attr('width', width / 3)
    .attr('height', pxScale * (this.data.uq - this.data.lq))
    .attr('x', width / 3)
    .attr('y', pxScale * (dataPadding + this.data.max - this.data.uq) + 5)
    .style('fill', 'skyblue')
    .style('stroke', 'black')
    .style('stroke-width', 2)
    .on('mouseover', function(d){
      tooltip
      .transition()
      .duration(200)
      .style('display', 'inline');
    })
    .on('mouseleave', function(d){
      if(d.toElement.tagName === "div") {
        return;
      }
      tooltip
      .transition()
      .duration(200)
      .style('display', 'none');
    });
    
    // Median Line
    chartSVG.append('svg').append('line')
    .attr('x1', width / 3)
    .attr('y1', pxScale * (dataPadding + this.data.max - this.data.med))
    .attr('x2', width * 2 / 3)
    .attr('y2', pxScale * (dataPadding + this.data.max - this.data.med))
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .on('mouseover', function(d){
      tooltip
      .transition()
      .duration(200)
      .style('display', 'inline');
    })
    .on('mouseleave', function(d){
      if(d.toElement.tagName === "div") {
        return;
      }
      tooltip
      .transition()
      .duration(200)
      .style('display', 'none');
    });
  }

  ngOnInit(): void { }

}
