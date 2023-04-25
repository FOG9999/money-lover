import { Component, ViewChild } from "@angular/core";
import { ChartOptions } from "app/model/chart-option";
import {
  ChartComponent,
} from "ng-apexcharts";

@Component({
  selector: "overall-in-outcome",
  templateUrl: "./overall-in-outcome.component.html",
  styleUrls: ["../report.component.scss"]
})
export class OverallInOutcomeComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Chi tiêu",
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
        },
        {
          name: "Thu nhập",
          data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
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
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct"
        ]
      },
      yaxis: {
        title: {
          text: "$ (thousands)"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return "$ " + val + " thousands";
          }
        }
      }
    };
  }
}
