import { useTheme } from "@mui/material/styles";
import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SET_BREADCRUMBS } from "../../../redux/actions/actions";
import { useQuery } from "@tanstack/react-query";

// mui
import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  IconButton,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useMediaQuery,
} from "@mui/material";

// mui icon
import dayjs, { Dayjs } from "dayjs";
import EmptyResult from "../../../utils/ui-components/EmptyResult";
import Spinner from "../../../utils/ui-components/Spinner";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import { listSalaryRecords } from "../../../assets/api";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import MainCard from "../../../utils/ui-components/MainCard";
import UpdateSalaryDetails from "./UpdateSalaryDetails";
import ViewEditDialog from "../../../utils/ui-components/ViewEditDialog";
import EditIcon from "@mui/icons-material/Edit";
import { convertToRupees, currencyFormat } from "../../../utils/utils";
import { isMobile } from "react-device-detect";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ViewStreamIcon from "@mui/icons-material/ViewStream";

export interface SalaryInterface {
  id: number;
  salaryBasic: number;
  salaryBudgeted: number;
  salaryWages: number;
  salaryAllowance: number;
  salaryVehicleAllowance: number;
  salaryTravelAllowance: number;
  salaryBata: number;
  salaryOutstation: number;
  salaryOt: number;
  salaryTotal: number;
  deductionEpf8: number;
  deductionEpf12: number;
  deductionEtf: number;
  deductionNoPay: number;
  deductionLoan: number;
  deductionAdvance: number;
  deductionPayee: number;
  deductionOther: number;
  deductionTotal: number;
  finalTotal: number;
  comment: string;
}

const INITIAL_FORM_STATE: SalaryInterface = {
  id: 0,
  salaryBasic: 0,
  salaryBudgeted: 0,
  salaryWages: 0,
  salaryAllowance: 0,
  salaryVehicleAllowance: 0,
  salaryTravelAllowance: 0,
  salaryBata: 0,
  salaryOutstation: 0,
  salaryOt: 0,
  salaryTotal: 0,
  deductionEpf8: 0,
  deductionEpf12: 0,
  deductionEtf: 0,
  deductionNoPay: 0,
  deductionLoan: 0,
  deductionAdvance: 0,
  deductionPayee: 0,
  deductionOther: 0,
  deductionTotal: 0,
  finalTotal: 0,
  comment: "",
};

