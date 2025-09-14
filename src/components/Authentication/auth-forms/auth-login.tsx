import React, { useState } from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
import FormControl from "@mui/material/FormControl";
import { Box, Button, FormControlLabel, FormHelperText, InputAdornment, InputLabel, OutlinedInput, Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Checkbox from "@mui/material/Checkbox";
import AnimateButton from "../../../utils/ui-components/AnimateButton";

AuthLogin.propTypes = {
  theme: PropTypes.object.isRequired,
  loginRequest: PropTypes.func,
  rememberMe: PropTypes.shape({
    usuario: PropTypes.string,
    clave: PropTypes.string,
    recuerdame: PropTypes.bool,
  }),
};

function AuthLogin({ loginRequest, rememberMe, theme, ...others }: any) {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        username: rememberMe?.usuario || "",
        password: rememberMe?.clave || "",
        rememberMe: rememberMe?.recuerdame || false,
      }}
      validationSchema={Yup.object().shape({
        username: Yup.string().email("Plase enter a valid email address").required("Please enter mobile number"),
        password: Yup.string()
          .max(50)
          .required("Password is required")
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
          ),
        rememberMe: Yup.boolean().required("Required"),
      })}
      onSubmit={async (values) => {
        loginRequest(values);
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }: any) => (
        <form noValidate onSubmit={handleSubmit} {...others}>
          <FormControl fullWidth error={Boolean(touched.username && errors.username)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-username-login">username</InputLabel>
            <OutlinedInput
              id="outlined-adornment-mobile-login"
              type="text"
              value={values.username}
              name="username"
              onBlur={handleBlur}
              onChange={handleChange}
              label="Username"
              inputProps={{}}
              sx={{ borderRadius: 4 }}
            />
            {touched.username && errors.username && (
              <FormHelperText error id="standard-weight-helper-text-email-login">
                {errors.username}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password-login"
              type={showPassword ? "text" : "password"}
              value={values.password}
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              inputProps={{}}
              sx={{ borderRadius: 4 }}
            />
            {touched.password && errors.password && (
              <FormHelperText error id="standard-weight-helper-text-password-login">
                {errors.password}
              </FormHelperText>
            )}
          </FormControl>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <FormControlLabel
              control={<Checkbox checked={values.rememberMe} onChange={handleChange} name="rememberMe" color="primary" />}
              label="Remember me"
            />
            {/*<Typography variant="subtitle1" color="primary"*/}
            {/*            sx={{textDecoration: 'none', cursor: 'pointer'}}>*/}
            {/*    Forgot Password?*/}
            {/*</Typography>*/}
          </Stack>
          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            <AnimateButton>
              <Button
                disableElevation
                disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Sign in
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  );
}

export default AuthLogin;
