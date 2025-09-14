import { Box, Button, FormHelperText, Grid, IconButton, InputAdornment, Tab, Tabs, TextField, Typography } from "@mui/material";
import * as Yup from "yup";
import { Formik } from "formik";
import { useState } from "react";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link, useNavigate } from "react-router-dom";
import AnimateButton from "../../../utils/ui-components/AnimateButton";
import PropTypes from "prop-types";
import LockIcon from "@mui/icons-material/Lock";
import MultipleSelectCheckmarksWrapper from "../../../utils/ui-components/FormsUI/MultipleSelectCheckmarks";
import SelectWrapper from "../../../utils/ui-components/FormsUI/Select";
import { listJobPositions, useListJobCategories } from "../../../kubb";
import { useQuery } from "@tanstack/react-query";

export const districts = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
];

export const cities = [
  "Colombo",
  "Dehiwala",
  "Mount Lavinia",
  "Negombo",
  "Gampaha",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
  "Kolonnawa",
  "Kotte",
  "Maharagama",
  "Homagama",
  "Moratuwa",
  "Ratmalana",
  "Nugegoda",
  "Wattala",
  "Ja-Ela",
  "Kelaniya",
  "Kiribathgoda",
  "Kadawatha",
  "Ragama",
  "Minuwangoda",
  "Panadura",
  "Beruwala",
  "Aluthgama",
  "Wadduwa",
  "Horana",
  "Peradeniya",
  "Gampola",
  "Katugastota",
  "Digana",
  "Kadugannawa",
  "Dambulla",
  "Sigiriya",
  "Ukuwela",
  "Rattota",
  "Hatton",
  "Talawakelle",
  "Bandarawela",
  "Ella",
  "Ambalangoda",
  "Karapitiya",
  "Weligama",
  "Mirissa",
  "Tangalle",
  "Kamburugamuwa",
  "Tissamaharama",
  "Kataragama",
  "Beliatta",
  "Puttalam",
  "Omanthai",
  "Mannar",
  "Pesalai",
  "Madhu",
  "Kinniya",
  "Muttur",
  "Nilaveli",
  "Kalmunai",
  "Sainthamaruthu",
  "Pottuvil",
  "Akkaraipattu",
  "Kantale",
  "Mihintale",
  "Kekirawa",
  "Thalawa",
  "Eppawala",
  "Medirigiriya",
  "Hingurakgoda",
  "Kuliyapitiya",
  "Nikaweratiya",
  "Wariyapola",
  "Hettipola",
  "Rambukkana",
  "Ruwanwella",
  "Monaragala",
  "Bibile",
  "Wellawaya",
  "Kataragama",
  "Eheliyagoda",
  "Balangoda",
  "Pelmadulla",
  "Embilipitiya",
  "Warakapola",
];

AuthRegister.propTypes = {
  theme: PropTypes.object.isRequired,
  registerRequest: PropTypes.func,
};

