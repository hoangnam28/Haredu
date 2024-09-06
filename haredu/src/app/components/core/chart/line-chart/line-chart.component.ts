import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent implements OnInit {
  options: EChartsOption = {
    color: ['#7367f0', '#000000'],
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['Revenue'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['00AM', '01AM', '02AM', '03AM', '04AM', '05AM', '06AM', '07AM', '08AM', '09AM', '10AM', '11AM', '12AM'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Revenue',
        type: 'line',
        stack: 'Total',
        data: [120, 132, 101, 134, 90, 230, 210, 899, 620, 920, 444, 321, 500],
      },
    ],
  };

  constructor() {}
  ngOnInit(): void {}
}
