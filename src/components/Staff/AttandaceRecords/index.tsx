import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useEffect, useMemo, useState } from "react";
import { gridSpacing } from "../../../store/constants";

// custom components
import { TabPanel } from "../../../utils/cssStyles";
import PageHeaders from "../../../utils/ui-components/PageHeaders";
import TextFieldWrapper from "../../../utils/ui-components/FormsUI/TextField";

// mui
import { Grid, Tabs, Tab, InputAdornment, Button, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// mui icon
// import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import { StaffService } from "../../../assets/_services/staff-service";
import { applyGlobalValidations } from "../../../utils/utils";
// import EmployeeAttendanceList from "./AttendanceList";
import dayjs, { Dayjs } from "dayjs";
import AttendanceRecordsOnDate from "./AttandaceRecords";
import AddIcon from "@mui/icons-material/Add";
import ViewEditDialog from "../../../utils/ui-components/ViewEditDialog";
import CreateAttandaceRecord from "./createAttandaceRecord";
// import SelectWrapper from "../../../utils/ui-components/FormsUI/Select";
import DownloadIcon from "@mui/icons-material/Download";
import { useMutation } from "@tanstack/react-query";
import { downloadAttendanceRecords } from "../../../assets/api";
import DateTimePickerWrapper from "../../../utils/ui-components/FormsUI/DateTimePicker";
import { isMobile } from "react-device-detect";

export interface EmployeeAttendanceInterface {
  id?: string | number;
  employeeId: string | number;
  divisionId: string | number;
  designation: string;
  checkin: Dayjs | null;
  checkout: Dayjs | null;
  project: string | number;
  comment: string;
}
const currentTime = dayjs();

const INITIAL_FORM_STATE: EmployeeAttendanceInterface = {
  id: "",
  employeeId: "",
  divisionId: "",
  designation: "",
  checkin: currentTime,
  checkout: currentTime.add(1, "hour"),
  project: "",
  comment: "",
};

function AttandaceRecords(props: { access: string; role: any }) {
  const theme: any = useTheme();

  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState<{
    searchTerm: string;
    toTime: Dayjs;
    fromTime: Dayjs;
    // status: "APPROVED" | "PENDING" | "REJECTED";
  }>({
    searchTerm: "",
    toTime: currentTime,
    fromTime: currentTime.subtract(1, "month"),
    // status: "APPROVED",
  });

  const [divisionTypes, setDivisionTypes] = useState<{ value: number; label: string; count: number }[]>([]);
  const [currentDivision, setCurrentDivision] = useState<any>(null);

  const [tableDataCount, setTableDataCount] = useState<number>(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    window.history.replaceState({}, "");

    {
      props.role !== 2 &&
        StaffService.getDivisionList({ headEmpId: undefined, searchTerm: undefined }, 0, 50).then((response) => {
          if (response.isSuccess) {
            setDivisionTypes([
              // { value: 0, label: "All", count: 0 },
              ...response.data.data.map((division) => ({
                value: division?.id,
                label: division?.name,
                count: 0,
              })),
            ]);
          } else {
            setDivisionTypes([]);
          }
        });
    }
  }, []);

  const dialog = useMemo(
    () =>
      ViewEditDialog(CreateAttandaceRecord)({
        open: open,
        setOpen: setOpen,
        dialogTitle: "Create Attendance Record",
        initialItem: INITIAL_FORM_STATE,
        fetchData: () => {
          setSearch({
            searchTerm: "",
            toTime: dayjs(),
            fromTime: dayjs().subtract(30, "day"),
            // status: "APPROVED",
          });
        },
        initialData: {
          role: props.role,
        },
        theme: theme,
        maxWidth: "sm",
      }),
    [open]
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const downloadItems = useMutation({
    mutationKey: ["attendanceRecords/_download"],
    mutationFn: downloadAttendanceRecords,
  });

  return (
    <Grid container justifyContent="center" spacing={gridSpacing}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <PageHeaders headerTitle="Attendance Records" HeaderIcon={<CalendarMonthIcon />} />
      </Grid>
      <Grid item container xs={12} spacing={1}>
        <Grid item xs={12}>
          <Formik
            initialValues={{
              searchTerm: "",
              fromTime: dayjs().subtract(1, "month"),
              toTime: dayjs(),
              // status: "APPROVED" as "APPROVED" | "PENDING" | "REJECTED",
            }}
            validationSchema={applyGlobalValidations(
              Yup.object().shape({
                searchTerm: Yup.string().notRequired(),
                // status: Yup.string().notRequired(),
                fromTime: Yup.date().nullable().required("Please Select a Time").typeError("please enter a valid time"),
                toTime: Yup.date().nullable().required("Please Select a Time").typeError("please enter a valid time"),
              })
            )}
            onSubmit={(values) => {
              setSearch(values);
            }}
          >
            {({ values, isValid }) => (
              <Form>
                <Grid container columnSpacing={1} justifyContent={"flex-end"}>
                  <Grid item>
                    <DateTimePickerWrapper required name="fromTime" label={"From Time"} maxDate={values.toTime} />
                    {/* <MonthlyPicker required name="date" label={"Attendance Month"} maxDate={dayjs()} /> */}
                  </Grid>
                  <Grid item>
                    <DateTimePickerWrapper required name="toTime" label={"To Time"} maxDate={dayjs()} minDate={values.fromTime} />

                    {/* <MonthlyPicker required name="date" label={"Attendance Month"} maxDate={dayjs()} /> */}
                  </Grid>
                  {/* <Grid item>
                    <SelectWrapper
                      label="Status"
                      name="status"
                      options={[
                        { value: "APPROVED", label: "Approved" },
                        { value: "REJECTED", label: "Rejected" },
                        { value: "PENDING", label: "Pending" },
                      ]}
                      customHandleChange={() => {}}
                    />
                  </Grid> */}
                  <Grid item>
                    <TextFieldWrapper
                      label="Search"
                      placeholder="Emp Number"
                      name="searchTerm"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      size={"small"}
                      sx={{ minWidth: "250px" }}
                      fullWidth={true}
                    />
                  </Grid>
                  <Grid item>
                    <Button color="primary" variant="contained" sx={{ ...theme.typography.button }} type="submit" disabled={!isValid}>
                      View
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      color="primary"
                      variant="contained"
                      sx={{ ...theme.typography.button }}
                      type="button"
                      disabled={downloadItems.isPending || !isValid || !tableDataCount}
                      startIcon={
                        !isMobile && (downloadItems.isPending ? <CircularProgress color="inherit" sx={{ mr: 1 }} size={20} /> : <DownloadIcon />)
                      }
                      onClick={() => {
                        downloadItems.mutate(
                          {
                            divisionId: currentDivision?.value || undefined,
                            createdFrom: search.fromTime.toISOString(),
                            createdTo: search.toTime.toISOString(),
                            searchTerm: search.searchTerm === "" ? undefined : search.searchTerm,
                          },
                          {
                            onSuccess: (res) => {
                              const url = window.URL.createObjectURL(
                                new Blob([res.data], {
                                  type: res.headers["Content-Type"]?.toString() ?? "application/octet-stream",
                                })
                              );
                              const link = document.createElement("a");
                              link.href = url;
                              link.setAttribute(
                                "download",
                                `attendance-records-division:${currentDivision.label}-from:${values.fromTime}to:${values.toTime}.xlsx`
                              );
                              document.body.appendChild(link);
                              link.click();
                            },
                          }
                        );
                      }}
                    >
                      {isMobile ? (
                        downloadItems.isPending ? (
                          <CircularProgress color="inherit" sx={{ mr: 1 }} size={20} />
                        ) : (
                          <DownloadIcon fontSize="medium" />
                        )
                      ) : (
                        "Export"
                      )}
                    </Button>
                  </Grid>
                  {props.access[0] === "1" && (
                    <Grid item>
                      <Button
                        color="primary"
                        variant="contained"
                        sx={{ ...theme.typography.button }}
                        type="button"
                        startIcon={!isMobile && <AddIcon />}
                        onClick={handleClickOpen}
                      >
                        {isMobile ? <AddIcon fontSize="medium" /> : "Create Attendance"}
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
        <Grid item lg={12} md={12} xs={12}>
          {props.role !== 2 && (
            <Tabs value={tabValue} onChange={handleChange} variant="scrollable">
              {divisionTypes.map((divType, index) => (
                <Tab iconPosition="end" label={divType.label} key={index} />
              ))}
            </Tabs>
          )}
          {divisionTypes.map((divType, index) => (
            <TabPanel value={tabValue} index={index} key={index}>
              <AttendanceRecordsOnDate
                divisionType={divType}
                search={search}
                setDivisionType={setCurrentDivision}
                setTableDataCount={setTableDataCount}
                access={props.access}
                role={props.role}
              />
            </TabPanel>
          ))}
          {props.role === 2 && (
            <AttendanceRecordsOnDate
              setDivisionType={setCurrentDivision}
              setTableDataCount={setTableDataCount}
              divisionType={{ value: 0, label: "All", count: 0 }}
              search={search}
              role={props.role}
              access={props.access}
            />
          )}
        </Grid>
      </Grid>
      {dialog}
    </Grid>
  );
}

export default AttandaceRecords;
