import { Component, Input, ViewChild, OnChanges, SimpleChanges } from "@angular/core";
import { formatNumber } from "@shared";
import { CONSTS } from "app/consts";
import { ChartOptions } from "app/model/chart-option";
import {
  ChartComponent,
} from "ng-apexcharts";

@Component({
  selector: "overall-in-outcome",
  templateUrl: "./overall-in-outcome.component.html",
  styleUrls: ["../report.component.scss"]
})
export class OverallInOutcomeComponent implements OnChanges {
  @ViewChild(ChartComponent) chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Chi tiêu",
          data: []
        },
        {
          name: "Thu nhập",
          data: []
        }
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: [
          ...CONSTS.months.filter((i, ind) => ind <= new Date().getMonth())
        ]
      },
      yaxis: {
        title: {
          text: "VND"
        },
        labels: {
          formatter: (val) => {
            return formatNumber(val.toString());
          }
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return formatNumber(val.toString());
          }
        }
      }
    };
  }

  @Input() data: {income: number[], outcome: number[]} = {income: [], outcome: []}

  ngOnChanges(changes: SimpleChanges){
    const {data} = changes;
    if(data && !data.firstChange){
      const newSeries = [
        {
          name: "Chi tiêu",
          data: []
        },
        {
          name: "Thu nhập",
          data: []
        }
      ]
      newSeries[0].data = data.currentValue.income;
      newSeries[1].data = data.currentValue.outcome;
      if(this.chart){
        this.chart.updateSeries(newSeries)
      }
    }
  }
}
