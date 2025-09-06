import { gridSpacing } from "../../../../store/constants";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SET_BREADCRUMBS } from "../../../../redux/actions/actions";
import { formatMobile } from "../../../../utils/utils";
import { useDispatch } from "react-redux";

// mui
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";

// custom components
import PageHeaders from "../../../../utils/ui-components/PageHeaders";
import MainCard from "../../../../utils/ui-components/MainCard";
// import ProjectStatusChart from "./ProjectStatusChart";
// import ClientJobList from "./ClientAllJob";

// mui icons
import CallIcon from "@mui/icons-material/Call";
import HomeIcon from "@mui/icons-material/Home";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import PersonIcon from "@mui/icons-material/Person";
import { ProjectService } from "../../../../assets/_services/project-service";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MapComponent from "../../../../utils/ui-components/Map";
import EditIcon from "@mui/icons-material/Edit";
import WorkIcon from "@mui/icons-material/Work";
// import { StaffService } from "../../../../assets/_services/staff-service";
// import { TabPanel } from "../../../../utils/cssStyles";
import TeamMembers from "./ProjectTeam";
import { closeConfirmDialog, openConfirmDialog } from "../../../../utils/ui-components/pop-ups/ConfirmDialog";
import { openSuccessDialog } from "../../../../utils/ui-components/pop-ups/SuccessDialog";
import { TabPanel } from "../../../../utils/cssStyles";
// import EmployeeAttendanceList from "../../../Staff/AttendanceSummery/AttendanceList";
// import dayjs from "dayjs";
// import { useMutation } from "@tanstack/react-query";
// import { downloadWorkBehaviorRecords } from "../../../../assets/api";
import ProjectContribution from "./ProjectContribution";

const statusMap = {
  ONGOING: { label: "Ongoing", color: "success" },
  COMPLETED: { label: "Closed", color: "error" },
  PENDING: { label: "Pending", color: "warning" },
  other: { label: "Unknown", color: "default" },
} as const;

