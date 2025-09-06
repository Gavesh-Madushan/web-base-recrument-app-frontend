import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { gridSpacing } from "../../../../store/constants";
import { getState, SET_BREADCRUMBS } from "../../../../redux/actions/actions";

// custom components
import TeamMembers from "./Team";
import { TabPanel } from "../../../../utils/cssStyles";
import MapComponent from "../../../../utils/ui-components/Map";
import MainCard from "../../../../utils/ui-components/MainCard";
import { applyGlobalValidations, convert_to_proper_case } from "../../../../utils/utils";
import EmptyResult from "../../../../utils/ui-components/EmptyResult";
import PageHeaders from "../../../../utils/ui-components/PageHeaders";
import TextField from "../../../../utils/ui-components/FormsUI/TextField";
import { StaffService } from "../../../../assets/_services/staff-service";
import { ProjectService } from "../../../../assets/_services/project-service";
import RadioGroupWrapper from "../../../../utils/ui-components/FormsUI/RadioGroup";
import { openSuccessDialog } from "../../../../utils/ui-components/pop-ups/SuccessDialog";
import InfiniteScrollSelect from "../../../../utils/ui-components/FormsUI/InfinityScrollSelect";
import { closeConfirmDialog, openConfirmDialog } from "../../../../utils/ui-components/pop-ups/ConfirmDialog";

// mui
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";

// mui icons
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector } from "react-redux";

export interface CreateJobInterface {
  jobDetails: {
    jobName: string;
    client: string;
    isOutstation: string;
    address: string;
    location: {
      latitude: number | string;
      longitude: number | string;
    };
    description: string;
    division: number | string;
  };
  team: {
    id: number;
    empImage: string;
    name_with_initials: string;
    emp_no: string;
    designation_type: string;
    class: string;
  }[];
}

