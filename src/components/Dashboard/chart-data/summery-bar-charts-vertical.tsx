export function lineChart(
  theme: any,
  chartData: { labels: string[]; series: { name: string; data: number[] }[] }
) {
  const data: any = {
    type: "line",
    series: [
      {
        name: "Batch wise rewards",
        data: [78, 29, 43, 36, 52, 32, 33, 22, 62, 54, 31, 73],
      },
      {
        name: "Item wise rewards",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 77, 56, 67, 25],
      },
    ],
    options: {
      chart: {
        height: 400,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.5,
        },
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ["#77B6EA", "#545454"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        width: 2,
        curve: "smooth",
      },
      title: {
        text: "Rewards",
        align: "left",
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        title: {
          text: "Month",
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
  };

  return data;
}

export function donutChart(
  theme: any,
  chartData: { labels: string[]; series: { name: string; data: number[] }[] }
) {
  const data: any = {
    height: 300,
    type: "donut",
    series: [43, 8, 16, 33],
    options: {
      chart: {}, // Data for the pie chart
      labels: [
        "not-assigned",
        "painter",
        "corporate-procurement",
        "home-owner",
      ],
      title: {
        text: "Active Customer Portfolio",
        align: "left",
      },
      legend: {
        position: "bottom", // Place the legend at the bottom
        horizontalAlign: "center", // Center the legend items
        floating: false, // Ensure it does not overlap the chart
        itemMargin: {
          vertical: 5, // Add vertical spacing between legend items
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              fontSize: "12px", // Adjust font size for smaller screens
              position: "bottom", // Place the legend at the bottom
              horizontalAlign: "center", // Center-align the legend items
              itemMargin: {
                vertical: 5,
              },
            },
          },
        },
      ],
    },
  };

  return data;
}

export function horizontalBarChart(
  theme: any,
  chartData: { labels: string[]; series: { name: string; data: number[] }[] }
) {
  const data: any = {
    height: 300,
    type: "bar",
    series: [
      {
        data: [23400, 22000, 10000, 23400],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 300,
      },
      plotOptions: {
        bar: {
          barHeight: "100%",
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: "bottom",
          },
        },
      },
      colors: [
        "#33b2df",
        "#546E7A",
        "#d4526e",
        "#13d8aa",
        "#A5978B",
        "#2b908f",
        "#f9a3a4",
        "#90ee7e",
        "#f48024",
        "#69d2e7",
      ],
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          colors: ["#fff"],
        },
        formatter: function (val, opt) {
          return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
        },
        offsetX: 0,
        dropShadow: {
          enabled: true,
        },
      },
      stroke: {
        width: 5,
        colors: ["#fff"],
      },
      xaxis: {
        categories: ["Jan", "April", "Mov", "Dec"],
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      title: {
        text: "Seasonable Rewards by Month",
        align: "center",
        floating: true,
      },
      subtitle: {
        text: "Category Names as DataLabels inside bars",
        align: "center",
      },
      tooltip: {
        theme: "dark",
        x: {
          show: false,
        },
        y: {
          title: {
            formatter: function () {
              return "";
            },
          },
        },
      },
    },
  };

  return data;
}
