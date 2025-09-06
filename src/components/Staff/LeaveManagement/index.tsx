import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import { applyGlobalValidations, convert_to_proper_case } from "../../../utils/utils";

// custom components
// import EmployeeList from "./Employee/EmployeeList";
import { TabPanel } from "../../../utils/cssStyles";
import { gridSpacing } from "../../../store/constants";
import PageHeaders from "../../../utils/ui-components/PageHeaders";
import TextFieldWrapper from "../../../utils/ui-components/FormsUI/TextField";
import { isMobile } from "react-device-detect";

// mui
import { useTheme } from "@mui/material/styles";
import { Grid, Tabs, Tab, InputAdornment, Button, useMediaQuery } from "@mui/material";

// mui icon
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SelectWrapper from "../../../utils/ui-components/FormsUI/Select";
import ApproveLeaveList from "./ApproveLeaves";
import { getDivisionList, getLeaveRequestTypes } from "../../../assets/api";
import LeaveList from "./Leaves";
import dayjs, { Dayjs } from "dayjs";
import ViewEditDialog from "../../../utils/ui-components/ViewEditDialog";
import ApplyLeaveForEmployee from "./ApplyLeaveForEmployee";
import DatePickerWrapper from "../../../utils/ui-components/FormsUI/DatePicker";

export interface LeaveInterface {
  id: number | string;
  employeeId: string | string;
  designation: "MANAGER" | "DIVISION_HEAD" | "HR_MANAGER" | "FINANCE_MANAGER" | "ENGINEER" | "TECHNICIAN" | "ASSISTANT_ENGINEER" | "";
  division: string;
  type: string;
  period: string;
  date: Dayjs | null;
  discription: string;
}

const INITIAL_FORM_STATE: LeaveInterface = {
  id: "",
  type: "",
  employeeId: "",
  designation: "",
  division: "",
  period: "",
  date: dayjs(),
  discription: "",
};

