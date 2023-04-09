import {
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart,
    ApexDataLabels,
    ApexTooltip
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexNonAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    colors: string[];
    dataLabels: ApexDataLabels;
    tooltip: ApexTooltip
};