import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { GridOverlay } from "@mui/x-data-grid";
import empty_box from "../../assets/images/empty-box.png";

const StyledGridOverlay = styled(GridOverlay)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  "& .ant-empty-img-1": {
    fill: theme.palette.mode === "light" ? theme.palette.info.main : "#262626",
  },
  "& .ant-empty-img-2": {
    fill: theme.palette.mode === "light" ? theme.palette.primary.light : "#595959",
  },
  "& .ant-empty-img-3": {
    fill: theme.palette.mode === "light" ? theme.palette.secondary.main : "#434343",
  },
  "& .ant-empty-img-4": {
    fill: theme.palette.mode === "light" ? "#fff" : "#1c1c1c",
  },
  "& .ant-empty-img-5": {
    fillOpacity: theme.palette.mode === "light" ? "0.8" : "0.08",
    fill: theme.palette.mode === "light" ? "#f5f5f5" : "#fff",
  },
}));
const EmptyResultDataGrid = () => {
  return (
    <StyledGridOverlay>
      <Grid
        container
        direction="row"
        style={{
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item className="empty-cart-cls" textAlign="center">
          <img alt="" src={empty_box} width="130" height="130" className="img-fluid mb-4 mr-3" />
          <Typography color="primary" variant="h4">
            <strong>No Result!</strong>
          </Typography>
          <Typography color="secondary" variant="subtitle1">
            We cannot find the item you are searching for, try again.
          </Typography>
        </Grid>
      </Grid>
    </StyledGridOverlay>
  );
};

export default EmptyResultDataGrid;
