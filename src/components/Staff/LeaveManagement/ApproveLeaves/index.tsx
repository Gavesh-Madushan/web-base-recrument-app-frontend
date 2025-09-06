import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SET_BREADCRUMBS } from "../../../../redux/actions/actions";
import dayjs, { Dayjs } from "dayjs";

// mui
import {
  Avatar,
  Box,
  Button,
  // Chip,
  CircularProgress,
  Grid,
  IconButton,
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

// custom component
import MainCard from "../../../../utils/ui-components/MainCard";
import EmptyResult from "../../../../utils/ui-components/EmptyResult";
import Spinner from "../../../../utils/ui-components/Spinner";

// mui icon
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { closeConfirmDialog, openConfirmDialog } from "../../../../utils/ui-components/pop-ups/ConfirmDialog";
import { closeConfirmWithCommentDialog, openConfirmWithCommentDialog } from "../../../../utils/ui-components/pop-ups/ConfirmWithCommentDialog";
import { approveLeave, getLeaveRequest, listLeaveRequests } from "../../../../assets/api";
import { convert_to_proper_case } from "../../../../utils/utils";
import DownloadIcon from "@mui/icons-material/Download";
import { isMobile } from "react-device-detect";
import { useQueryClient } from "@tanstack/react-query";

// const statusMap = {
//   APPROVED: { label: "Approved", color: "success" },
//   REJECTED: { label: "Rejected", color: "error" },
//   PENDING: { label: "Pending", color: "warning" },
//   APPROVE1: { label: "Sup. Approved", color: "warning" },
// } as const;

function Row(props: { leave; access: string; fetchData: () => void; leaveTypes: { value: string; label: string }[] }) {
  const { leave } = props;
  const queryClient = useQueryClient();
  const theme: any = useTheme();
  const [isLoading, setIsLoading] = useState<"APPROVE" | "REJECT" | null>(null);
  const [isDownloading, setIsDownloading] = useState<number[]>([]);

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

  return (
    <React.Fragment>
      <TableRow>
        {props.access[4] === "1" && (
          <TableCell
            width={50}
            sx={{
              backgroundColor: theme.palette.primary.light,
              cursor: "default",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Stack direction="row" spacing={1}>
              <Tooltip title="Approve">
                <span>
                  <IconButton
                    aria-label="view"
                    color="primary"
                    disabled={isLoading !== null}
                    sx={{ p: 0 }}
                    onClick={() => {
                      openConfirmDialog("Approve Leave", "Are you sure you want to accept this leave", {}, () => {
                        setIsLoading("APPROVE");
                        closeConfirmDialog();
                        approveLeave([
                          {
                            id: leave.id,
                            approvalState: "APPROVED",
                            comment: null,
                          },
                        ])
                          .then((response) => {
                            if (response.status === 204) {
                              setIsLoading(null);
                              props.fetchData();
                            }
                          })
                          .finally(() => setIsLoading(null));
                      });
                    }}
                  >
                    {isLoading === "APPROVE" ? <CircularProgress size={17} /> : <TaskAltIcon color="success" />}
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Reject">
                <IconButton
                  aria-label="view"
                  sx={{ p: 0 }}
                  color="primary"
                  disabled={isLoading !== null}
                  onClick={() => {
                    openConfirmWithCommentDialog("Reject Leave", "Are you sure you want to reject this leave", {}, (data: any, values: any) => {
                      setIsLoading("REJECT");
                      closeConfirmWithCommentDialog();
                      approveLeave([
                        {
                          id: leave.id,
                          approvalState: "REJECTED",
                          comment: values.comment === "" ? null : values.comment,
                        },
                      ])
                        .then((response) => {
                          if (response.status === 204) {
                            setIsLoading(null);
                            props.fetchData();
                          }
                        })
                        .finally(() => setIsLoading(null));
                    });
                  }}
                >
                  {isLoading === "REJECT" ? <CircularProgress size={17} /> : <HighlightOffIcon color="error" />}
                </IconButton>
              </Tooltip>
            </Stack>
          </TableCell>
        )}
        <TableCell>
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
          <Typography>{dayjs(new Date(leave?.year, leave?.month, leave?.day)).format("DD MMM YYYY")}</Typography>
        </TableCell>
        {/* <TableCell>
          <Chip color={color} label={label} size="small" />
        </TableCell> */}
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
            {leave?.description ?? " - "}
          </Typography>
        </TableCell>
        <TableCell>
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
    </React.Fragment>
  );
}
export interface ApproveLeaveInterface {
  id: number | string;
  description: string;
}

function ApproveLeaveList(props: {
  access: string;
  leaveTypes: { value: string; label: string }[];
  search: {
    search: string;
    division: number;
    fromDate: Dayjs;
    toDate: Dayjs;
    leaveType: string;
  };
  role: number;
}) {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [leaves, setLeaves] = useState<any>([]);

  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setIsLoading(false);
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
          name: "Pending Leaves",
          path: null,
          bold: true,
          state: null,
        },
      ],
    });
  }, []);

  useEffect(() => {
    getPendingLeaves(props.search);
  }, [page, rowsPerPage, props.search]);

  const getPendingLeaves = (searchValue) => {
    setIsLoading(true);
    listLeaveRequests({
      // month: searchValue.fromDate.format("M") - 1,
      // year: searchValue.fromDate.format("YYYY"),
      startDate: searchValue.fromDate.startOf("day").toISOString(),
      toDate: searchValue.toDate.endOf("day").toISOString(),
      type: searchValue.leaveType === "ALL" ? undefined : searchValue.leaveType,
      page: page,
      pageSize: rowsPerPage,
      searchTerm: searchValue.search === "" ? undefined : searchValue.search,
      joinUser: true,
      division: searchValue.division === 0 ? undefined : Number(searchValue.division),
      ...(props.role === 2
        ? { emp1ApprovalState: "PENDING" }
        : props.role === 1
        ? { emp2ApprovalState: "PENDING", emp1ApprovalState: "APPROVED" }
        : { emp2ApprovalState: "PENDING" }),
    })
      .then((response) => {
        if (response.data) {
          setLeaves(response.data.data);
          setCount(response.data.totalCount || count);
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

  return (
    <Grid container spacing={1}>
      <Grid item lg={12} md={12} sm={12} xs={12} container>
        <Grid item xs={12}>
          <MainCard>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {props.access[4] === "1" && <TableCell width={50} />}
                    <TableCell>Employee</TableCell>
                    <TableCell>Designation</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Period</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Approved Status</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell></TableCell>
                    {/* <TableCell width={100}>Status</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaves.map((leave) => {
                    return (
                      <Row
                        key={leave.id}
                        leave={leave}
                        access={props.access}
                        leaveTypes={props.leaveTypes}
                        fetchData={() => {
                          getPendingLeaves(props.search);
                        }}
                      />
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
      </Grid>
      {<iframe id="ifrm" src="/test.html" width={"0px"} height={"0px"} style={{ visibility: "hidden" }}></iframe>}
    </Grid>
  );
}

export default ApproveLeaveList;
