import { Button, Grid, Stack } from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import MultipleSelectCheckmarksWrapper from "../../../utils/ui-components/FormsUI/MultipleSelectCheckmarks";
import { UseMutationResult } from "@tanstack/react-query";

const columns = [
  { value: "employeeNumber", label: "Emp No." },
  { value: "name", label: "Name" },
  { value: "nameInitials", label: "Initials" },
  { value: "class", label: "Designation" },
  { value: "nic", label: "NIC" },
  { value: "email", label: "Email" },
  { value: "divisionName", label: "Division" },
  { value: "mobile", label: "Mobile" },
  { value: "address", label: "Address" },
  { value: "birthDate", label: "Birth Date" },
  { value: "remainingLeaveDaysAnnual", label: "Remaining Annual Leaves" },
  { value: "entitledLeaveDaysAnnual", label: "Entitled Annual Leaves" },
  { value: "remainingLeaveDaysMedical", label: "Remaining Medical Leaves" },
  { value: "entitledLeaveDaysMedical", label: "Entitled Medical Leaves" },
  { value: "remainingLeaveDaysCasual", label: "Remaining Casual Leaves" },
  { value: "entitledLeaveDaysCasual", label: "Entitled Casual Leaves" },
  { value: "salaryBasic", label: "Basic Salary" },
  { value: "salaryBudgeted", label: "Budgeted Salary" },
  { value: "salaryWages", label: "Wages" },
  { value: "salaryAllowance", label: "Allowance" },
  { value: "salaryVehicleAllowance", label: "Vehicle Allowance" },
  { value: "salaryTravelAllowance", label: "Travel Allowance" },
  { value: "salaryOtPerHour", label: "OT/Hour" },
  { value: "salaryBata", label: "Bata" },
  { value: "salaryOutstationPerDay", label: "Outstation" },
  { value: "percentageEpf8", label: "EPF 8%" },
  { value: "percentageEpf12", label: "EPF 12%" },
  { value: "percentageEtf", label: "ETF" },
  { value: "createdAt", label: "Registered At" },
  { value: "resignedAt", label: "Resigned At" },
];

const EmployeeReport = ({
  initialData,
  fetchData,
  setOpen,
}: {
  initialData: {
    search: string;
    empClass: string | number;
    division: string | number;
    divisionList: { value: number; label: string }[];
    tabValue: number;
  };
  fetchData: UseMutationResult;
  setOpen: (boolean) => void;
}) => {
  console.log("initialData", initialData);
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Formik
          initialValues={{
            columns: [],
          }}
          validationSchema={Yup.object().shape({
            columns: Yup.array()
              .of(Yup.object().shape({ value: Yup.string(), label: Yup.string() }))
              .required("Please select the download fields")
              .min(1, "Please select the download fields"),
          })}
          // enableReinitialize
          onSubmit={(values: any) => {
            setOpen(false);
            const divisionId = initialData.divisionList[initialData.tabValue].value;
            fetchData.mutate(
              {
                columns2Include: values.columns.map((item) => item.value),
                designation:
                  initialData.empClass === "ALL"
                    ? undefined
                    : (initialData.empClass as
                        | "MANAGER"
                        | "DIVISION_HEAD"
                        | "HR_MANAGER"
                        | "FINANCE_MANAGER"
                        | "ENGINEER"
                        | "TECHNICIAN"
                        | "ASSISTANT_ENGINEER"),
                divisionId: divisionId === 0 ? undefined : divisionId,
                searchTerm: initialData.search === "" ? undefined : initialData.search,
              },
              {
                onSuccess: (res: any) => {
                  const url = window.URL.createObjectURL(
                    new Blob([res.data], {
                      type: res.headers["Content-Type"]?.toString() ?? "application/octet-stream",
                    })
                  );
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute(
                    "download",
                    `employee-report-division:${
                      divisionId === 0 ? "all" : initialData.divisionList?.find((item) => item.value === divisionId)?.label
                    }.xlsx`
                  );
                  document.body.appendChild(link);
                  link.click();
                },
              }
            );
          }}
        >
          {({ dirty, isSubmitting, isValid }) => (
            <Form>
              <Grid item xs={12}>
                <MultipleSelectCheckmarksWrapper name="columns" label="Select Download Fields" options={columns} />
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent={"flex-end"}>
                  <Button color="primary" variant="contained" disabled={!dirty || isSubmitting || !isValid} type="submit">
                    Download
                  </Button>
                </Stack>
              </Grid>
            </Form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
};

export default EmployeeReport;
