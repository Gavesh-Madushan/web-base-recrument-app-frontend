import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// custom components
// import EmployeeList from "./Employee/EmployeeList";
import { TabPanel } from "../../../utils/cssStyles";
import { gridSpacing } from "../../../store/constants";
import PageHeaders from "../../../utils/ui-components/PageHeaders";
import WorkIcon from "@mui/icons-material/Work";

// mui
import { useTheme } from "@mui/material/styles";
import { Grid, Tabs, Tab, useMediaQuery } from "@mui/material";

import SortedCandidateList from "./sortList";
// import EmployeeReport from "./EmployeeReport";

function ReportData(props: { access: string }) {
  const theme: any = useTheme();
  const { state } = useLocation();
  const navigate = useNavigate();

  const matchDownmd = useMediaQuery(theme.breakpoints.up("md"));
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!state) {
      navigate("/reports");
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTabValue(0);
  }, [matchDownmd]);

  return (
    <Grid container justifyContent="center" spacing={gridSpacing}>
      <Grid item xs={12}>
        <PageHeaders HeaderIcon={<WorkIcon />} headerTitle={"Report - Job Post"} />
      </Grid>
      <Grid item container xs={12} spacing={1}>
        <Grid item xs={12}>
          <Tabs value={tabValue} onChange={handleChange} variant={"scrollable"}>
            {[
              { value: "PENDING", label: "Pending Candidates" },
              { value: "INTERVIEW_SCHEDULED", label: "Interview Scheduled Candidates" },
              { value: "SHORTLISTED", label: "Short Listed Candidates" },
              { value: "REJECTED", label: "Rejected Candidates" },
            ]?.map((empType, index) => (
              <Tab iconPosition="end" label={empType.label} key={index} />
            ))}
          </Tabs>
          <TabPanel value={tabValue} index={0} key={0}>
            <SortedCandidateList access={props.access} status={"PENDING"} state={state?.formData} />
          </TabPanel>
          <TabPanel value={tabValue} index={1} key={1}>
            <SortedCandidateList access={props.access} status={"INTERVIEW_SCHEDULED"} state={state?.formData} />
          </TabPanel>
          <TabPanel value={tabValue} index={2} key={2}>
            <SortedCandidateList access={props.access} status={"SHORTLISTED"} state={state?.formData} />
          </TabPanel>
          <TabPanel value={tabValue} index={3} key={3}>
            <SortedCandidateList access={props.access} status={"REJECTED"} state={state?.formData} />
          </TabPanel>
        </Grid>
      </Grid>
      {/* {dialog} */}
    </Grid>
  );
}

export default ReportData;
