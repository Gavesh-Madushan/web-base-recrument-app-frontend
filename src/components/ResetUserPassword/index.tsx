import PropTypes from "prop-types";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { CircularProgress, Grid, InputAdornment } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
import TextField from "../../utils/ui-components/FormsUI/TextField";
import React, { useState } from "react";
import { openSuccessDialog } from "../../utils/ui-components/pop-ups/SuccessDialog";
import ButtonWrapper from "../../utils/ui-components/FormsUI/Button";
import { replaceMyPassword } from "../../assets/api";
import { applyGlobalValidations } from "../../utils/utils";

export interface UpdatePasswordValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

ResetUserPassword.propTypes = {
  setOpen: PropTypes.func.isRequired,
};

function ResetUserPassword({ setOpen }: any) {
  const [passwordShow, setPasswordShow] = React.useState({
    oldPassword: "",
    showOldPassword: false,
    newPassword: "",
    showNewPassword: false,
    confirmPassword: "",
    showConfirmPassword: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const FORM_VALIDATION = Yup.object().shape({
    oldPassword: Yup.string()
      .max(50)
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    newPassword: Yup.string()
      .max(50)
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("newPassword")], "Your passwords do not match.")
      .required("Please retype your password."),
  });

  const handleClickShowOldPassword = () => {
    setPasswordShow({
      ...passwordShow,
      showOldPassword: !passwordShow.showOldPassword,
    });
  };

  const handleClickShowNewPassword = () => {
    setPasswordShow({
      ...passwordShow,
      showNewPassword: !passwordShow.showNewPassword,
    });
  };

  const handleClickShowConfirmPassword = () => {
    setPasswordShow({
      ...passwordShow,
      showConfirmPassword: !passwordShow.showConfirmPassword,
    });
  };

  const resetPassword = (itemData: UpdatePasswordValues, setSubmitting: (isSubmitting: boolean) => void) => {
    const formData = {
      oldPassword: itemData.oldPassword,
      newPassword: itemData.newPassword,
    };
    setIsLoading(true);
    replaceMyPassword(formData)
      .then((response) => {
        if (response.status === 204) {
          setOpen(false);
          setIsLoading(false);
          openSuccessDialog("Success", "Password reset succefully");
        } else {
          setIsLoading(false);
          setSubmitting(false);
        }
      })
      .finally(() => {
        setIsLoading(false);
        setSubmitting(false);
      });
  };

  return (
    <Formik
      initialValues={{
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }}
      enableReinitialize
      validationSchema={applyGlobalValidations(FORM_VALIDATION)}
      onSubmit={(values: any, { setSubmitting }) => {
        resetPassword(values, setSubmitting);
      }}
    >
      {({ dirty, isSubmitting, isValid }) => (
        <Form>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                required
                type={passwordShow.showOldPassword ? "text" : "password"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility" onClick={handleClickShowOldPassword} edge="end">
                        {passwordShow.showOldPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                name="oldPassword"
                // label="Password"
                placeholder="Old Password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                type={passwordShow.showNewPassword ? "text" : "password"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility" onClick={handleClickShowNewPassword} edge="end">
                        {passwordShow.showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                name="newPassword"
                // label="Password"
                placeholder="New Password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                type={passwordShow.showConfirmPassword ? "text" : "password"}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility" onClick={handleClickShowConfirmPassword} edge="end">
                        {passwordShow.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                name="confirmPassword"
                // label="Confirm Password"
                placeholder="Confirm Password"
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                py: 2,
              }}
            >
              <ButtonWrapper color="primary" variant="contained" type="submit" disabled={!dirty || isSubmitting || !isValid}>
                {isLoading && (
                  <CircularProgress
                    size={"20px"}
                    sx={{
                      mr: 1,
                      color: "gray",
                    }}
                  />
                )}{" "}
                Save password
              </ButtonWrapper>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

export default ResetUserPassword;
