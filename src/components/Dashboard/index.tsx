import { useEffect, useState } from "react";
import { gridSpacing } from "../../store/constants";
import { Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import OutputIcon from "@mui/icons-material/Output";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import { getTimeWelcome } from "../../utils/utils";
import { getState, SET_BREADCRUMBS } from "../../redux/actions/actions";
import { connect } from "react-redux";
import HomeIcon from "@mui/icons-material/Home";
import SummaryCard from "./summary-card";
import { DashboardDaliyAttandace } from "./DashboardDaliyAttandace";
import dayjs from "dayjs";
import PageHeaders from "../../utils/ui-components/PageHeaders";
import CheckInDashboard from "./check-in-dashboard";
import { useDispatch } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { DashboardDaliyLeaves } from "./DashboardDailyLeaves";

function Dashboard(props: any) {
  const { auth, access } = props;

  const theme: any = useTheme();
  const dispatch = useDispatch();

  const listCounts: any = () => {};

  const [selectedTab] = useState(0);
  // const [selectedTab, setSelectedTab] = useState(0);
  // const [selectedMarker, setSelectedMarker] = useState(0);

  useEffect(() => {
    dispatch({
      type: SET_BREADCRUMBS,
      payload: [],
    });
  }, []);

  return (
    <Grid container rowSpacing={gridSpacing} columnSpacing={1} justifyContent={"center"}>
      <Grid item md={7} xs={7}>
        <PageHeaders HeaderIcon={<HomeIcon />} headerTitle={"Dashboard"} />
      </Grid>
      <Grid item textAlign="end" md={5} xs={5}>
        <Typography color={theme.palette.info.main} variant="h4" gutterBottom>
          {getTimeWelcome()}
        </Typography>
        <Typography color="primary" variant="h3" gutterBottom>
          <b>Hi {auth?.nameInitials}</b>
        </Typography>
        {/* <Typography color="secondary" gutterBottom>
          All systems are running smoothly!
        </Typography> */}
      </Grid>
      {access[0] === "1" && (
        <Grid item md={12} sm={12} xs={12} bgcolor="green">
          <CheckInDashboard />
        </Grid>
      )}

      <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
        <Grid container spacing={1} justifyContent={"flex-end"}>
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <SummaryCard
              title="Check In"
              isLoading={listCounts.isFetching}
              OptionIcon={<CheckCircleOutlineIcon fontSize="medium" />}
              value={listCounts.data?.data.clockedInNotClockedOutUsersCount || 0}
              sx={{ height: "100%" }}
              color="green"
              selected={selectedTab == 1}
              onClick={() => {}}
            />
          </Grid>
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <SummaryCard
              title="Check Out"
              isLoading={listCounts.isFetching}
              OptionIcon={<OutputIcon fontSize="medium" />}
              value={listCounts.data?.data.clockedInAndClockedOutUsersCount || 0}
              sx={{ height: "100%" }}
              color="red"
              selected={selectedTab == 2}
              onClick={() => {}}
            />
          </Grid>
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <SummaryCard
              title="Late"
              isLoading={listCounts.isFetching}
              OptionIcon={<WatchLaterIcon fontSize="medium" />}
              value={listCounts.data?.data.lateUsersCount || 0}
              sx={{ height: "100%" }}
              color="orange"
              selected={selectedTab == 3}
              onClick={() => {}}
            />
          </Grid>
          <Grid item xl={3} lg={3} md={6} sm={6} xs={12}>
            <SummaryCard
              title="Leave"
              isLoading={listCounts.isFetching}
              OptionIcon={<ExitToAppIcon fontSize="medium" />}
              value={listCounts.data?.data.onLeaveUsersCount || 0}
              sx={{ height: "100%" }}
              color="blue"
              selected={selectedTab == 4}
              onClick={() => {}}
              // onClick={() => setSelectedTab(4)}
            />
          </Grid>
        </Grid>
      </Grid>

      <Grid item xl={7} lg={6} md={12} sm={12} xs={12}>
        <DashboardDaliyAttandace auth={auth} sx={{ height: "100%" }} />
      </Grid>
      <Grid item xl={5} lg={6} md={12} sm={12} xs={12}>
        <DashboardDaliyLeaves auth={auth} sx={{ height: "100%" }} />
      </Grid>
    </Grid>
  );
}

const mapStateToProps = (state: any) => ({
  auth: getState(state.auth.authData),
});

export default connect(mapStateToProps)(Dashboard);
