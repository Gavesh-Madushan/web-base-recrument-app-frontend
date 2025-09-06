import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Button, CircularProgress, Grid, useMediaQuery, useTheme } from "@mui/material";
import { gridSpacing } from "../../../store/constants";
import { useState } from "react";

// custom components

// mui icons
import SelectWrapper from "../../../utils/ui-components/FormsUI/Select";
import dayjs from "dayjs";
import { EmployeeAttendanceInterface } from ".";
import DateTimePickerWrapper from "../../../utils/ui-components/FormsUI/DateTimePicker";
import { applyGlobalValidations, convert_to_proper_case, defaultLocation } from "../../../utils/utils";
import {
  createAttandaceRecord,
  getEmployeeDesignationList,
  getEmployeeList,
  getProjectEmployeeAssignments,
  listDivision,
  replaceAttandaceRecord,
} from "../../../assets/api";
import { openSuccessDialog } from "../../../utils/ui-components/pop-ups/SuccessDialog";
import TextFieldWrapper from "../../../utils/ui-components/FormsUI/TextField";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getState } from "../../../redux/actions/actions";
import { useSelector } from "react-redux";
import TimePickerWrapper from "../../../utils/ui-components/FormsUI/TimePicker";

function CreateAttandaceRecord({
  initialItem,
  fetchData,
  setOpen,
  initialData,
}: {
  initialItem: EmployeeAttendanceInterface;
  fetchData: () => void;
  setOpen: (boolean) => void;
  initialData: { role: number };
}) {
  const theme: any = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const authState = useSelector((state: any) => state.auth.authData);
  const user = getState(authState);

  const divisionList = useQuery({
    queryKey: ["divisions", 50, undefined],
    queryFn: () =>
      listDivision({
        pageSize: 50,
      }),
    select: (res) =>
      res.data.data.map((el) => ({
        value: el.id,
        label: el.name,
      })),
    enabled: user.designation !== "DIVISION_HEAD",
  });

  const designationList = useQuery({
    queryKey: ["constants/employeeDesignation"],
    queryFn: getEmployeeDesignationList,
    select: (res) =>
      res.data.map((el) => ({
        value: el,
        label: convert_to_proper_case(el),
      })),
  });

  const [selectedDivisionId, setSelectedDivision] = useState<number>(initialItem.id ? initialItem.divisionId : user.divisionId);
  const [selectedDesignation, setSelectedDesignation] = useState<
    "MANAGER" | "DIVISION_HEAD" | "HR_MANAGER" | "FINANCE_MANAGER" | "ENGINEER" | "TECHNICIAN" | "ASSISTANT_ENGINEER" | undefined
  >(
    initialItem.id
      ? (initialItem.designation as "MANAGER" | "DIVISION_HEAD" | "HR_MANAGER" | "FINANCE_MANAGER" | "ENGINEER" | "TECHNICIAN" | "ASSISTANT_ENGINEER")
      : undefined
  );

  const employeeList = useQuery({
    queryKey: ["users", 50, undefined, "ACTIVE", selectedDivisionId, selectedDesignation],
    queryFn: () =>
      getEmployeeList(
        {
          activeState: "ACTIVE" as const,
          designation: selectedDesignation,
          divisionId: selectedDivisionId,
          searchTerm: undefined,
          joinDivision: false,
        },
        0,
        50
      ),
    select: (res) =>
      res.data.data.map((el) => ({
        value: el?.id,
        label: `(${el.employeeNumber}) - ${el?.nameInitials}`,
      })),
    enabled: initialItem.id ? true : selectedDivisionId !== undefined && selectedDesignation !== undefined,
  });

  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | undefined>(initialItem.id ? Number(initialItem.employeeId) : undefined);

  const employeeProjectAssignments = useQuery({
    queryKey: ["projectEmployeeAssignments", 50, undefined, "ONGOING", selectedEmployeeId],
    queryFn: () =>
      getProjectEmployeeAssignments({
        pageSize: 50,
        page: 0,
        userId: selectedEmployeeId,
        projectProcessingState: "ONGOING" as const,
      }),
    select: (res) =>
      res.data.data.map((el) => ({
        value: el.id,
        label: el.project?.name ?? "",
        location: el.project?.location || [],
      })),
    enabled:
      selectedEmployeeId !== undefined &&
      selectedDesignation !== undefined &&
      ["ENGINEER", "TECHNICIAN", "ASSISTANT_ENGINEER"].includes(selectedDesignation),
  });

  const FORM_VALIDATION = Yup.object().shape({
    divisionId: Yup.number().test("role", "Please select division", function (value) {
      return initialData.role === 2 ? true : value ? true : false;
    }),
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

  const createAttendance = useMutation({
    mutationFn: (values: EmployeeAttendanceInterface) =>
      createAttandaceRecord({
        divisionId: values.divisionId ? Number(values.divisionId) : user.divisionId,
        userId: Number(values.employeeId),
        projectAssignmentId:
          values.designation === "ENGINEER" || values.designation === "TECHNICIAN" || values.designation === "ASSISTANT_ENGINEER"
            ? Number(values.project)
            : null,
        type: "WORK" as const,
        createdLocation: employeeProjectAssignments.data?.find((item) => item.value === Number(values.project))?.location || defaultLocation,
        createdAt: values.checkin ? values.checkin?.startOf("minute").toISOString() : dayjs().startOf("minute").toISOString(),
        comment: values.comment === "" ? null : values.comment,
        endedAt: values.checkout ? values.checkout?.startOf("minute").toISOString() : dayjs().startOf("minute").toISOString(),
        endedLocation: employeeProjectAssignments.data?.find((item) => item.value === Number(values.project))?.location || defaultLocation,
      }),
  });

  const updateAttendance = useMutation({
    mutationFn: (values: EmployeeAttendanceInterface) =>
      replaceAttandaceRecord({
        id: Number(values.id),
        divisionId: values.divisionId ? Number(values.divisionId) : user.divisionId,
        userId: Number(values.employeeId),
        projectAssignmentId:
          values.designation === "ENGINEER" || values.designation === "TECHNICIAN" || values.designation === "ASSISTANT_ENGINEER"
            ? Number(values.project)
            : null,
        type: "WORK" as const,
        createdLocation: employeeProjectAssignments.data?.find((item) => item.value === Number(values.project))?.location || defaultLocation,
        createdAt: values.checkin ? values.checkin?.startOf("minute").toISOString() : dayjs().startOf("minute").toISOString(),
        comment: values.comment === "" ? null : values.comment,
        endedAt: values.checkout ? values.checkout?.startOf("minute").toISOString() : dayjs().startOf("minute").toISOString(),
        endedLocation: employeeProjectAssignments.data?.find((item) => item.value === Number(values.project))?.location || defaultLocation,
      }),
  });

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
            if (initialItem.id) {
              updateAttendance.mutate(values, {
                onSuccess: (res) => {
                  if (res.status === 201) {
                    fetchData();
                    setOpen(false);
                    openSuccessDialog("Success", "Attendance record has been successfully.");
                  } else {
                    setSubmitting(false);
                  }
                },
                onError: () => {
                  setSubmitting(false);
                },
              });
            } else {
              createAttendance.mutate(values, {
                onSuccess: (res) => {
                  if (res.status === 201) {
                    fetchData();
                    setOpen(false);
                    openSuccessDialog("Success", "Attendance record has been successfully.");
                  } else {
                    setSubmitting(false);
                  }
                },
                onError: () => {
                  setSubmitting(false);
                },
              });
            }
          }}
        >
          {({ dirty, isSubmitting, isValid, setFieldValue, values }) => (
            <Form>
              <Grid container columnSpacing={1}>
                <Grid container columnSpacing={gridSpacing}>
                  {initialData.role !== 2 && (
                    <Grid item xs={6}>
                      <SelectWrapper
                        label="Division"
                        name="divisionId"
                        options={divisionList.data ?? []}
                        disabled={initialItem.id ? true : false}
                        customHandleChange={(e) => {
                          setFieldValue("divisionId", e.target.value ?? user.divisionId);
                          setSelectedDivision(e.target.value ?? user.divisionId);
                          setFieldValue("employeeId", "");
                          setSelectedEmployeeId(undefined);
                          setFieldValue("project", "");
                        }}
                      />
                    </Grid>
                  )}
                  <Grid item xs={6}>
                    <SelectWrapper
                      label="Designation"
                      name="designation"
                      options={designationList.data ?? []}
                      disabled={initialItem.id ? true : false}
                      customHandleChange={(e) => {
                        setFieldValue("designation", e.target.value);
                        setSelectedDesignation(e.target.value);
                        setFieldValue("employeeId", "");
                        setSelectedEmployeeId(undefined);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <SelectWrapper
                      label="Employee"
                      name="employeeId"
                      options={employeeList.data ?? []}
                      customHandleChange={(e) => {
                        setFieldValue("employeeId", e.target.value);
                        setSelectedEmployeeId(e.target.value);
                        setFieldValue("project", "");
                      }}
                      disabled={!values.designation || initialItem.id ? true : false}
                    />
                  </Grid>
                  <Grid item xl={6} sm={6} xs={12} md={6}>
                    {values.id ? (
                      <TimePickerWrapper name="checkin" label={"Check In"} maxTime={values.checkout} />
                    ) : (
                      <DateTimePickerWrapper name="checkin" label={"Check In"} maxDate={dayjs()} />
                    )}
                  </Grid>
                  <Grid item xl={6} sm={6} xs={12} md={6}>
                    {values.id ? (
                      <TimePickerWrapper name="checkout" label={"Check Out"} minTime={values.checkin} />
                    ) : (
                      <DateTimePickerWrapper name="checkout" label={"Check Out"} minDate={values.checkin} maxDate={dayjs()} />
                    )}
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <SelectWrapper
                      label="Project"
                      name="project"
                      options={employeeProjectAssignments.data ?? []}
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
                        (updateAttendance.isPending || createAttendance.isPending) && (
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

export default CreateAttandaceRecord;
