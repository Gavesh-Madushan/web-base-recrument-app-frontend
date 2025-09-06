import PropTypes from "prop-types";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Drawer, useMediaQuery } from "@mui/material";

// third-party
import { BrowserView, MobileView } from "react-device-detect";

// project imports
import MenuList from "./MenuList";
import LogoSection from "../LogoSection";
import { drawerWidth } from "../../../store/constants";
// import NavItem from "./MenuList/NavItem";
// import LogoutIcon from "@mui/icons-material/Logout";

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = ({ drawerOpen, drawerToggle, window, role }: any) => {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));

  const drawer = (
    <>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Box sx={{ display: "flex", p: 2, mx: "auto" }}>
          <LogoSection theme={theme} />
        </Box>
      </Box>
      <BrowserView>
        <Box
          component="div"
          style={{
            height: !matchUpMd ? "calc(100vh - 65px)" : "calc(100vh - 65px)",
            paddingLeft: "10px",
            paddingRight: "16px",
            overflowX: "hidden",
          }}
        >
          <MenuList role={role} />
        </Box>
      </BrowserView>
      <MobileView>
        {/* <Box sx={{ px: 2 }}>
          <MenuList role={role} />
        </Box> */}
        <Box
          component="div"
          style={{
            height: !matchUpMd ? "calc(100vh - 72px)" : "calc(100vh - 72px)",
            paddingLeft: "16px",
            paddingRight: "16px",
            overflowX: "hidden",
          }}
        >
          <MenuList role={role} />
        </Box>
      </MobileView>
    </>
  );

  const container = window !== undefined ? () => window.document.body : undefined;

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { md: 0 },
        width: matchUpMd ? (drawerOpen ? drawerWidth : 215) : "auto",
      }}
      aria-label="mailbox folders"
    >
      <Drawer
        container={container}
        variant={matchUpMd ? "persistent" : "temporary"}
        anchor="left"
        open={matchUpMd ? true : drawerOpen}
        onClose={drawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: matchUpMd ? (drawerOpen ? drawerWidth : 75) : drawerWidth,
            background: theme.palette.background.default,
            color: theme.palette.text.primary,
            borderRight: "none",
            [theme.breakpoints.up("md")]: {
              top: "65px",
            },
            transition: theme.transitions.create("margin", {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

Sidebar.propTypes = {
  drawerOpen: PropTypes.bool,
  drawerToggle: PropTypes.func,
  window: PropTypes.object,
  role: PropTypes.number,
};

export default Sidebar;
