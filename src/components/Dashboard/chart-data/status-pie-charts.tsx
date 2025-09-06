import { currencyFormat } from "../../../utils/utils";

export function pieChartData(theme: any, chartData: any) {

    const data: any = {
        width: 300,
        type: "donut",
        options: {
            theme: {
                mode: theme,
                palette: 'palette6'
            },
            chart: {
                id: 'type-pie-chart',
                sparkline: {enabled: true},
                background: 'transparent'
            },
            labels: chartData.labels,
            tooltip: {
                theme: true
            },
            dataLabels: {
                enabled: true,
                formatter: function (val: any) {
                    return currencyFormat(val,'',0) + "%"
                },
            },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                        }
                    }
                }
            },
            legend: {
                show: true, // Enable legend
                position: 'bottom', // Position the legend (top, bottom, left, right)
                labels: {
                    colors: theme === 'dark' ? '#fff' : '#000', // Set label color based on theme
                    useSeriesColors: true // Use the colors of the series
                }
            }
        },
        series: chartData.series
    };

    return data;

}