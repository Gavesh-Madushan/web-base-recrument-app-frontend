import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { gridSpacing } from "../../../../store/constants";
import { SET_BREADCRUMBS } from "../../../../redux/actions/actions";

// custom components
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
import { getProjectDetailsById } from "../../../../assets/api";
import TeamMembers from "../CreateJob/Team";

export interface UpdateProjectInterface {
  id: number | string;
  jobName: string;
  client: number | string;
  isOutstation: string;
  address: string;
  location: {
    latitude: number | string;
    longitude: number | string;
  };
  description: string;
  division: number | string;
}

export interface UpdateTeamInterface {
  id: number | string;
  team: {
    id: number | string;
    empImage: string;
    name_with_initials: string;
    emp_no: string;
    designation_type: string;
  }[];
}

function UpdateProjectDetails({ role }: { role: number }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { state } = useLocation();
  const theme: any = useTheme();
  const formikRef: any = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [employeeTypes] = useState<
    {
      value: "ENGINEER" | "TECHNICIAN" | "ASSISTANT_ENGINEER" | "ALL";
      label: string;
      count: number;
    }[]
  >([
    {
      value: "ENGINEER",
      label: "Engineer",
      count: 0,
    },
    {
      value: "TECHNICIAN",
      label: "Technician",
      count: 0,
    },
    {
      value: "ASSISTANT_ENGINEER",
      label: "Assistant Engineer",
      count: 0,
    },
  ]);
  const [location, setLocation] = useState<{ lat: number; lng: number; name: string }[]>([]);
  const [initialItem, setInitialItem] = useState<UpdateProjectInterface>({
    id: "",
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
  });

  const [initialTeam, setInitialTeam] = useState<{
    id: number | string;
    team: {
      id: number;
      empImage: string;
      name_with_initials: string;
      emp_no: string;
      designation_type: string;
    }[];
  }>({ id: "", team: [] });

  useEffect(() => {
    dispatch({
      type: SET_BREADCRUMBS,
      payload: [
        { name: "Home", path: "/Dashboard", bold: false, state: null },
        {
          name: `Projecs (${initialItem.jobName})`,
          path: `/project/jobs/${id}`,
          bold: false,
          state: state,
        },
        { name: "Update", path: null, bold: true, state: null },
      ],
    });
  }, [initialItem]);

  useEffect(() => {
    getProjectDetails();
    getTeamMembers();
  }, []);

  const getProjectDetails = () => {
    getProjectDetailsById({ id: Number(id) }).then((response) => {
      if (response.data) {
        setInitialItem({
          id: response.data.id,
          jobName: response.data.name,
          client: response.data.clientId || "",
          isOutstation: response.data.isOutstation ? "1" : "2",
          address: response.data.address,
          location: {
            latitude: response.data.location[0],
            longitude: response.data.location[1],
          },
          description: response.data.description || "",
          division: String(response.data.divisionId),
        });
        setLocation([
          {
            lat: response.data.location[0],
            lng: response.data.location[1],
            name: "",
          },
        ]);
      }
    });
  };

  const getTeamMembers = () => {
    const values = {
      projectId: Number(id),
    };
    ProjectService.getTeamMembers(values, 0, 50).then((response) => {
      if (response.isSuccess) {
        setInitialTeam({
          id: Number(id),
          team: response.data.data.map((emp) => ({
            id: emp?.userId,
            name_with_initials: emp?.user?.nameInitials || "",
            emp_no: emp.user?.employeeNumber || "",
            designation_type: emp?.user?.designation || "",
            empImage: "",
          })),
        });
      } else {
        setInitialTeam({
          id: Number(id),
          team: [],
        });
      }
    });
  };

  useEffect(() => {
    if (formikRef.current && location.length > 0) {
      formikRef.current.setFieldValue("location", {
        latitude: location[0]?.lat,
        longitude: location[0]?.lng,
      });
    }
  }, [location]);

  const FORM_VALIDATION_PROJECT = Yup.object().shape({
    jobName: Yup.string()
      .required("Project name is required")
      .test("no-spaces", "Cannot start or end with a space", (value) => !value?.startsWith(" ") && !value?.endsWith(" "))
      .test("no-semicolon", "Semicolon (;) is not allowed", (value) => !value?.includes(";")),
    client: Yup.number().required("Project customer is required"),
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
      is: () => role === 1,
      then: (schema) => schema.required("Division is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const FORM_VALIDATION_TEAM = Yup.object().shape({
    team: Yup.array()
      .of(
        Yup.object().shape({
          id: Yup.number().required("Employee ID is required"),
          empImage: Yup.string().notRequired(),
          name_with_initials: Yup.string().required("Employee name is required"),
          emp_no: Yup.string().required("Employee name is required"),
          designation_type: Yup.string().required("Employee designation is required"),
        })
      )
      .min(1, "Need Minimum one employee for the team"),
  });

  const updateProject = (itemData: UpdateProjectInterface, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true);
    const data = {
      id: Number(id),
      name: itemData.jobName,
      location: [Number(itemData.location.latitude), Number(itemData.location.longitude)],
      clientId: Number(itemData.client),
      isOutstation: Number(itemData.isOutstation) === 1 ? true : false,
      description: itemData.description,
      address: itemData.address,
    };
    ProjectService.updateProject(data).then((response) => {
      if (response.isSuccess) {
        openSuccessDialog("Success", `project details updated successfully`);
        getProjectDetails();
        setIsLoading(false);
        setSubmitting(false);
      } else {
        setSubmitting(false);
        setIsLoading(false);
      }
    });
  };

  const updateTeam = (itemData: UpdateTeamInterface, setSubmitting: (isSubmitting: boolean) => void) => {
    setIsLoading(true);
    const data = {
      id: Number(itemData?.id),
      members: itemData.team.map((member) => Number(member.id)),
    };
    ProjectService.updateProjectTeam(data)
      .then((response) => {
        if (response.isSuccess) {
          openSuccessDialog("Success", `project team updated successfully`);
          getTeamMembers();
        } else {
          setSubmitting(false);
          setIsLoading(false);
        }
      })
      .finally(() => {
        setSubmitting(false);
        setIsLoading(false);
      });
  };

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Grid container justifyContent="center" spacing={gridSpacing}>
      <Grid item xs={12}>
        <PageHeaders HeaderIcon={<WorkIcon />} headerTitle={"Update Project"} />
      </Grid>
      <Grid item xs={12}>
        <Formik
          enableReinitialize
          innerRef={formikRef}
          initialValues={{
            ...initialItem,
          }}
          validationSchema={applyGlobalValidations(FORM_VALIDATION_PROJECT)}
          onSubmit={(values, { setSubmitting }) => {
            updateProject(values, setSubmitting);
          }}
        >
          {({ values, dirty, isSubmitting, isValid, resetForm }) => (
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
                              disabled={false}
                              name="isOutstation"
                              label={"Project Location *"}
                              radioGroup={[
                                { value: 1, label: "Outstation" },
                                { value: 2, label: "Local" },
                              ]}
                            />
                          </Grid>
                          <Grid item xl={12} xs={12} md={12}>
                            <TextField required label="Job Name" name="jobName" type="text" />
                          </Grid>
                          <Grid item xl={6} xs={12}>
                            <InfiniteScrollSelect
                              label="Customer *"
                              name="client"
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
                          {role === 1 && (
                            <Grid item xl={6} xs={12}>
                              <InfiniteScrollSelect
                                label="Division *"
                                name="division"
                                disabled
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
                            <TextField required label="Discription" name="description" type="text" multiline />
                          </Grid>
                          <Grid item xl={12} xs={12}>
                            <TextField
                              required
                              label="Address"
                              name="address"
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
                                Update Project
                              </Button>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={6} sx={{ height: "50vh" }}>
                        {!values.location.latitude && (
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
              </Grid>
            </Form>
          )}
        </Formik>
      </Grid>
      <Grid item xs={12}>
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
              <Formik
                enableReinitialize
                initialValues={{
                  ...initialTeam,
                }}
                validationSchema={applyGlobalValidations(FORM_VALIDATION_TEAM)}
                onSubmit={(values, { setSubmitting }) => {
                  updateTeam(values, setSubmitting);
                }}
              >
                {({ values, dirty, isSubmitting, isValid, resetForm, setFieldValue }) => (
                  <Form>
                    <Grid container spacing={gridSpacing}>
                      <Grid item xs={12}>
                        <Box display="flex" flexDirection="row" justifyContent={"flex-end"} columnGap={1}>
                          <Button
                            variant="contained"
                            type="button"
                            disabled={!dirty || isSubmitting}
                            onClick={() => {
                              resetForm();
                            }}
                          >
                            Clear
                          </Button>
                          <Button variant="contained" type="submit" disabled={!dirty || isSubmitting || !isValid}>
                            Update Team
                          </Button>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={12} lg={12} xl={6}>
                        <Tabs value={tabValue} onChange={handleChange} variant="scrollable">
                          {employeeTypes.map((empType, index) => (
                            <Tab iconPosition="end" label={empType.label} key={index} />
                          ))}
                        </Tabs>
                        {employeeTypes.map((empType, index) => (
                          <TabPanel value={tabValue} index={index} key={index}>
                            <TeamMembers empType={empType} setFieldValue={setFieldValue} team={values.team} division={initialItem.division} />
                          </TabPanel>
                        ))}
                      </Grid>
                      <Grid item xs={12} md={12} lg={12} xl={6}>
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
                            Selected Team Members
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
                                            src={``}
                                            // sx={{ width: 32, height: 32 }}
                                          />
                                          <Typography>{user?.emp_no}</Typography>
                                        </Stack>
                                      </TableCell>
                                      <TableCell>{user?.name_with_initials}</TableCell>
                                      <TableCell>{convert_to_proper_case(user?.designation_type)}</TableCell>
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
                  </Form>
                )}
              </Formik>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default UpdateProjectDetails;
