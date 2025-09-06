import { Container, Grid, Typography } from "@mui/material";
import empty_box from "../../assets/images/empty-box.png";

const EmptyResult = () => {
  return (
    <Container maxWidth="lg">
      <Grid
        container
        direction="row"
        style={{
          height: "40vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Grid item className="empty-cart-cls" textAlign="center">
          <img
            alt=""
            src={empty_box}
            width="130"
            height="130"
            className="img-fluid mb-4 mr-3"
          />
          <Typography color="primary" variant="h4">
            <strong>No Result!</strong>
          </Typography>
          <Typography color="secondary" variant="subtitle1">
            We cannot find the item you are searching for, try again.
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EmptyResult;
