import { useEffect, useState } from "react";
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
// import MapComponent from "../../utils/ui-components/Map";
// import { ProjectService } from "../../assets/_services/project-service";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useTheme } from "@emotion/react";
import SelectWrapper from "../../utils/ui-components/FormsUI/Select";
import { getDivisionList, listClockRecords } from "../../assets/api";
import { useQuery } from "@tanstack/react-query";

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

export function DashboardDaliyAttandace({ sx, auth }: RecentBatches): React.JSX.Element {
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
      empNo: string;
      empName: string;
      firstCheckIn: string;
      lastCheckIn: string;
      lastCheckout: string;
      project: string;
      location: number[];
    }[]
  >([]);
  // const [projectLocations, setProjectLocations] = useState<{ lat: number; lng: number; name: string }[]>([]);
  // const [attandaceLocations, setAttandaceLocations] = useState<{ lat: number; lng: number; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const listDivision = useQuery({
    queryKey: ["listDivision", 0, 50],
    queryFn: () => getDivisionList({}, 0, 50),
    enabled: role === 1 || role === 3 || role === 4,
    select(data) {
      return data.data.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
    },
    // placeholderData: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    getAttendance();
  }, [page, rowsPerPage, filterVlaues]);

  // useEffect(() => {
  //   getPrjectsByAttandaceLocation();
  // }, []);

  // const getPrjectsByAttandaceLocation = () => {
  //   getPrjectsByClockLocation(0, 50).then((response) => {
  //     if (response.data) {
  //       setProjectLocations(
  //         response.data.data.map((item) => ({
  //           lat: item.project.location[0],
  //           lng: item.project.location[1],
  //           name: item.project.name,
  //         }))
  //       );
  //       let attandace: { lat: number; lng: number; name: string }[] = [];
  //       response.data.data.map((item) => {
  //         attandace = [
  //           ...attandace,
  //           ...item.attendanceRecords.map((att) => ({
  //             lat: att.createdLocation[0],
  //             lng: att.createdLocation[1],
  //             name: "",
  //           })),
  //         ];
  //       });

  //       setAttandaceLocations(attandace);
  //     }
  //   });
  // };

  const getAttendance = () => {
    setLoading(true);
    listClockRecords({
      pageSize: rowsPerPage,
      page: page,
      divisionId: filterVlaues.division === "ALL" ? undefined : Number(filterVlaues.division),
      createdFrom: dayjs().startOf("day").toISOString(),
      createdTo: dayjs().endOf("day").toISOString(),
      joinUser: true,
      joinProjectAssignment: true,
    })
      .then((response) => {
        if (response.data) {
          const output = response.data.data.map((item) => ({
            id: item.id,
            empNo: item.user?.employeeNumber || "",
            empName: item.user?.nameInitials || "",
            firstCheckIn: item.createdAt,
            lastCheckIn: item?.attendanceRecords ? item?.attendanceRecords[0]?.createdAt || "" : "",
            lastCheckout: item?.attendanceRecords ? item?.attendanceRecords[0]?.endedAt || "" : "",
            project: item?.attendanceRecords ? item?.attendanceRecords[0]?.projectAssignment?.project?.name || "" : "",
            location: [],
          }));
          setTodayAttandace(output);
          setCount(response.data.totalCount || count);
        } else {
          setTodayAttandace([]);
        }
      })
      .finally(() => setLoading(false));
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
      {/* <Grid item xl={5} lg={5} md={12} xs={12} sx={{ minHeight: 500 }}>
        <MapComponent
          searchLocation={true}
          zoom={8}
          locations={attandaceLocations}
          arias={projectLocations}
          ariaCircleSize={1000}
        />
      </Grid> */}
      <Grid item xl={12} lg={12} md={12} xs={12}>
        <MainCard sx={sx} title="Today Attandance">
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
                        <Grid item sx={{ minWidth: "200px" }}>
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
                  <Table sx={{ minWidth: "500px" }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ minWidth: "150px" }}>Employee</TableCell>
                        <TableCell sx={{ minWidth: "135px" }}>First Check in</TableCell>
                        <TableCell sx={{ minWidth: "135px" }}>Last Check In</TableCell>
                        <TableCell sx={{ minWidth: "135px" }}>Last Check out</TableCell>
                        <TableCell sx={{ minWidth: "150px" }}>Project</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {todayAttandace?.length && !listDivision.isFetching && !loading
                        ? todayAttandace.map((order) => {
                            return (
                              <TableRow hover key={order.id}>
                                <TableCell>
                                  <Stack direction={"column"}>
                                    <Typography>{order.empNo}</Typography>
                                    <Typography variant="caption">{order.empName}</Typography>
                                  </Stack>
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="caption"
                                    fontWeight={"bold"}
                                    color={
                                      dayjs(order.firstCheckIn).isBefore(dayjs().startOf("day").add(9, "hour"))
                                        ? theme.palette.text.main
                                        : theme.palette.warning.dark
                                    }
                                  >
                                    {dayjs(order.firstCheckIn).format("MMM DD, hh:mm a")}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="caption" fontWeight={"bold"}>
                                    {order.lastCheckIn ? dayjs(order.lastCheckIn).format("MMM DD, hh:mm a") : ""}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="caption" fontWeight={"bold"}>
                                    {order.lastCheckout ? dayjs(order.lastCheckout).format("MMM DD, hh:mm a") : ""}
                                  </Typography>
                                </TableCell>
                                <TableCell>{order.project}</TableCell>
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
                  rowsPerPageOptions={[10, 25, 50]}
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
