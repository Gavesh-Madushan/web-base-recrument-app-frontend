import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

// mui
import {
  //   Avatar,
  Box,
  Button,
  // Chip,
  //   Button,
  //   Checkbox,
  Collapse,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  //   Stack,
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
import { applyGlobalValidations } from "../../utils/utils";
import { useQuery } from "@tanstack/react-query";
import { listAttendanceRecords, listClockRecords } from "../../assets/api";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import DatePickerWrapper from "../../utils/ui-components/FormsUI/DatePicker";
import { useSelector } from "react-redux";
import { getState } from "../../redux/actions/actions";
import PageHeaders from "../../utils/ui-components/PageHeaders";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { isBrowser, isTablet, isMobile } from "react-device-detect";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";

// const statusMap = {
//   APPROVED: { label: "Approved", color: "success" },
//   REJECTED: { label: "Reject", color: "error" },
//   PENDING: { label: "Pending", color: "warning" },
//   undefined: { label: "Undefined", color: "default" },
// } as const;

function Row(props: { employee; isOdd; userId; isOtEnabled }) {
  const { employee, isOdd, userId, isOtEnabled } = props;
  const [open, setOpen] = useState(false);
  const theme: any = useTheme();

  const [countDate, setCountDate] = useState(0);
  const [pageDate, setPageDate] = useState(0);
  const [rowsPerPageDate, setRowsPerPageDate] = useState(10);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPageDate(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPageDate(parseInt(event.target.value, 10));
    setPageDate(0);
  };

  const listDateItems = useQuery({
    queryKey: [
      "attendanceRecords",
      rowsPerPageDate,
      pageDate,
      userId ? userId : "@me",
      dayjs(employee?.createdAt).startOf("day").toISOString(),
      dayjs(employee?.createdAt).endOf("day").toISOString(),
    ],
    queryFn: () =>
      listAttendanceRecords({
        pageSize: rowsPerPageDate,
        page: pageDate,
        userId: userId ? userId : "@me",
        createdFrom: dayjs(employee?.createdAt).startOf("day").toISOString(),
        createdTo: dayjs(employee?.createdAt).endOf("day").toISOString(),
        joinProjectAssignment: true,
      }),
    enabled: open,
    select: (res) => res.data,
  });

  if (listDateItems.data?.totalCount && listDateItems.data.totalCount !== countDate) {
    setCountDate(listDateItems.data.totalCount);
  }

  return (
    <React.Fragment>
      <TableRow
        sx={{ cursor: "pointer" }}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <TableCell
          width={50}
          sx={{
            backgroundColor: theme.palette.primary.light,
            cursor: "default",
          }}
        >
          {open ? (
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
        </TableCell>
        <TableCell
          sx={{
            backgroundColor: isOdd ? theme.palette.grey[100] : theme.palette.background.paper,
          }}
        >
          {dayjs(employee?.createdAt).format("DD MMM YYYY")}
        </TableCell>
        <TableCell
          sx={{
            backgroundColor: isOdd ? theme.palette.grey[100] : theme.palette.background.paper,
          }}
        >
          {dayjs(employee?.createdAt).format("hh:mm:ss a")}
        </TableCell>
        <TableCell
          sx={{
            backgroundColor: isOdd ? theme.palette.grey[100] : theme.palette.background.paper,
          }}
        >
          {employee?.endedAt ? (employee?.endedAt === employee?.createdAt ? "-" : dayjs(employee?.endedAt).format("hh:mm:ss a")) : "-"}
        </TableCell>
        <TableCell
          sx={{
            backgroundColor: isOdd ? theme.palette.grey[100] : theme.palette.background.paper,
          }}
        >
          {(() => {
            const totalMinutes = dayjs(employee?.endedAt).diff(dayjs(employee?.createdAt), "minute", false);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${hours}h ${minutes}m`;
          })()}
        </TableCell>
        {isOtEnabled && (
          <TableCell
            sx={{
              backgroundColor: isOdd ? theme.palette.grey[100] : theme.palette.background.paper,
            }}
          >
            {/* {employee?.otHrs} */}
            {employee?.approvalState === "PENDING" && employee?.otHrs > 0 ? (
              <Typography variant="caption" color={theme.palette.warning.main} fontWeight={"bold"}>
                {employee?.otHrs} - Pending
              </Typography>
            ) : (
              employee?.otHrs
            )}
          </TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <Grid container spacing={1}>
                <Grid item xs={12} container sx={{ m: 1 }} rowSpacing={1}>
                  <Grid item xs={12} container>
                    <Grid
                      item
                      container
                      xs={12}
                      sx={{
                        backgroundColor: theme.palette.secondary.light,
                        p: 1,
                        borderRadius: 2,
                        color: theme.palette.secondary.dark,
                      }}
                      alignItems={"center"}
                    >
                      <Grid item xs={3}>
                        <Typography fontWeight={"bold"}>Check In</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography fontWeight={"bold"}>Check Out</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography fontWeight={"bold"}>Project</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography fontWeight={"bold"}>Comment</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  {listDateItems.data?.data?.length &&
                    !listDateItems.isFetching &&
                    listDateItems.data?.data?.map((item, index) => (
                      <Grid item xs={12} container spacing={1} key={index}>
                        <Grid item container xs={12} alignItems={"center"} sx={{ ml: 1 }}>
                          <Grid item xs={3}>
                            <Typography>{dayjs(item.createdAt).format("hh:mm:ss a")}</Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography>{item.endedAt ? dayjs(item.endedAt).format("hh:mm:ss a") : "Still cheked-In"}</Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography>{item.projectAssignment?.project?.name ?? "- - - - - - -"}</Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography>{item.comment}</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    ))}
                  {!listDateItems.data?.data?.length && !listDateItems.isFetching && <EmptyResult />}
                  {listDateItems.isFetching && (
                    <Grid container spacing={1}>
                      <Grid item xs={12} sx={{ mt: 1 }}>
                        <Skeleton variant="rectangular" height={20} />
                      </Grid>
                      <Grid item xs={12}>
                        <Skeleton variant="rectangular" height={20} />
                      </Grid>
                      <Grid item xs={12}>
                        <Skeleton variant="rectangular" height={20} />
                      </Grid>
                      <Grid item xs={12}>
                        <Skeleton variant="rectangular" height={20} />
                      </Grid>
                      <Grid item xs={12}>
                        <Skeleton variant="rectangular" height={20} />
                      </Grid>
                    </Grid>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TablePagination
                    rowsPerPageOptions={[]}
                    component="div"
                    count={countDate}
                    rowsPerPage={rowsPerPageDate}
                    page={pageDate}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function EmployeeProfileAttendanceList({ userId, otPerHr }: { userId: number; otPerHr?: number }) {
  const theme: any = useTheme();
  const authState = useSelector((state: any) => state.auth.authData);
  const user = getState(authState);
  const [isOtEnabled, setIsOtEnabled] = useState<boolean>(false);
  const [initialMonth, setInitialMonth] = useState(dayjs());
  const [isOpen, setIsOpen] = useState<number>(0);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  useEffect(() => {
    setIsOtEnabled(otPerHr ? otPerHr > 0 : user?.salaryOtPerHour > 0 ? true : false);
  }, []);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const listItems = useQuery({
    queryKey: ["clockRecords", rowsPerPage, page, userId, initialMonth.startOf("month").toISOString(), initialMonth.endOf("month").toISOString()],
    queryFn: () =>
      listClockRecords({
        pageSize: rowsPerPage,
        page: page,
        userId: userId ? userId : ("@me" as const),
        createdFrom: initialMonth.startOf("month").toISOString(),
        createdTo: initialMonth.endOf("month").toISOString(),
      }),
    enabled: true,
    select: (res) => res.data,
  });

  if (listItems.data?.totalCount && listItems.data.totalCount !== count) {
    setCount(listItems.data.totalCount);
  }

  return (
    <Grid container spacing={1} justifyContent={"center"}>
      {user?.roleId === 5 && (
        <Grid item xs={12}>
          <PageHeaders HeaderIcon={<CalendarMonthIcon />} headerTitle={"Attandance"} breadCrumb={false} />
        </Grid>
      )}
      {isBrowser && (
        <Grid item lg={12} md={12} sm={12} xs={12} container>
          <Grid item xs={12}>
            <MainCard>
              {/* <TableContainer component={Paper}> */}
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
                      <Grid item>
                        <DatePickerWrapper
                          name="month"
                          label="Month"
                          maxDate={dayjs()}
                          views={["month", "year"]}
                          // sx={{ ...theme.typography.customInput }}
                        />
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
                          <TableCell>Date</TableCell>
                          <TableCell>First Check IN</TableCell>
                          <TableCell>Last Check Out</TableCell>
                          <TableCell>Total Work Hours</TableCell>
                          {isOtEnabled && <TableCell>Total OT Hours</TableCell>}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {listItems.data?.data?.length && !listItems.isFetching
                          ? listItems.data?.data?.map((emp, index) => {
                              return <Row key={emp.id} employee={emp} isOdd={index % 2 !== 1} userId={userId} isOtEnabled={isOtEnabled} />;
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
                      <DatePickerWrapper name="month" label="Month" maxDate={dayjs()} views={["year", "month"]} />
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
                                    {dayjs(emp?.createdAt).format("dddd, DD MMMM YYYY")}
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
                                  <AccessTimeIcon sx={{ width: "15px", color: theme.palette.text.secondary }} />
                                  <Typography variant="caption" fontWeight={"bold"}>
                                    First-In {dayjs(emp.createdAt).format("hh:mm:ss a")}
                                  </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <AccessTimeIcon sx={{ width: "15px", color: theme.palette.text.secondary }} />
                                  <Typography variant="caption" fontWeight={"bold"}>
                                    Last-Out {emp.endedAt ? (emp.endedAt === emp.createdAt ? "" : dayjs(emp.endedAt).format("hh:mm:ss a")) : "-"}
                                  </Typography>
                                </Box>
                              </Stack>
                              <Stack direction={"row"} justifyContent={"space-between"}>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Typography variant="caption" fontWeight={"bold"}>
                                    Worked :
                                    {(() => {
                                      const totalMinutes = dayjs(emp?.endedAt).diff(dayjs(emp?.createdAt), "minute", false);
                                      const hours = Math.floor(totalMinutes / 60);
                                      const minutes = totalMinutes % 60;
                                      return `${hours}h ${minutes}m`;
                                    })()}
                                  </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={1}>
                                  {isOtEnabled &&
                                    (emp.approvalState === "PENDING" && emp.otHrs > 0 ? (
                                      <Typography variant="caption" color={theme.palette.warning.main} fontWeight={"bold"}>
                                        OT : {emp.otHrs}h - pending
                                      </Typography>
                                    ) : (
                                      <Typography variant="caption" fontWeight={"bold"}>
                                        OT : {emp.otHrs}h
                                      </Typography>
                                    ))}
                                </Box>
                              </Stack>
                            </Stack>
                            {isOpen === emp.id && <MobileAttandaceList employee={emp} open={isOpen === emp.id} userId={userId ? userId : "@me"} />}
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

export default EmployeeProfileAttendanceList;

function MobileAttandaceList(props: { employee; userId; open }) {
  const { employee, userId, open } = props;
  const theme: any = useTheme();
  const [countDate, setCountDate] = useState(0);
  const [pageDate] = useState(0);
  const [rowsPerPageDate] = useState(50);

  const listDateItems = useQuery({
    queryKey: [
      "attendanceRecords",
      rowsPerPageDate,
      pageDate,
      userId ? userId : "@me",
      dayjs(employee?.createdAt).startOf("day").toISOString(),
      dayjs(employee?.createdAt).endOf("day").toISOString(),
    ],
    queryFn: () =>
      listAttendanceRecords({
        pageSize: rowsPerPageDate,
        page: pageDate,
        userId: userId,
        createdFrom: dayjs(employee?.createdAt).startOf("day").toISOString(),
        createdTo: dayjs(employee?.createdAt).endOf("day").toISOString(),
        joinProjectAssignment: true,
      }),
    enabled: open,
    select: (res) => res.data,
  });

  if (listDateItems.data?.totalCount && listDateItems.data.totalCount !== countDate) {
    setCountDate(listDateItems.data.totalCount);
  }

  return (
    <Collapse in={open} timeout="auto" unmountOnExit>
      <Box sx={{ ml: 1, pl: 1 }}>
        {listDateItems.data?.data?.length &&
          !listDateItems.isFetching &&
          listDateItems.data?.data?.map((item, index) => (
            <Stack
              key={index}
              direction={"column"}
              sx={{
                p: 1,
                mb: 1,
                backgroundColor: theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Typography variant="caption" fontWeight={"bold"}>
                  IN: {dayjs(item.createdAt).format("hh:mm:ss a")}
                </Typography>
                <Typography variant="caption" fontWeight={"bold"}>
                  OUT: {item.endedAt ? dayjs(item.endedAt).format("hh:mm:ss a") : "Still cheked-In"}
                </Typography>
                {/* <Chip color={statusMap[item.approvalState].color} label={statusMap[item.approvalState].label} size="small" /> */}
              </Stack>
              <Stack>
                <Box display="flex" alignItems="center" gap={1}>
                  <WorkOutlineIcon sx={{ width: "15px", color: theme.palette.secondary.main }} />
                  <Typography variant="caption" fontWeight={"bold"}>
                    {item.projectAssignment?.project?.name ?? ""}
                  </Typography>
                </Box>
              </Stack>
              <Stack>
                <Typography variant="caption" fontWeight={"bold"}>
                  {item.comment}
                </Typography>
              </Stack>
            </Stack>
          ))}
        {!listDateItems.data?.data?.length && !listDateItems.isFetching && <EmptyResult />}
        {listDateItems.isFetching && (
          <Grid container spacing={1}>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Skeleton variant="rectangular" height={20} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton variant="rectangular" height={20} />
            </Grid>
            <Grid item xs={12}>
              <Skeleton variant="rectangular" height={20} />
            </Grid>
          </Grid>
        )}
      </Box>
    </Collapse>
  );
}
