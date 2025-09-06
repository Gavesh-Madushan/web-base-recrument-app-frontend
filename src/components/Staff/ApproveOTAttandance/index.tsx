import * as Yup from "yup";
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";

// mui
import { Button, Grid, Tab, Tabs, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DateRangeIcon from "@mui/icons-material/DateRange";

// custom component
import PageHeaders from "../../../utils/ui-components/PageHeaders";
import JobAttendanceList from "./AttendaceList";

// mui icon
import { SET_BREADCRUMBS } from "../../../redux/actions/actions";
import { useDispatch } from "react-redux";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";
import { applyGlobalValidations } from "../../../utils/utils";
import DatePickerWrapper from "../../../utils/ui-components/FormsUI/DatePicker";
import { useQuery } from "@tanstack/react-query";
import { getDivisionList } from "../../../assets/api";
import { TabPanel } from "../../../utils/cssStyles";
import SelectWrapper from "../../../utils/ui-components/FormsUI/Select";

export interface EmployeeAttendanceInterface {
  employeeId: string | number;
  designation: string;
  checkin: Dayjs | null;
  checkout: Dayjs | null;
  project: string | number;
  comment: string;
}

function ApproveOTAttendance(props: { access: string; role: number }) {
  const theme: any = useTheme();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const formikRef: any = useRef(null);
  const [searchValue, setSearchValue] = useState<{
    createdFrom: Dayjs;
    createdTo: Dayjs;
    division: number | string;
    approveStatus: "APPROVED" | "PENDING" | "REJECTED";
  }>({
    createdFrom: dayjs().startOf("month").startOf("day"),
    createdTo: dayjs().endOf("day"),
    division: props.role === 3 || props.role === 1 ? 0 : "",
    approveStatus: "PENDING",
  });
  const dispatch = useDispatch();
  const matchDownmd = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    if (props.access[1] === "0") {
      navigate("/dashboard");
    }
    dispatch({
      type: SET_BREADCRUMBS,
      payload: [
        { name: "Home", path: "/Dashboard", bold: false, state: null },
        {
          name: "Approve Pending Attendance",
          path: null,
          bold: true,
          state: null,
        },
      ],
    });
  }, []);

  const listDivision = useQuery({
    queryKey: ["listDivisions", undefined, 0, 50],
    queryFn: () => getDivisionList(undefined, 0, 50),
    enabled: props.role === 1 || props.role === 3 || props.role === 4,
    select: (res) =>
      res.data.data.map((item) => ({
        value: item.id,
        label: item.name,
      })),
  });

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    // formikRef.current?.setFieldValue("search", "");
    formikRef.current?.setFieldValue("division", (listDivision?.data || [])[newValue].value || "");
    setSearchValue({
      ...searchValue,
      division: (listDivision?.data || [])[newValue].value || "",
    });
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <PageHeaders HeaderIcon={<DateRangeIcon />} headerTitle={"Approve OT Attendance"} />
      </Grid>
      <Grid item lg={12} md={12} sm={12} xs={12} container>
        <Grid item xs={12}>
          <Formik
            innerRef={formikRef}
            initialValues={searchValue}
            validationSchema={applyGlobalValidations(
              Yup.object().shape({
                createdFrom: Yup.date().nullable().required("Please Select a Time").typeError("please enter a valid time"),
                createdTo: Yup.date().nullable().required("Please Select a Time").typeError("please enter a valid time"),
              })
            )}
            onSubmit={(values) => {
              setSearchValue({
                ...searchValue,
                approveStatus: values.approveStatus,
                createdFrom: values.createdFrom.startOf("day"),
                createdTo: values.createdTo.endOf("day"),
              });
            }}
          >
            {({ values, isValid }) => (
              <Form>
                <Grid container columnSpacing={1} justifyContent={"flex-end"}>
                  <Grid item>
                    <DatePickerWrapper required name="createdFrom" label={"From Date"} maxDate={values.createdTo} />
                    {/* <MonthlyPicker required name="date" label={"Attendance Month"} maxDate={dayjs()} /> */}
                  </Grid>
                  <Grid item>
                    <DatePickerWrapper required name="createdTo" label={"To Date"} maxDate={dayjs()} minDate={values.createdFrom} />
                  </Grid>
                  <Grid item>
                    <SelectWrapper
                      required
                      name="approveStatus"
                      label={"Status"}
                      options={[
                        {
                          value: "PENDING",
                          label: "Pending",
                        },
                        {
                          value: "APPROVED",
                          label: "Approved",
                        },
                      ]}
                      customHandleChange={() => {}}
                      sx={{ minWidth: "150px" }}
                    />
                  </Grid>
                  <Grid item>
                    <Button color="primary" variant="contained" sx={{ ...theme.typography.button }} type="submit" disabled={!isValid}>
                      View
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
        <Grid item xs={12}>
          {(props.role === 1 || props.role === 3 || props.role === 4) && matchDownmd ? (
            <Grid item xs={12}>
              <Tabs value={tabValue} onChange={handleChange} variant={"scrollable"}>
                {(props.role === 3 || props.role === 1 ? [...(listDivision.data || [])] : listDivision.data)?.map((empType, index) => (
                  <Tab iconPosition="end" label={empType.label} key={index} />
                ))}
              </Tabs>
              {(props.role === 3 || props.role === 1 ? [...(listDivision.data || [])] : listDivision.data)?.map((division, index) => (
                <TabPanel value={tabValue} index={index} key={index}>
                  {/* <EmployeeList division={division.value} search={search} access={props.access} /> */}
                  <JobAttendanceList search={searchValue} division={division.value} access={props.access} />
                </TabPanel>
              ))}
            </Grid>
          ) : (
            <Grid item xs={12}>
              {/* <EmployeeList division={search.division} search={search} access={props.access} /> */}
              <JobAttendanceList search={searchValue} access={props.access} />
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ApproveOTAttendance;
