import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  // useMediaQuery,
} from "@mui/material";

// project imports
import Header from "./Header";
import Sidebar from "./SideBar";
import { drawerWidth } from "../../store/constants";
import { SET_MENU } from "../../redux/actions/actions";
import AuthFooter from "../Footer/AuthFooter";
import { BrowserView } from "react-device-detect";

// styles
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    ...theme.typography.mainContent,
    ...(!open && {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      [theme.breakpoints.up("md")]: {
        marginLeft: -(drawerWidth - 100),
        width: `calc(100% - ${drawerWidth}px)`,
      },
      [theme.breakpoints.down("md")]: {
        width: `calc(100% - ${drawerWidth}px)`,
      },
      [theme.breakpoints.down("sm")]: {
        width: `calc(100% - ${drawerWidth}px)`,
      },
    }),
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      width: `calc(100% - ${drawerWidth}px)`,
    }),
  })
);

const Layout = styled(Box)(({ theme, open }) => ({
  ...theme.typography.mainLayoutContent,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up("md")]: {
      marginLeft: 0,
    },
  }),
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = ({ role }) => {
  const theme = useTheme();
  // const matchDownMd = useMediaQuery(theme.breakpoints.down("lg"));

  // Handle left drawer
  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  const dispatch = useDispatch();
  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
  };

  // useEffect(() => {
  //   dispatch({ type: SET_MENU, opened: !matchDownMd });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [matchDownMd]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* header */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          bgcolor: theme.palette.background.default,
          transition: leftDrawerOpened
            ? theme.transitions.create("width")
            : "none",
        }}
      >
        <Toolbar
          sx={{
            minHeight: "65px", // Change this to your desired height (default is 64px)
            height: "65px", // Set height if you want a fixed height
            px: 2, // Optional: Adjust padding
          }}
        >
          <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
        </Toolbar>
      </AppBar>

      {/* drawer */}
      <Sidebar
        drawerOpen={leftDrawerOpened}
        drawerToggle={handleLeftDrawerToggle}
        role={role}
      />

      {/* main content */}
      <Main theme={theme} open={leftDrawerOpened}>
        <Layout theme={theme} open={leftDrawerOpened}>
          <Outlet />
        </Layout>
        <AuthFooter />
      </Main>
      <BrowserView>
        {/* <Customization /> */}
      </BrowserView>
    </Box>
  );
};

export default MainLayout;
