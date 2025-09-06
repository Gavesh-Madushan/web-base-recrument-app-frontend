import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Avatar, CircularProgress, Grid, InputAdornment, Stack, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
import TextField from "../../../../utils/ui-components/FormsUI/TextField";
import React, { useState } from "react";
import { openSuccessDialog } from "../../../../utils/ui-components/pop-ups/SuccessDialog";
import ButtonWrapper from "../../../../utils/ui-components/FormsUI/Button";
import { convert_to_proper_case } from "../../../../utils/utils";
import { replaceEmployeePassword } from "../../../../assets/api";

function ResetEmployeePassword({
  setOpen,
  initialItem,
}: {
  setOpen: (b: boolean) => void;
  initialItem: {
    id: number;
    emp_no: string;
    division: string;
    designation: "MANAGER" | "DIVISION_HEAD" | "HR_MANAGER" | "FINANCE_MANAGER" | "ENGINEER" | "TECHNICIAN" | "ASSISTANT_ENGINEER";
    nic: string;
    name_with_initials: string;
    name: string;
    mobile: string;
    status: string;
  };
}) {
  const [passwordShow, setPasswordShow] = React.useState({
    newPassword: "",
    showNewPassword: false,
    confirmPassword: "",
    showConfirmPassword: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const FORM_VALIDATION = Yup.object().shape({
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

  const resetPassword = (itemData, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true);
    replaceEmployeePassword({ id: initialItem?.id, password: itemData.newPassword })
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
        newPassword: "",
        confirmPassword: "",
      }}
      enableReinitialize
      validationSchema={FORM_VALIDATION}
      onSubmit={(values, { setSubmitting }) => {
        resetPassword(values, setSubmitting);
      }}
    >
      {({ dirty, isSubmitting, isValid }) => (
        <Form>
          <Grid container spacing={1}>
            <Grid item xs={12} container spacing={2}>
              <Grid item>
                <Avatar sx={{ width: 55, height: 55 }}></Avatar>
              </Grid>
              <Grid item xs={8}>
                <Stack direction="column">
                  <Typography variant="caption" fontWeight={"bold"}>
                    Emp No : {initialItem.emp_no}
                  </Typography>
                  <Typography variant="caption" fontWeight={"bold"}>
                    Name : {initialItem.name}
                  </Typography>
                  <Typography variant="caption" fontWeight={"bold"}>
                    Designation : {convert_to_proper_case(initialItem.designation)}
                  </Typography>
                </Stack>
              </Grid>
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
                )}
                Save password
              </ButtonWrapper>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}

export default ResetEmployeePassword;
