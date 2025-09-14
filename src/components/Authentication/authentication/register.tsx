import React, { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { Button, Divider, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import AuthCardWrapper from "../AuthCardWrapper";
import Loader from "../../../utils/ui-components/Loader";
import { Link, useNavigate } from "react-router-dom";
import AuthRegister from "../auth-forms/auth-register";
import { connect } from "react-redux";
import { registerRequest, setRedirectPath } from "../../../redux/actions/actions";
import site_landing_light from "../../../assets/images/site_landing_light.png";
import site_landing_dark from "../../../assets/images/site_landing_dark.png";

function Register(props: any) {
  const {
    registerRequest, // remember, Redux Form injects this into our props
    // setRedirectPath,
    register,
    path,
  } = props;

  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (path) {
  //     navigate(path?.path, path?.state);
  //     // Optionally reset the redirect path in the store after navigating
  //   }
  // }, [navigate, path]);

  return (
    <Grid className="container">
      <Grid container direction="column" justifyContent="center" alignItems="center">
        <AuthCardWrapper maxWidth={{ xs: 400, lg: 1000, md: 770 }}>
          <Grid container spacing={2} alignItems="center" justifyContent="start">
            <Grid item container spacing={2} sx={{ mb: 3 }} alignItems="center" justifyContent="start">
              <Link to="#">
                <img height="85" src={theme.palette.mode === "light" ? site_landing_light : site_landing_dark} alt="" />
              </Link>
            </Grid>
            <Grid item>
              <Grid container direction={matchDownSM ? "column-reverse" : "row"} alignItems="center" justifyContent="center">
                <Grid item>
                  <Stack alignItems="start" justifyContent="center" spacing={1}>
                    <Typography color={theme.palette.grey[600]} gutterBottom variant={matchDownSM ? "h3" : "h2"}>
                      Registration
                    </Typography>
                    <Typography variant="caption" fontSize="16px" textAlign={matchDownSM ? "center" : "inherit"}>
                      Enter your credentials to continue
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <AuthRegister registerRequest={registerRequest} theme={theme} />
            </Grid>
            <Grid item xs={12}>
              <Divider>
                <Typography variant="caption" fontWeight={"bold"}>
                  Have an account?
                </Typography>
              </Divider>
              <Grid item container direction="column" alignItems="center" xs={12} sx={{ mt: 1 }}>
                <Button variant="outlined" onClick={() => navigate("/login")}>
                  <Typography variant="caption" fontWeight={"bold"}>
                    Login Here
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </AuthCardWrapper>
      </Grid>
      {register?.requesting && <Loader />}
    </Grid>
  );
}

const mapStateToProps = (state: any) => ({
  register: state.auth,
  path: state.auth.redirectPath,
});
const mapDispatchToProps = (dispatch: any) => {
  return {
    registerRequest: (values: any) => dispatch(registerRequest(values)),
    setRedirectPath: (path: string, state: any) => dispatch(setRedirectPath(path, state)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