function AuthRegister({ registerRequest, theme, ...others }: any) {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  const [passwordShow, setPasswordShow] = useState({
    password: "",
    showPassword: false,
    confirmPassword: "",
    showConfirmPassword: false,
  });
  const [tabValue, setTabValue] = useState(0);
  const [categoryId, setCategoryId] = useState(0);

  const handleChangeTabs = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleClickShowOldPassword = () => {
    setPasswordShow({
      ...passwordShow,
      showPassword: !passwordShow.showPassword,
    });
  };

  const handleClickShowConfirmPassword = () => {
    setPasswordShow({
      ...passwordShow,
      showConfirmPassword: !passwordShow.showConfirmPassword,
    });
  };

  const listJobCategory = useListJobCategories({
    page: 0,
    pageSize: 50,
  });

  const listJobPosition = useQuery({
    queryKey: ["job-positions", Number(categoryId)],
    queryFn: () =>
      listJobPositions({
        categoryId: Number(categoryId),
        page: 0,
        pageSize: 50,
      }),
    // enabled: false,s
    select: (res) => {
      return res.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
    },
  });

  return (
    <Formik
      initialValues={{
        email: "",
        fullName: "",
        description: "",
        password: "",
        confirmPassword: "",
        categoryId: "",
        prferedJobPostingIds: [],
      }}
      validationSchema={Yup.object().shape({
        fullName: Yup.string().required("Please enter Full Name"),
        email: Yup.string().email("Must be a valid email").max(255).required("Please enter Email"),
        description: Yup.string().required("Please enter description"),
        prferedJobPostingIds:
          tabValue === 1
            ? Yup.array().required("You must make a selection").min(1, "Please select at least 2 job positions")
            : Yup.array().notRequired(),
        categoryId: tabValue === 1 ? Yup.string().required("You must make a selection") : Yup.string().notRequired(),
        password: Yup.string()
          .max(50)
          .required("Password is required")
          .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
          ),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password")], "Your passwords do not match.")
          .required("Please retype your password."),
      })}
      onSubmit={async (values) => {
        registerRequest({
          ...values,
          role: tabValue === 0 ? "COMPANY" : "CANDIDATE",
          prferedJobPostingIds: values.prferedJobPostingIds.map((item) => Number(item?.value)),
        });
        navigate("/login");
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values, isValid }) => (
        <form noValidate onSubmit={handleSubmit} {...others}>
          <Grid container columnSpacing={1}>
            <Grid item xs={12}>
              <Tabs value={tabValue} onChange={handleChangeTabs} variant={"scrollable"}>
                {[
                  { value: "COMPANY", label: "Company" },
                  { value: "CANDIDATE", label: "Candidates" },
                ]?.map((empType, index) => (
                  <Tab iconPosition="end" label={empType.label} key={index} />
                ))}
              </Tabs>
            </Grid>
            <Grid item xs={12} lg={12} md={12}>
              <Grid container columnSpacing={1}>
                <Grid item xs={12} md={12} lg={12}>
                  <TextField
                    required
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    type="text"
                    value={values.fullName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    // size='small'
                    error={Boolean(touched.fullName && errors.fullName)}
                    sx={{ ...theme.typography.customInput }}
                    helperText={touched.fullName && errors.fullName && errors.fullName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Email Address"
                    name="email"
                    placeholder="xxxxxxxx@xxx.xx"
                    type="email"
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.email && errors.email)}
                    sx={{ ...theme.typography.customInput }}
                    helperText={touched.email && errors.email && errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Desctiption"
                    name="description"
                    type="text"
                    multiline
                    rows={1}
                    value={values.description}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description && errors.description}
                    sx={{ ...theme.typography.customInput }}
                  />
                </Grid>
                {tabValue === 1 && (
                  <Grid item xs={12}>
                    <SelectWrapper
                      sx={{ ...theme.typography.customInput }}
                      name={"categoryId"}
                      label="Job Category"
                      customHandleChange={(e) => {
                        setCategoryId(e.target.value);
                        setFieldValue("prferedJobPostingIds", []);
                      }}
                      options={(listJobCategory.data?.data || []).map((item) => ({ value: item.id, label: item.name }))}
                      fullWidth
                      required={tabValue === 1}
                    />
                  </Grid>
                )}
                {tabValue === 1 && (
                  <Grid item xs={12}>
                    <MultipleSelectCheckmarksWrapper
                      name={"prferedJobPostingIds"}
                      label="Prfered Job Posting"
                      sx={{ ...theme.typography.customInput }}
                      options={listJobPosition?.data || []}
                      fullWidth
                      required={tabValue === 1}
                    />
                  </Grid>
                )}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.password && errors.password)}
                    helperText={touched.password && errors.password && errors.password}
                    sx={{ ...theme.typography.customInput }}
                    type={passwordShow.showPassword ? "text" : "password"}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton aria-label="toggle password visibility" onClick={handleClickShowOldPassword} edge="end">
                            {passwordShow.showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                    helperText={touched.confirmPassword && errors.confirmPassword && errors.confirmPassword}
                    sx={{ ...theme.typography.customInput }}
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
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <FormControlLabel
                control={<Checkbox checked={checked} onChange={(event: any) => setChecked(event.target.checked)} name="checked" color="primary" />}
                label={
                  <Typography variant="body1">
                    Agree with &nbsp;
                    <Typography variant="body1" component={Link} to="#" color="primary" sx={{ textDecoration: "underline" }}>
                      Terms & Condition.
                    </Typography>
                  </Typography>
                }
              />
            </Grid>
          </Grid>
          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            <AnimateButton>
              <Button
                disableElevation
                disabled={isSubmitting || !checked || !isValid}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
                sx={{ color: "white", fontWeight: "bold" }}
              >
                Register
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  );
}

export default AuthRegister;
