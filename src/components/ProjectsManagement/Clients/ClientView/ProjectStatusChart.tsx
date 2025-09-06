import { useTheme } from "@mui/material/styles";
import { Grid } from "@mui/material";
import Chart from "react-apexcharts";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { donutChart } from "./DonutChart";

function ProjectStatusChart() {
  const theme: any = useTheme();
  const [isLoading, setIsloading] = useState(false);
  const [search, setSearch] = useState({
    fromDate: dayjs().subtract(6, "months").format("YYYY-MM"),
    toDate: dayjs().format("YYYY-MM"),
  });
  const [data, setData] = useState<{
    labels: string[];
    series: { name: string; data: number[] }[];
  }>({ labels: [""], series: [{ name: "", data: [] }] });

  useEffect(() => {
    setIsloading(true);
    let formData = {
      fromMonth: search.fromDate,
      toMonth: search.toDate,
    };
    // DashboardService.getDashboardParentDeliveryNumberCount(formData).then(
    //   (response) => {
    //     if (response.isSuccess) {
    //       const { data } = response.data;
    //       const labels = data.map(({ month }: any) =>
    //         dayjs(month).format("MMM YYYY")
    //       );
    //       const messageCount = data.map(
    //         ({ delivered_message_count }: any) => delivered_message_count
    //       );
    //       const revenue = data.map(
    //         ({ revenue_with_tax }: any) => revenue_with_tax
    //       );

    //       setData({
    //         labels,
    //         series: [
    //           { name: "Delivered Message Count", data: messageCount },
    //           { name: "Revenue", data: revenue },
    //         ],
    //       });
    //       setIsloading(false);
    //     } else {
    //       setIsloading(false);
    //       setData({ labels: [], series: [] });
    //     }
    //   }
    // );
  }, [search]);

  return <Chart {...donutChart(theme.palette.mode, data)} />;
}

export default ProjectStatusChart;
