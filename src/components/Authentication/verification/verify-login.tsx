import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLocation, useNavigate } from "react-router-dom";
import CachedIcon from "@mui/icons-material/Cached";
import MainCard from "../../../utils/ui-components/MainCard";
import CountdownTimer from "../../../utils/ui-components/count-down";
import OtpInput from "../../../utils/ui-components/otp-input";
import Loader from "../../../utils/ui-components/Loader";
import { openSnackBar } from "../../../utils/ui-components/CustomSnackBar";
// import {AuthService} from "../../../assets/_services/auth-service";
import { connect, useDispatch } from "react-redux";
import {
  getLogout,
  setRedirectPath,
  getLoginSuccess,
} from "../../../redux/actions/actions";
import { CircularProgress } from "@mui/material";

const numInputs = 6;
const LoginVerification = (props: any) => {
  const {
    setRedirectPath,
    getLogout,
    // path,
  } = props;

  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  const token = location?.state?.token;
  const mobile = location?.state?.mobile || "";
  const startTime = location?.state?.startTime;
  const dateTimeAfterThreeDays = startTime + location?.state?.expireTime;
  const enableGetOtpTime = 60000;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [disabledTime, setDisabledTime] = useState(
    startTime + enableGetOtpTime
  );
  const [countDown, setCountDown] = useState(
    disabledTime - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (countDown > 0) {
        setCountDown(disabledTime - new Date().getTime());
      }
    }, 500);

    return () => clearInterval(interval);
  }, [countDown]);

  const clearOtp = () => {
    setOtp("");
  };

  const renderer = ({ days, hours, minutes, seconds, onCompleted }: any) => {
    if (onCompleted) {
      return (
        <Typography variant="h3" color="error">
          00 : 00
        </Typography>
      );
    } else {
      return (
        <Typography variant="h3" color="success">
          {minutes} : {seconds}
        </Typography>
      );
    }
  };

  const verify = (values: any) => {
    setLoading(true);
    const formData = {
      loginOTP: values,
    };
    // AuthService?.verifyLogin(formData).then(
    //     response => {
    //         if(response.isSuccess){
    //             getLogout()
    //             navigate("/login");
    //             dispatch(getLoginSuccess(response.data))
    //             setLoading(false)
    //         }else{
    //             setLoading(false)
    //         }
    //     }
    // )
  };

  const otpGet = () => {
    setLoadingOtp(true);
    // AuthService?.resendLoginOtp().then(
    //     response => {
    //         if(response?.isSuccess){
    //             setLoadingOtp(false)
    //             openSnackBar('OTP send to your mobile number', 'success');
    //             // setDateTimeAfterThreeDays(new Date().getTime() + location?.state?.expireTime)
    //             setDisabledTime(new Date().getTime() + enableGetOtpTime)
    //             setCountDown(enableGetOtpTime);
    //         }else{
    //             getLogout()
    //             setLoadingOtp(false)
    //             navigate('/login')
    //         }
    //     }
    // )
  };

  useEffect(() => {
    setRedirectPath(null);
    // window.onpopstate = ()=> {
    //     getLogout()
    // }
    // if (!token) {
    //     openSnackBar('User data cannot be found', 'warning');
    //     navigate("/login");
    // } else if(!mobile){
    //     openSnackBar('User mobile cannot be found', 'warning');
    //     navigate("/login");
    // }
  }, []);

  return (
    <Grid className="container">
      <Grid container direction="column" justifyContent="center">
        <Grid item xs={12}>
          <Grid container justifyContent="center" alignItems="center">
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <MainCard
                sx={{
                  maxWidth: { xs: 400, lg: 475 },
                  "& > *": {
                    flexGrow: 1,
                    flexBasis: "50%",
                  },
                }}
                content={false}
              >
                <Box sx={{ p: { xs: 3, sm: 3, xl: 5 } }}>
                  <Grid container alignItems="center" justifyContent="center">
                    <Grid item xs={12}>
                      <Grid
                        container
                        direction={matchDownSM ? "column-reverse" : "row"}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Grid item>
                          <Stack
                            alignItems="center"
                            justifyContent="center"
                            spacing={1}
                            marginBottom={6}
                          >
                            <Typography
                              fontWeight="bold"
                              color={theme.palette.primary.main}
                              gutterBottom
                              variant={matchDownSM ? "h2" : "h1"}
                              textAlign={matchDownSM ? "center" : "center"}
                            >
                              Verification Code
                            </Typography>
                            <Typography
                              variant="caption"
                              fontSize="16px"
                              textAlign={matchDownSM ? "center" : "center"}
                            >
                              Enter the 6-digit code we've sent to +880*******
                              {mobile.slice(-3)}
                            </Typography>
                          </Stack>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <CountdownTimer
                          date={dateTimeAfterThreeDays}
                          renderer={renderer}
                          clear={clearOtp}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} marginTop={2}>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <OtpInput
                          shouldAutoFocus
                          value={otp}
                          onChange={setOtp}
                          numInputs={numInputs}
                          inputType="text"
                          renderSeparator={
                            <span style={{ padding: 5 }}> - </span>
                          }
                          renderInput={(props) => (
                            <input
                              {...props}
                              style={{
                                width: matchDownSM ? "2.1em" : "3.5em",
                                height: matchDownSM ? "2.5em" : "3.5em",
                                textAlign: "center",
                                display: "inline-block",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                boxSizing: "border-box",
                              }}
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} marginTop={2} textAlign="center">
                      <Button
                        type="button"
                        color="info"
                        variant="contained"
                        disabled={otp.trim() === ""}
                        onClick={clearOtp}
                        sx={{ m: 2 }}
                      >
                        Clear
                      </Button>
                      <Button
                        color="info"
                        type="button"
                        variant="contained"
                        disabled={loadingOtp || countDown > 0}
                        startIcon={
                          loadingOtp ? (
                            <CircularProgress
                              color="inherit"
                              sx={{ mr: 1 }}
                              size={20}
                            />
                          ) : (
                            <CachedIcon />
                          )
                        }
                        onClick={otpGet}
                      >
                        Get OTP
                      </Button>
                    </Grid>
                    <Grid item xs={12} marginY={3}>
                      <Divider
                        sx={{ backgroundColor: theme.palette.divider }}
                      />
                    </Grid>
                    <Button
                      fullWidth
                      variant="contained"
                      disabled={otp.length !== numInputs || loading}
                      color="primary"
                      onClick={() => verify(otp)}
                    >
                      VERIFY
                    </Button>
                    <Grid item>
                      <Grid
                        item
                        container
                        direction="column"
                        alignItems="center"
                        xs={12}
                      >
                        <Button
                          type="button"
                          onClick={() => {
                            getLogout();
                            navigate("/login");
                          }}
                        >
                          Back to Login
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </MainCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {loading && <Loader />}
    </Grid>
  );
};

const mapStateToProps = (state: any) => ({
  path: state.auth.redirectPath,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    setRedirectPath: (path: string, state: any) =>
      dispatch(setRedirectPath(path, state)),
    getLogout: () => dispatch(getLogout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginVerification);