function LeaveManagement(props: { access: string; role: number }) {
  const theme: any = useTheme();
  const matchDownmd = useMediaQuery(theme.breakpoints.up("md"));
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState<{
    search: string;
    division: number;
    toDate: Dayjs;
    fromDate: Dayjs;
    leaveType: string;
  }>({
    search: "",
    division: 0,
    toDate: dayjs(),
    fromDate: dayjs().subtract(1, "month"),
    leaveType: "ALL",
  });
  const [dialogTitle, setDialogTitle] = useState("");
  const [initialItem, setInitialItem] = useState<LeaveInterface>(INITIAL_FORM_STATE);
  const [divisionList, setDivisionList] = useState<{ value: number | "ALL"; label: string }[]>([]);

  const formikRef: any = useRef(null);

  const [leaveTypes, setLeaveTypes] = useState<{ value: string; label: string }[]>([]);
  const [LeaveStatusTypes] = useState<
    {
      value: "PENDING" | "APPROVED" | "REJECTED";
      label: string;
    }[]
  >([
    { value: "APPROVED" as const, label: "Approved" },
    { value: "PENDING" as const, label: "Pending" },
    { value: "REJECTED" as const, label: "Rejected" },
  ]);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    window.history.replaceState({}, "");
    getLeaveRequestTypes().then((response) => {
      if (response.data) {
        setLeaveTypes(
          response.data.map((item) => ({
            value: item,
            label: convert_to_proper_case(item),
          }))
        );
      }
    });

    if (props.role !== 2) {
      getDivisionList({}, 0, 50).then((response) => {
        if (response.data) {
          setDivisionList(
            response.data.data.map((item) => ({
              value: item.id,
              label: item.name,
            }))
          );
        }
      });
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTabValue(0);
  }, [matchDownmd]);

  const dialog = useMemo(
    () =>
      ViewEditDialog(ApplyLeaveForEmployee)({
        open: open,
        setOpen: setOpen,
        dialogTitle: dialogTitle,
        initialItem: initialItem,
        fetchData: () => {
          setTabValue(1);
        },
        initialData: {
          leaveTypes: leaveTypes.filter((item) => item.value !== "ALL"),
        },
        theme: theme,
        maxWidth: "sm",
      }),
    [open]
  );

  const handleClickOpen = (dialogTitle: string, formState: LeaveInterface) => {
    setOpen(true);
    setDialogTitle(dialogTitle);
    setInitialItem(formState);
  };

  return (
    <Grid container justifyContent="center" spacing={gridSpacing}>
      <Grid item xs={12}>
        <PageHeaders HeaderIcon={<Inventory2Icon />} headerTitle={"Leave Management"} />
      </Grid>
      <Grid item container xs={12} spacing={1}>
        <Grid item xs={12}>
          <Formik
            innerRef={formikRef}
            initialValues={{
              search: "",
              division: 0,
              fromDate: dayjs().subtract(1, "month"),
              toDate: dayjs(),
              leaveType: "ALL",
            }}
            validationSchema={applyGlobalValidations(
              Yup.object().shape({
                search: Yup.string().notRequired(),
                division: Yup.number().notRequired(),
                leaveType: Yup.string().required("Leave type required"),
                fromDate: Yup.date().nullable().required("Please Select a Date").typeError("please enter a valid date"),
                toDate: Yup.date().nullable().required("Please Select a date").typeError("please enter a valid dat"),
              })
            )}
            onSubmit={(values) => {
              setSearch(values);
            }}
          >
            {({ values, isValid }) => (
              <Form>
                <Grid container columnSpacing={1} justifyContent={"flex-end"}>
                  {props.role !== 2 && (
                    <Grid item xl={2} lg={2} md={3} sm={6} xs={6}>
                      <SelectWrapper
                        label={"Division"}
                        name="division"
                        options={[{ value: 0, label: "All" }, ...divisionList]}
                        customHandleChange={() => {}}
                      />
                    </Grid>
                  )}
                  <Grid item xl={2} lg={2} md={3} sm={6} xs={6}>
                    <SelectWrapper
                      label="Leave Type"
                      name="leaveType"
                      options={[{ value: "ALL", label: "All" }, ...leaveTypes]}
                      customHandleChange={() => {}}
                    />
                  </Grid>
                  <Grid item xl={2} lg={2} md={3} sm={6} xs={6}>
                    <DatePickerWrapper required name="fromDate" label={"From Date"} maxDate={values.toDate} />
                  </Grid>
                  <Grid item xl={2} lg={2} md={3} sm={6} xs={6}>
                    <DatePickerWrapper required name="toDate" label={"To Date"} minDate={values.fromDate} />
                  </Grid>
                  <Grid item xl={2} lg={2} md={4} sm={6} xs={12}>
                    <TextFieldWrapper
                      label="Search"
                      name="search"
                      placeholder="Emp Number"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      size={"small"}
                      fullWidth={true}
                    />
                  </Grid>
                  <Grid item>
                    <Button color="primary" variant="contained" sx={{ ...theme.typography.button }} type="submit" disabled={!isValid}>
                      View
                    </Button>
                  </Grid>
                  {props.access[0] === "1" && (
                    <Grid item>
                      <Button
                        color="primary"
                        sx={{ ...theme.typography.button }}
                        variant="contained"
                        type="button"
                        fullWidth
                        onClick={() => {
                          handleClickOpen(`Apply Leave`, INITIAL_FORM_STATE);
                        }}
                        startIcon={!isMobile && <AddIcon />}
                        disabled={leaveTypes.length === 0}
                      >
                        {isMobile ? <AddIcon fontSize="medium" /> : "Create Leave"}
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
        {props.access[1] === "1" ? (
          <Grid item xs={12}>
            <Tabs value={tabValue} onChange={handleChange} variant={"scrollable"}>
              {LeaveStatusTypes.map((empType, index) => (
                <Tab iconPosition="end" label={empType.label} key={index} />
              ))}
            </Tabs>
            <TabPanel value={tabValue} index={0}>
              <LeaveList role={props.role} tabValue={tabValue} leaveTypes={leaveTypes} search={search} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <ApproveLeaveList role={props.role} access={props.access} leaveTypes={leaveTypes} search={search} />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <LeaveList role={props.role} tabValue={tabValue} leaveTypes={leaveTypes} search={search} />
            </TabPanel>
          </Grid>
        ) : (
          <Grid item xs={12}>
            {/* <EmployeeList empType={searchEmpType} search={search} access={access} /> */}
          </Grid>
        )}
      </Grid>
      {dialog}
    </Grid>
  );
}

export default LeaveManagement;
