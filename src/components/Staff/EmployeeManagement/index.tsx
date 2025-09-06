import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { applyGlobalValidations, convert_to_proper_case } from "../../../utils/utils";
import { isMobile } from "react-device-detect";
// custom components
import EmployeeList from "./Employee/EmployeeList";
import { TabPanel } from "../../../utils/cssStyles";
import { gridSpacing } from "../../../store/constants";
import PageHeaders from "../../../utils/ui-components/PageHeaders";
import TextFieldWrapper from "../../../utils/ui-components/FormsUI/TextField";
import DownloadIcon from "@mui/icons-material/Download";

// mui
import { useTheme } from "@mui/material/styles";
import { Grid, Tabs, Tab, InputAdornment, Button, useMediaQuery, CircularProgress } from "@mui/material";

// mui icon
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SelectWrapper from "../../../utils/ui-components/FormsUI/Select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { downloadUserList, getDivisionList, getEmployeeDesignationList } from "../../../assets/api";
import ViewEditDialog from "../../../utils/ui-components/ViewEditDialog";
import EmployeeReport from "./EmployeeReport";

function EmployeeManagement(props: { access: string; role?: number }) {
  const theme: any = useTheme();
  const navigate = useNavigate();
  const matchDownmd = useMediaQuery(theme.breakpoints.up("md"));
  const formikRef: any = useRef(null);
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState<{
    search: string;
    empClass: string | number;
    division: string | number;
  }>({
    search: "",
    empClass: "ALL",
    division: props.role === 3 || props.role === 1 ? 0 : "",
  });

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

  const listEmployeeClass = useQuery({
    queryKey: ["listEmployeeDesignations"],
    queryFn: () => getEmployeeDesignationList(),
    select: (res) =>
      res.data.map((item) => ({
        value: item,
        label: convert_to_proper_case(item),
      })),
  });

  const downloadItems = useMutation({
    mutationKey: ["/users/_download"],
    mutationFn: downloadUserList,
  });

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    // console.log((listDivision?.data || [])[newValue]);
    formikRef.current?.setFieldValue("search", "");
    formikRef.current?.setFieldValue("empClass", "ALL");
    formikRef.current?.setFieldValue("division", (listDivision?.data || [])[newValue].value || "");
    setSearch({
      division: (listDivision?.data || [])[newValue].value || "",
      empClass: "ALL",
      search: "",
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    window.history.replaceState({}, "");
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTabValue(0);
  }, [matchDownmd]);

  const dialog = useMemo(
    () =>
      ViewEditDialog(EmployeeReport)({
        open: open,
        setOpen: setOpen,
        dialogTitle: "Employee Report",
        initialItem: {},
        initialData: {
          ...search,
          divisionList: props.role === 3 || props.role === 1 ? [{ value: 0, label: "All" }, ...(listDivision.data || [])] : listDivision.data,
          tabValue: tabValue,
        },
        fetchData: downloadItems,
        theme: theme,
        maxWidth: "sm",
      }),
    [open]
  );

  return (
    <Grid container justifyContent="center" spacing={gridSpacing}>
      <Grid item xs={12}>
        <PageHeaders HeaderIcon={<Inventory2Icon />} headerTitle={"Employee"} />
      </Grid>
      <Grid item container xs={12} spacing={1}>
        <Grid item xs={12}>
          <Formik
            innerRef={formikRef}
            enableReinitialize
            initialValues={{
              search: "",
              empClass: "ALL",
              division: props.role === 3 || props.role === 1 ? 0 : "",
            }}
            validationSchema={applyGlobalValidations(
              Yup.object().shape({
                search: Yup.string().notRequired(),
                empClass: Yup.string().notRequired(),
                division: Yup.number().notRequired(),
              })
            )}
            onSubmit={(values) => {
              setSearch(values);
            }}
          >
            {({ isValid }) => (
              <Form>
                <Grid container columnSpacing={1} justifyContent={"flex-end"}>
                  {!matchDownmd && listDivision.isFetched && (
                    <Grid item xl={3} lg={3} md={3} sm={4} xs={12}>
                      <SelectWrapper
                        label={"Division"}
                        name="division"
                        options={
                          props.role === 3 || props.role === 1 ? [{ value: 0, label: "All" }, ...(listDivision?.data || [])] : listDivision?.data
                        }
                        customHandleChange={() => {}}
                      />
                    </Grid>
                  )}
                  {listEmployeeClass?.isFetched && (
                    <Grid item xl={3} lg={3} md={3} sm={4} xs={12}>
                      <SelectWrapper
                        label={"Employee Class"}
                        name="empClass"
                        options={[{ value: "ALL", label: "All" }, ...(listEmployeeClass?.data || [])]}
                        customHandleChange={() => {}}
                      />
                    </Grid>
                  )}
                  <Grid item xl={3} lg={3} md={4} sm={6} xs={12}>
                    <TextFieldWrapper
                      label="Search"
                      placeholder="Emp Name..."
                      name="search"
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
                    <Button color="primary" variant="contained" sx={{ ...theme.typography.button }} type="submit">
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
                        onClick={() => navigate("/staff/employee/0")}
                        startIcon={<AddIcon />}
                      >
                        Create Employee
                      </Button>
                    </Grid>
                  )}
                  {(props.role === 3 || props.role === 1) && (
                    <Grid item>
                      <Button
                        color="primary"
                        variant="contained"
                        sx={{ ...theme.typography.button }}
                        type="button"
                        disabled={downloadItems.isPending || !isValid}
                        startIcon={
                          !isMobile && (downloadItems.isPending ? <CircularProgress color="inherit" sx={{ mr: 1 }} size={20} /> : <DownloadIcon />)
                        }
                        onClick={() => {
                          setOpen(true);
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
                  )}
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
        {(props.role === 1 || props.role === 3 || props.role === 4) && matchDownmd ? (
          <Grid item xs={12}>
            <Tabs value={tabValue} onChange={handleChange} variant={"scrollable"}>
              {(props.role === 3 || props.role === 1 ? [{ value: 0, label: "All" }, ...(listDivision.data || [])] : listDivision.data)?.map(
                (empType, index) => (
                  <Tab iconPosition="end" label={empType.label} key={index} />
                )
              )}
            </Tabs>
            {(props.role === 3 || props.role === 1 ? [{ value: 0, label: "All" }, ...(listDivision.data || [])] : listDivision.data)?.map(
              (division, index) => (
                <TabPanel value={tabValue} index={index} key={index}>
                  <EmployeeList division={division.value} search={search} access={props.access} />
                </TabPanel>
              )
            )}
          </Grid>
        ) : (
          <Grid item xs={12}>
            <EmployeeList division={search.division} search={search} access={props.access} />
          </Grid>
        )}
      </Grid>
      {dialog}
    </Grid>
  );
}

export default EmployeeManagement;
