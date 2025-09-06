import { useEffect, useState } from "react";
import { gridSpacing } from "../../../../store/constants";

// mui
// import { useTheme } from "@mui/material/styles";
import { Grid } from "@mui/material";

// custom components
import JobList from "./JobList";
import { TabPanel } from "../../../../utils/cssStyles";

function ClientJobList({ clientId }: { clientId: number }) {
  // const theme: any = useTheme();

  const [tabValue] = useState(0);

  const [divisionTypes, setDivisionTypes] = useState<{ id: number; name: string; count: number }[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    window.history.replaceState({}, "");
    setDivisionTypes([
      { id: 0, name: "All", count: 29 },
      { id: 1, name: "Division 1", count: 5 },
      { id: 2, name: "Division 2", count: 10 },
      { id: 3, name: "Division 3", count: 4 },
      { id: 4, name: "Division 4", count: 10 },
    ]);
  }, []);

  return (
    <Grid container justifyContent="center" spacing={gridSpacing}>
      <Grid item lg={12} md={12} xs={12}>
        {divisionTypes.map((divType, index) => (
          <TabPanel value={tabValue} index={index} key={index}>
            <JobList divisionType={divType} clientId={clientId} />
          </TabPanel>
        ))}
      </Grid>
    </Grid>
  );
}

export default ClientJobList;
