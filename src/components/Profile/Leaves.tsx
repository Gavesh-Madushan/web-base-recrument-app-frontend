import { useTheme } from "@mui/material/styles";
import React, { useEffect, useMemo, useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { isBrowser, isTablet, isMobile } from "react-device-detect";
import dayjs, { Dayjs } from "dayjs";

// mui
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import DownloadIcon from "@mui/icons-material/Download";

// custom component
import MainCard from "../../utils/ui-components/MainCard";
import EmptyResult from "../../utils/ui-components/EmptyResult";
import Spinner from "../../utils/ui-components/Spinner";
import { useSelector } from "react-redux";
import { getState } from "../../redux/actions/actions";
import PageHeaders from "../../utils/ui-components/PageHeaders";

// mui icon
import Inventory2Icon from "@mui/icons-material/Inventory2";
import MonthlyPicker from "../../utils/ui-components/FormsUI/MonthlyPicker";
import SelectWrapper from "../../utils/ui-components/FormsUI/Select";
import { deleteLeaveByEmployee, getEmployee, getLeaveRequest, getLeaveRequestTypes, getMe, listLeaveRequests } from "../../assets/api";
import { convert_to_proper_case } from "../../utils/utils";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CommentIcon from "@mui/icons-material/Comment";
import { useParams } from "react-router-dom";
import ViewEditDialog from "../../utils/ui-components/ViewEditDialog";
import ApplyLeave from "./ApplyLeave";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { closeConfirmDialog, openConfirmDialog } from "../../utils/ui-components/pop-ups/ConfirmDialog";
import { openSuccessDialog } from "../../utils/ui-components/pop-ups/SuccessDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DatePickerWrapper from "../../utils/ui-components/FormsUI/DatePicker";

const statusMap = {
  APPROVED: { label: "Approved", color: "success" },
  REJECTED: { label: "Rejected", color: "error" },
  PENDING: { label: "Pending", color: "warning" },
  APPROVE1: { label: "Sup. Approved", color: "warning" },
} as const;

export interface LeaveInterface {
  id: number | string;
  type: string;
  period: string;
  date: Dayjs | null;
  discription: string;
}

const INITIAL_FORM_STATE: LeaveInterface = {
  id: "",
  type: "",
  period: "",
  date: dayjs(),
  discription: "",
};

function EmployeeLeaveList() {
  const theme: any = useTheme();
  const { id } = useParams();
  const authState = useSelector((state: any) => state.auth.authData);
  const user = getState(authState);
  const [isDownloading, setIsDownloading] = useState<number[]>([]);
  const [search, setSearch] = useState<{
    search: string;
    toDate: Dayjs;
    fromDate: Dayjs;
    leaveType: string;
  }>({
    search: "",
    toDate: dayjs(),
    fromDate: dayjs().subtract(1, "month"),
    leaveType: "ALL",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [leaves, setLeaves] = useState<
    {
      id: number;
      createdAt: string;
      leave_type: "ANNUAL" | "CASUAL" | "MEDICAL" | "DAY_OFF";
      period: "ONE_DAY" | "HALF_DAY_MORNING" | "HALF_DAY_AFTERNOON";
      date: string;
      approvalState1: "PENDING" | "APPROVED" | "REJECTED";
      approvalState2: "PENDING" | "APPROVED" | "REJECTED";
      description: string;
      comment: string;
    }[]
  >([]);

  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogTitle, setDialogTitle] = useState("");
  const [deleteLeaveId, setDeleteLeaveId] = useState(0);
  const queryClient = useQueryClient();

  const [initialItem, setInitialItem] = useState<LeaveInterface>(INITIAL_FORM_STATE);
  const [open, setOpen] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState<{ value: string; label: string }[]>([{ label: "All", value: "ALL" }]);

  useEffect(() => {
    getLeaveRequestTypes().then((response) => {
      if (response.data) {
        setLeaveTypes([
          { value: "ALL", label: "All" },
          ...response.data.map((item) => ({
            value: item,
            label: convert_to_proper_case(item),
          })),
        ]);
      }
    });
  }, []);

  const userDetails = useQuery({
    queryKey: ["userDetails", Number(id)],
    queryFn: () => getEmployee(Number(id)),
    enabled: id !== undefined,
  });

  const myDetails = useQuery({
    queryKey: ["userDetails"],
    queryFn: () => getMe(),
    enabled: id === undefined,
  });

  useEffect(() => {
    getLeaveRequestLIst(search);
  }, [page, rowsPerPage, search]);

  const getLeaveRequestLIst = (searchValue) => {
    setIsLoading(true);
    // if (id) {
    listLeaveRequests({
      startDate: searchValue.fromDate.startOf("day").toISOString(),
      toDate: searchValue.toDate.endOf("day").toISOString(),
      page: page,
      pageSize: rowsPerPage,
      userId: id ? Number(id) : "@me",
    })
      .then((response) => {
        if (response.data) {
          setLeaves(
            response.data.data.map((item) => ({
              id: item.id,
              createdAt: item.createdAt,
              leave_type: item.type,
              period: item.period,
              date: new Date(item.year, item.month, item.day).toISOString(),
              approvalState1: item.emp1ApprovalState,
              approvalState2: item.emp2ApprovalState,
              description: item.description || "",
              comment: item.comment || "",
            }))
          );
          setCount(response.data.totalCount || count);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickOpen = (dialogTitle: string, formState: LeaveInterface) => {
    setOpen(true);
    setDialogTitle(dialogTitle);
    setInitialItem(formState);
  };

  const deleteLeaveRequest = (data: { id: number }) => {
    closeConfirmDialog();
    deleteLeaveByEmployee(data.id)
      .then((response) => {
        if (response.status === 204) {
          setDeleteLeaveId(0);
          openSuccessDialog("Success", "Leave request deleted successfully");
          getLeaveRequestLIst(search);
        } else {
          setDeleteLeaveId(0);
        }
      })
      .finally(() => setDeleteLeaveId(0));
  };

  const dialog = useMemo(
    () =>
      ViewEditDialog(ApplyLeave)({
        open: open,
        setOpen: setOpen,
        dialogTitle: dialogTitle,
        initialItem: initialItem,
        fetchData: () => {
          getLeaveRequestLIst(search);
        },
        initialData: {
          leaveTypes: leaveTypes.filter((item) => item.value !== "ALL"),
        },
        theme: theme,
        maxWidth: "sm",
      }),
    [open]
  );

  const handleFetch = async (id) => {
    setIsDownloading([...isDownloading, id]);
    const res = await queryClient.fetchQuery({
      queryKey: ["leaveRequests", id],
      queryFn: () => getLeaveRequest(Number(id)),
    });

    const data = {
      id: res.data.id,
      userId: res.data.userId,
      divisionId: res.data.divisionId,
      createdAt: dayjs(res.data.createdAt).format("YYYY-MM-DD"),
      type: convert_to_proper_case(res.data.type),
      period: convert_to_proper_case(res.data.period),
      year: res.data.year,
      month: res.data.month,
      day: res.data.day,
      emp1ApprovalState: res.data.emp1ApprovalState,
      emp2ApprovalState: res.data.emp2ApprovalState,
      description: res.data.description,
      comment: res.data.comment,
      division: {
        name: res.data.division.name,
      },
      user: {
        class: convert_to_proper_case(res.data.user.designation),
        designation: res.data.user.class,
        employeeNumber: res.data.user.employeeNumber,
        nameInitials: res.data.user.nameInitials,
        remainingLeaveDaysAnnual: res.data.user.remainingLeaveDaysAnnual,
        entitledLeaveDaysAnnual: res.data.user.entitledLeaveDaysAnnual,
        remainingLeaveDaysMedical: res.data.user.remainingLeaveDaysMedical,
        entitledLeaveDaysMedical: res.data.user.entitledLeaveDaysMedical,
        remainingLeaveDaysCasual: res.data.user.remainingLeaveDaysCasual,
        entitledLeaveDaysCasual: res.data.user.entitledLeaveDaysCasual,
      },
      approvedBy: {
        class: res.data?.approvedBy?.class || "",
        employeeNumber: res.data.approvedBy?.employeeNumber || "",
        nameInitials: res.data.approvedBy?.nameInitials || "",
      },
    };
    const ifrm = document.getElementById("ifrm") as HTMLIFrameElement;
    // @ts-ignore
    ifrm.contentWindow?.generateContent(data);
    // @ts-ignore
    ifrm.contentWindow?.toPdf();
    setIsDownloading(isDownloading.filter((id) => id !== id));
  };

  return (
    <Grid container spacing={1}>
      {(isTablet || isMobile || user.roleId === 5) && (
        <Grid item xs={12}>
          <PageHeaders HeaderIcon={<Inventory2Icon />} headerTitle={"Leaves"} breadCrumb={false} />
        </Grid>
      )}
      <Grid item xs={12} container spacing={1}>
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              border: `1px solid ${theme.palette.success.dark}`,
              borderLeft: `5px solid ${theme.palette.success.dark}`,
              backgroundColor: theme.palette.background.paper,
              p: "10px 15px 10px 15px",
              borderRadius: 3,
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h4" color={"GrayText"}>
                  Anual Leaves
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" fontWeight={"bold"}>
                  Total
                </Typography>
                <Typography variant="body1" fontWeight={"bold"}>
                  {id ? userDetails.data?.data.entitledLeaveDaysAnnual : myDetails.data?.data?.entitledLeaveDaysAnnual}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" fontWeight={"bold"}>
                  Available
                </Typography>
                <Typography variant="body1" fontWeight={"bold"}>
                  {id ? userDetails.data?.data.remainingLeaveDaysAnnual : myDetails.data?.data?.remainingLeaveDaysAnnual}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              border: `1px solid ${theme.palette.warning.dark}`,
              borderLeft: `5px solid ${theme.palette.warning.dark}`,
              backgroundColor: theme.palette.background.paper,
              p: "10px 15px 10px 15px",
              borderRadius: 3,
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h4" color={"GrayText"}>
                  Casual Leaves
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" fontWeight={"bold"}>
                  Total
                </Typography>
                <Typography variant="body1" fontWeight={"bold"}>
                  {id ? userDetails.data?.data.entitledLeaveDaysCasual : myDetails.data?.data?.entitledLeaveDaysCasual}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" fontWeight={"bold"}>
                  Available
                </Typography>
                <Typography variant="body1" fontWeight={"bold"}>
                  {id ? userDetails.data?.data.remainingLeaveDaysCasual : myDetails.data?.data?.remainingLeaveDaysCasual}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box
            sx={{
              border: `1px solid ${theme.palette.blue.main}`,
              borderLeft: `5px solid ${theme.palette.blue.main}`,
              backgroundColor: theme.palette.background.paper,
              p: "10px 15px 10px 15px",
              borderRadius: 3,
            }}
          >
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Typography variant="h4" color={"GrayText"}>
                  Medical Leaves
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" fontWeight={"bold"}>
                  Total
                </Typography>
                <Typography variant="body1" fontWeight={"bold"}>
                  {id ? userDetails.data?.data.entitledLeaveDaysMedical : myDetails.data?.data?.entitledLeaveDaysMedical}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" fontWeight={"bold"}>
                  Available
                </Typography>
                <Typography variant="body1" fontWeight={"bold"}>
                  {id ? userDetails.data?.data.remainingLeaveDaysMedical : myDetails.data?.data?.remainingLeaveDaysMedical}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Divider textAlign="left">
          <Typography variant="caption" fontWeight={"bold"}>
            Leave History
          </Typography>
        </Divider>
      </Grid>
      <Grid item xs={12}>
        <Formik
          initialValues={{
            search: "",
            fromDate: dayjs().subtract(1, "month"),
            toDate: dayjs(),
            leaveType: "ALL",
          }}
          validationSchema={Yup.object().shape({
            userName: Yup.string().notRequired(),
            day: Yup.string().notRequired(),
            fromDate: Yup.date().nullable().required("Please Select a Date").typeError("please enter a valid date"),
            toDate: Yup.date().nullable().required("Please Select a date").typeError("please enter a valid dat"),
            leaveType: Yup.string().notRequired(),
          })}
          onSubmit={(values) => {
            setPage(0);
            setSearch(values);
          }}
        >
          {({ values }) => (
            <Form>
              <Grid container columnSpacing={1} justifyContent={"flex-end"}>
                <Grid item>
                  <DatePickerWrapper required name="fromDate" label={"From Date"} maxDate={values.toDate} />
                </Grid>
                <Grid item>
                  <DatePickerWrapper required name="toDate" label={"To Date"} minDate={values.fromDate} />
                </Grid>
                <Grid item xl={2} lg={3} md={4} sm={4} xs={6}>
                  <SelectWrapper label="Leave Type" name="leaveType" options={leaveTypes} customHandleChange={() => {}} />
                </Grid>
                <Grid item>
                  <Button color="primary" variant="contained" sx={{ ...theme.typography.button }} type="submit">
                    View
                  </Button>
                </Grid>
                {!id && (
                  <Grid item>
                    <Button
                      color="primary"
                      variant="contained"
                      sx={{ ...theme.typography.button }}
                      type="submit"
                      onClick={() => {
                        handleClickOpen(`Apply Leave`, INITIAL_FORM_STATE);
                      }}
                    >
                      Apply Leave
                    </Button>
                  </Grid>
                )}
              </Grid>
            </Form>
          )}
        </Formik>
      </Grid>
      {isBrowser && (
        <Grid item xs={12}>
          <MainCard>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {!id && <TableCell width={"50px"} />}
                    <TableCell width={"150px"}>Leave Type</TableCell>
                    <TableCell width={"150px"}>Date</TableCell>
                    <TableCell width={"150px"}>Period</TableCell>
                    <TableCell width={100}>Status</TableCell>
                    <TableCell align="center">discription</TableCell>
                    <TableCell width={"100px"} />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaves?.length > 0 &&
                    !isLoading &&
                    leaves.map((leave, index) => {
                      const { label, color } = statusMap[leave.approvalState2] ?? {
                        label: "Unknown",
                        color: "default",
                      };
                      return (
                        <TableRow key={index}>
                          {!id && (
                            <TableCell>
                              <Tooltip title="Delete Leave">
                                <span>
                                  <IconButton
                                    onClick={() =>
                                      openConfirmDialog(
                                        "Delete",
                                        `Are you sure you want to delete this leave request?`,
                                        {
                                          id: leave?.id,
                                        },
                                        (data) => {
                                          setDeleteLeaveId(data.id);
                                          deleteLeaveRequest(data);
                                        }
                                      )
                                    }
                                    disabled={
                                      ((leave?.approvalState1 === "APPROVED" || leave?.approvalState1 === "REJECTED") &&
                                        (leave?.approvalState2 === "APPROVED" || leave?.approvalState2 === "REJECTED")) ||
                                      deleteLeaveId !== 0
                                    }
                                  >
                                    {deleteLeaveId === leave?.id ? (
                                      <CircularProgress color="error" size="20px" />
                                    ) : (
                                      <DeleteForeverIcon color="error" />
                                    )}
                                  </IconButton>
                                </span>
                              </Tooltip>
                            </TableCell>
                          )}
                          <TableCell>
                            <Typography
                              variant="caption"
                              fontWeight={"bold"}
                              color={
                                leave?.leave_type === "ANNUAL"
                                  ? theme.palette.success.dark
                                  : leave?.leave_type === "CASUAL"
                                  ? theme.palette.warning.dark
                                  : leave?.leave_type === "MEDICAL"
                                  ? theme.palette.blue.main
                                  : theme.palette.primary.main
                              }
                            >
                              {convert_to_proper_case(leave.leave_type)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">{dayjs(leave.date).format("DD MMM YYYY")}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">{convert_to_proper_case(leave.period)}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip color={color} label={label} size="small" />
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="caption">{leave.description}</Typography>
                          </TableCell>
                          <TableCell>
                            {/* <ExportLeaveSubmission id={leave?.id} /> */}
                            <Button variant="contained" onClick={() => handleFetch(leave?.id)} disabled={isDownloading.includes(leave?.id)}>
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
              {!leaves?.length && !isLoading ? (
                <EmptyResult />
              ) : isLoading ? (
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
              ) : null}
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
            </TableContainer>
          </MainCard>
        </Grid>
      )}
      <Grid item xs={12}>
        {(isTablet || isMobile) && (
          <Grid container>
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
            {!leaves?.length && !isLoading ? (
              <EmptyResult />
            ) : isLoading ? (
              <Grid container justifyContent={"center"} spacing={1}>
                <Grid item xs={11}>
                  <Skeleton variant="rounded" height={"90px"} animation="wave" />
                </Grid>
                <Grid item xs={11}>
                  <Skeleton variant="rounded" height={"90px"} animation="wave" />
                </Grid>
                <Grid item xs={11}>
                  <Skeleton variant="rounded" height={"90px"} animation="wave" />
                </Grid>
              </Grid>
            ) : null}
            <Grid item xl={6} lg={8} md={10} xs={12}>
              {leaves.map((leave, index) => {
                const { label, color } = statusMap[leave?.approvalState2] ?? {
                  label: "Unknown",
                  color: "default",
                };
                return (
                  <List key={index}>
                    <ListItem
                      style={{
                        borderRadius: "10px",
                        padding: "20px",
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${
                          leave?.leave_type === "ANNUAL"
                            ? theme.palette.success.dark
                            : leave?.leave_type === "CASUAL"
                            ? theme.palette.warning.dark
                            : leave?.leave_type === "MEDICAL"
                            ? theme.palette.blue.main
                            : theme.palette.primary.main
                        }`,
                        borderLeft: `10px solid ${
                          leave?.leave_type === "ANNUAL"
                            ? theme.palette.success.dark
                            : leave?.leave_type === "CASUAL"
                            ? theme.palette.warning.dark
                            : leave?.leave_type === "MEDICAL"
                            ? theme.palette.blue.main
                            : theme.palette.primary.main
                        }`,
                      }}
                    >
                      <Grid container direction={"row"}>
                        <Grid item xs={7}>
                          <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                            <Typography color="secondary" variant="h4" fontWeight={"bold"}>
                              {convert_to_proper_case(leave?.leave_type)}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center">
                            <AccessTimeIcon color="secondary" sx={{ width: "15px" }} />
                            <Typography color="secondary" sx={{ ml: 1 }}>
                              {convert_to_proper_case(leave?.period)}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center">
                            <CalendarTodayIcon color="secondary" sx={{ width: "15px" }} />
                            <Typography color="secondary" sx={{ ml: 1 }}>
                              {dayjs(leave?.date).format("DD MMM YYYY")}
                            </Typography>
                          </Box>
                        </Grid>

                        {/* status */}
                        <Grid item xs={5} textAlign={"end"}>
                          <Stack direction="column" justifyItems={"space-between"} height={"100%"} justifyContent={"space-between"}>
                            <Box>
                              <Chip color={color} label={label} size="small" />
                            </Box>
                            <Stack direction={"row"} justifyContent={"flex-end"}>
                              {!id && (
                                <span>
                                  <IconButton
                                    onClick={() =>
                                      openConfirmDialog(
                                        "Delete",
                                        `Are you sure you want to delete this leave request?`,
                                        {
                                          id: leave?.id,
                                        },
                                        (data) => {
                                          setDeleteLeaveId(data.id);
                                          deleteLeaveRequest(data);
                                        }
                                      )
                                    }
                                    disabled={
                                      ((leave?.approvalState1 === "APPROVED" || leave?.approvalState1 === "REJECTED") &&
                                        (leave?.approvalState2 === "APPROVED" || leave?.approvalState2 === "REJECTED")) ||
                                      deleteLeaveId !== 0
                                    }
                                  >
                                    {deleteLeaveId === leave?.id ? (
                                      <CircularProgress color="error" size="20px" />
                                    ) : (
                                      <DeleteForeverIcon color="error" />
                                    )}
                                  </IconButton>
                                </span>
                              )}
                              <span>
                                <IconButton onClick={() => handleFetch(leave?.id)} disabled={isDownloading.includes(leave?.id)}>
                                  <DownloadIcon />
                                </IconButton>
                              </span>
                            </Stack>
                          </Stack>
                        </Grid>
                        <Grid item xs={12}>
                          <Box display="flex" alignItems="center">
                            <CommentIcon color="secondary" sx={{ width: "15px" }} />
                            <Typography color="secondary" sx={{ ml: 1 }}>
                              {leave?.description}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </ListItem>
                  </List>
                );
              })}
            </Grid>
          </Grid>
        )}
      </Grid>
      {dialog}
      {<iframe id="ifrm" src="/test.html" width={"0px"} height={"0px"} style={{ visibility: "hidden" }}></iframe>}
    </Grid>
  );
}

export default EmployeeLeaveList;
