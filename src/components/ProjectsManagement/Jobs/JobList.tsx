import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SET_BREADCRUMBS } from "../../../redux/actions/actions";
import { ProjectService } from "../../../assets/_services/project-service";

// mui
import {
  Box,
  Chip,
  // Collapse,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  // Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";

// custom components
import MainCard from "../../../utils/ui-components/MainCard";
import EmptyResult from "../../../utils/ui-components/EmptyResult";
import Spinner from "../../../utils/ui-components/Spinner";

// mui icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import MapComponent from "../../../utils/ui-components/Map";

const statusMap = {
  ONGOING: { label: "Ongoing", color: "success" },
  COMPLETED: { label: "Completed", color: "error" },
  PENDING: { label: "Pending", color: "warning" },
} as const;

function JobList({ divisionType, search }: { divisionType: { value: number; label: string; count: number }; search: string }) {
  const theme: any = useTheme();
  const dispatch = useDispatch();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const { state } = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [projects, setProjects] = useState<
    {
      id: number;
      jobName: string;
      division: {
        id: number;
        name: string;
      };
      client: { id: number; name: string };
      isOutstation: boolean;
      address: string;
      location: {
        latitude: number;
        longitude: number;
      };
      status: string;
    }[]
  >([]);
  const [count, setCount] = useState(0);
  const [projectLoctions, setProjectLocations] = useState<{ lat: number; lng: number; name: string }[]>([]);

  useEffect(() => {
    dispatch({
      type: SET_BREADCRUMBS,
      payload: [
        { name: "Home", path: "/Dashboard", bold: false, state: null },
        {
          name: "Projects",
          path: null,
          bold: true,
          state: state,
        },
        divisionType.value !== 0
          ? {
              name: `${divisionType.label}`,
              path: null,
              bold: true,
              state: null,
            }
          : { name: "All", path: null, bold: true, state: null },
      ],
    });
    getActiveProjectLocations();
  }, []);

  useEffect(() => {
    fetchProjectList();
  }, [page, rowsPerPage, search]);

  const getActiveProjectLocations = () => {
    const data = {
      divisionId: divisionType.value === 0 ? undefined : divisionType.value,
      state: "ONGOING" as const,
      isOutstation: true,
    };
    ProjectService.getProjectList(data, page, rowsPerPage).then((response) => {
      if (response.isSuccess && response.data) {
        setProjectLocations(
          response.data.data.map((project) => ({
            name: project.name,
            lat: project.location[0],
            lng: project.location[1],
          }))
        );
      }
    });
  };

  const fetchProjectList = () => {
    setIsLoading(true);
    const data = {
      clientId: undefined,
      divisionId: divisionType.value === 0 ? undefined : divisionType.value,
      state: undefined,
      searchTerm: search === "" ? undefined : search,
    };
    ProjectService.getProjectList(data, page, rowsPerPage).then((response) => {
      if (response.isSuccess && response.data) {
        setProjects(
          response.data.data.map((project) => ({
            id: project.id,
            jobName: project.name,
            division: {
              id: project.divisionId,
              name: String(project.divisionId),
            },
            client: {
              id: project.clientId || 0,
              name: project.client?.businessName || "-",
            },
            isOutstation: project.isOutstation,
            address: "Address",
            location: {
              latitude: project.location[0],
              longitude: project.location[1],
            },
            status: project.processingState,
          }))
        );
        setCount(response?.data?.totalCount || count);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
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
      <Grid item lg={6} md={12} sm={12} xs={12}>
        <MainCard>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={"60px"} />
                  <TableCell sx={{ minWidth: "150px" }}>Project Name</TableCell>
                  <TableCell sx={{ minWidth: "150px" }}>Customer</TableCell>
                  <TableCell width={"80px"}>Outstation</TableCell>
                  <TableCell width={"90px"}>Status</TableCell>
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
                      <TableCell
                        sx={{
                          backgroundColor: theme.palette.primary.light,
                          cursor: "default",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Tooltip title="View">
                          <IconButton
                            aria-label="view"
                            color="primary"
                            onClick={() => {
                              navigate(`/project/jobs/${job?.id}`, { state: { data: job } });
                            }}
                          >
                            <VisibilityIcon fontSize="inherit" color="primary" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" fontWeight="bold">
                          {job.jobName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">{job.client.name}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        {job.isOutstation ? <CheckBoxIcon color={"action"} /> : <CheckBoxOutlineBlankIcon color="disabled" />}
                      </TableCell>
                      <TableCell>
                        <Chip color={color} label={label} size="small" />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

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
        </MainCard>
      </Grid>
      {!matchDownSM && (
        <Grid item lg={6} sx={{ minHeight: "50vh", maxHeight: "60vh", width: "100%" }}>
          <MapComponent
            searchLocation={true}
            currentLocationRadius={0}
            showCurrentLocation={false}
            zoom={8}
            centerLocation={[6.57508, 80.12142]}
            locations={projectLoctions}
            onMapClick={() => {}}
            onMarkerClick={() => {
              // alert(`You clicked on: ${location.name || `${location.lat}, ${location.lng}`}`);
            }}
          />
        </Grid>
      )}
    </Grid>
  );
}

export default JobList;
