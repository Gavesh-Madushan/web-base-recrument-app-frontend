import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Button, CircularProgress, Grid, useMediaQuery, useTheme } from "@mui/material";
import { gridSpacing } from "../../store/constants";
import { useState } from "react";

// custom components
import TextField from "../../utils/ui-components/FormsUI/TextField";

// mui icons
import { openSuccessDialog } from "../../utils/ui-components/pop-ups/SuccessDialog";
import { LeaveInterface } from "./Leaves";
import SelectWrapper from "../../utils/ui-components/FormsUI/Select";
import DateTimePicker from "../../utils/ui-components/FormsUI/DatePicker";
import { createLeave } from "../../assets/api";
import { applyGlobalValidations, convert_to_proper_case } from "../../utils/utils";

function ApplyLeave({
  initialItem,
  fetchData,
  setOpen,
  initialData,
}: {
  initialItem: LeaveInterface;
  initialData: { leaveTypes: { value: string; label: string }[] };
  fetchData: () => void;
  setOpen: (boolean) => void;
}) {
  const theme: any = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  const [isLoading, setIsLoading] = useState(false);

  const FORM_VALIDATION = Yup.object().shape({
    type: Yup.string().required("Please select leave type"),
    period: Yup.string().required("Please select leave period"),
    date: Yup.date().required("Please select leave date"),
    discription: Yup.string().notRequired(),
  });

  const createNewLeave = (values: LeaveInterface, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true);

    createLeave([
      {
        userId: "@me",
        day: Number(values.date?.format("DD")),
        month: Number(values.date?.format("M")) - 1,
        year: Number(values.date?.format("YYYY")),
        description: values.discription === "" ? null : values.discription,
        period: values.period as "ONE_DAY" | "HALF_DAY_MORNING" | "HALF_DAY_AFTERNOON",
        type: values.type as "ANNUAL" | "MEDICAL" | "CASUAL",
        comment: null,
      },
    ])
      .then((response) => {
        if (response.status === 201) {
          openSuccessDialog(
            "Success",
            `<b>${values.date?.format("DD MMM YYYY")} - ${convert_to_proper_case(values.period)} </b><br> Leave created successfully`
          );
          setOpen(false);
          fetchData();
          setIsLoading(false);
        } else {
          setSubmitting(false);
          setIsLoading(false);
        }
      })
      .finally(() => {
        setSubmitting(false);
        setIsLoading(false);
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
            createNewLeave(values, setSubmitting);
          }}
        >
          {({ dirty, isSubmitting, isValid, setFieldValue, values }) => (
            <Form>
              <Grid container columnSpacing={1}>
                <Grid item xl={6} sm={6} xs={12} md={6}>
                  <DateTimePicker name="date" label={"Date"} />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <SelectWrapper
                    label="Leave Type"
                    name="type"
                    options={initialData.leaveTypes || []}
                    customHandleChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      setFieldValue("type", e.target.value);
                      if (e.target.value === "DAY_OFF") {
                        setFieldValue("period", "ONE_DAY");
                      }
                    }}
                  />
                </Grid>
                <Grid item sm={6} xs={12}>
                  <SelectWrapper
                    label="Period"
                    name="period"
                    options={[
                      { value: "ONE_DAY", label: "One day" },
                      { value: "HALF_DAY_MORNING", label: "Half day morning" },
                      { value: "HALF_DAY_AFTERNOON", label: "Half day afternoon" },
                    ]}
                    disabled={values.type === "DAY_OFF"}
                    customHandleChange={() => {}}
                  />
                </Grid>
                <Grid item xl={12} xs={12} md={12}>
                  <TextField label="Discription" name="discription" type="text" multiline rows={3} />
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
                      {initialItem.id ? "Update" : "Create"} Leave
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

export default ApplyLeave;
