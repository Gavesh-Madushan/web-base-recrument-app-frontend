import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import * as React from "react";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import InputAdornment from "@mui/material/InputAdornment";
import { useLocation, useNavigate } from "react-router-dom";
import MainCard from "../../../utils/ui-components/MainCard";
import TextField from "../../../utils/ui-components/FormsUI/TextField";
import Checkbox from "../../../utils/ui-components/FormsUI/Checkbox";
import Loader from "../../../utils/ui-components/Loader";
import { openSnackBar } from "../../../utils/ui-components/CustomSnackBar";
// import {AuthService} from "../../../assets/_services/auth-service";
import { connect } from "react-redux";
import { getLogout, setRedirectPath } from "../../../redux/actions/actions";

const MobileNumberEnter = (props: any) => {
  const {
    setRedirectPath,
    getLogout,
    // path,
  } = props;
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    // setRedirectPath(null);
    // if (!location?.state?.token) {
    //     openSnackBar('User cannot be found', 'warning');
    //     navigate("/login");
    // }
    // window.onpopstate = ()=> {
    //     getLogout()
    // }
  }, []);

  const INITIAL_FORM_STATE = {
    mobile: "",
    termsAndPrivacy: false,
  };

  const FORM_VALIDATION = Yup.object().shape({
    mobile: Yup.string()
      .matches(
        /^((880|0)?(1){1}[3456789]{1}(\d){8},?)+$/,
        "Invalid mobile numbers pattern detected"
      )
      .required("Please enter mobile number"),
    termsAndPrivacy: Yup.boolean()
      .required("You must agree to our privacy policy and terms of services")
      .oneOf(
        [true],
        "You must agree to our privacy policy and terms of services"
      ),
  });

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
                    <Formik
                      enableReinitialize
                      initialValues={{
                        ...INITIAL_FORM_STATE,
                      }}
                      validationSchema={FORM_VALIDATION}
                      onSubmit={(values: any) => {
                        setLoading(true);
                        let formData = {
                          mobile: values.mobile,
                        };
                        // AuthService?.validateMobile(formData).then(
                        //     response => {
                        //         if (response.isSuccess) {
                        //             navigate('/verify-mobile', {state: {mobile: values.mobile, token: location?.state?.token, startTime: location?.state?.startTime, expireTime: location?.state?.expireTime}
                        //             });
                        //             setLoading(false);
                        //             openSnackBar(response.data.comment, 'success');
                        //         } else {
                        //             setLoading(false);
                        //         }
                        //     }
                        // )
                        // mobileValidate(values, setLoading, navigate, location?.state?.registrationOTPToken, () => {
                        // }, () => {
                        // });
                      }}
                    >
                      {({ values, dirty, isSubmitting, isValid }) => (
                        <Form>
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
                                  marginBottom={8}
                                >
                                  <Typography
                                    fontWeight="bold"
                                    color={theme.palette.primary.main}
                                    gutterBottom
                                    variant={matchDownSM ? "h2" : "h1"}
                                    textAlign={
                                      matchDownSM ? "center" : "center"
                                    }
                                  >
                                    Mobile Number
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    fontSize="16px"
                                    textAlign={
                                      matchDownSM ? "center" : "center"
                                    }
                                  >
                                    We will send a verification code to this
                                    number
                                  </Typography>
                                </Stack>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              required
                              type="tel"
                              name="mobile"
                              label="Mobile Number"
                              placeholder="1XXXXXXXXX"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    +880
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Stack direction="row" marginTop={3}>
                              <Checkbox
                                name="termsAndPrivacy"
                                color="primary"
                                legend={
                                  <Typography variant="caption" fontSize="14px">
                                    I agree to the{" "}
                                    <a
                                      href="ada-user-react/src/components#"
                                      style={{
                                        textDecoration: "none",
                                        color: theme.palette.primary.main,
                                      }}
                                    >
                                      Terms of Services
                                    </a>{" "}
                                    and{" "}
                                    <a
                                      href="ada-user-react/src/components#"
                                      style={{
                                        textDecoration: "none",
                                        color: theme.palette.primary.main,
                                      }}
                                    >
                                      Privacy Policy
                                    </a>
                                    .
                                  </Typography>
                                }
                                customHandleChange={() => {}}
                              />
                            </Stack>
                          </Grid>
                          {/* <Grid item xs={12} marginY={3}>
                                                        <Divider sx={{backgroundColor: theme.palette.divider}}/>
                                                    </Grid> */}
                          <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            sx={{ mb: 2 }}
                            // disabled={!isValid || isSubmitting || loading}

                            color="primary"
                          >
                            VERIFY MOBILE
                          </Button>
                          <Grid item xs={12}>
                            <Divider sx={{ mb: 2 }} />
                          </Grid>
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
                        </Form>
                      )}
                    </Formik>
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

// export function mobileValidate(values: any, setLoading: Function, navigate: Function, userId: string, clearOTP: Function, resetTimer: Function) {
//     setLoading(true);
//     let formData = {
//         mobile: values.mobile
//     }
//     AuthService.validateMobile(formData).then(
//         response => {
//             if (response.isSuccess) {
//                 navigate('/verify-mobile', {
//                     state: {
//                         mobile: values.mobile
//                     }
//                 });
//                 setLoading(false);
//                 openSnackBar(response.data.comment, 'success');
//                 clearOTP();
//                 resetTimer();
//             } else {
//                 setLoading(false);
//             }
//         }
//     )
// }

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

export default connect(mapStateToProps, mapDispatchToProps)(MobileNumberEnter);