function CreateJob({ role }: { role: any }) {
  const authState = useSelector((state: any) => state.auth.authData);
  const user = getState(authState);
  const dispatch = useDispatch();
  const { state } = useLocation();
  const theme: any = useTheme();
  const formikRef: any = useRef(null);
  const navigate = useNavigate();

  const initialItem: CreateJobInterface = {
    jobDetails: {
      jobName: "",
      client: "",
      isOutstation: "",
      address: "",
      location: {
        latitude: "",
        longitude: "",
      },
      description: "",
      division: "",
    },
    team: [],
  };

  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [employeeTypes, setEmployeeTypes] = useState<
    {
      value: "ENGINEER" | "TECHNICIAN" | "ASSISTANT_ENGINEER" | "ALL";
      label: string;
      count: number;
    }[]
  >([]);
  const [location, setLocation] = useState<{ lat: number; lng: number; name: string }[]>([]);

  useEffect(() => {
    dispatch({
      type: SET_BREADCRUMBS,
      payload: [
        { name: "Home", path: "/Dashboard", bold: false, state: null },
        {
          name: "Projecs",
          path: "/project/jobs",
          bold: false,
          state: state,
        },
        { name: "Create", path: null, bold: true, state: null },
      ],
    });

    StaffService.getEmployeeDesignationList().then((response) => {
      if (response.isSuccess) {
        const employeeTypes = [
          // { value: "ALL" as const, label: "All", count: 0 },
          ...response.data
            .filter((empType) => empType === "ENGINEER" || empType === "TECHNICIAN" || empType === "ASSISTANT_ENGINEER")
            .map((empType) => ({
              value: empType,
              label: convert_to_proper_case(empType),
              count: 0,
            })),
        ];
        setEmployeeTypes(employeeTypes);
      } else {
        setEmployeeTypes([{ value: "ALL" as const, label: "All", count: 0 }]);
      }
    });
  }, []);

  useEffect(() => {
    if (formikRef.current && location.length > 0) {
      formikRef.current.setFieldValue("jobDetails.location", {
        latitude: location[0]?.lat,
        longitude: location[0]?.lng,
      });
    }
  }, [location]);

  const FORM_VALIDATION = Yup.object().shape({
    jobDetails: Yup.object().shape({
      jobName: Yup.string()
        .required("Project name is required")
        .test("no-spaces", "Cannot start or end with a space", (value) => !value?.startsWith(" ") && !value?.endsWith(" "))
        .test("no-semicolon", "Semicolon (;) is not allowed", (value) => !value?.includes(";")),
      client: Yup.string().required("Project customer is required"),
      isOutstation: Yup.string().required("Project location is required"),
      address: Yup.string()
        .required("Project address is required")
        .test("no-spaces", "Cannot start or end with a space", (value) => !value?.startsWith(" ") && !value?.endsWith(" ")),
      location: Yup.object().shape({
        latitude: Yup.number().required("Location is required"),
        longitude: Yup.number().required("Location is required"),
      }),
      description: Yup.string()
        .notRequired()
        .test("no-spaces", "Cannot start or end with a space", (value) => !value?.startsWith(" ") && !value?.endsWith(" ")),
      // division: user.designation === "MANAGER" ? Yup.string().required("Division is required") : Yup.string().notRequired(""),
      division: Yup.string().when([], {
        is: () => user.designation === "MANAGER",
        then: (schema) => schema.required("Division is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    }),
    team: Yup.array()
      .of(
        Yup.object().shape({
          id: Yup.number().required("Employee ID is required"),
          empImage: Yup.string().notRequired(),
          name_with_initials: Yup.string().required("Employee name is required"),
          emp_no: Yup.string().required("Employee name is required"),
          designation_type: Yup.string().required("Employee class is required"),
          class: Yup.string().required("Employee designation is required"),
        })
      )
      .min(1, "Need Minimum one employee for the team"),
  });

  const createProject = (itemData: CreateJobInterface, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true);
    const data = {
      name: itemData.jobDetails.jobName,
      location: [Number(itemData.jobDetails.location.latitude), Number(itemData.jobDetails.location.longitude)],
      divisionId: user.designation === "MANAGER" ? Number(itemData.jobDetails.division) : Number(user.divisionId),
      clientId: Number(itemData.jobDetails.client),
      isOutstation: Number(itemData.jobDetails.isOutstation) === 1 ? true : false,
      description: itemData.jobDetails.description,
      address: itemData.jobDetails.address,
    };
    ProjectService.createProject(data).then((response) => {
      if (response.isSuccess) {
        createTeam(response.data.id, itemData, setSubmitting);
      } else {
        setSubmitting(false);
        setIsLoading(false);
      }
    });
  };

  const createTeam = (projectId: number, itemData: CreateJobInterface, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true);
    const data = {
      id: projectId,
      members: itemData.team.map((member) => Number(member.id)),
    };
    ProjectService.updateProjectTeam(data).then((response) => {
      if (response.isSuccess) {
        openSuccessDialog("Success", `${itemData.jobDetails.jobName} project created successfully`);
        navigate("/project/jobs");
      } else {
        setSubmitting(false);
        setIsLoading(false);
      }
    });
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Grid container justifyContent="center" spacing={gridSpacing}>
      <Grid item xs={12}>
        <PageHeaders HeaderIcon={<WorkIcon />} headerTitle={"Create Project"} />
      </Grid>
      <Grid item xs={12}>
        <Formik
          innerRef={formikRef}
          initialValues={{
            ...initialItem,
          }}
          validationSchema={applyGlobalValidations(FORM_VALIDATION)}
          onSubmit={(values, { setSubmitting }) => {
            createProject(values, setSubmitting);
          }}
        >
          {({ values, dirty, isSubmitting, isValid, setFieldValue, resetForm }) => (
            <Form>
              <Grid container spacing={1}>
                <Grid item xs={12} lg={12} md={12}>
                  <MainCard title="Project Information">
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Grid container columnSpacing={gridSpacing}>
                          <Grid item xl={12} xs={12} md={6}>
                            <RadioGroupWrapper
                              // required
                              name="jobDetails.isOutstation"
                              label={"Project Location *"}
                              radioGroup={[
                                { value: 1, label: "Outstation" },
                                { value: 2, label: "Local" },
                              ]}
                              disabled={false}
                            />
                          </Grid>
                          <Grid item xl={12} xs={12} md={12}>
                            <TextField required label="Job Name" name="jobDetails.jobName" type="text" />
                          </Grid>
                          <Grid item xl={6} xs={12}>
                            <InfiniteScrollSelect
                              label="Customer *"
                              name="jobDetails.client"
                              customHandleChange={() => {}}
                              fetchData={async (page: number) => {
                                const values = {
                                  activeState: "ACTIVE" as const,
                                  searchTerm: undefined,
                                };
                                const response = await ProjectService.getClientList(values, page, 30);
                                if (response.isSuccess) {
                                  return response.data.data.map((client) => ({
                                    value: client.id,
                                    label: client.businessName,
                                  }));
                                } else {
                                  return [];
                                }
                              }}
                            />
                          </Grid>
                          {user.designation === "MANAGER" && (
                            <Grid item xl={6} xs={12}>
                              <InfiniteScrollSelect
                                label="Division *"
                                name="jobDetails.division"
                                customHandleChange={() => {}}
                                fetchData={async (page: number) => {
                                  const values = {
                                    headEmpId: undefined,
                                    searchTerm: undefined,
                                  };
                                  const response = await StaffService.getDivisionList(values, page, 30);
                                  if (response.isSuccess) {
                                    return response.data.data.map((division) => ({
                                      value: division.id,
                                      label: division.name,
                                    }));
                                  } else {
                                    return [];
                                  }
                                }}
                              />
                            </Grid>
                          )}
                          <Grid item xl={12} xs={12}>
                            <TextField required label="Discription" name="jobDetails.description" type="text" multiline />
                          </Grid>
                          <Grid item xl={12} xs={12}>
                            <TextField
                              required
                              label="Address"
                              name="jobDetails.address"
                              type="text"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <HomeIcon />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={6} sx={{ height: "50vh" }}>
                        {!values.jobDetails.location.latitude && (
                          <Typography variant="caption" color="error">
                            Select Project Location on map
                          </Typography>
                        )}
                        <MapComponent
                          locations={location}
                          onMapClick={(latlng) => {
                            setLocation([
                              {
                                lat: latlng.lat,
                                lng: latlng.lng,
                                name: "Manual Selection",
                              },
                            ]);
                          }}
                          onMarkerClick={() => {}}
                          searchLocation={true}
                          centerLocation={[6.9271, 79.8612]}
                          currentLocationRadius={0}
                          showCurrentLocation={false}
                          zoom={10}
                        />
                      </Grid>
                    </Grid>
                  </MainCard>
                </Grid>
                {role === 1 && values.jobDetails.division && (
                  <Grid item xl={12} xs={12} sx={{ mt: 1 }}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: "#ffff" }} />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                        }}
                      >
                        <Typography fontWeight={"bold"} variant="h4" color={"#ffff"}>
                          Team Details
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={gridSpacing}>
                          <Grid item xs={12} xl={6}>
                            <Tabs value={tabValue} onChange={handleChange} variant="scrollable">
                              {employeeTypes.map((empType, index) => (
                                <Tab iconPosition="end" label={empType.label} key={index} />
                              ))}
                            </Tabs>
                            {employeeTypes.map((empType, index) => (
                              <TabPanel value={tabValue} index={index} key={index}>
                                <TeamMembers
                                  empType={empType}
                                  setFieldValue={setFieldValue}
                                  team={values.team}
                                  division={values.jobDetails.division}
                                />
                              </TabPanel>
                            ))}
                          </Grid>
                          <Grid item xs={12} xl={6}>
                            <Stack
                              justifyContent={"center"}
                              sx={{
                                mb: 1,
                                border: `2px solid ${theme.palette.info[200]}`,
                                height: 46,
                                borderRadius: 2,
                                p: 1,
                              }}
                            >
                              <Typography fontWeight={"bold"} variant="caption">
                                Team Members
                              </Typography>
                            </Stack>
                            <Grid item xs={12}>
                              <Box sx={{ minHeight: 400, width: "100%" }}>
                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell width={60} />
                                      <TableCell>Emp No</TableCell>
                                      <TableCell>Name</TableCell>
                                      <TableCell>Designation</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {values.team.map((user, index) => {
                                      return (
                                        <TableRow key={index}>
                                          <TableCell>
                                            <DeleteIcon
                                              color="error"
                                              onClick={() => {
                                                setFieldValue(
                                                  "team",
                                                  values.team.filter((teamMember) => teamMember.id !== user.id)
                                                );
                                              }}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <Stack alignItems={"center"} direction={"row"} spacing={2}>
                                              <Avatar
                                                src={""}
                                                // sx={{ width: 32, height: 32 }}
                                              />
                                              <Typography>{user?.emp_no}</Typography>
                                            </Stack>
                                          </TableCell>
                                          <TableCell>{user?.name_with_initials}</TableCell>
                                          <TableCell>{user?.class}</TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                                {!values.team?.length && <EmptyResult />}
                              </Box>
                            </Grid>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                )}
                {role !== 1 && (
                  <Grid item xl={12} xs={12} sx={{ mt: 1 }}>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: "#ffff" }} />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                        }}
                      >
                        <Typography fontWeight={"bold"} variant="h4" color={"#ffff"}>
                          Team Details
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={gridSpacing}>
                          <Grid item xs={12} xl={7}>
                            <Tabs value={tabValue} onChange={handleChange} variant="scrollable">
                              {employeeTypes.map((empType, index) => (
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
                                  //           empType.value === employeeTypes[tabValue].value
                                  //             ? theme.palette.secondary.main
                                  //             : theme.palette.secondary.light
                                  //         } !important`, // Change background on hover
                                  //         borderRadius: 1.5,
                                  //       }}
                                  //     >
                                  //       <Typography
                                  //         sx={{
                                  //           fontWeight: "bold",
                                  //           fontSize: 12, // Adjust the font size
                                  //           color: `${empType.value === employeeTypes[tabValue].value ? "white" : "black"} !important`, // Ensure contrast against the background
                                  //         }}
                                  //       >
                                  //         {empType.count}
                                  //       </Typography>
                                  //     </Box>
                                  //   </Icon>
                                  // }
                                  label={empType.label}
                                  key={index}
                                />
                              ))}
                            </Tabs>
                            {employeeTypes.map((empType, index) => (
                              <TabPanel value={tabValue} index={index} key={index}>
                                <TeamMembers
                                  empType={empType}
                                  setFieldValue={setFieldValue}
                                  team={values.team}
                                  division={values.jobDetails.division}
                                />
                              </TabPanel>
                            ))}
                          </Grid>
                          <Grid item xs={12} xl={5}>
                            <Stack
                              justifyContent={"center"}
                              sx={{
                                mb: 1,
                                border: `2px solid ${theme.palette.info[200]}`,
                                height: 46,
                                borderRadius: 2,
                                p: 1,
                              }}
                            >
                              <Typography fontWeight={"bold"} variant="caption">
                                Team Members
                              </Typography>
                            </Stack>
                            <Grid item xs={12}>
                              <Box sx={{ minHeight: 400, width: "100%" }}>
                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell width={60} />
                                      <TableCell>Emp No</TableCell>
                                      <TableCell>Name</TableCell>
                                      <TableCell width={100}>Designation</TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {values.team.map((user, index) => {
                                      return (
                                        <TableRow key={index}>
                                          <TableCell>
                                            <DeleteIcon
                                              color="error"
                                              onClick={() => {
                                                setFieldValue(
                                                  "team",
                                                  values.team.filter((teamMember) => teamMember.id !== user.id)
                                                );
                                              }}
                                            />
                                          </TableCell>
                                          <TableCell>
                                            <Stack alignItems={"center"} direction={"row"} spacing={2}>
                                              <Avatar
                                                src={`https://images.unsplash.com/photo-1562788869-4ed32648eb72?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZW1wbG95ZWV8ZW58MHx8MHx8fDA%3D`}
                                                // sx={{ width: 32, height: 32 }}
                                              />
                                              <Typography>{user?.emp_no}</Typography>
                                            </Stack>
                                          </TableCell>
                                          <TableCell>{user?.name_with_initials}</TableCell>
                                          <TableCell>{user?.designation_type}</TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                                {!values.team?.length && <EmptyResult />}
                              </Box>
                            </Grid>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  </Grid>
                )}

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
                    <Button
                      color="primary"
                      variant="contained"
                      type="button"
                      size="medium"
                      sx={{ ...theme.typography.button }}
                      onClick={() =>
                        openConfirmDialog("Reset Form", `Are you sure you want to reset form?`, {}, () => {
                          closeConfirmDialog();
                          resetForm();
                        })
                      }
                    >
                      Clear
                    </Button>
                    <Button
                      color="primary"
                      variant="contained"
                      type="submit"
                      sx={{ ...theme.typography.button }}
                      size="medium"
                      disabled={!dirty || isSubmitting || !isValid}
                      startIcon={
                        isLoading && (
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
                      Create Project
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

export default CreateJob;
