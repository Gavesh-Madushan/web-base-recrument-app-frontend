import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { gridSpacing } from "../../../store/constants";

// custom components
import { TabPanel } from "../../../utils/cssStyles";
import PageHeaders from "../../../utils/ui-components/PageHeaders";
import TextFieldWrapper from "../../../utils/ui-components/FormsUI/TextField";
import { isMobile } from "react-device-detect";

// mui
import { Grid, Tabs, Tab, InputAdornment, Button, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// mui icon
// import AddIcon from "@mui/icons-material/Add";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import { StaffService } from "../../../assets/_services/staff-service";
import { applyGlobalValidations } from "../../../utils/utils";
import EmployeeAttendanceList from "./AttendanceList";
import dayjs, { Dayjs } from "dayjs";
import MonthlyPicker from "../../../utils/ui-components/FormsUI/MonthlyPicker";
import DownloadIcon from "@mui/icons-material/Download";
import { downloadWorkBehaviorRecords } from "../../../assets/api";
import { useMutation } from "@tanstack/react-query";

function EmployeeAttendance(access: { access: string; role: any }) {
  const theme: any = useTheme();

  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState<{
    searchTerm: string;
    month: Dayjs;
  }>({
    searchTerm: "",
    month: dayjs(),
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
      access.role !== 2 &&
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

  const downloadItems = useMutation({
    mutationKey: ["summaries/users/workBehaviorRecords/_download"],
    mutationFn: downloadWorkBehaviorRecords,
  });

  return (
    <Grid container justifyContent="center" spacing={gridSpacing}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <PageHeaders headerTitle="Attendance Summery" HeaderIcon={<CalendarMonthIcon />} />
      </Grid>
      <Grid item container xs={12} spacing={1}>
        <Grid item xs={12}>
          <Formik
            initialValues={{
              searchTerm: "",
              month: dayjs(),
            }}
            validationSchema={applyGlobalValidations(
              Yup.object().shape({
                searchTerm: Yup.string().notRequired(),
                month: Yup.date().required("Select a month"),
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
                    <MonthlyPicker required name="month" label={"Attendance Month"} maxDate={dayjs()} />
                  </Grid>
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
                      sx={{ maxWidth: "200px" }}
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
                            month: values.month.month(),
                            year: values.month.year(),
                            divisionId: currentDivision?.value || undefined,
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
                                `attendance-summary-records-division:${currentDivision.label}-${values.month.format("MMMM")}_${values.month.format(
                                  "YYYY"
                                )}.xlsx`
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
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
        <Grid item lg={12} md={12} xs={12}>
          {access.role !== 2 && (
            <Tabs value={tabValue} onChange={handleChange} variant="scrollable">
              {divisionTypes.map((divType, index) => (
                <Tab iconPosition="end" label={divType.label} key={index} />
              ))}
            </Tabs>
          )}
          {divisionTypes.map((divType, index) => {
            return (
              <TabPanel value={tabValue} index={index} key={index}>
                <EmployeeAttendanceList
                  setDivisionType={setCurrentDivision}
                  setTableDataCount={setTableDataCount}
                  divisionType={divType}
                  search={search}
                />
              </TabPanel>
            );
          })}
          {access.role === 2 && (
            <EmployeeAttendanceList
              setTableDataCount={setTableDataCount}
              divisionType={{ value: 0, label: "All", count: 0 }}
              setDivisionType={setCurrentDivision}
              search={search}
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default EmployeeAttendance;
