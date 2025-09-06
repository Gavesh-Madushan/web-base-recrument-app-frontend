import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import dayjs from "dayjs";

// mui
import {
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";

// custom component
import MainCard from "../../utils/ui-components/MainCard";
import EmptyResult from "../../utils/ui-components/EmptyResult";
import Spinner from "../../utils/ui-components/Spinner";

// mui icon
// import { StaffService } from "../../assets/_services/staff-service";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { applyGlobalValidations, convertToRupees, currencyFormat } from "../../utils/utils";
import { useQuery } from "@tanstack/react-query";
import { listSalaryRecords } from "../../assets/api";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import DatePickerWrapper from "../../utils/ui-components/FormsUI/DatePicker";
import { gridSpacing } from "../../store/constants";
import { useSelector } from "react-redux";
import { getState } from "../../redux/actions/actions";
import PageHeaders from "../../utils/ui-components/PageHeaders";
import { isBrowser, isTablet, isMobile } from "react-device-detect";
import EventIcon from "@mui/icons-material/Event";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

function EmployeeProfilePayroll({ userId }: { userId?: number }) {
  const theme: any = useTheme();
  const authState = useSelector((state: any) => state.auth.authData);
  const user = getState(authState);
  const [initialMonth, setInitialMonth] = useState(dayjs());
  const [isOpen, setIsOpen] = useState<number>(0);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const listItems = useQuery({
    queryKey: [
      "listSalaryRecords",
      rowsPerPage,
      page,
      userId,
      initialMonth.startOf("month").toISOString(),
      initialMonth.endOf("month").toISOString(),
    ],
    queryFn: () =>
      listSalaryRecords({
        pageSize: rowsPerPage,
        page: page,
        userId: userId ? userId : ("@me" as const),
        year: initialMonth.year(),
      }),
    enabled: true,
    select: (res) => {
      return {
        ...res.data,
        data: res.data.data.map((item) => ({
          ...item,
          salaryBasic: convertToRupees(item.salaryBasic),
          salaryBudgeted: convertToRupees(item.salaryBudgeted),
          salaryWages: convertToRupees(item.salaryWages),
          salaryAllowance: convertToRupees(item.salaryAllowance),
          salaryVehicleAllowance: convertToRupees(item.salaryVehicleAllowance),
          salaryTravelAllowance: convertToRupees(item.salaryTravelAllowance),
          salaryBata: convertToRupees(item.salaryBata),
          salaryOutstation: convertToRupees(item.salaryOutstation),
          salaryOt: convertToRupees(item.salaryOt),
          salaryTotal: convertToRupees(item.salaryTotal),
          deductionEpf8: convertToRupees(item.deductionEpf8),
          deductionEpf12: convertToRupees(item.deductionEpf12),
          deductionEtf: convertToRupees(item.deductionEtf),
          deductionNoPay: convertToRupees(item.deductionNoPay),
          deductionLoan: convertToRupees(item.deductionLoan),
          deductionAdvance: convertToRupees(item.deductionAdvance),
          deductionPayee: convertToRupees(item.deductionPayee),
          deductionOther: convertToRupees(item.deductionOther),
          deductionTotal: convertToRupees(item.deductionTotal),
          finalTotal: convertToRupees(item.finalTotal),
        })),
      };
    },
  });

  if (listItems.data?.totalCount && listItems.data.totalCount !== count) {
    setCount(listItems.data.totalCount);
  }

  return (
    <Grid container spacing={1} justifyContent={"center"}>
      {user?.roleId === 5 && (
        <Grid item xs={12}>
          <PageHeaders HeaderIcon={<AccountBalanceIcon />} headerTitle={"Payroll"} breadCrumb={false} />
        </Grid>
      )}
      {isBrowser && (
        <Grid item lg={12} md={12} sm={12} xs={12} container>
          <Grid item xs={12}>
            <MainCard>
              {/* <TableContainer component={Paper}> */}
              <Formik
                initialValues={{
                  year: initialMonth,
                }}
                validationSchema={applyGlobalValidations(
                  Yup.object().shape({
                    year: Yup.date().required("Select a month"),
                  })
                )}
                onSubmit={async (values) => {
                  setInitialMonth(values.year);
                }}
              >
                {() => (
                  <Form>
                    <Grid container spacing={gridSpacing}>
                      <Grid item>
                        <DatePickerWrapper name="year" label="Year" maxDate={dayjs()} views={["year"]} sx={{ ...theme.typography.customInput }} />
                      </Grid>
                      <Grid item>
                        <Button variant="contained" disableElevation color="primary" type="submit" sx={{ ...theme.typography.customInput }}>
                          View
                        </Button>
                      </Grid>
                    </Grid>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell />
                          <TableCell>Month</TableCell>
                          <TableCell align="right" sx={{ minWidth: "130px" }}>
                            Gross Salary
                          </TableCell>
                          <TableCell align="right" sx={{ minWidth: "100px" }}>
                            OT
                          </TableCell>
                          <TableCell align="right" sx={{ minWidth: "100px" }}>
                            Outstation
                          </TableCell>
                          <TableCell align="right" sx={{ minWidth: "100px" }}>
                            Bata
                          </TableCell>
                          <TableCell align="right" sx={{ minWidth: "100px" }}>
                            Total Deduction
                          </TableCell>
                          <TableCell align="right" sx={{ minWidth: "100px" }}>
                            Salary
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {listItems.data?.data?.length && !listItems.isFetching
                          ? listItems.data?.data?.map((salary, index) => {
                              return (
                                <>
                                  <TableRow
                                    key={index}
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => {
                                      setIsOpen(isOpen === salary.id ? 0 : salary.id);
                                    }}
                                  >
                                    <TableCell
                                      width={50}
                                      sx={{
                                        backgroundColor: theme.palette.primary.light,
                                        cursor: "default",
                                      }}
                                    >
                                      <Tooltip title="View full pay sheet">
                                        <IconButton sx={{ p: 0 }}>
                                          <RemoveRedEyeIcon fontSize="medium" />
                                        </IconButton>
                                      </Tooltip>
                                    </TableCell>
                                    <TableCell>{dayjs(salary?.createdAt).format("MMMM")}</TableCell>
                                    <TableCell align="right" sx={{ minWidth: "130px" }}>
                                      {currencyFormat(salary?.salaryTotal, "", 2)}
                                    </TableCell>
                                    <TableCell align="right" sx={{ minWidth: "100px" }}>
                                      {currencyFormat(salary?.salaryOt, "", 2)}
                                    </TableCell>
                                    <TableCell align="right" sx={{ minWidth: "100px" }}>
                                      {currencyFormat(salary?.salaryOutstation, "", 2)}
                                    </TableCell>
                                    <TableCell align="right" sx={{ minWidth: "100px" }}>
                                      {currencyFormat(salary?.salaryBata, "", 2)}
                                    </TableCell>
                                    <TableCell align="right" sx={{ minWidth: "100px" }}>
                                      {currencyFormat(salary?.deductionTotal, "", 2)}
                                    </TableCell>
                                    <TableCell align="right" sx={{ minWidth: "130px" }}>
                                      {currencyFormat(salary?.finalTotal, "", 2)}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                                      <Collapse in={isOpen === salary.id} timeout="auto" unmountOnExit>
                                        <Box sx={{ p: 2, maxWidth: 350 }}>
                                          <SalaryView values={salary} open={isOpen === salary.id} />
                                        </Box>
                                      </Collapse>
                                    </TableCell>
                                  </TableRow>
                                </>
                              );
                            })
                          : null}
                      </TableBody>
                    </Table>
                    {!listItems.data?.data?.length && !listItems.isFetching && <EmptyResult />}
                    {listItems.isFetching && (
                      <Box
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          minHeight: "40vh",
                        }}
                      >
                        <Spinner />
                      </Box>
                    )}
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, 50]}
                      component="div"
                      count={count}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActions}
                    />
                    {/* </TableContainer> */}
                  </Form>
                )}
              </Formik>
            </MainCard>
          </Grid>
        </Grid>
      )}
      {(isMobile || isTablet) && (
        <Grid item xs={12}>
          <Formik
            initialValues={{
              month: initialMonth,
            }}
            validationSchema={applyGlobalValidations(
              Yup.object().shape({
                month: Yup.date().required("Select a month"),
              })
            )}
            onSubmit={async (values) => {
              setInitialMonth(values.month);
            }}
          >
            {() => (
              <Form>
                <Grid container spacing={1}>
                  <Grid item xs={12} container spacing={1} justifyContent={"flex-end"}>
                    <Grid item>
                      <DatePickerWrapper name="month" label="Year" maxDate={dayjs()} views={["year"]} />
                    </Grid>
                    <Grid item>
                      <Button variant="contained" disableElevation color="primary" type="submit" sx={{ ...theme.typography.customInput }}>
                        View
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    {!listItems.data?.data?.length && !listItems.isFetching && <EmptyResult />}
                    {listItems.isFetching && (
                      <Box
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          minHeight: "40vh",
                        }}
                      >
                        <Spinner />
                      </Box>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    {listItems.data?.data?.length && !listItems.isFetching
                      ? listItems.data?.data?.map((emp, index) => (
                          <Grid item xs={12} key={index}>
                            <Stack
                              onClick={() => {
                                setIsOpen(isOpen === emp.id ? 0 : emp.id);
                              }}
                              spacing={1}
                              sx={{
                                borderLeft: "2px solid",
                                borderColor: theme.palette.blue.main,
                                p: 1,
                                mb: 1,
                                backgroundColor: theme.palette.background.paper,
                                borderRadius: 2,
                              }}
                              direction={"column"}
                              boxShadow="0px 2px 8px rgba(0, 0, 0, 0.1)"
                            >
                              <Stack direction={"row"} justifyContent={"space-between"}>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <EventIcon sx={{ width: "15px", color: theme.palette.secondary.main }} />
                                  <Typography fontWeight={"bold"} color={theme.palette.secondary.main}>
                                    {dayjs(emp?.createdAt).format("MMMM YYYY")}
                                  </Typography>
                                </Box>
                                <Box display="flex" alignItems="center">
                                  {isOpen === emp.id ? (
                                    <Tooltip title="Expand">
                                      <IconButton sx={{ p: 0 }}>
                                        <ExpandLessIcon fontSize="medium" />
                                      </IconButton>
                                    </Tooltip>
                                  ) : (
                                    <Tooltip title="collaps">
                                      <IconButton sx={{ p: 0 }}>
                                        <ExpandMoreIcon fontSize="medium" />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                </Box>
                              </Stack>
                              <Stack direction={"row"} justifyContent={"space-between"}>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <AccountBalanceWalletIcon sx={{ width: "15px", color: theme.palette.text.secondary }} />
                                  <Typography variant="caption" fontWeight={"bold"}>
                                    Salary {currencyFormat(emp.finalTotal, "LKR ", 2)}
                                  </Typography>
                                </Box>
                                {/* <Box display="flex" alignItems="center" gap={1}>
                                  <AccessTimeIcon sx={{ width: "15px", color: theme.palette.text.secondary }} />
                                  <Typography variant="caption" fontWeight={"bold"}>
                                    Last-Out {dayjs(emp.endedAt).format("hh:mm:ss a")}
                                  </Typography>
                                </Box> */}
                              </Stack>
                            </Stack>
                            {isOpen === emp.id && <SalaryView values={emp} open={isOpen === emp.id} />}
                          </Grid>
                        ))
                      : null}
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
      )}
    </Grid>
  );
}

export default EmployeeProfilePayroll;

function SalaryView(props: { values; open }) {
  const { values, open } = props;

  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Box sx={{ ml: 1, pl: 1 }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"} px={1}>
              <Typography variant="caption" fontWeight={"bold"}>
                Basic Salary
              </Typography>
              <Typography variant="caption" fontWeight={"bold"}>
                {currencyFormat(values.salaryBasic, "", 2)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"} px={1}>
              <Typography variant="caption" fontWeight={"bold"}>
                Budgeted Allowance
              </Typography>
              <Typography variant="caption" fontWeight={"bold"}>
                {currencyFormat(values.salaryBudgeted, "", 2)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"} px={1}>
              <Typography variant="caption" fontWeight={"bold"}>
                Console Basic Salary
              </Typography>
              <Typography variant="caption" fontWeight={"bold"} sx={{ borderTop: "1px solid" }}>
                {currencyFormat(values.salaryBudgeted + values.salaryBasic, "", 2)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"} px={1}>
              <Typography variant="caption" fontWeight={"bold"}>
                Wage Salary
              </Typography>
              <Typography variant="caption" fontWeight={"bold"}>
                {currencyFormat(values.salaryWages, "", 2)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"} px={1}>
              <Typography variant="caption" fontWeight={"bold"}>
                Allowance
              </Typography>
              <Typography variant="caption" fontWeight={"bold"}>
                {currencyFormat(values.salaryAllowance, "", 2)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"} px={1}>
              <Typography variant="caption" fontWeight={"bold"}>
                Vehicle Allowance
              </Typography>
              <Typography variant="caption" fontWeight={"bold"}>
                {currencyFormat(values.salaryVehicleAllowance, "", 2)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"} px={1}>
              <Typography variant="caption" fontWeight={"bold"}>
                Travel Allowance
              </Typography>
              <Typography variant="caption" fontWeight={"bold"}>
                {currencyFormat(values.salaryTravelAllowance, "", 2)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"} px={1}>
              <Typography variant="caption" fontWeight={"bold"}>
                Gross Salary
              </Typography>
              <Typography variant="caption" fontWeight={"bold"} sx={{ borderTop: "1px solid" }}>
                {currencyFormat(values.salaryTotal, "", 2)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"} px={1}>
              <Typography variant="caption" fontWeight={"bold"}>
                Bata
              </Typography>
              <Typography variant="caption" fontWeight={"bold"}>
                {currencyFormat(values.salaryBata, "", 2)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"} px={1}>
              <Typography variant="caption" fontWeight={"bold"}>
                OT
              </Typography>
              <Typography variant="caption" fontWeight={"bold"}>
                {currencyFormat(values.salaryOt, "", 2)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"} px={1}>
              <Typography variant="caption" fontWeight={"bold"}>
                Outstation
              </Typography>
              <Typography variant="caption" fontWeight={"bold"}>
                {currencyFormat(values.salaryOutstation, "", 2)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"} px={1}>
              <Typography variant="caption" fontWeight={"bold"} color={"error"}>
                EPF(8%)
              </Typography>
              <Typography variant="caption" fontWeight={"bold"}>
                {currencyFormat(values.deductionEpf8, "", 2)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"} px={1}>
              <Typography variant="caption" fontWeight={"bold"}>
                EPF(12%)
              </Typography>
              <Typography variant="caption" fontWeight={"bold"}>
                {currencyFormat(values.deductionEpf12, "", 2)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"} px={1}>
              <Typography variant="caption" fontWeight={"bold"}>
                ETF
              </Typography>
              <Typography variant="caption" fontWeight={"bold"}>
                {currencyFormat(values.deductionEtf, "", 2)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"} px={1}>
              <Typography variant="caption" fontWeight={"bold"} color={"error"}>
                Advance Deduction
              </Typography>
              <Typography variant="caption" fontWeight={"bold"}>
                {currencyFormat(values.deductionAdvance, "", 2)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"} px={1}>
              <Typography variant="caption" fontWeight={"bold"} color={"error"}>
                Loan Deduction
              </Typography>
              <Typography variant="caption" fontWeight={"bold"}>
                {currencyFormat(values.deductionLoan, "", 2)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"} px={1}>
              <Typography variant="caption" fontWeight={"bold"} color={"error"}>
                NoPay Deduction
              </Typography>
              <Typography variant="caption" fontWeight={"bold"}>
                {currencyFormat(values.deductionNoPay, "", 2)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"} px={1}>
              <Typography variant="caption" fontWeight={"bold"} color={"error"}>
                Payee Deduction
              </Typography>
              <Typography variant="caption" fontWeight={"bold"}>
                {currencyFormat(values.deductionPayee, "", 2)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"} px={1}>
              <Typography variant="caption" fontWeight={"bold"} color={"error"}>
                Other Deductions
              </Typography>
              <Typography variant="caption" fontWeight={"bold"}>
                {currencyFormat(values.deductionOther, "", 2)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"} px={1}>
              <Typography variant="caption" fontWeight={"bold"} color={"error"}>
                Total Deductions
              </Typography>
              <Typography variant="caption" fontWeight={"bold"} sx={{ borderTop: "1px solid" }} color={"error"}>
                {currencyFormat(values.deductionTotal, "", 2)}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction={"row"} justifyContent={"space-between"} px={1} sx={{ borderTop: "1px solid", pt: 1 }}>
              <Typography fontWeight={"bold"}>Employee Salary</Typography>
              <Typography fontWeight={"bold"}>{currencyFormat(values.finalTotal, "LKR ", 2)}</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Collapse>
  );
}
