import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import type { SxProps } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import dayjs from "dayjs";
import MainCard from "../../utils/ui-components/MainCard";
import EmptyResult from "../../utils/ui-components/EmptyResult";
import Spinner from "../../utils/ui-components/Spinner";
import { Grid, Skeleton, Stack, TableContainer, TablePagination, Typography } from "@mui/material";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import SelectWrapper from "../../utils/ui-components/FormsUI/Select";
import { useQuery } from "@tanstack/react-query";
import { convert_to_proper_case } from "../../utils/utils";
import { useTheme } from "@mui/material/styles";

export interface Order {
  id: string;
  customer: { name: string };
  amount: number;
  status: string;
  lastCheckIn: Date;
  lastCheckOut: Date;
  job: string;
  location: string;
}

export interface RecentBatches {
  sx?: SxProps;
  loading?: boolean;
  auth: any;
}

export function DashboardDaliyLeaves({ sx, auth }: RecentBatches): React.JSX.Element {
  const theme: any = useTheme();

  const role = auth?.roleId;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [filterVlaues, setFilterValues] = useState<{ division: string }>({
    division: "ALL",
  });
  const [todayAttandace, setTodayAttandace] = useState<
    {
      id: number;
      type: "ANNUAL" | "MEDICAL" | "CASUAL" | "DAY_OFF";
      period: "ONE_DAY" | "HALF_DAY_MORNING" | "HALF_DAY_AFTERNOON";
      userId: number;
      nameInitials: string;
      employeeNumber: string;
      status: "PENDING" | "APPROVED" | "REJECTED";
    }[]
  >([]);
  // const [projectLocations, setProjectLocations] = useState<{ lat: number; lng: number; name: string }[]>([]);
  // const [attandaceLocations, setAttandaceLocations] = useState<{ lat: number; lng: number; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const listDivision: any = () => {};

  useEffect(() => {
    fetchLeaveRequestList(filterVlaues);
  }, [page, rowsPerPage, filterVlaues]);

  const fetchLeaveRequestList = (searchValue) => {
    setLoading(true);
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
      <Grid item xl={12} lg={12} md={12} xs={12}>
        <MainCard sx={sx} title="Leaves">
          <Grid container spacing={1}>
            {(role === 1 || role === 3 || role === 4) && (
              <Grid item xs={12}>
                <Formik
                  initialValues={{
                    division: "ALL",
                  }}
                  validationSchema={Yup.object().shape({
                    division: Yup.string().notRequired(),
                  })}
                  onSubmit={(values: { division: string }) => {
                    setFilterValues(values);
                  }}
                >
                  {({ setFieldValue }) => (
                    <Form>
                      <Grid container spacing={1} justifyContent={"flex-end"}>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                          {!listDivision.isFetching ? (
                            <SelectWrapper
                              customHandleChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                setFieldValue("division", e.target.value);
                                setFilterValues({
                                  division: e.target.value,
                                });
                              }}
                              name={"division"}
                              label="Division"
                              disabled={listDivision.isFetching}
                              options={[{ value: "ALL", label: "All" }, ...(listDivision?.data || [])]}
                            />
                          ) : (
                            <Skeleton variant="rounded" height={34} sx={{ mt: 1 }} />
                          )}
                        </Grid>
                        {/* <Grid item>
                          <Button color="primary" variant="contained" sx={{ ...theme.typography.customInput }} type="submit">
                            View
                          </Button>
                        </Grid> */}
                      </Grid>
                    </Form>
                  )}
                </Formik>
              </Grid>
            )}
            <Grid item xs={12}>
              <Box sx={{ overflowX: "auto" }}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Employee</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Period</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {todayAttandace?.length && !listDivision.isFetching && !loading
                        ? todayAttandace.map((leave) => {
                            return (
                              <TableRow hover key={leave.id}>
                                <TableCell>
                                  <Stack direction={"column"}>
                                    <Typography>{leave.employeeNumber}</Typography>
                                    <Typography variant="caption">{leave.nameInitials}</Typography>
                                  </Stack>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="caption">{convert_to_proper_case(leave.type)}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="caption">{convert_to_proper_case(leave.period)}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="caption"
                                    fontWeight={"bold"}
                                    color={
                                      leave?.status === "APPROVED"
                                        ? theme.palette.success.dark
                                        : leave?.status === "PENDING"
                                          ? theme.palette.warning.dark
                                          : leave?.status === "REJECTED"
                                            ? theme.palette.error.main
                                            : theme.palette.grey[100]
                                    }
                                  >
                                    {convert_to_proper_case(leave?.status)}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        : null}
                    </TableBody>
                  </Table>
                  {!todayAttandace?.length && !listDivision.isFetching && !loading ? (
                    <EmptyResult />
                  ) : listDivision.isFetching || loading ? (
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
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[]}
                  component="div"
                  count={count}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </Box>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
    </Grid>
  );
}
