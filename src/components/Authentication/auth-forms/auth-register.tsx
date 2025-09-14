import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Popper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import * as Yup from "yup";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { convertFileToBase64, strengthColor, strengthIndicator } from "../../../utils/utils";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Link } from "react-router-dom";
import AnimateButton from "../../../utils/ui-components/AnimateButton";
import { IMAGE_SIZE, IMAGE_SUPPORTED_FORMATS } from "../../../store/constants";
import ItemImageUpload from "../../../utils/ui-components/FormsUI/ItemImageUpload/item-image-upload.component";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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

const cities = [
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
  const maxDate = dayjs();
  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);

  const [strength, setStrength] = useState(0);
  const [level, setLevel] = useState({ label: "", color: "" });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  const changePassword = (value: any) => {
    const temp = strengthIndicator(value);
    setStrength(temp);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword("123456");
  }, []);
  return (
    <Formik
      initialValues={{
        fullName: "",
        firstName: "",
        lastName: "",
        nicOrPassport: "",
        email: "",
        gender: "",
        dob: null,
        district: "",
        city: "",
        residentialMobile: "",
        address: "",
        submit: null,
      }}
      validationSchema={Yup.object().shape({
        fullName: Yup.string().required("Please enter Full Name"),
        firstName: Yup.string().notRequired(),
        lastName: Yup.string().notRequired(),
        nicOrPassport: Yup.string()
          .required("Please enter NIC number")
          .matches(/^(?:\d{9}[VXvx]|\d{12}|[A-Z]\d{7})$/, "Invalid NIC or Passport number. NIC: 123456789V, 200123456789 | Passport: N1234567"),
        email: Yup.string().email("Must be a valid email").max(255).required("Please enter Email"),
        gender: Yup.string().required("Please Select a Gender"),
        dob: Yup.date().nullable().required("Date of birth is required").max(maxDate.toDate(), "Date of birth cannot be in the future"),
        district: Yup.string().required("You must make a selection").oneOf(districts, "Please select a valid city"),
        city: Yup.string().required("You must make a selection"),
        address: Yup.string().max(255, "maximum character count exceeded"),
        residentialMobile: Yup.string().matches(/^(7[0-9]{8}|0[1-9][0-9]{7})$/, "Invalid mobile numbers pattern detected"),
      })}
      onSubmit={async (values) => {
        registerRequest(values);
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, setFieldValue, isSubmitting, touched, values, isValid }) => (
        <form noValidate onSubmit={handleSubmit} {...others}>
          <Grid container columnSpacing={1}>
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
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    // size='small'
                    fullWidth
                    label="First Name"
                    name="firstName"
                    type="text"
                    value={values.firstName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.firstName && errors.firstName)}
                    sx={{ ...theme.typography.customInput }}
                    helperText={touched.firstName && errors.firstName && errors.firstName}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    type="text"
                    value={values.lastName}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.lastName && errors.lastName)}
                    sx={{ ...theme.typography.customInput }}
                    helperText={touched.lastName && errors.lastName && errors.lastName}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    required
                    fullWidth
                    label="NIC / Passport Number"
                    name="nicOrPassport"
                    type="text"
                    value={values.nicOrPassport}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.nicOrPassport && errors.nicOrPassport)}
                    sx={{ ...theme.typography.customInput }}
                    helperText={touched.nicOrPassport && errors.nicOrPassport && errors.nicOrPassport}
                  />
                </Grid>
                <Grid item xs={12} lg={6} md={6}>
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
                <Grid item xs={12} lg={3} md={6}>
                  <FormControl component="fieldset" error={touched.gender && Boolean(errors.gender)}>
                    <FormLabel component="legend">Gender</FormLabel>
                    <RadioGroup row name="gender" value={values.gender} onChange={handleChange} onBlur={handleBlur}>
                      <FormControlLabel value="male" control={<Radio />} label="Male" />
                      <FormControlLabel value="female" control={<Radio />} label="Female" />
                    </RadioGroup>
                    {touched.gender && errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={4} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <FormControl error={touched.dob && Boolean(errors.dob)} fullWidth>
                      <DatePicker
                        label="Date of Birth"
                        name="dob"
                        value={values.dob}
                        onChange={(value: any) => {
                          setFieldValue("dob", value ? value.toDate() : null, true); // Trigger validation
                        }}
                        maxDate={maxDate}
                        slotProps={{
                          textField: {
                            error: Boolean(touched.dob && errors.dob),
                            helperText: touched.dob && errors.dob ? errors.dob : "",
                            onBlur: handleBlur,
                            required: true,
                          },
                        }}
                        sx={{ ...theme.typography.customInput }}
                      />
                    </FormControl>
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} lg={5} md={6}>
                  <FormControl fullWidth error={Boolean(touched.district && errors.district)} sx={{ ...theme.typography.customInput }}>
                    <InputLabel htmlFor="outlined-adornment-district-register">District *</InputLabel>
                    <Select
                      required
                      fullWidth
                      label="District"
                      name="district"
                      value={values.district}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      error={Boolean(touched.district && errors.district)}
                    >
                      {districts.map((district) => (
                        <MenuItem key={district} value={district}>
                          {district}
                        </MenuItem>
                      ))}
                    </Select>
                    {touched.district && errors.district && <FormHelperText>{errors.district}</FormHelperText>}
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={5} md={6}>
                  <FormControl fullWidth error={touched.city && Boolean(errors.city)}>
                    <Autocomplete
                      id="city"
                      options={[...new Set(cities)]}
                      value={values.city || null}
                      onChange={(event, newValue) => setFieldValue("city", newValue)}
                      onBlur={handleBlur}
                      isOptionEqualToValue={(option, value) => option === value}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="City *"
                          variant="outlined"
                          error={touched.city && Boolean(errors.city)}
                          helperText={touched.city && errors.city}
                        />
                      )}
                      sx={{ ...theme.typography.customInput }}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                  <TextField
                    fullWidth
                    label="Residential Mobile Number"
                    name="residentialMobile"
                    type="tel"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">+94</InputAdornment>,
                    }}
                    value={values.residentialMobile}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.residentialMobile && errors.residentialMobile)}
                    sx={{ ...theme.typography.customInput }}
                    helperText={touched.residentialMobile && errors.residentialMobile && errors.residentialMobile}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    type="text"
                    multiline
                    rows={1}
                    value={values.address}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.address && errors.address}
                    sx={{ ...theme.typography.customInput }}
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
