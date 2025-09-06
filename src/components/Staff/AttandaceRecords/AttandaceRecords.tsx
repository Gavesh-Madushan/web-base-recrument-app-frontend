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
  // Chip,
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

// mui icon
import dayjs, { Dayjs } from "dayjs";
import EmptyResult from "../../../utils/ui-components/EmptyResult";
import Spinner from "../../../utils/ui-components/Spinner";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import { listAttendanceRecords } from "../../../assets/api";
import EditIcon from "@mui/icons-material/Edit";
import ViewEditDialog from "../../../utils/ui-components/ViewEditDialog";
import CreateAttandaceRecord from "./createAttandaceRecord";
import { EmployeeAttendanceInterface } from ".";

export interface ProductValues {
  id: number | string;
  productCode: string;
  brand: string;
  category: string;
  sku: number | string;
  description: string;
}

function AttendanceRecordsOnDate(props: {
  setDivisionType: (data: any) => void;
  setTableDataCount: (data: any) => void;
  divisionType: { value: number; label: string; count: number };
  search: {
    searchTerm: string;
    fromTime: Dayjs;
    toTime: Dayjs;
    // status: "APPROVED" | "REJECTED" | "PENDING";
  };
  access: string;
  role: number;
}) {
  const theme: any = useTheme();
  const dispatch = useDispatch();
  const { state } = useLocation();

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [initialItem, setInitialItem] = useState<EmployeeAttendanceInterface>({
    id: "",
    employeeId: "",
    divisionId: "",
    designation: "",
    checkin: dayjs(),
    checkout: dayjs().add(1, "hour"),
    project: "",
    comment: "",
  });

  const startOfMonth = props.search.fromTime.subtract(1, "month").date(22);
  const endOfMonth = props.search.toTime.date(21);

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
    queryKey: ["attendanceRecords", pageSize, page, props.divisionType?.value, props.search.fromTime, props.search.toTime, props.search.searchTerm],
    queryFn: () =>
      listAttendanceRecords({
        page,
        pageSize,
        joinUser: true,
        joinProjectAssignment: true,
        divisionId: props.divisionType.value === 0 ? undefined : props.divisionType.value,
        createdFrom: props.search.fromTime.toISOString(),
        createdTo: props.search.toTime.toISOString(),
        searchTerm: props.search.searchTerm === "" ? undefined : props.search.searchTerm,
      }),
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

  const dialog = useMemo(
    () =>
      ViewEditDialog(CreateAttandaceRecord)({
        open: open,
        setOpen: setOpen,
        dialogTitle: "Update Attendance Record",
        initialItem: initialItem,
        fetchData: () => {
          listItems.refetch();
        },
        initialData: {
          role: props.role,
        },
        theme: theme,
        maxWidth: "sm",
      }),
    [open]
  );

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
              <Box sx={{ overflowX: "auto" }}>
                <Table width="100%">
                  <TableHead>
                    <TableRow>
                      {props.access[2] === "1" && <TableCell />}
                      <TableCell>Employee</TableCell>
                      <TableCell>Designation</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Check-In</TableCell>
                      <TableCell>Check-Out</TableCell>
                      <TableCell>Project</TableCell>
                      <TableCell>Comment</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {!listItems.isFetching &&
                      listItems.data?.data?.map((record) => {
                        return (
                          <TableRow
                            key={record.id}
                            // sx={{ cursor: "pointer" }}
                            // onClick={() => {
                            //   setOpenId(openId === index ? null : index);
                            // }}
                          >
                            {props.access[2] === "1" && (
                              <TableCell sx={{ width: "50px" }}>
                                <Tooltip title="Edit">
                                  <IconButton
                                    aria-label="view"
                                    color="primary"
                                    onClick={() => {
                                      setInitialItem({
                                        id: record.id,
                                        employeeId: record.userId,
                                        divisionId: record.divisionId,
                                        designation: record.user?.designation || "",
                                        checkin: dayjs(record.createdAt),
                                        checkout: dayjs(record.endedAt),
                                        project: record.projectAssignmentId || "",
                                        comment: record.comment || "",
                                      });
                                      setOpen(true);
                                    }}
                                  >
                                    <EditIcon fontSize="inherit" color="primary" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            )}
                            <TableCell>
                              <Stack alignItems={"center"} direction={"row"} spacing={2}>
                                <Avatar src={``} sx={{ width: 30, height: 30 }} />
                                <Stack direction={"column"}>
                                  <Typography variant="caption">{record.user?.employeeNumber}</Typography>
                                  <Typography>{record.user?.nameInitials}</Typography>
                                </Stack>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Typography>{record?.user?.class}</Typography>
                            </TableCell>
                            <TableCell>{dayjs(record.createdAt).format("DD MMMM YYYY")}</TableCell>
                            <TableCell>{dayjs(record.createdAt).format("hh:mm:ss A")}</TableCell>
                            <TableCell>{record.endedAt ? dayjs(record.endedAt).format("hh:mm:ss A") : "-"}</TableCell>
                            <TableCell>{record.projectAssignment?.project.name ?? "-"}</TableCell>
                            <TableCell>{record.comment}</TableCell>
                          </TableRow>
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
      {dialog}
    </Grid>
  );
}

export default AttendanceRecordsOnDate;
