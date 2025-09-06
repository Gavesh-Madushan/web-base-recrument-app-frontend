export function donutChart(theme: any, chartData: { labels: string[]; series: { name: string; data: number[] }[] }) {
  const data: any = {
    height: 300,
    type: "donut",
    series: [3, 12, 16],
    options: {
      chart: {}, // Data for the pie chart
      labels: ["Pending", "Ongoing", "Closed"],
      title: {
        text: "Projects Status",
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
      colors: ["#FFC107", "#4CAF50", "#B0B0B0"],
    },
  };

  return data;
}
