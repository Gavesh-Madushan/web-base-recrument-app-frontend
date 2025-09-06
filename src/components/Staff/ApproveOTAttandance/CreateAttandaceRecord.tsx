import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Button, CircularProgress, Grid, useMediaQuery, useTheme } from "@mui/material";
import { gridSpacing } from "../../../store/constants";
import { useEffect, useState } from "react";

// custom components

// mui icons
import SelectWrapper from "../../../utils/ui-components/FormsUI/Select";
import dayjs from "dayjs";
import { EmployeeAttendanceInterface } from ".";
import DateTimePickerWrapper from "../../../utils/ui-components/FormsUI/DateTimePicker";
import { StaffService } from "../../../assets/_services/staff-service";
import { applyGlobalValidations, convert_to_proper_case, defaultLocation } from "../../../utils/utils";
import { createAttandaceRecord, getProjectEmployeeAssignments } from "../../../assets/api";
import { useSelector } from "react-redux";
import { getState } from "../../../redux/actions/actions";
import { openSuccessDialog } from "../../../utils/ui-components/pop-ups/SuccessDialog";
import TextFieldWrapper from "../../../utils/ui-components/FormsUI/TextField";

function CreateEmployeeAttandaceRecord({
  initialItem,
  fetchData,
  setOpen,
}: {
  initialItem: EmployeeAttendanceInterface;
  fetchData: () => void;
  setOpen: (boolean) => void;
}) {
  const theme: any = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const authState = useSelector((state: any) => state.auth.authData);
  const user = getState(authState);

  const [isLoading, setIsLoading] = useState(false);
  const [employeeTypes, setEmployeeTypes] = useState<
    {
      value: "ENGINEER" | "TECHNICIAN" | "ASSISTANT_ENGINEER" | "DIVISION_HEAD" | "HR_MANAGER" | "FINANCE_MANAGER" | "MANAGER";
      label: string;
      count: number;
    }[]
  >([]);
  const [employeeList, setEmployeeList] = useState<{ value: number; label: string }[]>([]);
  const [employeeProjectList, setEmployeeProjectList] = useState<{ value: number; label: string; location: number[] }[]>([]);

  useEffect(() => {
    StaffService.getEmployeeDesignationList().then((response) => {
      if (response.isSuccess) {
        const employeeTypes = response.data.map((empType) => ({
          value: empType,
          label: convert_to_proper_case(empType),
          count: 0,
        }));
        setEmployeeTypes(employeeTypes);
      } else {
        setEmployeeTypes([]);
      }
    });
  }, []);

  const fetchEmployeeList = (
    empType: "MANAGER" | "DIVISION_HEAD" | "HR_MANAGER" | "FINANCE_MANAGER" | "ENGINEER" | "TECHNICIAN" | "ASSISTANT_ENGINEER"
  ) => {
    const values = {
      activeState: "ACTIVE" as const,
      designation: empType,
      searchTerm: undefined,
      divisionId: undefined,
      joinDivision: false,
    };
    StaffService.getEmployeeList(values, 0, 50).then((response) => {
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

  const fetchEmployeeProjects = (empId: number) => {
    const data = {
      pageSize: 50,
      page: 0,
      userId: empId,
      projectProcessingState: "ONGOING" as const,
    };
    getProjectEmployeeAssignments(data).then((response) => {
      if (response.data) {
        setEmployeeProjectList(
          response.data.data.map((project) => ({
            value: project.id,
            label: project.project?.name || "",
            location: project.project?.location || [],
          }))
        );
      } else {
        setEmployeeProjectList([]);
      }
    });
  };

  const FORM_VALIDATION = Yup.object().shape({
    employeeId: Yup.number().required("Please select employee"),
    designation: Yup.string().required("Please select designation"),
    checkin: Yup.date().required("Please select check-in date and time"),
    checkout: Yup.date()
      .required("Please select check-out date and time")
      .test("checkout-after-checkin", "Checkout time must be after check-in time", function (value) {
        const { checkin } = this.parent;
        return checkin && value && new Date(value) > new Date(checkin);
      }),
    project: Yup.number().test("project", "Please select project", function (value) {
      const { designation } = this.parent;
      return designation === "ENGINEER" || designation === "TECHNICIAN" || designation === "ASSISTANT_ENGINEER" ? (value ? true : false) : true;
    }),
    comment: Yup.string().notRequired(),
  });

  const createAttandace = (values: EmployeeAttendanceInterface, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true);
    createAttandaceRecord({
      divisionId: user.divisionId,
      userId: Number(values.employeeId),
      projectAssignmentId:
        values.designation === "ENGINEER" || values.designation === "TECHNICIAN" || values.designation === "ASSISTANT_ENGINEER"
          ? Number(values.project)
          : null,
      type: "WORK" as const,
      createdLocation: employeeProjectList.find((item) => item.value === Number(values.project))?.location || defaultLocation,
      createdAt: values.checkin ? values.checkin?.toISOString() : dayjs().toISOString(),
      comment: values.comment === "" ? null : values.comment,
      endedAt: values.checkout ? values.checkout?.toISOString() : dayjs().toISOString(),
      endedLocation: employeeProjectList.find((item) => item.value === Number(values.project))?.location || defaultLocation,
    })
      .then((response) => {
        if (response.status === 201) {
          setIsLoading(false);
          fetchData();
          setOpen(false);
          openSuccessDialog("Success", "Attendance record has been successfully created and approved.");
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
          // validateOnMount={true}
          enableReinitialize
          initialValues={{
            ...initialItem,
          }}
          validationSchema={applyGlobalValidations(FORM_VALIDATION)}
          onSubmit={(values: EmployeeAttendanceInterface, { setSubmitting }) => {
            createAttandace(values, setSubmitting);
          }}
        >
          {({ dirty, isSubmitting, isValid, setFieldValue, values }) => (
            <Form>
              <Grid container columnSpacing={1}>
                <Grid container columnSpacing={gridSpacing}>
                  <Grid item xs={6}>
                    <SelectWrapper
                      label="Designation"
                      name="designation"
                      options={employeeTypes}
                      customHandleChange={(e) => {
                        setFieldValue("designation", e.target.value);
                        setFieldValue("employeeId", "");
                        fetchEmployeeList(e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <SelectWrapper
                      label="Employee"
                      name="employeeId"
                      options={employeeList}
                      customHandleChange={(e) => {
                        setFieldValue("employeeId", e.target.value);
                        setFieldValue("project", "");
                        if (values.designation === "ENGINEER" || values.designation === "TECHNICIAN" || values.designation === "ASSISTANT_ENGINEER") {
                          fetchEmployeeProjects(Number(e.target.value));
                        }
                      }}
                      disabled={!values.designation}
                    />
                  </Grid>
                  <Grid item xl={6} sm={6} xs={12} md={6}>
                    <DateTimePickerWrapper name="checkin" label={"Check In"} maxDate={dayjs()} />
                  </Grid>
                  <Grid item xl={6} sm={6} xs={12} md={6}>
                    <DateTimePickerWrapper name="checkout" label={"Check Out"} minDate={values.checkin} maxDate={dayjs()} />
                  </Grid>
                  <Grid item xs={6}>
                    <SelectWrapper
                      label="Project"
                      name="project"
                      options={employeeProjectList}
                      customHandleChange={() => {}}
                      disabled={
                        values.designation === "MANAGER" ||
                        values.designation === "DIVISION_HEAD" ||
                        values.designation === "HR_MANAGER" ||
                        values.designation === "FINANCE_MANAGER"
                          ? true
                          : !values.employeeId
                      }
                    />
                  </Grid>
                  <Grid item xl={12} xs={12}>
                    <TextFieldWrapper label="Comment" name="comment" type="text" multiline />
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
                      Save
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

export default CreateEmployeeAttandaceRecord;
