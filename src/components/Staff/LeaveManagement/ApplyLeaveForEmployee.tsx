import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Button, CircularProgress, Grid, useMediaQuery, useTheme } from "@mui/material";
import { gridSpacing } from "../../../store/constants";
import { useEffect, useState } from "react";

// custom components
import TextField from "../../../utils/ui-components/FormsUI/TextField";

// mui icons
import { openSuccessDialog } from "../../../utils/ui-components/pop-ups/SuccessDialog";
import SelectWrapper from "../../../utils/ui-components/FormsUI/Select";
import DateTimePicker from "../../../utils/ui-components/FormsUI/DatePicker";
import { createLeave } from "../../../assets/api";
import { convert_to_proper_case } from "../../../utils/utils";
import { LeaveInterface } from ".";
import { StaffService } from "../../../assets/_services/staff-service";

function ApplyLeaveForEmployee({
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
  const [division, setDivision] = useState<{ value: number; label: string }[]>([]);
  const [designation, setDesignation] = useState<
    { value: "MANAGER" | "DIVISION_HEAD" | "HR_MANAGER" | "FINANCE_MANAGER" | "ENGINEER" | "TECHNICIAN" | "ASSISTANT_ENGINEER"; label: string }[]
  >([]);
  const [employeeList, setEmployeeList] = useState<{ value: number; label: string }[]>([]);

  const FORM_VALIDATION = Yup.object().shape({
    type: Yup.string().required("Please select leave type"),
    period: Yup.string().required("Please select leave period"),
    date: Yup.string().required("Please select leave date"),
    discription: Yup.string()
      .notRequired()
      .trim("Cannot start or end with a space")
      .strict()
      .test("no-spaces", "Cannot start or end with a space", (value) => !value?.startsWith(" ") && !value?.endsWith(" ")),
  });

  const createNewLeave = (values: LeaveInterface, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true);

    createLeave([
      {
        userId: Number(values.employeeId),
        day: Number(values.date?.format("DD")),
        month: Number(values.date?.format("M")) - 1,
        year: Number(values.date?.format("YYYY")),
        description: values.discription === "" ? null : values.discription,
        period: values.period as "ONE_DAY" | "HALF_DAY_MORNING" | "HALF_DAY_AFTERNOON",
        type: values.type as "ANNUAL" | "MEDICAL" | "CASUAL" | "DAY_OFF",
        comment: null,
      },
    ])
      .then((response) => {
        if (response.status === 201) {
          openSuccessDialog(
            "Success",
            `<b>${values.date?.format("DD MMM YYYY")} - ${convert_to_proper_case(values.period)} </b><br> Leave created for successfully`
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

  const getEmployeeList = (designation: string, divisionId: number) => {
    StaffService.getEmployeeList(
      {
        activeState: "ACTIVE",
        designation: designation as "MANAGER" | "DIVISION_HEAD" | "HR_MANAGER" | "FINANCE_MANAGER" | "ENGINEER" | "TECHNICIAN" | "ASSISTANT_ENGINEER",
        searchTerm: undefined,
        divisionId: divisionId,
        joinDivision: false,
      },
      0,
      50
    ).then((response) => {
      if (response.isSuccess) {
        setEmployeeList(
          response.data.data.map((emp) => ({
            value: emp?.id,
            label: `(${emp.employeeNumber}) - ${emp?.nameInitials}`,
          }))
        );
      } else {
        setEmployeeList([]);
      }
    });
  };

  useEffect(() => {
    StaffService.getDivisionList({ headEmpId: undefined, searchTerm: undefined }, 0, 50).then((response) => {
      if (response.isSuccess) {
        setDivision(
          response.data.data.map((division) => ({
            value: division?.id,
            label: division?.name,
          }))
        );
      } else {
        setDivision([]);
      }
    });

    StaffService.getEmployeeDesignationList().then((response) => {
      if (response.isSuccess) {
        const employeeTypes = response.data.map((empType) => ({
          value: empType,
          label: convert_to_proper_case(empType),
        }));
        setDesignation(employeeTypes);
      } else {
        setDesignation([]);
      }
    });
  }, []);

  return (
    <Grid container justifyContent="center" spacing={gridSpacing}>
      <Grid item xs={12}>
        <Formik
          validateOnMount={true}
          enableReinitialize
          initialValues={{
            ...initialItem,
          }}
          validationSchema={FORM_VALIDATION}
          onSubmit={(values: LeaveInterface, { setSubmitting }) => {
            setIsLoading(true);
            createNewLeave(values, setSubmitting);
          }}
        >
          {({ dirty, isSubmitting, isValid, values, setFieldValue }) => (
            <Form>
              <Grid container columnSpacing={1}>
                <Grid container columnSpacing={gridSpacing}>
                  <Grid item sm={6} xs={12}>
                    <SelectWrapper
                      label="Division"
                      name="division"
                      options={division}
                      customHandleChange={(e) => {
                        setFieldValue("division", e.target.value);
                        setFieldValue("employeeId", "");
                        if (values.designation && e.target.value) {
                          getEmployeeList(values.designation, Number(e.target.value));
                        }
                      }}
                    />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <SelectWrapper
                      label="Employee Class"
                      name="designation"
                      options={designation}
                      customHandleChange={(e) => {
                        setFieldValue("designation", e.target.value);
                        setFieldValue("employeeId", "");
                        if (values.division && e.target.value) {
                          getEmployeeList(e.target.value, Number(values.division));
                        }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <SelectWrapper label="Employee" name="employeeId" options={employeeList} customHandleChange={() => {}} />
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
                      customHandleChange={() => {}}
                      disabled={values.type === "DAY_OFF"}
                    />
                  </Grid>
                  <Grid item xl={6} sm={6} xs={12} md={6}>
                    <DateTimePicker name="date" label={"Date"} />
                  </Grid>
                  <Grid item xl={12} xs={12} md={12}>
                    <TextField label="Discription" name="discription" type="text" multiline rows={3} />
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

export default ApplyLeaveForEmployee;
