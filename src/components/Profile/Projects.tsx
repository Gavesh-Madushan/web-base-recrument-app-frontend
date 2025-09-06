import React, { useEffect, useMemo, useState } from "react";
import { getProjectEmployeeAssignments } from "../../assets/api";
import { getState } from "../../redux/actions/actions";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { isBrowser, isTablet, isMobile } from "react-device-detect";

// mui
import {
  Box,
  Chip,
  Grid,
  IconButton,
  List,
  ListItem,
  Skeleton,
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
import { useTheme } from "@mui/material/styles";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";

// custom components
import Spinner from "../../utils/ui-components/Spinner";
import MainCard from "../../utils/ui-components/MainCard";
import EmptyResult from "../../utils/ui-components/EmptyResult";
import PageHeaders from "../../utils/ui-components/PageHeaders";

// mui icons
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import VisibilityIcon from "@mui/icons-material/Visibility";
import WorkIcon from "@mui/icons-material/Work";
import HomeIcon from "@mui/icons-material/Home";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ViewEditDialog from "../../utils/ui-components/ViewEditDialog";
import MapComponent from "../../utils/ui-components/Map";
import MapIcon from "@mui/icons-material/Map";

const statusMap = {
  ONGOING: { label: "Ongoing", color: "success" },
  COMPLETED: { label: "Completed", color: "info" },
  PENDING: { label: "Pending", color: "warning" },
} as const;

function EmployeeProjectList() {
  const theme: any = useTheme();
  const { id } = useParams();
  const authState = useSelector((state: any) => state.auth.authData);
  const user = getState(authState);
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [projects, setProjects] = useState<
    {
      id: number;
      jobName: string;
      isOutstation: boolean;
      address: string;
      location: {
        latitude: number;
        longitude: number;
      } | null;
      status: string;
    }[]
  >([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchEmployeeProjects();
  }, [page, rowsPerPage]);

  const fetchEmployeeProjects = () => {
    setIsLoading(true);
    const data = {
      pageSize: rowsPerPage,
      page: page,
      userId: user?.roleId === 5 ? undefined : Number(id) || 1,
    };
    getProjectEmployeeAssignments(data)
      .then((response) => {
        if (response.data) {
          setProjects(
            response.data.data.map((project) => ({
              id: project.projectId,
              jobName: project.project?.name || "",
              isOutstation: project.project?.isOutstation || false,
              address: project.project?.address || "",
              location: project.project
                ? {
                    latitude: project.project?.location[0],
                    longitude: project.project?.location[1],
                  }
                : null,
              status: project.project?.processingState || "PENDING",
            }))
          );
          setCount(response?.data?.totalCount || count);
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

  const dialog = useMemo(
    () =>
      ViewEditDialog(MapView)({
        open: open,
        setOpen: setOpen,
        dialogTitle: "Project Location",
        initialItem: {},
        fetchData: () => {},
        initialData: {
          location: location,
        },
        theme: theme,
        maxWidth: "md",
      }),
    [open]
  );

  return (
    <Grid container spacing={1}>
      {user?.roleId === 5 && (
        <Grid item xs={12}>
          <PageHeaders HeaderIcon={<WorkIcon />} headerTitle={"Projects"} breadCrumb={false} />
        </Grid>
      )}
      <Grid item container xs={12}>
        {isBrowser && (
          <Grid item lg={12} md={7} sm={12} xs={12}>
            <MainCard>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell width={60} />
                    <TableCell>Project Name</TableCell>
                    <TableCell align="center">Outstation</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.map((job, index) => {
                    const { label, color } = statusMap[job.status] ?? {
                      label: "Unknown",
                      color: "default",
                    };
                    return (
                      <TableRow key={index}>
                        <TableCell sx={{ backgroundColor: theme.palette.primary.light }}>
                          <Tooltip title="View">
                            <IconButton aria-label="view" color="primary" onClick={() => {}}>
                              <VisibilityIcon
                                fontSize="inherit"
                                color="primary"
                                // sx={{color: 'Background'}}
                              />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                        <TableCell>{job.jobName}</TableCell>
                        <TableCell align="center">
                          {job.isOutstation ? <CheckBoxIcon color={"action"} /> : <CheckBoxOutlineBlankIcon color="disabled" />}
                        </TableCell>
                        <TableCell align="center">
                          <Chip color={color} label={label} size="small" />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {!projects?.length && !isLoading ? (
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
              {/* </TableContainer> */}
            </MainCard>
          </Grid>
        )}
        {(isTablet || isMobile) && (
          <Grid container justifyContent={"center"}>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              {!projects?.length && !isLoading ? (
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
            </Grid>
            <Grid item xl={7} lg={8} md={10} xs={12}>
              {projects.map((project, index) => {
                const { label, color } = statusMap[project?.status] ?? {
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
                        border: `1px solid ${project?.isOutstation ? theme.palette.secondary.main : theme.palette.primary.main}`,
                        borderLeft: `10px solid ${project?.isOutstation ? theme.palette.secondary.main : theme.palette.primary.main}`,
                      }}
                    >
                      <Grid container direction={"row"}>
                        <Grid item xs={7}>
                          <Typography fontWeight={"bold"} variant="caption">
                            Project ID: {project?.id}
                          </Typography>
                          <Box display="flex" alignItems="center" sx={{ mt: 0.5 }}>
                            <WorkIcon color="secondary" />
                            <Typography color="secondary" variant="h4" fontWeight={"bold"} sx={{ ml: 1 }}>
                              {project?.jobName}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center">
                            <HomeIcon color="secondary" />
                            <Typography color="secondary" sx={{ ml: 1 }}>
                              {project?.isOutstation ? "Outstation" : "Local"}
                            </Typography>
                          </Box>
                        </Grid>

                        {/* check in */}
                        <Grid item xs={5}>
                          <Stack direction="column" alignItems={"flex-end"}>
                            <Chip color={color} label={label} size="small" />
                            <IconButton
                              onClick={() => {
                                setLocation([
                                  {
                                    lat: project.location?.latitude || 0,
                                    lng: project.location?.longitude || 0,
                                    name: project?.address || "",
                                  },
                                ]);
                                setOpen(true);
                              }}
                            >
                              <MapIcon fontSize="large" color="secondary" />
                            </IconButton>
                          </Stack>
                        </Grid>
                        <Grid item xs={12}>
                          <Box display="flex" alignItems="center">
                            <LocationOnIcon color="secondary" />
                            <Typography color="secondary" sx={{ ml: 1 }}>
                              {project?.address}
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
    </Grid>
  );
}

export default EmployeeProjectList;

const MapView = (prop) => {
  return (
    <Grid container>
      <Grid item xs={12} sx={{ minHeight: "50vh" }}>
        <MapComponent searchLocation={false} zoom={8} locations={[]} arias={prop.initialData.location} ariaCircleSize={1} />
      </Grid>
    </Grid>
  );
};
