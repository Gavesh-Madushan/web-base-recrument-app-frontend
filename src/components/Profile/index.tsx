import { gridSpacing } from "../../store/constants";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { SET_BREADCRUMBS } from "../../redux/actions/actions";
import { convert_to_proper_case, formatMobile } from "../../utils/utils";
import { useDispatch } from "react-redux";

// mui
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

// custom components
import PageHeaders from "../../utils/ui-components/PageHeaders";
import MainCard from "../../utils/ui-components/MainCard";
// import ProjectStatusChart from "./ProjectStatusChart";
// import ClientJobList from "./ClientAllJob";

// mui icons
import CallIcon from "@mui/icons-material/Call";
// import HomeIcon from "@mui/icons-material/Home";
// import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import PersonIcon from "@mui/icons-material/Person";
import CancelIcon from "@mui/icons-material/Cancel";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { styled } from "@mui/material/styles";
import GridViewIcon from "@mui/icons-material/GridView";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";

import EmployeeProfileAttendanceList from "./Attendace";
import EmployeeProjectList from "./Projects";
import EmployeeLeaveList from "./Leaves";
import EmployeeAttachmentList from "./Attachments";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getEmployee, getMe, resignEmployee } from "../../assets/api";
import { UploadService } from "../../assets/_services/upload-service";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ViewEditDialog from "../../utils/ui-components/ViewEditDialog";
import ChangeProfilePicture from "../ChangeProfilePicture";
import EmployeeProfilePayroll from "./Payroll";
import { closeConfirmDialog, openConfirmDialog } from "../../utils/ui-components/pop-ups/ConfirmDialog";
import { openSuccessDialog } from "../../utils/ui-components/pop-ups/SuccessDialog";
// import ViewEditDialog from "../../utils/ui-components/ViewEditDialog";

const CardWrapper = styled(MainCard)(({ theme, color }: any) => ({
  //   boxShadow: `${theme.palette[color][200]} 0px 3px 6px, ${theme.palette[color][200]} 0px 3px 6px`,
  border: `1px solid ${theme.palette[color][200]}`,
  background: theme.palette[color][200],
  color: theme.palette[color].main,
  overflow: "hidden",
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    width: 210,
    height: 210,
    background: theme.palette[color][200],
    borderRadius: "50%",
    top: -85,
    right: -95,
    [theme.breakpoints.down("sm")]: {
      top: -105,
      right: -140,
    },
  },
  "&:before": {
    content: '""',
    position: "absolute",
    width: 210,
    height: 210,
    background: theme.palette[color][200],
    borderRadius: "50%",
    top: -125,
    right: -15,
    opacity: 0.5,
    [theme.breakpoints.down("sm")]: {
      top: -155,
      right: -70,
    },
  },
}));

