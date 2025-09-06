const chartData: any =
    {
        height: 350,
        type: "line",
        options: {
            chart: {
                id: 'line-chart',
                height: 350,
                type: 'line',
                toolbar: {
                    show: true
                },
                zoom: {
                    enabled: false
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                width: [2, 2, 2, 2],
                curve: 'smooth',
            },
            title: {
                text: '',
                align: 'left'
            },
            legend:{
                show:true,
                position: 'bottom'
            },
            markers: {
                size: 0,
                hover: {
                    sizeOffset: 6
                }
            },
            xaxis: {
                type: 'datetime',
                color:'red'
            },
            tooltip: {
                y: [
                    // {
                    //     title: {
                    //         formatter: function (val: any) {
                    //             return val
                    //         }
                    //     }
                    // },
                    // {
                    //     title: {
                    //         formatter: function (val: any) {
                    //             return val + " per session"
                    //         }
                    //     }
                    // },
                    // {
                    //     title: {
                    //         formatter: function (val: any) {
                    //             return val;
                    //         }
                    //     }
                    // }
                ]
            },
            grid: {
                borderColor: '#f1f1f1',
            },
            // labels: ["totalImpression"],
        },
        series: [],
    };

export default chartData;