function JobView(props: { access: string }) {
  const theme: any = useTheme();
  const { id } = useParams();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState<string>(state?.data?.jobName || "");
  const [projectDetails, setProjectDetails] = useState<{
    address: string;
    clientId: number | null;
    createdAt: string | null;
    description: string | null;
    divisionId: number;
    division: {
      name: string;
    };
    endedAt: string | null;
    id: number;
    isOutstation: boolean;
    location: number[];
    name: string;
    processingState: "PENDING" | "ONGOING" | "COMPLETED";
    startedAt: null | string;
  }>({
    address: "",
    clientId: 0,
    createdAt: "",
    description: "",
    divisionId: 0,
    division: {
      name: "",
    },
    endedAt: "",
    id: 0,
    isOutstation: false,
    location: [],
    name: "",
    processingState: "PENDING",
    startedAt: "",
  });
  const [isLoadingProject, setIsLoadingProject] = useState<boolean>(true);

  const [clienttDetails, setClientDetails] = useState<{
    id: number | null;
    activeState: string | null;
    businessName: string | null;
    businessEmail: string | null;
    businessAddress: string | null;
    businessPhone: string | null;
    personName: string | null;
    personPhone: string | null;
    description: string | null;
  }>({
    id: 0,
    activeState: "",
    businessName: "",
    businessEmail: "",
    businessAddress: "",
    businessPhone: "",
    personName: "",
    personPhone: "",
    description: "",
  });
  const [isLoadingClient, setIsLoadingClient] = useState<boolean>(true);

  const [location, setLocation] = useState<number[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [isLoadingStatusChange, setIsLoadingStatusChange] = useState({
    start: false,
    end: false,
  });

  useEffect(() => {
    dispatch({
      type: SET_BREADCRUMBS,
      payload: [
        { name: "Home", path: "/Dashboard", bold: false, state: null },
        {
          name: "Projects",
          path: "/project/jobs",
          bold: false,
          state: state,
        },
        {
          name: `${projectName}`,
          path: null,
          bold: true,
          state: null,
        },
      ],
    });
  }, [projectName]);

  useEffect(() => {
    if (id) {
      const values = {
        id: Number(id),
      };

      getProjectDetails(values);
    } else {
      navigate("/project/jobs");
    }
  }, []);
  useEffect(() => {
    if (projectDetails.clientId) {
      const values = {
        id: projectDetails.clientId,
      };
      getClientDetails(values);
    }
    return () => {};
  }, [projectDetails.clientId]);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getProjectDetails = (values: { id: number }) => {
    setIsLoadingProject(true);
    ProjectService.getProjectDetailsById(values)
      .then((response) => {
        if (response.isSuccess) {
          setProjectDetails(response.data);
          setProjectName(response.data.name);
          setLocation(response.data.location);
        }
      })
      .finally(() => setIsLoadingProject(false));
  };
  const getClientDetails = (values: { id: number }) => {
    setIsLoadingClient(true);
    ProjectService.getClientDetailsBy(values)
      .then((response) => {
        if (response.isSuccess) {
          const clientData = response.data as {
            data: {
              id: number;
              activeState: string;
              businessName: string;
              businessEmail: string;
              businessAddress: string;
              businessPhone: string;
              personName: string;
              personPhone: string;
              description: string;
            };
          };
          setClientDetails({
            id: clientData.data.id,
            activeState: clientData.data.activeState,
            businessName: clientData.data.businessName,
            businessEmail: clientData.data.businessEmail,
            businessAddress: clientData.data.businessAddress,
            businessPhone: clientData.data.businessPhone,
            personName: clientData.data.personName,
            personPhone: clientData.data.personPhone,
            description: clientData.data.description,
          });
        }
      })
      .finally(() => setIsLoadingClient(false));
  };

  const startProject = () => {
    openConfirmDialog(
      "Start Project",
      `Are you sure you want to start this project?`,
      {
        id: projectDetails?.id,
      },
      (data) => {
        setIsLoadingStatusChange({ start: true, end: false });
        ProjectService.startProject(data?.id).then((response) => {
          if (response.isSuccess) {
            setIsLoadingStatusChange({ start: false, end: false });
            closeConfirmDialog();
            getProjectDetails({ id: projectDetails.id });
            openSuccessDialog("Success", "Project start successfully, ready to use");
          } else {
            setIsLoadingStatusChange({ start: false, end: false });
          }
        });
      }
    );
  };

  const endProject = () => {
    openConfirmDialog(
      "Close Project",
      `Are you sure you want to close this project?`,
      {
        id: projectDetails?.id,
      },
      (data) => {
        setIsLoadingStatusChange({ start: true, end: false });
        ProjectService.endProject(data?.id).then((response) => {
          if (response.isSuccess) {
            setIsLoadingStatusChange({ start: false, end: false });
            closeConfirmDialog();
            getProjectDetails({ id: projectDetails.id });
            openSuccessDialog("Success", "Project closed successfully");
          } else {
            setIsLoadingStatusChange({ start: false, end: false });
          }
        });
      }
    );
  };
  return (
    <Grid container justifyContent="center" spacing={gridSpacing}>
      <Grid item xs={12}>
        <PageHeaders HeaderIcon={<WorkIcon />} headerTitle={"Projects"} />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid item xs={12} lg={4}>
            <MainCard>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Stack justifyContent={"space-between"} direction={"row"}>
                    <Box>
                      {!isLoadingProject ? (
                        <Chip
                          color={statusMap[projectDetails?.processingState].color}
                          label={statusMap[projectDetails?.processingState].label}
                          size="small"
                        />
                      ) : (
                        <Skeleton variant="rectangular" height={30} width={90} />
                      )}
                    </Box>
                    {props.access[2] === "1" && !isLoadingProject && (
                      <Tooltip title="Update Project Details">
                        <IconButton size="small" color="info" onClick={() => navigate(`/project/jobs/update/${id}`)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction={"row"} justifyContent={"flex-end"} spacing={1}>
                    {projectDetails.processingState === "PENDING" && !isLoadingProject && props.access[4] === "1" && (
                      <Tooltip title="Start Project">
                        <Button
                          variant="contained"
                          onClick={startProject}
                          disabled={isLoadingStatusChange.start}
                          startIcon={isLoadingStatusChange.start && <CircularProgress size={20} />}
                          sx={{ height: 22 }}
                        >
                          Start
                        </Button>
                      </Tooltip>
                    )}
                    {(projectDetails.processingState === "PENDING" || projectDetails.processingState === "ONGOING") &&
                      !isLoadingProject &&
                      props.access[5] === "1" && (
                        <Tooltip title="Close Project">
                          <Button
                            variant="contained"
                            onClick={endProject}
                            color="error"
                            disabled={isLoadingStatusChange.start}
                            startIcon={isLoadingStatusChange.end && <CircularProgress size={20} />}
                            sx={{ height: 22 }}
                          >
                            Close
                          </Button>
                        </Tooltip>
                      )}
                  </Stack>
                </Grid>
                <Grid item xs={12}>
                  {!isLoadingProject ? (
                    <Typography color={theme.palette.text.secondary} variant="h3">
                      {projectDetails?.name}
                    </Typography>
                  ) : (
                    <Skeleton variant="rectangular" height={40} width={"100%"} />
                  )}
                </Grid>
                <Grid item xs={12} sx={{ ml: 2, mt: 1 }}>
                  <Stack direction={"row"} spacing={1}>
                    {isLoadingProject ? <Skeleton width={20} /> : <LocationOnIcon fontSize="small" />}
                    {isLoadingProject ? <Skeleton width={100} /> : <Typography>{projectDetails?.isOutstation ? "Outstation" : "Local"}</Typography>}
                  </Stack>
                </Grid>
                <Grid item xs={12} sx={{ ml: 2 }}>
                  <Stack direction={"row"} spacing={1}>
                    {isLoadingProject ? <Skeleton width={20} /> : <AccountTreeIcon fontSize="small" />}
                    {isLoadingProject ? <Skeleton width={100} /> : <Typography>{projectDetails?.division.name || ""}</Typography>}
                  </Stack>
                </Grid>
                <Grid item xs={12} sx={{ ml: 2 }}>
                  <Stack direction={"row"} spacing={1}>
                    {isLoadingProject ? <Skeleton width={20} /> : <HomeIcon fontSize="small" />}
                    {isLoadingProject ? <Skeleton width={100} /> : <Typography>{projectDetails?.address || ""}</Typography>}
                  </Stack>
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Divider textAlign="right">
                    <Typography variant="caption" fontWeight={"bold"}>
                      Customer Details
                    </Typography>
                  </Divider>
                </Grid>
                <Grid item xs={12} sx={{ ml: 2 }}>
                  <Stack direction={"row"} spacing={1}>
                    {isLoadingClient ? <Skeleton width={20} /> : <PersonIcon fontSize="small" />}
                    {isLoadingClient ? <Skeleton width={100} /> : <Typography>{clienttDetails?.businessName || ""}</Typography>}
                  </Stack>
                </Grid>
                <Grid item xs={12} sx={{ ml: 2 }}>
                  <Stack direction={"row"} spacing={1}>
                    {isLoadingClient ? <Skeleton width={20} /> : <CallIcon fontSize="small" />}
                    {isLoadingClient ? <Skeleton width={100} /> : <Typography>{formatMobile(clienttDetails?.businessPhone || "")}</Typography>}
                  </Stack>
                </Grid>
                <Grid item xs={12} sx={{ ml: 2 }}>
                  <Stack direction={"row"} spacing={1}>
                    {isLoadingClient ? <Skeleton width={20} /> : <AttachEmailIcon fontSize="small" />}
                    {isLoadingClient ? <Skeleton width={100} /> : <Typography>{clienttDetails?.businessEmail || ""}</Typography>}
                  </Stack>
                </Grid>
                {location.length > 0 && !isLoadingProject ? (
                  <Grid item xs={12} sx={{ minHeight: "50vh", mt: 1 }}>
                    <MapComponent
                      locations={
                        location.length > 0
                          ? [
                              {
                                lat: location[0],
                                lng: location[1],
                                name: `${projectDetails?.address || ""}`,
                              },
                            ]
                          : []
                      }
                      onMapClick={() => {}}
                      onMarkerClick={() => {}}
                      searchLocation={false}
                      centerLocation={location}
                      currentLocationRadius={0}
                      showCurrentLocation={false}
                      zoom={10}
                    />
                  </Grid>
                ) : (
                  <Skeleton variant="rectangular" width={"100%"} sx={{ minHeight: "50vh", mt: 1 }} />
                )}
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} lg={8}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <Tabs value={tabValue} onChange={handleChange} variant="scrollable">
                  <Tab iconPosition="end" label={"Attendance"} />
                  <Tab iconPosition="end" label={"Team"} />
                </Tabs>
              </Grid>
              <Grid item xs={12}>
                <TabPanel value={tabValue} index={0}>
                  <MainCard>
                    <ProjectContribution
                      project={{
                        projectName: projectName,
                        projectId: Number(id),
                      }}
                    />
                  </MainCard>
                </TabPanel>
                <TabPanel value={tabValue} index={1}>
                  <MainCard>
                    <TeamMembers projectId={Number(id)} />
                  </MainCard>
                </TabPanel>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default JobView;