function ProfileView(props: { access: string; role: number }) {
  const theme: any = useTheme();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [select, setSelect] = useState<number>(1);
  const { id: userId } = useParams();
  const [openChangeProfilePicture, setOpenChangeProfilePicture] = useState(false);
  const [isLoadingResign, setIsLoadingResign] = useState(false);

  // const [open, setOpen] = useState<boolean>(false);

  const [isLoadingImage, setIsLoadingImage] = useState<boolean>(true);
  const [profilePictureSrc, setProfilePictureSrc] = useState("");

  useEffect(() => {
    dispatch({
      type: SET_BREADCRUMBS,
      payload: [
        { name: "Home", path: "/Dashboard", bold: false, state: null },
        ...(userId
          ? [
              {
                name: "Employee",
                path: "/staff/employee",
                bold: false,
                state: state,
              },
              {
                name: "Profile",
                path: "",
                bold: true,
                state: state,
              },
            ]
          : [
              {
                name: "Profile",
                path: "",
                bold: true,
                state: state,
              },
            ]),
      ],
    });
  }, []);

  const userDetails = useQuery({
    queryKey: ["userDetails", userId],
    queryFn: () => (userId !== undefined ? getEmployee(Number.parseInt(userId)) : getMe({})),
  });

  const resignUser = useMutation({
    mutationFn: resignEmployee,
  });

  useEffect(() => {
    if (!userDetails.isLoading && userDetails.data?.data.profilePicturePath) {
      setIsLoadingImage(true);
      UploadService.getFile(userDetails.data.data.profilePicturePath).then((src) => {
        setProfilePictureSrc(URL.createObjectURL(src));
        setIsLoadingImage(false);
      });
    }
  }, [userDetails.data?.data.profilePicturePath]);

  // const dialog = useMemo(
  //   () =>
  //     ViewEditDialog(ApplyLeave)({
  //       open: open,
  //       setOpen: setOpen,
  //       dialogTitle: "Update Profile Image",
  //       initialItem: {
  //         empImg: {}
  //       },
  //       fetchData: () => {
  //         userDetails.refetch();
  //       },
  //       theme: theme,
  //       maxWidth: "sm",
  //     }),
  //   [open]
  // );

  const changeProfilePicture = async () => {
    setOpenChangeProfilePicture(true);
  };

  const dialogProfilePicture = useMemo(
    () =>
      ViewEditDialog(ChangeProfilePicture)({
        open: openChangeProfilePicture,
        setOpen: setOpenChangeProfilePicture,
        dialogTitle: "Change Profile Picture",
        theme: theme,
        maxWidth: "sm",
      }),
    [openChangeProfilePicture]
  );

  return (
    <Grid container justifyContent="center" spacing={gridSpacing}>
      <Grid item xs={12}>
        <PageHeaders HeaderIcon={<PersonIcon />} headerTitle={"Employee Profile"} />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <CardWrapper color={"secondary"} border={false} content={false}>
              <Box sx={{ p: 2.25 }}>
                <Grid container columnSpacing={3}>
                  <Grid item xs={12}>
                    <Stack alignItems={"flex-end"}>
                      <Box sx={{ zIndex: 100 }}>
                        {!userDetails.isLoading && (
                          <Chip
                            color={
                              userDetails?.data?.data?.resignedAt
                                ? "error"
                                : userDetails?.data?.data?.activeState === "INACTIVE"
                                ? "error"
                                : "success"
                            }
                            label={
                              userDetails?.data?.data?.resignedAt
                                ? "Resigned"
                                : userDetails?.data?.data?.activeState === "INACTIVE"
                                ? "Inactive"
                                : "Active"
                            }
                            size="medium"
                          />
                        )}
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item>
                    {userDetails.isLoading && isLoadingImage ? (
                      <Skeleton variant="circular" width={150} height={150} />
                    ) : (
                      <Stack direction={"column"} spacing={1}>
                        <Avatar src={profilePictureSrc} sx={{ width: "150px", height: "150px" }} />
                        {!userId && (
                          <Button startIcon={<CameraAltIcon />} variant="outlined" type="button" onClick={changeProfilePicture}>
                            Update Picture
                          </Button>
                        )}
                      </Stack>
                    )}
                    {props.access[2] === "1" &&
                      !userDetails.isLoading &&
                      !userDetails?.data?.data?.resignedAt &&
                      (props.role === 3 || props.role === 1) && (
                        <Stack sx={{ pt: 1 }}>
                          <Button
                            startIcon={
                              isLoadingResign ? (
                                <CircularProgress
                                  size={"20px"}
                                  sx={{
                                    mr: 1,
                                    color: "gray",
                                  }}
                                />
                              ) : (
                                <CancelIcon />
                              )
                            }
                            disabled={isLoadingResign}
                            color="error"
                            variant="contained"
                            type="button"
                            onClick={() => {
                              openConfirmDialog(
                                "Resign Employee",
                                `Are you sure you want to resign this employee?`,
                                { input: { id: userDetails.data?.data.id } },
                                (data) => {
                                  setIsLoadingResign(true);
                                  closeConfirmDialog();
                                  resignUser.mutate(
                                    {
                                      id: data.input.id,
                                    },
                                    {
                                      onSuccess: () => {
                                        openSuccessDialog("Success", `Employee resigned successfully`);
                                        setIsLoadingResign(false);
                                        userDetails.refetch();
                                      },
                                      onError: () => {
                                        // setSubmitting(false);
                                        setIsLoadingResign(false);
                                      },
                                    }
                                  );
                                }
                              );
                            }}
                          >
                            Resign Employee
                          </Button>
                        </Stack>
                      )}
                  </Grid>
                  <Grid item xs={6}>
                    <Stack direction={"column"} spacing={0}>
                      {userDetails.isLoading ? (
                        <Skeleton variant="text" height={40} />
                      ) : (
                        <Typography color={theme.palette.text.secondary} variant="h2">
                          {userDetails.data?.data.nameInitials ?? ""}
                        </Typography>
                      )}
                      {userDetails.isLoading ? (
                        <Skeleton variant="text" height={15} />
                      ) : (
                        <Typography color={theme.palette.text.secondary} fontWeight={"bold"} variant="caption">
                          {userDetails.data?.data.name ?? ""}
                        </Typography>
                      )}
                    </Stack>
                    <Stack direction={"column"} sx={{ mt: 2 }}>
                      <Stack direction={"row"} spacing={1}>
                        {userDetails.isLoading ? (
                          <>
                            <Skeleton variant="text" width={25} height={25} />
                            <Skeleton variant="text" width={"100%"} height={25} />
                          </>
                        ) : (
                          <>
                            <GridViewIcon fontSize="small" />
                            <Typography>{userDetails.data?.data.employeeNumber ?? ""}</Typography>
                          </>
                        )}
                      </Stack>
                      <Stack direction={"row"} spacing={1}>
                        {userDetails.isLoading ? (
                          <>
                            <Skeleton variant="text" width={25} height={25} />
                            <Skeleton variant="text" width={"100%"} height={25} />
                          </>
                        ) : (
                          <>
                            <CallIcon fontSize="small" />
                            <Typography>{formatMobile(userDetails.data?.data.mobile ?? "")}</Typography>
                          </>
                        )}
                      </Stack>
                      <Stack direction={"row"} spacing={1}>
                        {userDetails.isLoading ? (
                          <>
                            <Skeleton variant="text" width={25} height={25} />
                            <Skeleton variant="text" width={"100%"} height={25} />
                          </>
                        ) : (
                          <>
                            <HolidayVillageIcon fontSize="small" />
                            <Typography>{userDetails.data?.data?.division?.name ?? ""}</Typography>
                          </>
                        )}
                      </Stack>
                      <Stack direction={"row"} spacing={1}>
                        {userDetails.isLoading ? (
                          <>
                            <Skeleton variant="text" width={25} height={25} />
                            <Skeleton variant="text" width={"100%"} height={25} />
                          </>
                        ) : (
                          <>
                            <AccountCircleOutlinedIcon fontSize="small" />
                            <Typography>{convert_to_proper_case(userDetails.data?.data.class) ?? ""}</Typography>
                          </>
                        )}
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>
            </CardWrapper>
          </Grid>
          <Grid item xs={3}>
            <MainCard>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <List
                    component="nav"
                    sx={{
                      width: "100%",
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: "10px",
                      [theme.breakpoints.down("md")]: {
                        minWidth: "100%",
                      },
                      "& .MuiListItemButton-root": {
                        mt: 0.5,
                        borderRadius: `5px`,
                      },
                    }}
                  >
                    <ListItemButton selected={select === 1} onClick={() => setSelect(1)}>
                      <ListItemIcon>
                        <CalendarMonthIcon sx={{ fontSize: "1.3rem" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="inherit">
                            Attendace
                          </Typography>
                        }
                      />
                    </ListItemButton>
                    {userDetails?.data?.data?.roleId === 5 && (
                      <ListItemButton selected={select === 2} onClick={() => setSelect(2)}>
                        <ListItemIcon>
                          <AccountTreeIcon sx={{ stroke: 1.5, fontSize: "1.3rem" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" color="inherit">
                              Projects
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    )}
                    <ListItemButton selected={select === 3} onClick={() => setSelect(3)}>
                      <ListItemIcon>
                        <AccountBalanceIcon sx={{ stroke: 1.5, fontSize: "1.3rem" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="inherit">
                            Payroll
                          </Typography>
                        }
                      />
                    </ListItemButton>
                    <ListItemButton selected={select === 4} onClick={() => setSelect(4)}>
                      <ListItemIcon>
                        <AccessTimeIcon sx={{ stroke: 1.5, fontSize: "1.3rem" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="inherit">
                            Leaves
                          </Typography>
                        }
                      />
                    </ListItemButton>
                    <ListItemButton selected={select === 5} onClick={() => setSelect(5)}>
                      <ListItemIcon>
                        <AttachFileOutlinedIcon sx={{ stroke: 1.5, fontSize: "1.3rem" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="inherit">
                            Attachments
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </List>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={9}>
            {select === 1 ? (
              <EmployeeProfileAttendanceList userId={Number(userId)} otPerHr={userDetails?.data?.data?.salaryOtPerHour} />
            ) : select === 2 ? (
              <EmployeeProjectList />
            ) : select === 3 ? (
              <EmployeeProfilePayroll userId={Number(userId)} />
            ) : select === 4 ? (
              <EmployeeLeaveList />
            ) : select === 5 ? (
              <EmployeeAttachmentList userId={Number(userId)} access={props.access} />
            ) : (
              <MainCard />
            )}
          </Grid>
        </Grid>
      </Grid>
      {/* {dialog} */}
      {dialogProfilePicture}
    </Grid>
  );
}

export default ProfileView;
