import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
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
import SearchIcon from "@mui/icons-material/Search";
import { applyGlobalValidations } from "../../../utils/utils";
import EmployeeAttendanceList from "./PayrollList";
import dayjs, { Dayjs } from "dayjs";
import MonthlyPicker from "../../../utils/ui-components/FormsUI/MonthlyPicker";
import DownloadIcon from "@mui/icons-material/Download";
import { downloadSalaryRecords, getDivisionList } from "../../../assets/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useLocation, useNavigate } from "react-router-dom";

function PayrollManagement(props: { access: string; role: any }) {
  const theme: any = useTheme();
  const { state } = useLocation();
  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState<{
    searchTerm: string;
    month: Dayjs;
  }>({
    searchTerm: state?.searchTerm || "",
    month: state?.month ? dayjs().set("year", state?.year).set("month", state?.month) : dayjs(),
  });
  const navigate = useNavigate();
  const [currentDivision, setCurrentDivision] = useState<any>(null);
  const [tableDataCount, setTableDataCount] = useState<number>(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

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

  useEffect(() => {
    window.scrollTo(0, 0);
    window.history.replaceState({}, "");
  }, []);

  const downloadItems = useMutation({
    mutationKey: ["/salaryRecords/_download"],
    mutationFn: downloadSalaryRecords,
  });

  return (
    <Grid container justifyContent="center" spacing={gridSpacing}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <PageHeaders headerTitle="Employee Payroll" HeaderIcon={<AccountBalanceIcon />} />
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
                      placeholder="Emp Number.."
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
                  {(props.role === 1 || props.role === 4) && (
                    <Grid item>
                      <Button
                        color="primary"
                        variant="contained"
                        sx={{ ...theme.typography.button }}
                        type="button"
                        disabled={!isValid || !tableDataCount}
                        onClick={() => {
                          navigate("/staff/payroll/bulk-update", {
                            state: {
                              ...search,
                              month: dayjs(search?.month).month(),
                              year: dayjs(search?.month).year(),
                              divisonId: currentDivision?.value || undefined,
                            },
                          });
                        }}
                      >
                        Bulk Update
                      </Button>
                    </Grid>
                  )}
                  <Grid item>
                    <Button
                      color="primary"
                      variant="contained"
                      sx={{ ...theme.typography.button }}
                      type="button"
                      disabled={downloadItems.isPending || !isValid || !tableDataCount}
                      startIcon={downloadItems.isPending ? <CircularProgress color="inherit" sx={{ mr: 1 }} size={20} /> : <DownloadIcon />}
                      onClick={() => {
                        downloadItems.mutate(
                          {
                            month: values.month.month(),
                            year: values.month.year(),
                            divisionId: currentDivision?.value || undefined,
                            searchTerm: values.searchTerm ? values.searchTerm : undefined,
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
                                `employee_salary_sheet-division:${currentDivision.label}_month-${values.month.format("MMMM")}_${values.month.format(
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
                      Export
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
        <Grid item xs={12}>
          {props.role !== 2 && (
            <Tabs value={tabValue} onChange={handleChange} variant="scrollable">
              {listDivision.data?.map((divType, index) => (
                <Tab iconPosition="end" label={divType.label} key={index} />
              ))}
            </Tabs>
          )}
          {listDivision.data?.map((divType, index) => {
            return (
              <TabPanel value={tabValue} index={index} key={index}>
                <EmployeeAttendanceList
                  setDivisionType={setCurrentDivision}
                  setTableDataCount={setTableDataCount}
                  divisionType={divType}
                  search={search}
                  access={props.access}
                />
              </TabPanel>
            );
          })}
          {props.role === 2 && (
            <EmployeeAttendanceList
              setTableDataCount={setTableDataCount}
              divisionType={{ value: 0, label: "All" }}
              setDivisionType={setCurrentDivision}
              access={props.access}
              search={search}
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default PayrollManagement;
