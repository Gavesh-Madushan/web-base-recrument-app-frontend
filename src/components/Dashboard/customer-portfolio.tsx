import { useTheme } from "@mui/material/styles";
import MainCard from "../../utils/ui-components/MainCard";
import { Grid, Typography } from "@mui/material";
import { gridSpacing } from "../../store/constants";
import Chart from "react-apexcharts";
import { useEffect, useState } from "react";
import { DashboardService } from "../../assets/_services/dashboard-service";
import dayjs from "dayjs";
import {
  donutChart,
  lineChart,
} from "./chart-data/summery-bar-charts-vertical";

function CustomerPortfolioChart({ campaignType }: { campaignType: number }) {
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
      isBulk: campaignType - 1,
    };
    DashboardService.getDashboardParentDeliveryNumberCount(formData).then(
      (response) => {
        if (response.isSuccess) {
          const { data } = response.data;
          const labels = data.map(({ month }: any) =>
            dayjs(month).format("MMM YYYY")
          );
          const messageCount = data.map(
            ({ delivered_message_count }: any) => delivered_message_count
          );
          const revenue = data.map(
            ({ revenue_with_tax }: any) => revenue_with_tax
          );

          setData({
            labels,
            series: [
              { name: "Delivered Message Count", data: messageCount },
              { name: "Revenue", data: revenue },
            ],
          });
          setIsloading(false);
        } else {
          setIsloading(false);
          setData({ labels: [], series: [] });
        }
      }
    );
  }, [search, campaignType]);

  return (
    <MainCard>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          {/* <Chart {...chartData} /> */}
          <Chart {...donutChart(theme.palette.mode, data)} />
        </Grid>
      </Grid>
    </MainCard>
  );
}

export default CustomerPortfolioChart;