function EmployeeAttendanceList(props: {
  setDivisionType: (data: any) => void;
  setTableDataCount: (data: any) => void;
  divisionType: { value: number; label: string };
  access: string;
  search: {
    searchTerm: string;
    month: Dayjs;
  };
}) {
  const theme: any = useTheme();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const [dialogTitle, setDialogTitle] = useState("");
  const [initialItem, setInitialItem] = useState<SalaryInterface>(INITIAL_FORM_STATE);
  const [open, setOpen] = useState<boolean>(false);
  const [view, setView] = useState<"PAYSHEET" | "SUMMERY" | "CALEDAR">("PAYSHEET");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const startOfMonth = props.search.month.startOf("month").subtract(1, "month").date(21);
  const endOfMonth = props.search.month.startOf("month").date(20);
  const datesInRange: any = [];
  let currentDate = startOfMonth;

  while (currentDate.isBefore(endOfMonth) || currentDate.isSame(endOfMonth, "day")) {
    datesInRange.push(currentDate);
    currentDate = currentDate.add(1, "day");
  }

  useEffect(() => {
    dispatch({
      type: SET_BREADCRUMBS,
      payload: [
        { name: "Home", path: "/Dashboard", bold: false, state: null },
        {
          name: "Payroll",
          path: null,
          bold: true,
          state: state,
        },
      ],
    });
    props.setDivisionType(props.divisionType);
  }, []);

  const salaryRecords = useQuery({
    queryKey: [
      "listSalaryRecords",
      props.divisionType?.value,
      props.search?.month,
      props.search?.month,
      page,
      pageSize,
      undefined,
      true,
      props.search.searchTerm,
    ],
    queryFn: () =>
      listSalaryRecords({
        divisionId: props.divisionType.value === 0 ? undefined : props.divisionType.value,
        month: dayjs(props.search?.month).month(),
        year: dayjs(props.search?.month).year(),
        page: page,
        pageSize: pageSize,
        joinUser: true,
        searchTerm: props.search.searchTerm === "" ? undefined : props.search.searchTerm,
      }),
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

  useEffect(() => {
    if (salaryRecords.data?.totalCount && salaryRecords.data.totalCount !== count) {
      setCount(salaryRecords.data.totalCount);
    }
    props.setTableDataCount(salaryRecords.data?.totalCount || 0);
  }, [salaryRecords.data?.totalCount, count]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickOpen = (dialogTitle: string, formState: SalaryInterface) => {
    setOpen(true);
    setDialogTitle(dialogTitle);
    setInitialItem(formState);
  };

  const dialog = useMemo(
    () =>
      ViewEditDialog(UpdateSalaryDetails)({
        open: open,
        setOpen: setOpen,
        dialogTitle: dialogTitle,
        initialItem: initialItem,
        fetchData: () => {
          salaryRecords.refetch();
        },
        theme: theme,
        maxWidth: "sm",
        initialData: {},
      }),
    [open]
  );

  return (
    <Grid container spacing={1}>
      <Grid item lg={open && !matchDownSM ? 7 : 12} md={open && !matchDownSM ? 7 : 12} sm={12} xs={12}>
        <Box
          sx={{
            minHeight: 400,
            backgroundColor: theme.palette.background.paper,
            p: "10px",
            borderRadius: "10px",
            border: "1px solid",
            borderColor: theme.palette.primary[200],
          }}
        >
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Stack direction={"row"} spacing={1}>
                  <Button
                    startIcon={<AttachMoneyIcon />}
                    variant={view === "PAYSHEET" ? "contained" : "outlined"}
                    onClick={() => {
                      setView("PAYSHEET");
                    }}
                  >
                    Paysheet View
                  </Button>
                  <Button
                    startIcon={<BackupTableIcon />}
                    variant={view === "SUMMERY" ? "contained" : "outlined"}
                    onClick={() => {
                      setView("SUMMERY");
                    }}
                  >
                    Table View
                  </Button>
                  <Button
                    startIcon={!isMobile && <DateRangeIcon />}
                    variant={view === "CALEDAR" ? "contained" : "outlined"}
                    onClick={() => {
                      setView("CALEDAR");
                    }}
                  >
                    {isMobile ? <DateRangeIcon /> : "Calender View"}
                  </Button>
                  {view === "CALEDAR" && (
                    <>
                      <Button
                        onClick={(event: any) => {
                          setAnchorEl(event.currentTarget);
                        }}
                      >
                        <ViewStreamIcon />
                      </Button>
                      <Popover
                        open={Boolean(anchorEl)}
                        anchorEl={anchorEl}
                        onClose={() => setAnchorEl(null)}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                      >
                        <Stack direction="column" spacing={2} sx={{ p: 2 }}>
                          {[
                            { label: "AB", text: "Absent", color: "error" },
                            { label: "FW", text: "Fully Work Day", color: "success" },
                            // { label: "HW", text: "Half Day Work", color: "success" },
                            { label: "AL", text: "Annual Leave", color: "error" },
                            { label: "CL", text: "Casual Leave", color: "error" },
                            { label: "ML", text: "Medical Leave", color: "error" },
                            { label: "HL", text: "Half Day Leave", color: "error" },
                            // { label: "HC", text: "Half Day Casual Leave", color: "warning" },
                            // { label: "HM", text: "Half Day Medical Leave", color: "warning" },
                            { label: "HD", text: "Holiday", color: "warning" },
                            { label: "DO", text: "Day Off", color: "info" },
                          ].map((item) => (
                            <Stack key={item.label} direction="row" spacing={1} alignItems="center">
                              <Chip
                                label={item.label}
                                size="small"
                                color={item.color as "default" | "error" | "success" | "secondary" | "warning" | "primary" | "info"}
                                sx={{ height: 20 }}
                              />
                              <Typography variant="caption" fontWeight="bold">
                                {item.text}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Popover>
                    </>
                  )}
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ overflowX: "auto" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {props.access[0] === "1" && <TableCell width={"50px"} />}
                      <TableCell
                        sx={{
                          position: isMobile ? "static" : "sticky",
                          left: 0,
                          zIndex: 1,
                        }}
                      >
                        Employee
                      </TableCell>
                      {view === "PAYSHEET" && (
                        <>
                          <TableCell align="right" sx={{ minWidth: "130px" }}>
                            Console Basic
                          </TableCell>
                          <TableCell align="right" sx={{ minWidth: "130px" }}>
                            Gross Salary
                          </TableCell>
                          <TableCell align="right" sx={{ minWidth: "130px" }}>
                            Overtime
                          </TableCell>
                          <TableCell align="right" sx={{ minWidth: "130px" }}>
                            Bata
                          </TableCell>
                          <TableCell align="right" sx={{ minWidth: "130px" }}>
                            OutStation
                          </TableCell>
                          <TableCell align="right" sx={{ minWidth: "140px" }}>
                            Total Deduction
                          </TableCell>
                          <TableCell align="right" sx={{ minWidth: "130px" }}>
                            Paid Salary
                          </TableCell>
                        </>
                      )}
                      {view === "SUMMERY" && (
                        <>
                          <TableCell align="left" sx={{ minWidth: "150px" }}>
                            Designation
                          </TableCell>
                          <TableCell align="right" sx={{ minWidth: "130px" }}>
                            Working Days
                          </TableCell>
                          <TableCell align="right" sx={{ minWidth: "100px" }}>
                            OT Hours
                          </TableCell>
                          <TableCell align="right" sx={{ minWidth: "140px" }}>
                            Full day Leaves
                          </TableCell>
                          <TableCell align="right" sx={{ minWidth: "140px" }}>
                            Half Day Leaves
                          </TableCell>
                          <TableCell align="right" sx={{ minWidth: "130px" }}>
                            Absent Days
                          </TableCell>
                        </>
                      )}
                      {view === "CALEDAR" && (
                        <>
                          {datesInRange.map((date, index) => (
                            <TableCell
                              key={index}
                              sx={{
                                backgroundColor: dayjs(date).day() === 0 || dayjs(date).day() === 6 ? `${theme.palette.info[200]} !important` : null,
                              }}
                            >
                              <Stack
                                direction={"column"}
                                alignItems={"center"}
                                width={50}
                                sx={{
                                  backgroundColor: dayjs(date).isSame(dayjs(), "day") ? "#f0f09a" : null,
                                  paddingY: 0.5,
                                  borderRadius: "5px",
                                  border: dayjs(date).isSame(dayjs(), "day") ? "1px solid #d5d511" : null,
                                }}
                              >
                                <Typography variant="caption" fontWeight={"bold"}>
                                  {date.format("D")}
                                </Typography>
                                <Typography variant="caption" fontWeight={"bold"}>
                                  {date.format("ddd")}
                                </Typography>
                              </Stack>
                            </TableCell>
                          ))}
                        </>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!salaryRecords.isFetching &&
                      salaryRecords.data?.data?.map((emp, index) => {
                        return (
                          <React.Fragment key={index}>
                            <TableRow>
                              {props.access[0] === "1" && (
                                <TableCell width={"50px"}>
                                  <IconButton
                                    onClick={() =>
                                      handleClickOpen(`Update [ ${emp.user.employeeNumber} ] Employee Salary`, {
                                        id: emp.id,
                                        salaryBasic: emp.salaryBasic,
                                        salaryBudgeted: emp.salaryBudgeted,
                                        salaryWages: emp.salaryWages,
                                        salaryAllowance: emp.salaryAllowance,
                                        salaryVehicleAllowance: emp.salaryVehicleAllowance,
                                        salaryTravelAllowance: emp.salaryTravelAllowance,
                                        salaryBata: emp.salaryBata,
                                        salaryOutstation: emp.salaryOutstation,
                                        salaryOt: emp.salaryOt,
                                        salaryTotal: emp.salaryTotal,
                                        deductionEpf8: emp.deductionEpf8,
                                        deductionEpf12: emp.deductionEpf12,
                                        deductionEtf: emp.deductionEtf,
                                        deductionNoPay: emp.deductionNoPay,
                                        deductionLoan: emp.deductionLoan,
                                        deductionAdvance: emp.deductionAdvance,
                                        deductionPayee: emp.deductionPayee,
                                        deductionOther: emp.deductionOther,
                                        deductionTotal: emp.deductionTotal,
                                        finalTotal: emp.finalTotal,
                                        comment: emp.comment || "",
                                      })
                                    }
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </TableCell>
                              )}
                              <TableCell
                                sx={{
                                  position: isMobile ? "static" : "sticky",
                                  left: 0,
                                  backgroundColor: index % 2 === 0 ? theme.palette.grey[100] : theme.palette.background.paper, // or use theme.palette.background.paper
                                  zIndex: 1,
                                }}
                              >
                                <Stack alignItems={"center"} minWidth={"200px"} direction={"row"} spacing={2}>
                                  <Avatar src={``} sx={{ width: 30, height: 30 }} />
                                  <Stack direction={"column"}>
                                    <Typography variant="caption">{emp?.user?.employeeNumber}</Typography>
                                    <Typography>{emp?.user?.nameInitials}</Typography>
                                  </Stack>
                                </Stack>
                              </TableCell>
                              {view === "SUMMERY" && (
                                <>
                                  <TableCell align="left">
                                    <Typography>{emp?.user?.class}</Typography>
                                  </TableCell>
                                  <TableCell align="right">{emp?.workBehavior?.fullyWorkedDays}</TableCell>
                                  <TableCell align="right">{emp?.workBehavior?.otHrs}</TableCell>
                                  <TableCell align="right">{emp?.workBehavior?.fullLeaveDays}</TableCell>
                                  <TableCell align="right">{emp?.workBehavior?.halfLeaveDays}</TableCell>
                                  <TableCell align="right">{emp?.workBehavior?.absentDays}</TableCell>
                                </>
                              )}
                              {view === "PAYSHEET" && (
                                <>
                                  <TableCell align="right" sx={{ minWidth: "130px" }}>
                                    {currencyFormat(emp?.salaryBudgeted + emp?.salaryBasic, "", 2)}
                                  </TableCell>
                                  <TableCell align="right" sx={{ minWidth: "130px" }}>
                                    {currencyFormat(emp?.salaryTotal, "", 2)}
                                  </TableCell>
                                  <TableCell align="right" sx={{ minWidth: "130px" }}>
                                    {currencyFormat(emp?.salaryOt, "", 2)}
                                  </TableCell>
                                  <TableCell align="right" sx={{ minWidth: "130px" }}>
                                    {currencyFormat(emp?.salaryBata, "", 2)}
                                  </TableCell>
                                  <TableCell align="right" sx={{ minWidth: "130px" }}>
                                    {currencyFormat(emp?.salaryOutstation, "", 2)}
                                  </TableCell>
                                  <TableCell align="right" sx={{ minWidth: "140px" }}>
                                    {currencyFormat(emp?.deductionTotal, "", 2)}
                                  </TableCell>
                                  <TableCell align="right" sx={{ minWidth: "130px" }}>
                                    {currencyFormat(emp?.finalTotal, "", 2)}
                                  </TableCell>
                                </>
                              )}
                              {view === "CALEDAR" && (
                                <>
                                  {generateMonthData(emp.workBehavior?.workBehaviors, startOfMonth, endOfMonth).map((data, index) => (
                                    <TableCell
                                      key={index}
                                      sx={{
                                        backgroundColor:
                                          dayjs(data.date).day() === 0 || dayjs(data.date).day() === 6
                                            ? `${theme.palette.info[200]} !important`
                                            : null,
                                      }}
                                    >
                                      <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                        <Chip
                                          sx={{
                                            height: "20px",
                                            // width: "100%",
                                          }}
                                          label={data.value}
                                          size="small"
                                          variant="filled"
                                          color={
                                            data.value == "AB"
                                              ? "error"
                                              : data.value == "FW"
                                              ? "success"
                                              : data.value == "AL" || data.value == "ML" || data.value == "CL"
                                              ? "error"
                                              : data.value == "HL"
                                              ? "error"
                                              : data.value == "HD"
                                              ? "warning"
                                              : data.value == "DO"
                                              ? "info"
                                              : "default"
                                          }
                                        />
                                      </Box>
                                    </TableCell>
                                  ))}
                                </>
                              )}
                            </TableRow>
                          </React.Fragment>
                        );
                      })}
                  </TableBody>
                </Table>
              </Box>
              {!salaryRecords.data?.data?.length && !salaryRecords.isFetching && <EmptyResult />}
              {salaryRecords.isFetching && (
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
                rowsPerPage={pageSize}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </Grid>
          </Grid>
        </Box>
      </Grid>
      {open && !matchDownSM ? (
        <Grid item lg={5} md={5}>
          <MainCard title={dialogTitle}>
            <UpdateSalaryDetails
              fetchData={() => {
                salaryRecords.refetch();
              }}
              initialData={{}}
              initialItem={initialItem}
              setOpen={setOpen}
            />
          </MainCard>
        </Grid>
      ) : (
        dialog
      )}
    </Grid>
  );
}

export default EmployeeAttendanceList;

function generateMonthData(initialValues, startOfMonth, endOfMonth) {
  const totalDays = endOfMonth.diff(startOfMonth, "day") + 1;
  const values = initialValues ? initialValues.split(";") : [];
  const symbolMap = {
    "☀️": "NA",
    "🪐": "NA",
    FA: "AL",
    FM: "ML",
    FC: "CL",
    HA: "HL",
    HM: "HL",
    HC: "HL",
    FD: "DO",
  };

  return Array.from({ length: totalDays }, (_, i) => {
    const rawValue = values[i] || "NA";
    const value = symbolMap[rawValue] || rawValue;

    const currentDate = startOfMonth.add(i, "day");
    const date = currentDate.format("YYYY-MM-DD");

    return { date, value };
  });
}
