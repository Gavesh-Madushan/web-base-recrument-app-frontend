import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SET_BREADCRUMBS } from "../../../../redux/actions/actions";
import dayjs, { Dayjs } from "dayjs";
import { isMobile } from "react-device-detect";

// mui
import {
  Avatar,
  Box,
  Button,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import DownloadIcon from "@mui/icons-material/Download";

// custom component
import MainCard from "../../../../utils/ui-components/MainCard";
import EmptyResult from "../../../../utils/ui-components/EmptyResult";
import Spinner from "../../../../utils/ui-components/Spinner";
import { getLeaveRequest, listLeaveRequests } from "../../../../assets/api";
import { convert_to_proper_case } from "../../../../utils/utils";
import { useQueryClient } from "@tanstack/react-query";
// import ExportLeaveSubmission from "../LeaveSubmission";

export function LeaveList(props: {
  leaveTypes: { value: string; label: string }[];
  search: {
    search: string;
    division: number;
    fromDate: Dayjs;
    toDate: Dayjs;
    leaveType: string;
  };
  tabValue: number;
  role: number;
}) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [leaves, setLeaves] = useState<any>([]);
  const theme: any = useTheme();
  const queryClient = useQueryClient();
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isDownloading, setIsDownloading] = useState<number[]>([]);

  useEffect(() => {
    dispatch({
      type: SET_BREADCRUMBS,
      payload: [
        { name: "Home", path: "/Dashboard", bold: false, state: null },
        {
          name: "Leaves",
          path: null,
          bold: true,
          state: null,
        },
        {
          name: `${props.tabValue === 0 ? "Approved" : "Rejected"} Leaves`,
          path: null,
          bold: true,
          state: null,
        },
      ],
    });
  }, []);

  useEffect(() => {
    fetchLeaveRequestList(props.search);
  }, [page, rowsPerPage, props.search]);

  const fetchLeaveRequestList = (searchValue) => {
    setIsLoading(true);

    listLeaveRequests({
      ...(props.role === 2
        ? {
            emp1ApprovalState: props.tabValue === 0 ? "APPROVED" : props.tabValue === 2 ? "REJECTED" : undefined,
          }
        : {
            emp2ApprovalState: props.tabValue === 0 ? "APPROVED" : props.tabValue === 2 ? "REJECTED" : undefined,
          }),
      type: searchValue.leaveType === "ALL" ? undefined : searchValue.leaveType,
      // month: searchValue.fromDate.format("M") - 1,
      // year: searchValue.fromDate.format("YYYY"),
      startDate: searchValue.fromDate.startOf("day").toISOString(),
      toDate: searchValue.toDate.endOf("day").toISOString(),
      page: page,
      pageSize: rowsPerPage,
      searchTerm: searchValue.search === "" ? undefined : searchValue.search,
      division: searchValue.division === 0 ? undefined : Number(searchValue.division),
      joinUser: true,
    })
      .then((response) => {
        if (response.data) {
          setLeaves(response.data.data);
          setCount(response.data.totalCount || count);
        }
      })
      .finally(() => setIsLoading(false));
  };

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

    ifrm.contentWindow?.generateContent(data);
    ifrm.contentWindow?.toPdf();
    setIsDownloading(isDownloading.filter((id) => id !== id));
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Grid container spacing={1}>
      {<iframe id="ifrm" src="/test.html" width={"0px"} height={"0px"} style={{ visibility: "hidden" }}></iframe>}
      <Grid item lg={12} md={12} sm={12} xs={12} container>
        <Grid item xs={12}>
          <MainCard>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Designation</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Period</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Approved Status</TableCell>
                    <TableCell>Comment</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!isLoading &&
                    leaves.length > 0 &&
                    leaves.map((leave, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ minWidth: "150px" }}>
                          <Stack alignItems={"center"} direction={"row"} spacing={2}>
                            <Avatar src={``} sx={{ width: 30, height: 30 }} />
                            <Stack direction={"column"}>
                              <Typography>{leave?.user?.employeeNumber || 0}</Typography>
                              <Typography variant="caption">{leave?.user?.nameInitials || ""}</Typography>
                            </Stack>
                          </Stack>
                        </TableCell>
                        <TableCell sx={{ minWidth: "150px" }}>{convert_to_proper_case(leave?.user?.class)}</TableCell>
                        <TableCell sx={{ minWidth: "80px" }}>
                          <Typography variant="caption" fontWeight={"bold"}>
                            {convert_to_proper_case(leave?.type)}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ minWidth: "100px" }}>
                          <Typography variant="caption" fontWeight={"bold"}>
                            {convert_to_proper_case(leave?.period)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ minWidth: "80px" }}>
                            {dayjs(new Date(leave?.year, leave?.month, leave?.day)).format("DD MMM YYYY")}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ minWidth: "160px" }}>
                          <Typography
                            variant="caption"
                            fontWeight={"bold"}
                            color={
                              leave?.emp1ApprovalState === "APPROVED"
                                ? theme.palette.success.dark
                                : leave?.emp1ApprovalState === "PENDING"
                                ? theme.palette.warning.dark
                                : leave?.emp1ApprovalState === "REJECTED"
                                ? theme.palette.error.main
                                : theme.palette.grey[100]
                            }
                          >
                            {convert_to_proper_case(leave?.emp1ApprovalState)}
                          </Typography>
                          {" / "}
                          <Typography
                            variant="caption"
                            fontWeight={"bold"}
                            color={
                              leave?.emp2ApprovalState === "APPROVED"
                                ? theme.palette.success.dark
                                : leave?.emp2ApprovalState === "PENDING"
                                ? theme.palette.warning.dark
                                : leave?.emp2ApprovalState === "REJECTED"
                                ? theme.palette.error.main
                                : theme.palette.grey[100]
                            }
                          >
                            {convert_to_proper_case(leave?.emp2ApprovalState)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption" fontWeight={"bold"}>
                            {leave?.comment ?? " -"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {/* <ExportLeaveSubmission id={leave?.id} /> */}
                          <Button
                            variant="outlined"
                            startIcon={!isMobile && <DownloadIcon />}
                            onClick={() => handleFetch(leave?.id)}
                            disabled={isDownloading.includes(leave?.id)}
                          >
                            {isMobile ? <DownloadIcon fontSize="medium" /> : "Export"}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
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
      </Grid>
    </Grid>
  );
}

export default LeaveList;
