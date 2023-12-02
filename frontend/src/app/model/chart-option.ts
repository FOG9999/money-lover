import {
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart,
    ApexDataLabels,
    ApexTooltip,
    ApexFill,
    ApexLegend,
    ApexPlotOptions,
    ApexStroke,
    ApexXAxis,
    ApexYAxis,
    ApexAxisChartSeries,
    ApexNoData
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexNonAxisChartSeries | ApexAxisChartSeries;
    chart: ApexChart;
    responsive: ApexResponsive[];
    labels: any;
    colors: string[];
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    yaxis: ApexYAxis;
    xaxis: ApexXAxis;
    fill: ApexFill;
    tooltip: ApexTooltip;
    stroke: ApexStroke;
    legend: ApexLegend;
    noData: ApexNoData
};

export const NoDataChart = {
    text: "Không có dữ liệu",
    style: {
        fontSize: "16px"
    }
}