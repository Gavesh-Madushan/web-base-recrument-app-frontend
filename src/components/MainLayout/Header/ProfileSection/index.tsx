import { useState, useRef, useEffect, useMemo } from "react";

import { useNavigate } from "react-router-dom";
import { connect, useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Chip,
  ClickAwayListener,
  Divider,
  // Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popper,
  Stack,
  Typography,
} from "@mui/material";

// project imports
import MainCard from "../../../../utils/ui-components/MainCard";
import Transitions from "../../../../utils/ui-components/extended/Transitions";

// assets
// import SettingsIcon from '@mui/icons-material/Settings';
// import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LockResetIcon from "@mui/icons-material/LockReset";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
// import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutIcon from "@mui/icons-material/Logout";
import { getTimeWelcome, stringAvatar } from "../../../../utils/utils";
import { getLogout, getState, setAuthState } from "../../../../redux/actions/actions";
import ViewEditDialog from "../../../../utils/ui-components/ViewEditDialog";
import ResetUserPassword from "../../../ResetUserPassword";
// import { openSnackBar } from "../../../../utils/ui-components/CustomSnackBar";
// import { StaffService } from "../../../../assets/_services/staff-service";
import ChangeProfilePicture from "../../../ChangeProfilePicture";
import { UploadService } from "../../../../assets/_services/upload-service";

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = (props: any) => {
  const { auth, getLogout } = props;

  const theme: any = useTheme();
  const navigate = useNavigate();
  const customization = useSelector((state: any) => state.customization);
  const [profilePictureSrc, setProfilePictureSrc] = useState("");

  const [selectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const [openChangeProfilePicture, setOpenChangeProfilePicture] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  /**
   * anchorRef is used on different componets and specifying one type leads to other components throwing an error
   * */
  const anchorRef: any = useRef(null);

  useEffect(() => {
    if (auth?.profilePicturePath) {
      UploadService.getFile(auth.profilePicturePath).then((src) => {
        setProfilePictureSrc(URL.createObjectURL(src));
      });
    }
  }, [auth]);

  const handleLogout = async () => {
    getLogout();
  };

  const handleResetPassword = async () => {
    setOpenResetPassword(true);
    setOpen(false);
  };
  const dialog = useMemo(
    () =>
      ViewEditDialog(ResetUserPassword)({
        open: openResetPassword,
        setOpen: setOpenResetPassword,
        dialogTitle: "Reset Password",
        theme: theme,
        maxWidth: "sm",
      }),
    [openResetPassword]
  );

  const changeProfilePicture = async () => {
    setOpen(false);
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

  const handleClose = (event: any) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // getLocation(setAuthState, openSnackBar, auth);
    // getApproxLocation(setAuthState, openSnackBar, auth);
    // getAttendanceDetail();

    // const interval = setInterval(() => {
    // getLocation(setAuthState, openSnackBar, auth);
    // getApproxLocation(setAuthState, openSnackBar, auth);
    // getAttendanceDetail();
    // }, 5 * 60 * 1000);

    // return () => clearInterval(interval);
  }, []);

  // const getAttendanceDetail = () => {
  //   StaffService.getMe({
  //     joinAttendanceRecords: true,
  //     joinLeaveRequests: false,
  //     joinUploads: false,
  //     page: undefined,
  //     pageSize: 1,
  //   }).then((response) => {
  //     if (response.isSuccess) {
  //       setAuthState({
  //         ...auth,
  //         onGoingProjectId: response.data.attendanceRecords[0]?.projectAssignmentId,
  //       });
  //     }
  //   });
  // };

  return (
    <>
      <Chip
        sx={{
          height: "40px",
          alignItems: "center",
          borderRadius: "27px",
          transition: "all .2s ease-in-out",
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          "& .MuiChip-icon": {
            color: theme.palette.primary.dark,
            backgroundColor: theme.palette.primary[200],
          },
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            "& svg": {
              stroke: theme.palette.primary.light,
            },
            "& .MuiChip-icon": {
              color: theme.palette.primary.dark,
              backgroundColor: theme.palette.primary.light,
            },
          },
          "& .MuiChip-label": {
            lineHeight: 0,
          },
        }}
        icon={
          auth?.profilePicturePath ? (
            <Avatar
              src={profilePictureSrc}
              sx={{
                ...theme.typography.mediumAvatar,
                margin: "3px 0 3px 3px !important",
                cursor: "pointer",
              }}
            />
          ) : (
            <Avatar
              {...stringAvatar(`${auth?.nameInitials}`)}
              sx={{
                ...theme.typography.mediumAvatar,
                margin: "3px 0 3px 3px !important",
                cursor: "pointer",
              }}
              ref={anchorRef}
              aria-controls={open ? "menu-list-grow" : undefined}
              aria-haspopup="true"
              color="inherit"
            />
          )
        }
        label={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-settings"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke={theme.palette.primary.main}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
            <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
          </svg>
        }
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 14],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }: any) => (
          <Transitions in={open} {...TransitionProps}>
            <ClickAwayListener onClickAway={handleClose}>
              <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                <Box sx={{ p: 2 }}>
                  <Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography variant="h4" color={theme.palette.info.main}>
                        {getTimeWelcome()}
                      </Typography>
                      <Typography color={theme.palette.primary.main} variant="h4" sx={{ fontWeight: 400 }}>
                        {`${auth?.nameInitials || ""}`}
                      </Typography>
                    </Stack>
                    <Typography variant="subtitle2">{auth?.class || ""}</Typography>
                  </Stack>
                  <Divider />
                </Box>
                <Box
                  sx={{ p: 2, pt: 0 }}
                  style={{
                    height: "100%",
                    maxHeight: "calc(100vh - 250px)",
                    overflowX: "hidden",
                  }}
                >
                  <List
                    component="nav"
                    sx={{
                      width: "100%",
                      maxWidth: 350,
                      minWidth: 300,
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: "10px",
                      [theme.breakpoints.down("md")]: {
                        minWidth: "100%",
                      },
                      "& .MuiListItemButton-root": {
                        mt: 0.5,
                        borderRadius: `${customization.borderRadius}px`,
                      },
                    }}
                  >
                    {/* auth?.role === "2") && ( */}
                    <ListItemButton selected={selectedIndex === 4} onClick={handleResetPassword}>
                      <ListItemIcon>
                        <LockResetIcon sx={{ stroke: 1.5, fontSize: "1.3rem" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="inherit">
                            Reset Password
                          </Typography>
                        }
                      />
                    </ListItemButton>
                    {(Number(auth.roleId) === 2 || Number(auth.roleId) === 3 || Number(auth.roleId) === 4) && (
                      <ListItemButton
                        selected={selectedIndex === 4}
                        onClick={() => {
                          navigate("/profile");
                          setOpen(false);
                        }}
                      >
                        <ListItemIcon>
                          <AssignmentIndOutlinedIcon sx={{ fontSize: "1.3rem" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" color="inherit">
                              Profile
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    )}
                    {Number(auth.roleId) === 5 && (
                      <ListItemButton selected={selectedIndex === 4} onClick={changeProfilePicture}>
                        <ListItemIcon>
                          <AssignmentIndOutlinedIcon sx={{ fontSize: "1.3rem" }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" color="inherit">
                              Change Profile Picture
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    )}
                    <ListItemButton selected={selectedIndex === 4} onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon sx={{ stroke: 1.5, fontSize: "1.3rem" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="inherit">
                            Logout
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </List>
                </Box>
              </MainCard>
            </ClickAwayListener>
          </Transitions>
        )}
      </Popper>
      {dialog}
      {dialogProfilePicture}
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: getState(state.auth?.authData),
});

const mapDispatchToProps = (dispatch) => {
  return {
    setAuthState: (values) => dispatch(setAuthState(values)),
    getLogout: () => dispatch(getLogout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileSection);
