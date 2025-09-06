import { gridSpacing } from "../../store/constants";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SET_BREADCRUMBS } from "../../redux/actions/actions";
import { useDispatch } from "react-redux";

// mui
import {
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";

// custom components
import PageHeaders from "../../utils/ui-components/PageHeaders";
import MainCard from "../../utils/ui-components/MainCard";
// import ProjectStatusChart from "./ProjectStatusChart";
// import ClientJobList from "./ClientAllJob";
import SettingsIcon from "@mui/icons-material/Settings";

// mui icons
// import PersonIcon from "@mui/icons-material/Person";
// import CallIcon from "@mui/icons-material/Call";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DivisionManagement from "./DivisionManagement";
import CalendarManagement from "./CalanderManagement";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import GridViewIcon from "@mui/icons-material/GridView";
// import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
// import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
// import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";

function Configurations(props: { access: string }) {
  const theme: any = useTheme();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [select, setSelect] = useState<number>(0);

  useEffect(() => {
    dispatch({
      type: SET_BREADCRUMBS,
      payload: [
        { name: "Home", path: "/Dashboard", bold: false, state: null },
        {
          name: "Confuigurations",
          path: "",
          bold: true,
          state: state,
        },
      ],
    });
  }, []);

  return (
    <Grid container justifyContent="center" spacing={gridSpacing}>
      <Grid item xs={12}>
        <PageHeaders
          HeaderIcon={<SettingsIcon />}
          headerTitle={"Configurations"}
        />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid item xs={3}>
            <MainCard>
              <Grid container spacing={1}>
                <Grid item xs={12} minHeight={"60vh"}>
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
                    <ListItemButton
                      selected={select === 0}
                      onClick={() => setSelect(0)}
                    >
                      <ListItemIcon>
                        <AccountTreeIcon
                          sx={{ stroke: 1.5, fontSize: "1.3rem" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="inherit">
                            Division
                          </Typography>
                        }
                      />
                    </ListItemButton>
                    <ListItemButton
                      selected={select === 1}
                      onClick={() => setSelect(1)}
                    >
                      <ListItemIcon>
                        <CalendarMonthIcon
                          sx={{ stroke: 1.5, fontSize: "1.3rem" }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body2" color="inherit">
                            Calendar
                          </Typography>
                        }
                      />
                    </ListItemButton>
                    {/* <ListItemButton selected={select === 1} onClick={() => setSelect(1)}>
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
                    </ListItemButton> */}
                  </List>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={9}>
            {select === 0 ? (
              <DivisionManagement access={props.access} />
            ) : select === 1 ? (
              <CalendarManagement />
            ) : select === 2 ? (
              <></>
            ) : select === 3 ? (
              <MainCard />
            ) : select === 4 ? (
              <></>
            ) : select === 5 ? (
              <></>
            ) : (
              <MainCard />
            )}
          </Grid>
          {/* <Grid item xs={8}>
            <ClientJobList />
          </Grid> */}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Configurations;
