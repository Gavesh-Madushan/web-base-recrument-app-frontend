import { useTheme } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

// mui
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Grid,
  IconButton,
  LinearProgress,
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
import MainCard from "../../../utils/ui-components/MainCard";
import EmptyResult from "../../../utils/ui-components/EmptyResult";
import Spinner from "../../../utils/ui-components/Spinner";

// mui icon
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useMutation, useQuery } from "@tanstack/react-query";
import { approveClockRecord, listAttendanceRecords, listClockRecords } from "../../../assets/api";
import { UploadService } from "../../../assets/_services/upload-service";
import { openSuccessDialog } from "../../../utils/ui-components/pop-ups/SuccessDialog";
// import { approveAtatndaceRecord } from "../../../assets/api";
// import { openSuccessDialog } from "../../../utils/ui-components/pop-ups/SuccessDialog";

function Row(props: { clockRecord; refetch; access: string }) {
  const { clockRecord, refetch, access } = props;
  const [open, setOpen] = useState(false);
  const theme: any = useTheme();
  const [avatar, setAvatar] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (clockRecord?.user?.profilePicturePath) {
      getAvatar();
    }
  }, []);

  const getAvatar = async () => {
    const fileSrc: any = await UploadService.getFile(clockRecord?.user?.profilePicturePath);
    setAvatar(URL.createObjectURL(fileSrc));
  };

  const listAttandaceRecords = useQuery({
    queryKey: ["attendanceRecords", 50, 0, clockRecord?.userId, clockRecord?.createdAd, clockRecord?.endedAd],
    queryFn: () =>
      listAttendanceRecords({
        pageSize: 50,
        page: 0,
        userId: clockRecord?.userId,
        createdFrom: clockRecord?.createdAd,
        createdTo: clockRecord?.endedAd,
        joinProjectAssignment: true,
      }),
    enabled: open,
    select: (res) => res.data,
  });

  const approveAttandance = useMutation({
    mutationFn: approveClockRecord,
  });

  return (
    <React.Fragment>
      <TableRow
        sx={{ cursor: "pointer" }}
        onClick={() => {
          setOpen(!open);
        }}
      >
        <TableCell width={50} sx={{ cursor: "default" }}>
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
        <TableCell align="center">
          <Typography>{dayjs(clockRecord?.createdAt).format("DD - MMMM - YYYY")}</Typography>
        </TableCell>
        <TableCell>
          <Stack alignItems={"center"} direction={"row"} spacing={2}>
            <Avatar key={clockRecord?.id} src={avatar} />
            <Stack direction={"column"}>
              <Typography>{clockRecord?.user?.employeeNumber}</Typography>
              <Typography variant="caption">{clockRecord?.user?.nameInitials}</Typography>
            </Stack>
          </Stack>
        </TableCell>
        <TableCell align="center">
          <Typography>{dayjs(clockRecord?.createdAt).format("hh:mm:ss a")}</Typography>
        </TableCell>
        <TableCell align="center">
          <Typography>{dayjs(clockRecord?.endedAt).format("hh:mm:ss a")}</Typography>
        </TableCell>
        <TableCell align="center">{clockRecord?.otHrs}</TableCell>
        {clockRecord.approvalState === "PENDING" && access[2] === "1" && (
          <TableCell align="center">
            <Button
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading && <CircularProgress size={20} />}
              onClick={() => {
                setIsLoading(true);
                approveAttandance.mutate(clockRecord?.id, {
                  onSuccess: () => {
                    setIsLoading(false);
                    openSuccessDialog("Success", `Overtime record updated successfully.`);
                    refetch();
                  },
                  onError: () => {
                    setIsLoading(false);
                  },
                });
              }}
            >
              Approve
            </Button>
          </TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={clockRecord.approvalState === "PENDING" ? 7 : 6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ py: 1, pl: 1 }}>
              {!listAttandaceRecords?.isFetching ? (
                <Table size="small">
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Typography fontWeight={"bold"} color={theme.palette.text.secondary}>
                          Check In
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={"bold"} color={theme.palette.text.secondary}>
                          Check Out
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={"bold"} color={theme.palette.text.secondary}>
                          Project
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={"bold"} color={theme.palette.text.secondary}>
                          Comment
                        </Typography>
                      </TableCell>
                    </TableRow>
                    {listAttandaceRecords.isFetched &&
                      !!listAttandaceRecords?.data?.data?.length &&
                      listAttandaceRecords?.data?.data?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{dayjs(item.createdAt).format("hh:mm:ss a")}</TableCell>
                          <TableCell>{dayjs(item.endedAt).format("hh:mm:ss a")}</TableCell>
                          <TableCell>{item?.projectAssignment?.project?.name}</TableCell>
                          <TableCell>{item?.comment}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              ) : (
                <LinearProgress />
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function JobAttendanceList(props: {
  search: {
    createdFrom: Dayjs;
    createdTo: Dayjs;
    division: number | string;
    approveStatus: "APPROVED" | "PENDING" | "REJECTED";
  };
  access: string;
  division?: number;
}) {
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const listItems = useQuery({
    queryKey: [
      "clockRecords",
      rowsPerPage,
      page,
      props.search.createdFrom.toISOString(),
      props.search.createdTo.toISOString(),
      true,
      true,
      props.search.approveStatus,
    ],
    queryFn: () =>
      listClockRecords({
        pageSize: rowsPerPage,
        page: page,
        createdFrom: props.search.createdFrom.toISOString(),
        createdTo: props.search.createdTo.toISOString(),
        joinUser: true,
        hasOtHrs: true,
        approvalStatus: props.search.approveStatus,
        divisionId: props.division,
      }),
    enabled: true,
    select: (res) => res.data,
  });

  if (listItems.data?.totalCount && listItems.data.totalCount !== count) {
    setCount(listItems.data.totalCount);
  }

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
            {/* <TableContainer component={Paper}> */}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell align="center">Date</TableCell>
                  <TableCell>Employee</TableCell>
                  <TableCell align="center">First Check In</TableCell>
                  <TableCell align="center">Last Check Out</TableCell>
                  <TableCell align="center">Ot Hours</TableCell>
                  {props.search.approveStatus === "PENDING" && props.access[2] === "1" && <TableCell />}
                </TableRow>
              </TableHead>
              <TableBody>
                {!listItems.isFetching &&
                  listItems?.data?.data.map((clockRecord) => {
                    return <Row key={clockRecord.id} clockRecord={clockRecord} access={props.access} refetch={listItems.refetch} />;
                  })}
              </TableBody>
            </Table>
            {!listItems?.data?.data?.length && !listItems.isFetching ? (
              <EmptyResult />
            ) : listItems.isFetching ? (
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
            {/* </TableContainer> */}
          </MainCard>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default JobAttendanceList;
