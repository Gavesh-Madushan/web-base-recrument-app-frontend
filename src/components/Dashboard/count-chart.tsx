import { useTheme } from "@mui/material/styles";
import MainCard from "../../utils/ui-components/MainCard";
import {
  Button,
  CircularProgress,
  Grid,
  TablePagination,
  Typography,
} from "@mui/material";
import Chart from "react-apexcharts";
import React, { useEffect, useState } from "react";
import { DashboardService } from "../../assets/_services/dashboard-service";
import dayjs from "dayjs";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import DateTimePicker from "../../utils/ui-components/FormsUI/DatePicker";
import TextFieldWrapper from "../../utils/ui-components/FormsUI/TextField";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";

const INITIAL_FORM_STATE = {
  fromDate: dayjs().subtract(30, "day"),
  toDate: dayjs(),
  revenue: 1000,
};

const FORM_VALIDATION = Yup.object().shape({
  fromDate: Yup.date()
    .nullable()
    .required("Please Select a Date")
    .typeError("please enter a valid date"),
  toDate: Yup.date()
    .nullable()
    .required("Please Select a Date")
    .typeError("please enter a valid date"),
  revenue: Yup.number()
    .required("Please Select a Date")
    .typeError("please enter a valid date")
    .min(0, "Revenue is required"),
});

function DeliveryNumberCountChart({ campaignType }: { campaignType: number }) {
  const theme: any = useTheme();
  const [search, setSearch] = useState({
    fromDate: dayjs().subtract(6, "months").format("YYYY-MM"),
    toDate: dayjs().format("YYYY-MM"),
    revenue: 0,
  });
  const [isLoading, setIsloading] = useState(false);
  const [answerSummeryChartData, setAnswerSummeryBarChartData] = useState<{
    labels: string[];
    series: { name: string; data: number[] }[];
  }>({ labels: [""], series: [{ name: "", data: [] }] });
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    setIsloading(true);
    let formData = {
      fromMonth: search.fromDate,
      toMonth: search.toDate,
      revenue: search.revenue,
      isBulk: campaignType - 1,
    };
    DashboardService.getDashboardParentBaseRevenue(formData).then(
      (response) => {
        if (response.isSuccess) {
          const labels: any[] = [];
          const monthMap = new Map();

          const graphData = response.data.data.graphData;
          graphData.forEach((user: any) => {
            labels.push(user.userName);

            user.graphData.forEach((item: any) => {
              // Extract month and revenue
              const month = new Date(item.month).toLocaleString("en-US", {
                month: "short",
              });
              const revenue = Number(item.revenue_with_tax);

              // Initialize month entry if it doesn't exist
              if (!monthMap.has(month)) {
                monthMap.set(month, []);
              }

              // Push the revenue to the month array
              monthMap.get(month).push(revenue);
            });
          });

          // Construct the series array
          const series = Array.from(monthMap, ([month, data]) => ({
            name: ` ${month}`,
            data,
          }));

          setCount(response.data.data.userCount);
          setAnswerSummeryBarChartData({
            labels,
            series: series,
          });
          setIsloading(false);
        } else {
          setIsloading(false);
          setAnswerSummeryBarChartData({ labels: [], series: [] });
        }
      }
    );
  }, [search, page, rowsPerPage, campaignType]);

  return (
    <MainCard>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Grid container direction="column" spacing={1}>
                <Grid item>
                  <Typography variant="h3">User Revenue</Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle2">
                    Shows total revenue (including tax) for the selected date
                    range, providing an overview of monthly performance.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Formik
            initialValues={{
              ...INITIAL_FORM_STATE,
            }}
            validationSchema={FORM_VALIDATION}
            onSubmit={(values) => {
              setSearch({
                fromDate: values.fromDate.format("YYYY-MM"),
                toDate: values.toDate.format("YYYY-MM"),
                revenue: values.revenue,
              });
            }}
          >
            {({ values }) => (
              <Form>
                <Grid container columnSpacing={1}>
                  <Grid item xl={2} lg={3} md={3.5} sm={5} xs={9}>
                    <DateTimePicker
                      name="fromDate"
                      label="From Date"
                      placeholder="From Date"
                      views={["month", "year"]}
                      maxDate={values.toDate}
                    />
                  </Grid>
                  <Grid item xl={2} lg={3} md={3.5} sm={5} xs={9}>
                    <DateTimePicker
                      name="toDate"
                      label="To Date"
                      placeholder="To Date"
                      views={["month", "year"]}
                      // maxDate={dayjs()}
                      minDate={values.fromDate}
                    />
                  </Grid>
                  <Grid item xl={2} lg={3} md={3} sm={5} xs={9}>
                    <TextFieldWrapper
                      required
                      label="Revenue"
                      name="revenue"
                      type="number"
                    />
                  </Grid>
                  <Grid item lg={2} md={2} sm={2} xs={2}>
                    <Button
                      color="primary"
                      variant="contained"
                      type="submit"
                      sx={{ ...theme.typography.customInput }}
                      startIcon={isLoading && <CircularProgress size={25} />}
                    >
                      View
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <TablePagination
                      rowsPerPageOptions={[5]}
                      component="div"
                      count={count}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
        <Grid item xs={12}>
          <Chart
            // {...barChartVertical(theme.palette.mode, answerSummeryChartData)}
          />
        </Grid>
      </Grid>
    </MainCard>
  );
}

export default DeliveryNumberCountChart;
