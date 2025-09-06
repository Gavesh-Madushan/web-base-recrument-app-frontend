import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { StaffService } from "../../assets/_services/staff-service";
import { getState, SET_BREADCRUMBS } from "../../redux/actions/actions";
import { CheckInService } from "../../assets/_services/check-in-service";

//custom components
import EmptyResult from "../../utils/ui-components/EmptyResult";
import PageHeaders from "../../utils/ui-components/PageHeaders";
import { openSnackBar } from "../../utils/ui-components/CustomSnackBar";
import { closeCustomConfirmDialog, openCustomConfirmDialog } from "../../utils/ui-components/pop-ups/CustomConfirmDialog";

// mui
import { useTheme } from "@mui/material/styles";
import { Box, Button, CircularProgress, Grid, List, ListItem, Skeleton, Typography } from "@mui/material";

// mui icons
import WorkIcon from "@mui/icons-material/Work";
import HomeIcon from "@mui/icons-material/Home";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EngineeringIcon from "@mui/icons-material/Engineering";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { defaultLocation } from "../../utils/utils";

function CheckIn(props: any) {
  const { auth } = props;

  const theme: any = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<
    {
      divisionId: number;
      userId: number;
      id: number;
      createdAt: string;
      projectId: number;
      user?:
        | {
            employeeNumber: string;
            nameInitials: string;
            designation: "MANAGER" | "DIVISION_HEAD" | "HR_MANAGER" | "FINANCE_MANAGER" | "ENGINEER" | "TECHNICIAN" | "ASSISTANT_ENGINEER";
          }
        | undefined;
      project?:
        | {
            address: string;
            isOutstation: boolean;
            location: number[];
            name: string;
            processingState: "PENDING" | "ONGOING" | "COMPLETED";
          }
        | undefined;
    }[]
  >([]);
  const [checkInId, setCheckInId] = useState<number>(0);

  useEffect(() => {
    dispatch({
      type: SET_BREADCRUMBS,
      payload: [
        { name: "Home", path: "/Dashboard", bold: false, state: null },
        {
          name: "Check-In",
          path: "/checkin",
          bold: true,
          state: null,
        },
        {
          name: "Assigned Projects",
          path: "/checkin",
          bold: true,
          state: null,
        },
      ],
    });

    StaffService.getMe({
      joinAttendanceRecords: true,
      joinLeaveRequests: undefined,
      joinUploads: undefined,
      page: undefined,
      pageSize: 1,
    }).then((response) => {
      if (response.isSuccess) {
        if (response.data.attendanceRecords[0]?.endedAt || response.data.attendanceRecords.length === 0) {
          getJobs();
        } else {
          navigate("/checkin/job", {
            state: {
              jobName: response.data.attendanceRecords[0].projectAssignment?.project.name || "",
              jobId: response.data.attendanceRecords[0].projectAssignmentId,
            },
          });
        }
      } else {
        getJobs();
      }
    });

    getJobs();
  }, []);

  //get assign ongoing project list
  const getJobs = () => {
    CheckInService.getEmployeeAssignmentList({ userId: auth?.id, projectProcessingState: "ONGOING" })
      .then((response) => {
        if (response.isSuccess) {
          setJobs(response.data?.data || []);
        }
      })
      .then(() => {
        setIsLoading(false);
      });
  };

  return (
    <Grid container justifyContent="center" spacing={2}>
      <Grid item xs={12}>
        <PageHeaders HeaderIcon={<EngineeringIcon />} headerTitle={"Check-In"} />
      </Grid>

      {/* project list */}
      <Grid item xl={6} lg={8} md={10} xs={12}>
        {jobs?.length > 0 &&
          !isLoading &&
          jobs.map((item, index: number) => (
            <List key={index}>
              <ListItem
                style={{
                  borderRadius: "10px",
                  padding: "20px",
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${item?.project?.isOutstation ? theme.palette.secondary.main : theme.palette.primary.main}`,
                  borderLeft: `10px solid ${item?.project?.isOutstation ? theme.palette.secondary.main : theme.palette.primary.main}`,
                }}
              >
                <Grid container direction={"row"}>
                  <Grid item xs={7}>
                    <Typography fontWeight={"bold"} variant="caption">
                      Project ID: {item?.projectId}
                    </Typography>
                    <Box display="flex" alignItems="center" sx={{ mt: 0.5 }}>
                      <WorkIcon color="secondary" />
                      <Typography color="secondary" variant="h4" fontWeight={"bold"} sx={{ ml: 1 }}>
                        {item?.project?.name}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <HomeIcon color="secondary" />
                      <Typography color="secondary" sx={{ ml: 1 }}>
                        {item?.project?.isOutstation ? "Outstation" : "Local"}
                      </Typography>
                    </Box>
                  </Grid>

                  {/* check in */}
                  <Grid item xs={5} textAlign={"end"}>
                    <Button
                      size="small"
                      variant="contained"
                      disabled={checkInId !== 0}
                      startIcon={checkInId === item?.projectId && <CircularProgress size={"20px"} />}
                      onClick={() => {
                        setCheckInId(item?.projectId);
                        // navigator.geolocation.getCurrentPosition(
                        //   (position) => {
                        //     const { latitude, longitude } = position.coords;
                        const userLocation: { lat: number; long: number } = {
                          lat: item.project?.location[0] || defaultLocation[0],
                          long: item.project?.location[1] || defaultLocation[1],
                        };
                        setCheckInId(0);
                        openCustomConfirmDialog({
                          title: "Check-In",
                          message: `Are you sure you want to check-In to ${item?.project?.name || ""}`,
                          data: { location: userLocation },
                          onSubmit: (data) => {
                            setCheckInId(item.projectId);
                            CheckInService.clockIn({
                              projectId: item?.id,
                              createdLocation: [data.location.lat, data.location.long],
                            })
                              .then((response) => {
                                if (response.isSuccess) {
                                  setCheckInId(0);
                                  openSnackBar("Checked In successfully to " + item?.project?.name || "", "success", 3000);
                                  navigate("/checkin/job", {
                                    state: {
                                      jobName: item?.project?.name,
                                      jobId: item?.id,
                                    },
                                  });
                                } else {
                                  setCheckInId(0);
                                }
                              })
                              .then(() => {
                                closeCustomConfirmDialog();
                              });
                          },
                          close: true,
                          confirmBtnDisable: false,
                          initialFormState: {
                            note: "",
                          },
                          Component: () => {},
                        });
                        //   },
                        //   (error) => {
                        //     setCheckInId(0);
                        //     openSnackBar("Unable to get your current location", "error", 3000);
                        //     console.error("Error fetching location: ", error);
                        //   }
                        // );
                      }}
                      endIcon={<ArrowForwardIosIcon sx={{ width: "12px", height: "12px" }} />}
                    >
                      CHECK IN
                    </Button>
                  </Grid>
                  <Grid item xs={12}>
                    <Box display="flex" alignItems="center">
                      <LocationOnIcon color="secondary" />
                      <Typography color="secondary" sx={{ ml: 1 }}>
                        {item?.project?.address}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </ListItem>
            </List>
          ))}

        {/* Loading and emplty result */}
        {!jobs?.length && !isLoading && <EmptyResult />}
        {isLoading && (
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              minHeight: "40vh",
            }}
          >
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
          </Box>
        )}
      </Grid>
    </Grid>
  );
}

const mapStateToProps = (state: any) => ({
  auth: getState(state.auth.authData),
});

export default connect(mapStateToProps, {})(CheckIn);
