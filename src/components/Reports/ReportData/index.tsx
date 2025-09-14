import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { applyGlobalValidations, convert_to_proper_case } from "../../../utils/utils";
import { isMobile } from "react-device-detect";
// custom components
// import EmployeeList from "./Employee/EmployeeList";
import { TabPanel } from "../../../utils/cssStyles";
import { gridSpacing } from "../../../store/constants";
import PageHeaders from "../../../utils/ui-components/PageHeaders";
import TextFieldWrapper from "../../../utils/ui-components/FormsUI/TextField";
import WorkIcon from "@mui/icons-material/Work";
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
import SortedCandidateList from "./sortList";
// import EmployeeReport from "./EmployeeReport";

function ReportData(props: { access: string }) {
  const theme: any = useTheme();
  const { state } = useLocation();
  console.log(state);
  const navigate = useNavigate();
  const matchDownmd = useMediaQuery(theme.breakpoints.up("md"));
  const formikRef: any = useRef(null);
  const [tabValue, setTabValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState<{
    search: string;
    empClass: string | number;
  }>({
    search: "",
    empClass: "ALL",
  });

  const listDivision = () => {};

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

  return (
    <Grid container justifyContent="center" spacing={gridSpacing}>
      <Grid item xs={12}>
        <PageHeaders HeaderIcon={<WorkIcon />} headerTitle={"Report - Job Post"} />
      </Grid>
      <Grid item container xs={12} spacing={1}>
        <Grid item xs={12}>
          <Formik
            innerRef={formikRef}
            enableReinitialize
            initialValues={{
              search: "",
              empClass: "ALL",
            }}
            validationSchema={applyGlobalValidations(
              Yup.object().shape({
                search: Yup.string().notRequired(),
                empClass: Yup.string().notRequired(),
                division: Yup.number().notRequired(),
              })
            )}
            onSubmit={(values) => {
              //   setSearch(values);
            }}
          >
            {({ isValid }) => (
              <Form>
                <Grid container columnSpacing={1} justifyContent={"flex-end"}>
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
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
        <Grid item xs={12}>
          <Tabs value={tabValue} onChange={handleChange} variant={"scrollable"}>
            {[
              { value: "ACTIVE", label: "Sorted Candidates" },
              { value: "INACTIVE", label: "Rejected Candidates" },
            ]?.map((empType, index) => (
              <Tab iconPosition="end" label={empType.label} key={index} />
            ))}
          </Tabs>
          <TabPanel value={tabValue} index={0} key={0}>
            <SortedCandidateList access={props.access} />
          </TabPanel>
          <TabPanel value={tabValue} index={1} key={1}>
            <SortedCandidateList access={props.access} />
          </TabPanel>
        </Grid>
      </Grid>
      {/* {dialog} */}
    </Grid>
  );
}

export default ReportData;
