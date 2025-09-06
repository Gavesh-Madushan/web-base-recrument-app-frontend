import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { gridSpacing } from "../../../store/constants";

// custom components
import JobList from "../Jobs/JobList";
import { TabPanel } from "../../../utils/cssStyles";
import PageHeaders from "../../../utils/ui-components/PageHeaders";
import TextFieldWrapper from "../../../utils/ui-components/FormsUI/TextField";

// mui
import { Grid, Tabs, Tab, InputAdornment, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { isMobile } from "react-device-detect";

// mui icon
import AddIcon from "@mui/icons-material/Add";
import WorkIcon from "@mui/icons-material/Work";
import SearchIcon from "@mui/icons-material/Search";
import { StaffService } from "../../../assets/_services/staff-service";
import { applyGlobalValidations } from "../../../utils/utils";

function ProjectManagement(props: { access: string; role: number }) {
  const theme: any = useTheme();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [search, setSearch] = useState("");

  const formikRef: any = useRef(null);

  const [divisionTypes, setDivisionTypes] = useState<{ value: number; label: string; count: number }[]>([]);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
    formikRef.current?.resetForm();
    setSearch("");
  };

  useEffect(() => {
    if (props.access[1] === "0") {
      navigate("/dashboard");
    } else {
      window.scrollTo(0, 0);
      window.history.replaceState({}, "");

      if (props.role !== 2) {
        StaffService.getDivisionList({ headEmpId: undefined, searchTerm: undefined }, 0, 50).then((response) => {
          if (response.isSuccess) {
            setDivisionTypes([
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
    }
  }, []);

  return (
    <Grid container justifyContent="center" spacing={gridSpacing}>
      <Grid item xs={12}>
        <PageHeaders HeaderIcon={<WorkIcon />} headerTitle={"Projects"} />
      </Grid>
      <Grid item container xs={12} spacing={1}>
        <Grid item xs={12}>
          <Formik
            innerRef={formikRef}
            enableReinitialize
            initialValues={{
              searchTerm: "",
            }}
            validationSchema={applyGlobalValidations(
              Yup.object().shape({
                searchTerm: Yup.string().notRequired(),
              })
            )}
            onSubmit={(values) => {
              // setPage(0);
              setSearch(values.searchTerm || "");
            }}
          >
            {({ isValid }) => (
              <Form>
                <Grid container columnSpacing={1} justifyContent={"flex-end"}>
                  <Grid item>
                    <TextFieldWrapper
                      label="Search"
                      placeholder="Project Name.."
                      name="searchTerm"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      size={"small"}
                      // sx={{ minWidth: "250px" }}
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
                        onClick={() => navigate("/project/jobs/create")}
                        startIcon={!isMobile && <AddIcon />}
                      >
                        {isMobile ? <AddIcon fontSize="medium" /> : "Create Project"}
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          {props.role !== 2 && (
            <Tabs value={tabValue} onChange={handleChange} variant="scrollable">
              {divisionTypes.map((divType, index) => (
                <Tab
                  iconPosition="end"
                  // icon={
                  //   <Icon sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  //     <Box
                  //       sx={{
                  //         display: "flex",
                  //         alignItems: "center",
                  //         justifyContent: "center",
                  //         width: 22, // Fixed width
                  //         height: 22, // Fixed height
                  //         backgroundColor: `${
                  //           divType.value === divisionTypes[tabValue].value ? theme.palette.secondary.main : theme.palette.secondary.light
                  //         } !important`, // Change background on hover
                  //         borderRadius: 1.5,
                  //       }}
                  //     >
                  //       <Typography
                  //         sx={{
                  //           fontWeight: "bold",
                  //           fontSize: 12, // Adjust the font size
                  //           color: `${divType.value === divisionTypes[tabValue].value ? "white" : "black"} !important`, // Ensure contrast against the background
                  //         }}
                  //       >
                  //         {divType.count}
                  //       </Typography>
                  //     </Box>
                  //   </Icon>
                  // }
                  label={divType.label}
                  key={index}
                />
              ))}
            </Tabs>
          )}
          {divisionTypes.map((divType, index) => (
            <TabPanel value={tabValue} index={index} key={index}>
              <JobList divisionType={divType} search={search} />
            </TabPanel>
          ))}
          {props.role === 2 && <JobList divisionType={{ value: 0, label: "All", count: 0 }} search={search} />}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default ProjectManagement;
