import dayjs from "dayjs";
import "leaflet/dist/leaflet.css";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { gridSpacing } from "../../store/constants";
import { useLocation, useNavigate } from "react-router-dom";
import { StaffService } from "../../assets/_services/staff-service";
import { getState, SET_BREADCRUMBS } from "../../redux/actions/actions";
import { CheckInService } from "../../assets/_services/check-in-service";
// import TextFieldWrapper from "../../utils/ui-components/FormsUI/TextField";

//custom components
import MainCard from "../../utils/ui-components/MainCard";
import PageHeaders from "../../utils/ui-components/PageHeaders";
import { openSnackBar } from "../../utils/ui-components/CustomSnackBar";
import { closeCustomConfirmDialog, openCustomConfirmDialog } from "../../utils/ui-components/pop-ups/CustomConfirmDialog";

// mui
import { useTheme } from "@mui/material/styles";
import { Box, Button, CircularProgress, Grid, Skeleton, Stack, Typography } from "@mui/material";

// mui icon
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import { defaultLocation } from "../../utils/utils";
import * as Yup from "yup";
import TextFieldWrapper from "../../utils/ui-components/FormsUI/TextField";

dayjs.extend(utc);

function CheckInProjectWise(props: any) {
  const { auth } = props;

  const theme: any = useTheme();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [checkIn, setCheckIn] = useState(false);
  const [timeDiff, setTimeDiff] = useState("00:00:00");

  const [job, setJob] = useState<
    | {
        // approvalState: "PENDING" | "ONGOING" | "COMPLETED" | "APPROVED" | "REJECTED";
        comment: null | string;
        createdAt: null | string;
        createdLocation: number[];
        divisionId: number;
        endedAt: null | string;
        endedLocation: null | number[];
        id: number;
        lastUpdatedUserId: number | null;
        projectAssignment: {
          project: {
            name: string;
          };
        } | null;
        projectAssignmentId: number | null;
        type: "WORK" | "BREAK";
        userId: number;
      }
    | undefined
  >(undefined);

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!state?.jobId) {
      navigate("/checkin");
    }
    dispatch({
      type: SET_BREADCRUMBS,
      payload: [
        { name: "Home", path: "/Dashboard", bold: false, state: null },
        {
          name: "Assigned Projects",
          path: "/checkin",
          bold: false,
          state: state,
        },
        {
          name: `${state?.jobName || ""}`,
          path: null,
          bold: true,
          state: null,
        },
      ],
    });
  }, []);

  useEffect(() => {
    getAttendanceDetail();
  }, [auth?.onGoingProjectId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeDiff(calculateTimeDiff());
    }, 1000);
    return () => clearInterval(interval);
  }, [job?.createdAt]);

  const calculateTimeDiff = () => {
    if (job?.createdAt) {
      // Convert current time and job.createdAt to seconds
      const currentTimeInSeconds = dayjs().unix();
      const jobTimeInSeconds = dayjs(job.createdAt).unix();

      // Calculate the difference in seconds
      const differenceInSeconds = currentTimeInSeconds - jobTimeInSeconds;

      // Convert the difference to hours, minutes, and seconds
      const hours = Math.floor(differenceInSeconds / 3600);
      const minutes = Math.floor((differenceInSeconds % 3600) / 60);
      const seconds = differenceInSeconds % 60;

      // Format the result as hh:mm:ss (padding with leading zeros)
      return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
    return "00:00:00"; // Fallback if job?.createdAt is undefined
  };

  const getAttendanceDetail = () => {
    setLoading(true);
    StaffService.getMe({
      joinAttendanceRecords: true,
      joinLeaveRequests: undefined,
      joinUploads: undefined,
      page: undefined,
      pageSize: 1,
    }).then((response) => {
      if (response.isSuccess) {
        if (response.data.attendanceRecords[0]?.endedAt || response.data.attendanceRecords.length === 0) {
          setCheckIn(false);
        } else {
          setCheckIn(true);
          setJob(response.data.attendanceRecords[0]);
        }
        setLoading(false);
      } else {
        setLoading(false);
        setCheckIn(false);
      }
    });
  };

  const CheckInCheckOut = () => {
    setIsCheckingOut(true);
    // navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     const { latitude, longitude } = position.coords;
    const userLocation: { lat: number; long: number } = {
      lat: job?.createdLocation[0] || defaultLocation[0],
      long: job?.createdLocation[1] || defaultLocation[1],
    };
    setIsCheckingOut(false);
    openCustomConfirmDialog({
      title: "Check Out",
      message: "Are you sure you want to check-out from this project",
      data: { location: userLocation },
      onSubmit: (data, values) => {
        console.log(values);
        setIsCheckingOut(true);
        CheckInService.clockOut({
          endedLocation: [data.location.lat, data.location.long],
          comment: values?.comment ? values?.comment : null,
        })
          .then((response: any) => {
            if (response.isSuccess) {
              setIsCheckingOut(false);
              openSnackBar("Checked Out successfully from " + state?.jobName, "success", 3000);
              navigate("/checkin");
            } else {
              setIsCheckingOut(false);
            }
          })
          .then(() => closeCustomConfirmDialog());
      },
      close: true,
      confirmBtnDisable: false,
      initialFormState: {
        comment: "",
      },
      formValidation: Yup.object().shape({
        comment: Yup.string().notRequired(),
      }),

      Component: () => {
        return (
          <Box>
            <Grid container spacing={gridSpacing} justifyContent="center">
              <Grid item md={8} xs={12}>
                <TextFieldWrapper multiline type="text" name="comment" label="Comment" />
              </Grid>
            </Grid>
          </Box>
        );
      },
    });
    //   },
    //   (error) => {
    //     setIsCheckingOut(false);
    //     console.error("Error fetching location: ", error);
    //     openSnackBar("Unable to get your current location", "error", 3000);
    //   }
    // );
  };

  return (
    <Grid container justifyContent="center" rowSpacing={2}>
      <Grid item xs={12}>
        <PageHeaders HeaderIcon={<ManageAccountsIcon />} headerTitle={"Check-Out"} />
      </Grid>
      <Grid item xl={6} lg={7} md={10} sm={10} xs={12}>
        <MainCard>
          {!loading ? (
            <Box width="100%">
              <Grid container justifyContent="center" rowSpacing={gridSpacing}>
                <Grid item xs={12} textAlign="center">
                  <AccessTimeFilledIcon fontSize="medium" color="secondary" />
                  <Typography variant="subtitle2" color="secondary">
                    {dayjs().format("DD dddd MMMM YYYY")}
                  </Typography>
                  <Typography variant="h3" color="secondary">
                    {dayjs().format("hh:mm:ss a")}
                  </Typography>
                </Grid>
                <Grid item xs={12} textAlign="center">
                  <Stack direction={"row"} justifyContent="center" spacing={1}>
                    <LocationOnIcon color="primary" />
                    <Typography variant="h3" color="primary" sx={{ textTransform: "uppercase" }}>
                      {state?.jobName}
                    </Typography>
                  </Stack>
                </Grid>

                <Grid item xs={12} textAlign="center">
                  {job && (
                    <Typography variant="caption" color="secondary">
                      You are last checked in at{" "}
                      {checkIn ? dayjs(job?.createdAt).format("DD MMM YYYY - hh:mm:ss a") : dayjs(job?.endedAt).format("DD MMM YYYY - hh:mm:ss a")}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} textAlign="center">
                  <Grid item xs={12} textAlign="center">
                    <Typography variant="caption" fontWeight={"bold"} color="secondary">
                      Works Hours
                    </Typography>
                  </Grid>
                  <Typography
                    variant="h2"
                    sx={{
                      color: checkIn ? theme.palette.success.main : theme.palette.grey[300],
                    }}
                  >
                    {timeDiff}
                  </Typography>
                </Grid>

                <Grid item xs={12} textAlign="center" marginY={2}>
                  {checkIn && (
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={isCheckingOut ? <CircularProgress size={"20px"} /> : <ArrowBackIosIcon />}
                      onClick={CheckInCheckOut}
                      disabled={isCheckingOut}
                    >
                      Check Out
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Grid container alignContent={"center"} direction={"column"}>
              <Grid item xs={2}>
                <Stack alignItems={"center"}>
                  <Skeleton variant="circular" width={30} height={30} />
                </Stack>
              </Grid>
              <Grid item xs={3}>
                <Stack alignItems={"center"}>
                  <Skeleton variant="text" width={"150px"} />
                </Stack>
              </Grid>
              <Grid item xs={2}>
                <Stack alignItems={"center"}>
                  <Skeleton variant="text" height={"30px"} width={"220px"} />
                </Stack>
              </Grid>
              <Grid item xs={3} sx={{ mt: 1 }}>
                <Stack alignItems={"center"}>
                  <Skeleton variant="text" height={"70px"} width={"300px"} />
                </Stack>
              </Grid>
              <Grid item xs={2} sx={{ mt: 2 }}>
                <Stack alignItems={"center"}>
                  <Skeleton variant="text" width={"150px"} />
                </Stack>
              </Grid>
              <Grid item xs={2} sx={{ mt: 2 }}>
                <Stack alignItems={"center"}>
                  <Skeleton variant="text" width={"150px"} />
                </Stack>
              </Grid>
              <Grid item xs={2}>
                <Stack alignItems={"center"}>
                  <Skeleton variant="rounded" height={"30px"} width={"100px"} />
                </Stack>
              </Grid>
            </Grid>
          )}
        </MainCard>
      </Grid>
    </Grid>
  );
}

const mapStateToProps = (state: any) => ({
  auth: getState(state.auth.authData),
});

export default connect(mapStateToProps, {})(CheckInProjectWise);
