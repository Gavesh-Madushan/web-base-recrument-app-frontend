import { Grid, InputAdornment } from "@mui/material";
import TextFieldWrapper from "../../../../utils/ui-components/FormsUI/TextField";

export default function LeaveEligibility() {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={6}>
        <TextFieldWrapper
          label="Annual Leave"
          name="leaveEligibility.entitledLeaveDaysAnnual"
          InputProps={{
            endAdornment: <InputAdornment position="end">Days</InputAdornment>,
          }}
          // readOnly
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextFieldWrapper
          label="Casual Leave"
          name="leaveEligibility.entitledLeaveDaysCasual"
          InputProps={{
            endAdornment: <InputAdornment position="end">Days</InputAdornment>,
          }}
          // readOnly
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextFieldWrapper
          label="Medical Leave"
          name="leaveEligibility.entitledLeaveDaysMedical"
          InputProps={{
            endAdornment: <InputAdornment position="end">Days</InputAdornment>,
          }}
          // readOnly
        />
      </Grid>
    </Grid>
  );
}
