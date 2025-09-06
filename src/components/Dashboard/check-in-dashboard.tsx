import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { useTheme } from "@mui/material/styles";
import { Box, CircularProgress, Grid, Tooltip, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import Fingerprint from "@mui/icons-material/Fingerprint";
import MainCard from "../../utils/ui-components/MainCard";
import { gridSpacing } from "../../store/constants";
import dayjs from "dayjs";
import * as Yup from "yup";
import { closeCustomConfirmDialog, openCustomConfirmDialog } from "../../utils/ui-components/pop-ups/CustomConfirmDialog";
import { CheckInService } from "../../assets/_services/check-in-service";
import { openSnackBar } from "../../utils/ui-components/CustomSnackBar";
import { StaffService } from "../../assets/_services/staff-service";
import { defaultLocation } from "../../utils/utils";
import TextFieldWrapper from "../../utils/ui-components/FormsUI/TextField";

function CheckInDashboard() {
  const theme: any = useTheme();
  const [timeDiff, setTimeDiff] = useState("00:00:00");
  const [currentTime, setCurrentTime] = useState(dayjs().format("hh:mm:ss a"));
  const [isLoading, setIsLoading] = useState(true);

  const [job, setJob] = useState<null | {
    id: number;
    userId: null | number;
    createdAt: string | null;
    endedAt: string | null;
  }>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeDiff(calculateTimeDiff(job));
      setCurrentTime(dayjs().format("hh:mm:ss a"));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentTime]);

  const calculateTimeDiff = (jobData) => {
    if (jobData !== null && jobData?.createdAt && jobData?.endedAt === null) {
      // Convert current time and job.createdAt to seconds
      const currentTimeInSeconds = dayjs().unix();
      const jobTimeInSeconds = dayjs(jobData.createdAt).unix();

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

  useEffect(() => {
    getAttendanceDetail();
  }, []);

  const getAttendanceDetail = () => {
    setIsLoading(true);
    StaffService.getMe({
      joinAttendanceRecords: true,
      joinLeaveRequests: undefined,
      joinUploads: undefined,
      page: undefined,
      pageSize: 1,
    })
      .then((response) => {
        if (response.isSuccess) {
          if (response.data.attendanceRecords.length === 0) {
            setJob(null);
          } else {
            const data = response.data.attendanceRecords[0];
            setJob({
              id: data.id,
              createdAt: data.createdAt,
              endedAt: data.endedAt,
              userId: data.userId,
            });
          }
        } else {
          setJob(null);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const CheckInCheckOut = (title, message, status) => {
    openCustomConfirmDialog({
      title: title,
      message: message,
      data: {},
      onSubmit: (_, values) => {
        setIsLoading(true);
        closeCustomConfirmDialog();
        // navigator.geolocation.getCurrentPosition(
        //   (position) => {
        //     const { latitude, longitude } = position.coords;
        const userLocation: { lat: number; long: number } = { lat: defaultLocation[0], long: defaultLocation[1] };
        if (status == "CHECKOUT") {
          CheckInService.clockOut({
            endedLocation: [userLocation.lat, userLocation.long],
            comment: values?.comment ? values?.comment : null,
          })
            .then((response: any) => {
              if (response.isSuccess) {
                openSnackBar("Checked Out successfully", "success", 3000);
                getAttendanceDetail();
              }
            })
            .then(() => setIsLoading(false));
        } else if (status == "CHECKIN") {
          CheckInService.clockIn({
            projectId: null,
            createdLocation: [userLocation.lat, userLocation.long],
          })
            .then((response) => {
              if (response.isSuccess) {
                openSnackBar("Checked In successfully", "success", 3000);
                setJob({
                  createdAt: response.data.createdAt,
                  endedAt: response.data.endedAt,
                  id: response.data.id,
                  userId: response.data.userId,
                });
              }
            })
            .then(() => setIsLoading(false));
        }
        // },
        // (error) => {
        //   console.error("Error fetching location: ", error);
        //   setIsLoading(false);
        //   openSnackBar("Unable to get your current location", "error", 3000);
        // }
        // );
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
        return status == "CHECKOUT" ? (
          <Box>
            <Grid container spacing={gridSpacing} justifyContent="center">
              <Grid item md={8} xs={12}>
                <TextFieldWrapper multiline type="text" name="comment" label="Comment" />
              </Grid>
            </Grid>
          </Box>
        ) : null;
      },
    });
  };

  return (
    <MainCard>
      <Box width="100%">
        <Grid container justifyContent="center" spacing={gridSpacing}>
          <Grid item md={4} sm={6} xs={12} textAlign="center">
            <AccessTimeFilledIcon fontSize="medium" color="secondary" />
            <Typography variant="subtitle2" color="secondary">
              {dayjs().format("DD dddd, MMMM YYYY")}
            </Typography>
            <Typography variant="h3" color="secondary">
              {currentTime}
            </Typography>
          </Grid>
          <Grid item md={4} sm={6} xs={12} textAlign="center">
            <Typography variant="caption" color="secondary">
              {job &&
                `You are last ${job.endedAt ? "checked Out" : "checked In"} at ${
                  job.endedAt ? dayjs(job?.endedAt).format("hh:mm:ss a") : dayjs(job?.createdAt).format("hh:mm:ss a")
                }`}
            </Typography>
            <Typography
              variant="h1"
              sx={{
                color: job ? (job.endedAt ? theme.palette.grey[300] : theme.palette.success.main) : theme.palette.grey[300],
              }}
            >
              {timeDiff}
            </Typography>
          </Grid>
          <Grid item md={4} xs={12} textAlign="center" marginY={2}>
            {(!job || job?.endedAt) && (
              <Tooltip title="Check-In">
                <span>
                  <IconButton
                    aria-label="fingerprint"
                    color="success"
                    disabled={isLoading}
                    sx={{
                      backgroundColor: theme.palette.success.light,
                      "&:hover": {
                        backgroundColor: theme.palette.success.main,
                        color: theme.palette.success.light,
                      },
                      borderRadius: "50%",
                    }}
                    onClick={() => {
                      CheckInCheckOut("Check In", "Are you sure do you want to check in now?", "CHECKIN");
                    }}
                  >
                    <Fingerprint fontSize="large" />
                    {isLoading && (
                      <CircularProgress
                        size="45px"
                        thickness={2}
                        sx={{
                          animationDuration: "5s",
                          position: "absolute",
                          color: "inherit",
                        }}
                      />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            )}
            {job?.createdAt && !job?.endedAt && (
              <Tooltip title="Check-Out">
                <span>
                  <IconButton
                    aria-label="fingerprint"
                    color="error"
                    disabled={isLoading}
                    sx={{
                      backgroundColor: theme.palette.error.light,
                      "&:hover": {
                        backgroundColor: theme.palette.error.main,
                        color: theme.palette.error.light,
                      },
                      borderRadius: "50%",
                    }}
                    onClick={() => {
                      CheckInCheckOut("Check Out", "Are you sure do you want to check out now?", "CHECKOUT");
                    }}
                  >
                    <Fingerprint fontSize="large" />
                    {isLoading && (
                      <CircularProgress
                        size="45px"
                        thickness={2}
                        sx={{
                          animationDuration: "5s",
                          position: "absolute",
                          color: "inherit",
                        }}
                      />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </Grid>
        </Grid>
      </Box>
    </MainCard>
  );
}

export default CheckInDashboard;
