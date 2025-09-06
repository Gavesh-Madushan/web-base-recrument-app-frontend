import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Button, CircularProgress, Divider, Grid, InputAdornment, Typography, useMediaQuery, useTheme } from "@mui/material";
import { gridSpacing } from "../../../store/constants";
import { useState } from "react";

// custom components
import SwitchWrapper from "../../../utils/ui-components/FormsUI/Switch";
import TextField from "../../../utils/ui-components/FormsUI/TextField";

// mui icons
import CallIcon from "@mui/icons-material/Call";
import HomeIcon from "@mui/icons-material/Home";
import AttachEmailIcon from "@mui/icons-material/AttachEmail";
import { ClientInterface } from ".";
import { ProjectService } from "../../../assets/_services/project-service";
import { openSuccessDialog } from "../../../utils/ui-components/pop-ups/SuccessDialog";
import { applyGlobalValidations } from "../../../utils/utils";

function CreateClient({
  initialItem,
  fetchData,
  setOpen,
}: {
  initialItem: ClientInterface;
  initialData: object;
  fetchData: () => void;
  setOpen: (boolean) => void;
}) {
  const theme: any = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  const [isLoading, setIsLoading] = useState(false);

  const FORM_VALIDATION = Yup.object().shape({
    company_name: Yup.string().trim().required("Please enter the company name"),

    company_contact: Yup.string()
      .required("Please enter company contact number")
      .matches(
        /^((0)(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\d)\d{6},?)+$/,
        "Invalid mobile numbers pattern detected (e.g.., 07xxxxxxx or 011xxxxxxx)"
      ),
    company_address: Yup.string().notRequired(),
    company_email: Yup.string().email("Invalid email address").notRequired(),
    contact_person: Yup.string().notRequired(),
    person_mobile: Yup.string()
      .notRequired()
      .matches(
        /^((0)(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\d)\d{6},?)+$/,
        "Invalid mobile numbers pattern detected (e.g.., 07xxxxxxx)"
      ),
    discription: Yup.string().notRequired(),
    status: Yup.boolean().notRequired(),
  });

  const updateClient = (values: ClientInterface, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true);

    const data = {
      id: Number(values.id),
      company_name: values.company_name,
      company_contact: values.company_contact === "" ? null : values.company_contact,
      company_address: values.company_address === "" ? null : values.company_address,
      company_email: values.company_email === "" ? null : values.company_email,
      person_name: values.contact_person === "" ? null : values.contact_person,
      person_contact: values.person_mobile === "" ? null : values.person_mobile,
      status: values.status ? ("ACTIVE" as const) : ("INACTIVE" as const),
      discription: values.discription === "" ? null : values.discription,
    };
    ProjectService.updateClientDetails(data).then((response) => {
      if (response.isSuccess) {
        openSuccessDialog("Success", `${values.company_name} customer updated successfully`);
        setOpen(false);
        fetchData();
        setIsLoading(false);
      } else {
        setSubmitting(false);
        setIsLoading(false);
      }
    });
  };

  const createClient = (values: ClientInterface, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true);

    const data = {
      company_name: values.company_name,
      company_contact: values.company_contact === "" ? null : values.company_contact,
      company_address: values.company_address === "" ? null : values.company_address,
      company_email: values.company_email === "" ? null : values.company_email,
      person_name: values.contact_person === "" ? null : values.contact_person,
      person_contact: values.person_mobile === "" ? null : values.person_mobile,
      status: values.status ? ("ACTIVE" as const) : ("INACTIVE" as const),
      discription: values.discription === "" ? null : values.discription,
    };
    ProjectService.createNewClient(data).then((response) => {
      if (response.isSuccess) {
        openSuccessDialog("Success", `${values.company_name} customer created successfully`);
        setOpen(false);
        fetchData();
        setIsLoading(false);
      } else {
        setSubmitting(false);
        setIsLoading(false);
      }
    });
  };

  return (
    <Grid container justifyContent="center" spacing={gridSpacing}>
      <Grid item xs={12}>
        <Formik
          validateOnMount={true}
          enableReinitialize
          initialValues={{
            ...initialItem,
          }}
          validationSchema={applyGlobalValidations(FORM_VALIDATION)}
          onSubmit={(values, { setSubmitting }) => {
            setIsLoading(true);
            if (initialItem.id) {
              updateClient(values, setSubmitting);
            } else {
              createClient(values, setSubmitting);
            }
          }}
        >
          {({ values, dirty, isSubmitting, isValid }) => (
            <Form>
              <Grid container columnSpacing={1}>
                <Grid container columnSpacing={gridSpacing}>
                  <Grid item xl={12} xs={12} md={12}>
                    <TextField required label="Company Name" name="company_name" type="text" />
                  </Grid>
                  <Grid item xl={12} xs={12} md={6}>
                    <TextField
                      required
                      label="Company Contact"
                      name="company_contact"
                      type="tel"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CallIcon /> |
                          </InputAdornment>
                        ),
                      }}
                      onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      }}
                      // onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      //   const mobileNumber = e.target.value;
                      //   if (mobileNumber.length === 10 && mobileNumber.startsWith("0")) {
                      //     setFieldValue("company_contact", mobileNumber.slice(1));
                      //   } else if (mobileNumber.length === 11 && mobileNumber.startsWith("94")) {
                      //     setFieldValue("company_contact", mobileNumber.slice(2));
                      //   } else {
                      //     setFieldValue("company_contact", mobileNumber);
                      //   }
                      // }}
                    />
                  </Grid>
                  <Grid item xl={12} xs={12} md={6}>
                    <TextField
                      label="Company Email"
                      name="company_email"
                      type="text"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <AttachEmailIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xl={12} xs={12} md={12}>
                    <TextField
                      label="Company Address"
                      name="company_address"
                      type="text"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeIcon /> |
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xl={12} xs={12} sm={6} md={6}>
                    <Divider textAlign="left" sx={{ my: 1 }}>
                      <Typography variant="caption" fontWeight={"bold"}>
                        Contact Person Details
                      </Typography>
                    </Divider>
                  </Grid>
                  <Grid item xl={12} xs={12} sm={6} md={6}>
                    <TextField label="Person Name" name="contact_person" type="text" />
                  </Grid>
                  <Grid item xl={12} xs={12} sm={12} md={12}>
                    <TextField
                      label="Mobile"
                      name="person_mobile"
                      type="tel"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CallIcon />|
                          </InputAdornment>
                        ),
                      }}
                      onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                        e.target.value = e.target.value.replace(/[^0-9]/g, "");
                      }}
                      // onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      //   const mobileNumber = e.target.value;
                      //   if (mobileNumber.length === 10 && mobileNumber.startsWith("0")) {
                      //     setFieldValue("person_mobile", mobileNumber.slice(1));
                      //   } else if (mobileNumber.length === 11 && mobileNumber.startsWith("94")) {
                      //     setFieldValue("person_mobile", mobileNumber.slice(2));
                      //   } else {
                      //     setFieldValue("person_mobile", mobileNumber);
                      //   }
                      // }}
                    />
                  </Grid>
                  <Grid item xl={12} xs={12} sm={6} md={6}>
                    <TextField label="Discription" name="discription" type="text" />
                  </Grid>
                  <Grid item xl={4} lg={4}>
                    <SwitchWrapper name="status" label={values.status ? "ACTIVE" : "INACTIVE"} style={{ co: "green" }} />
                  </Grid>
                </Grid>

                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Grid
                    item
                    xs={12}
                    gap={1}
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      py: 2,
                    }}
                  >
                    {!matchDownSM && (
                      <Button
                        color="primary"
                        variant="contained"
                        type="button"
                        size="medium"
                        sx={{ ...theme.typography.button }}
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </Button>
                    )}

                    <Button
                      color="primary"
                      variant="contained"
                      type="submit"
                      sx={{ ...theme.typography.button }}
                      size="medium"
                      disabled={!dirty || isSubmitting || !isValid}
                      startIcon={
                        isLoading && (
                          <CircularProgress
                            size={"20px"}
                            sx={{
                              mr: 1,
                              color: "gray",
                            }}
                          />
                        )
                      }
                    >
                      {initialItem.id ? "Update" : "Create"} Customer
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
}

export default CreateClient;
