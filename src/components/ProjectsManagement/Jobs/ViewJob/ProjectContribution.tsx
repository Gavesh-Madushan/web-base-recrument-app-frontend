import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Collapse,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EmptyResult from "../../../../utils/ui-components/EmptyResult";
import Spinner from "../../../../utils/ui-components/Spinner";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import { applyGlobalValidations } from "../../../../utils/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { downloadProjectContributionRecords, listProjectContributionRecords } from "../../../../assets/api";
import { Form, Formik } from "formik";
import * as Yup from "yup";
// import { gridSpacing } from "../../../../store/constants";
import DatePickerWrapper from "../../../../utils/ui-components/FormsUI/DatePicker";
import dayjs from "dayjs";
import { UploadService } from "../../../../assets/_services/upload-service";
import { isMobile } from "react-device-detect";

function ProjectContribution({ project }: any) {
  const date = dayjs();
  const theme: any = useTheme();
  const [initialMonth, setInitialMonth] = useState({
    fromDay: date.subtract(1, "month"),
    toDay: date,
  });
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const listItems = useQuery({
    queryKey: [
      "summaries/projects/projectContributionRecords",
      project.projectId,
      initialMonth.fromDay.startOf("day").toISOString(),
      initialMonth.toDay.endOf("day").toISOString(),
    ],
    queryFn: () =>
      listProjectContributionRecords({
        projectId: project.projectId,
        fromDay: initialMonth.fromDay.toISOString(),
        toDay: initialMonth.toDay.toISOString(),
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

  const downloadItems = useMutation({
    mutationKey: ["summaries/projects/projectContributionRecords/_download"],
    mutationFn: downloadProjectContributionRecords,
  });

  return (
    <Grid container spacing={1}>
      <Formik
        initialValues={{
          fromDay: date.subtract(1, "month"),
          toDay: date,
        }}
        validationSchema={applyGlobalValidations(
          Yup.object().shape({
            fromDay: Yup.date().required("Select a from date"),
            toDay: Yup.date()
              .required("Select a end date")
              .test("max-1-month", "The date range cannot exceed 1 month", function (value) {
                const { fromDay } = this.parent;
                if (!fromDay || !value) return true; // Skip validation if either date is missing
                return dayjs(value).diff(dayjs(fromDay), "month", true) <= 1;
              }),
          })
        )}
        onSubmit={async (values) => {
          setInitialMonth(values);
        }}
      >
        {({ values }) => (
          <Form>
            <Grid container spacing={1}>
              <Grid item sx={{ maxWidth: 160 }}>
                <DatePickerWrapper
                  name="fromDay"
                  label="From Date"
                  maxDate={values.toDay}
                  // views={["year", "month"]}
                  // sx={{ ...theme.typography.customInput }}
                />
              </Grid>
              <Grid item sx={{ maxWidth: 160 }}>
                <DatePickerWrapper
                  name="toDay"
                  label="To date"
                  maxDate={dayjs()}
                  // views={["year", "month"]}
                  // sx={{ ...theme.typography.customInput }}
                />
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" type="submit" sx={{ ...theme.typography.button }}>
                  View
                </Button>
              </Grid>
              <Grid item>
                <Button
                  color="primary"
                  variant="contained"
                  sx={{ ...theme.typography.button }}
                  type="button"
                  disabled={downloadItems.isPending || !listItems.data?.data?.length || listItems.isFetching}
                  startIcon={!isMobile && (downloadItems.isPending ? <CircularProgress color="inherit" size={20} /> : <DownloadIcon />)}
                  onClick={() => {
                    downloadItems.mutate(
                      {
                        projectId: project.projectId,
                        fromDay: initialMonth.fromDay.toISOString(),
                        toDay: initialMonth.toDay.toISOString(),
                      },
                      {
                        onSuccess: (res) => {
                          const url = window.URL.createObjectURL(
                            new Blob([res.data], {
                              type: res.headers["Content-Type"]?.toString() ?? "application/octet-stream",
                            })
                          );
                          const link = document.createElement("a");
                          link.href = url;
                          link.setAttribute(
                            "download",
                            `contribution-records-project:${project.projectName}-${dayjs().format("MMMM")}_${dayjs().format("YYYY")}.xlsx`
                          );
                          document.body.appendChild(link);
                          link.click();
                        },
                      }
                    );
                  }}
                >
                  {isMobile ? downloadItems.isPending ? <CircularProgress color="inherit" size={20} /> : <DownloadIcon /> : "Export"}
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
      <Grid item lg={12} sm={12} xs={12}>
        <Box sx={{ minHeight: 400, width: "100%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!listItems.isFetching &&
                listItems.data?.data?.map((contribution, index) => {
                  return <Row key={index} row={contribution} />;
                })}
            </TableBody>
          </Table>
          {!listItems.data?.data?.length && !listItems.isFetching ? (
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

          {/* <Grid container> */}
          <Grid item xs={12} justifyContent={"flex-end"}>
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
          </Grid>
          {/* </Grid> */}
        </Box>
      </Grid>
    </Grid>
  );
}

export default ProjectContribution;

function Row(props: { row: any }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {dayjs(row?.day).format("DD - dddd, MMMM YYYY")}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="subtitle1" color="secondary" gutterBottom component="div">
                Employees
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Employee No</TableCell>
                    <TableCell>Designation</TableCell>
                    <TableCell>Total Hours</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row?.users?.map((user, index) => (
                    <UserRow key={index} user={user} />
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function UserRow(props: { user: any }) {
  const { user } = props;
  const [profilePictureSrc, setProfilePictureSrc] = useState("");
  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(true);

  useEffect(() => {
    if (user?.profilePicturePath) {
      setIsLoadingImage(true);
      UploadService.getFile(user?.profilePicturePath).then((src: any) => {
        setProfilePictureSrc(URL.createObjectURL(src));
        setIsLoadingImage(false);
      });
    }
  }, [user?.profilePicturePath]);

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        <Stack alignItems={"center"} direction={"row"} spacing={2}>
          <Box width={40} height={40}>
            {user?.profilePicturePath && isLoadingImage ? (
              <Skeleton variant="circular" width="100%" height="100%" />
            ) : (
              <Avatar src={profilePictureSrc} />
            )}
          </Box>
          <Typography>{user?.nameInitials}</Typography>
        </Stack>
      </TableCell>
      <TableCell>{user.employeeNumber}</TableCell>
      <TableCell>{user.class}</TableCell>
      <TableCell align="right">{user.workHrs}</TableCell>
    </TableRow>
  );
}
