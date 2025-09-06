import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SET_BREADCRUMBS } from "../../../redux/actions/actions";
import { useQuery } from "@tanstack/react-query";
import { isMobile } from "react-device-detect";

// mui
import {
  Avatar,
  Box,
  Button,
  Chip,
  Grid,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";

// mui icon
import dayjs, { Dayjs } from "dayjs";
import EmptyResult from "../../../utils/ui-components/EmptyResult";
import Spinner from "../../../utils/ui-components/Spinner";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import DateRangeIcon from "@mui/icons-material/DateRange";
import { getClockLeaveSummaries } from "../../../assets/api";
import ViewStreamIcon from "@mui/icons-material/ViewStream";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";

export interface ProductValues {
  id: number | string;
  productCode: string;
  brand: string;
  category: string;
  sku: number | string;
  description: string;
}

function EmployeeAttendanceList(props: {
  setDivisionType: (data: any) => void;
  setTableDataCount: (data: any) => void;
  divisionType: { value: number; label: string; count: number };
  search: {
    searchTerm: string;
    month: Dayjs;
  };
}) {
  const theme: any = useTheme();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const [view, setView] = useState<"TABLE" | "CALEDAR" | "PROJECT">("TABLE");

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);

  const startOfMonth = props.search.month.startOf("month");
  const endOfMonth = props.search.month.endOf("month");

  // Generate dates between the start and end of the range
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
          name: "Attendance",
          path: null,
          bold: true,
          state: state,
        },
      ],
    });
    props.setDivisionType(props.divisionType);
  }, []);

  const listItems = useQuery({
    queryKey: ["summaries/users/clockLeave", pageSize, page, props.divisionType?.value, props.search?.month],
    queryFn: () =>
      getClockLeaveSummaries(
        page,
        pageSize,
        props.divisionType.value === 0 ? undefined : props.divisionType.value,
        dayjs(props.search?.month).year(),
        dayjs(props.search?.month).month()
      ),
    select: (res) => res.data,
  });

  useEffect(() => {
    if (listItems.data?.totalCount && listItems.data.totalCount !== count) {
      setCount(listItems.data.totalCount);
    }
    props.setTableDataCount(listItems.data?.totalCount || 0);
  }, [listItems.data?.totalCount, count]);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Grid container spacing={1}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
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
                    startIcon={!isMobile && <BackupTableIcon />}
                    variant={view === "TABLE" ? "contained" : "outlined"}
                    onClick={() => {
                      setView("TABLE");
                    }}
                  >
                    {isMobile ? <BackupTableIcon /> : "Table View"}
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
                  <Button
                    startIcon={!isMobile && <WorkOutlineIcon />}
                    variant={view === "PROJECT" ? "contained" : "outlined"}
                    onClick={() => {
                      setView("PROJECT");
                    }}
                  >
                    {isMobile ? <WorkOutlineIcon /> : "Project View"}
                  </Button>
                </Stack>
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
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ overflowX: "auto" }}>
                <Table width="100%">
                  <TableHead>
                    <TableRow>
                      {/* <TableCell /> */}
                      <TableCell
                        sx={{
                          position: isMobile ? "static" : "sticky",
                          left: 0,
                          zIndex: 1,
                        }}
                      >
                        Employee
                      </TableCell>
                      {view === "TABLE" && (
                        <>
                          <TableCell>Designation</TableCell>
                          <TableCell>Working Days</TableCell>
                          {/* <TableCell>OT Hours</TableCell> */}
                          <TableCell>Leave Days</TableCell>
                          <TableCell>Absent Days</TableCell>
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
                      {view === "PROJECT" && (
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
                                width={80}
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
                    {!listItems.isFetching &&
                      listItems.data?.data?.map((emp, index) => {
                        return (
                          <React.Fragment key={index}>
                            <TableRow>
                              <TableCell
                                sx={{
                                  position: isMobile ? "static" : "sticky",
                                  left: 0,
                                  backgroundColor: index % 2 === 0 ? theme.palette.grey[100] : theme.palette.background.paper, // or use theme.palette.background.paper
                                  zIndex: 1,
                                }}
                              >
                                {view === "TABLE" ? (
                                  <Stack alignItems={"center"} direction={"row"} spacing={2}>
                                    <Avatar src={``} sx={{ width: 30, height: 30 }} />
                                    <Stack direction={"column"}>
                                      <Typography variant="caption">{emp?.user?.employeeNumber}</Typography>
                                      <Typography>{emp?.user?.nameInitials}</Typography>
                                    </Stack>
                                  </Stack>
                                ) : (
                                  <Stack direction={"row"} sx={{ minWidth: "200px" }} columnGap={1}>
                                    <Typography variant="caption">[ {emp?.user?.employeeNumber} ]</Typography>
                                    <Typography>{emp?.user?.nameInitials}</Typography>
                                  </Stack>
                                )}
                              </TableCell>
                              {view === "TABLE" && (
                                <>
                                  <TableCell>
                                    <Typography>{emp?.user?.class}</Typography>
                                  </TableCell>
                                  <TableCell>{emp?.fullyWorkedDays}</TableCell>
                                  {/* <TableCell>{emp?.otHrs}</TableCell> */}
                                  <TableCell>{emp?.fullLeaveDays}</TableCell>
                                  <TableCell>{emp?.absentDays}</TableCell>
                                </>
                              )}
                              {view === "CALEDAR" && (
                                <>
                                  {generateMonthData(emp.workBehaviors, props.search?.month).map((data, index) => (
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
                              {view === "PROJECT" && (
                                <>
                                  {generateMonthData(emp.workProjects, props.search?.month).map((data, index) => (
                                    <TableCell
                                      align="center"
                                      key={index}
                                      sx={{
                                        backgroundColor:
                                          dayjs(data.date).day() === 0 || dayjs(data.date).day() === 6
                                            ? `${theme.palette.info[200]} !important`
                                            : null,
                                      }}
                                    >
                                      {data.value == "HA" ||
                                      data.value == "HM" ||
                                      data.value == "HC" ||
                                      data.value == "FA" ||
                                      data.value == "FM" ||
                                      data.value == "FC" ||
                                      data.value == "E1" ||
                                      data.value == "U1" ||
                                      data.value == "U2" ||
                                      data.value == "U3" ||
                                      data.value == "FW" ||
                                      data.value == "NA" ||
                                      data.value == "HD" ||
                                      data.value == "FD" ||
                                      data.value === "AB" ? (
                                        <Typography
                                          variant="caption"
                                          fontWeight={"bold"}
                                          color={
                                            data.value === "AB"
                                              ? "error"
                                              : data.value === "FW"
                                              ? theme.palette.success.dark
                                              : data.value === "HA" || data.value === "HM" || data.value === "HC"
                                              ? theme.palette.error.dark
                                              : data.value === "FA" || data.value === "FM" || data.value === "FC"
                                              ? theme.palette.error.dark
                                              : data.value === "HD"
                                              ? theme.palette.warning.main
                                              : data.value == "FD"
                                              ? theme.palette.info.main
                                              : "default"
                                          }
                                        >
                                          {data.value === "NA" ? "-" : data.value}
                                        </Typography>
                                      ) : (
                                        <Typography variant="caption" fontWeight={"bold"}>
                                          {data?.value.slice(0, 20)}
                                        </Typography>
                                      )}
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
    </Grid>
  );
}

export default EmployeeAttendanceList;

function generateMonthData(initialValues, month) {
  const totalDays = month.daysInMonth();
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

    const date = `${month.year()}-${String(month.month() + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;

    return { date, value };
  });
}
