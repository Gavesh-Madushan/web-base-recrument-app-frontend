import PropTypes from "prop-types";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Avatar, Box, ButtonBase, Grid, IconButton, Tooltip } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
// import HomeIcon from "@mui/icons-material/Home";
// import NavigateNextIcon from "@mui/icons-material/NavigateNext";

// project imports
import LogoSection from "../LogoSection";
import ProfileSection from "./ProfileSection";
// import NotificationSection from './NotificationSection';
import { useDispatch } from "react-redux";
import { SET_MODE, SET_SYSTEM_MODE } from "../../../redux/actions/actions";
import { gridSpacing } from "../../../store/constants";
// import { StyledBreadcrumb } from "../../../utils/cssStyles";
// import { useNavigate } from "react-router-dom";

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleLeftDrawerToggle }: any) => {
  const theme: any = useTheme();
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const customization = useSelector((state: any) => state.customization);
  // const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,
          display: "flex",
          [theme.breakpoints.down("md")]: {
            width: "auto",
          },
        }}
      >
        <Box component="span" sx={{ display: { xs: "none", md: "block" }, flexGrow: 1 }}>
          <LogoSection theme={theme} />
        </Box>
        <ButtonBase sx={{ borderRadius: "12px", overflow: "hidden" }}>
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              transition: "all .2s ease-in-out",
              background: theme.palette.primary.light,
              color: theme.palette.primary.dark,
              "&:hover": {
                background: theme.palette.primary.dark,
                color: theme.palette.primary.light,
              },
            }}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-menu-2"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M4 6l16 0"></path>
              <path d="M4 12l16 0"></path>
              <path d="M4 18l16 0"></path>
            </svg>
          </Avatar>
        </ButtonBase>
      </Box>

      {/* header search */}
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />
      {/* mode, notification & profile */}
      <Grid container justifyContent={"right"} alignItems="center">
        <Grid item>
          <Grid container justifyContent="right" alignItems="center" columnSpacing={gridSpacing}>
            <Grid item>
              <Tooltip title="Mode">
                <IconButton
                  sx={{ ml: 1 }}
                  onClick={() => {
                    dispatch({ type: SET_SYSTEM_MODE, systemMode: false });
                    dispatch({
                      type: SET_MODE,
                      mode: theme.palette.mode === "light" ? "dark" : "light",
                    });
                  }}
                >
                  {theme.palette.mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
            </Grid>
            {/* <NotificationSection/> */}
            <Grid item>
              <ProfileSection />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func,
};

export default Header;
