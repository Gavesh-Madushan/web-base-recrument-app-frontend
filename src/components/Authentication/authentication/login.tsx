import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { Button, Divider, Grid, Stack, Typography, useMediaQuery } from "@mui/material";
import AuthCardWrapper from "../AuthCardWrapper";
import Loader from "../../../utils/ui-components/Loader";
import AuthLogin from "../auth-forms/auth-login";
import { Link, useNavigate } from "react-router-dom";
import { getLogout, getState, loginRequest, setRedirectPath } from "../../../redux/actions/actions";
import site_landing_light from "../../../assets/images/site_landing_light.png";
import site_landing_dark from "../../../assets/images/site_landing_dark.png";

function Login(props: any) {
  const {
    loginRequest, // remember, Redux Form injects this into our props
    setRedirectPath,
    login,
    path,
    rememberMe,
  } = props;

  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLogout());
  }, []);

  useEffect(() => {
    if (path?.path === "/login") {
      setRedirectPath(null);
    } else if (path) {
      navigate(path?.path, path?.state);
      // Optionally reset the redirect path in the store after navigating
    }
  }, [navigate, path]);

  return (
    <Grid className="container">
      <Grid container direction="column" justifyContent="center" alignItems="center">
        <AuthCardWrapper>
          <Grid container spacing={2} alignItems="center" justifyContent="start">
            <Grid item container spacing={2} alignItems="center" justifyContent="start">
              <Grid item>
                <img height="85" src={theme.palette.mode === "light" ? site_landing_light : site_landing_dark} alt="logo" />
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction={matchDownSM ? "column-reverse" : "row"} alignItems="center" justifyContent="center">
                <Grid item>
                  <Stack alignItems="start" justifyContent="start" spacing={1}>
                    <Typography fontWeight="bold" color={theme.palette.grey[600]} gutterBottom variant={matchDownSM ? "h3" : "h2"}>
                      Hi, Welcome Back
                    </Typography>
                    <Typography variant="caption" fontSize="16px" textAlign={matchDownSM ? "center" : "inherit"}>
                      Enter your credentials to continue
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
            <Grid item style={{ width: "100%", marginTop: 20 }}>
              <AuthLogin rememberMe={getState(rememberMe)} loginRequest={loginRequest} theme={theme} />
            </Grid>
            <Grid item xs={12}>
              <Divider>
                <Typography variant="caption" fontWeight={"bold"}>
                  Don't have an account?
                </Typography>
              </Divider>
              <Grid item container direction="column" alignItems="center" xs={12} sx={{ mt: 1 }}>
                <Button variant="outlined" onClick={() => navigate("/signup")}>
                  <Typography variant="caption" fontWeight={"bold"}>
                    Register Here
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </AuthCardWrapper>
      </Grid>
      {login?.requesting && <Loader />}
    </Grid>
  );
}

const mapStateToProps = (state: any) => ({
  login: state.auth,
  path: state.auth.redirectPath,
  rememberMe: state.rememberMe?.rememberMeData,
});
const mapDispatchToProps = (dispatch: any) => {
  return {
    loginRequest: (values: any) => dispatch(loginRequest(values)),
    setRedirectPath: (path: string, state: any) => dispatch(setRedirectPath(path, state)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
