import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { applyGlobalValidations } from "../../utils/utils";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SET_BREADCRUMBS } from "../../redux/actions/actions";
import WorkIcon from "@mui/icons-material/Work";
import { isMobile } from "react-device-detect";

// mui
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// custom components
import PageHeaders from "../../utils/ui-components/PageHeaders";
import TextField from "../../utils/ui-components/FormsUI/TextField";
import EmptyResultDataGrid from "../../utils/ui-components/EmptyResultDataGrid";

// mui icons
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import dayjs from "dayjs";
import MainCard from "../../utils/ui-components/MainCard";
import SelectWrapper from "../../utils/ui-components/FormsUI/Select";
import ItemImageUpload from "../../utils/ui-components/FormsUI/ItemImageUpload/item-image-upload.component";
import FileUpload from "../../utils/ui-components/FormsUI/fileUpload/file-upload.component";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckboxWrapper from "../../utils/ui-components/FormsUI/Checkbox";
import MultipleSelectCheckmarksWrapper from "../../utils/ui-components/FormsUI/MultipleSelectCheckmarks";

interface JobPostDetails {
  id: number;
  jobTitle: string;
  jobCategory: string;
  jobType: string;
  jobWorkMode: string;
  jobLocation: string;
  jobDescription: string;
  jobResponsibilities: string;
  jobQualifications: string;
  firstName: string;
  lastName: string;
  email: string;
  nic: string;
  contact: string;
  cv: string;
  address: string;
  age: {
    isUse: boolean;
    min: number;
    max: number;
    content: string;
  };
  experience: {
    isUse: boolean;
    min: number;
    max: number;
    content: string;
  };
  salary: {
    isUse: boolean;
    min: number;
    max: number;
    content: string;
  };
  education: {
    isUse: boolean;
    enabled: number[];
    content: string;
  };
  qulification: {
    isUse: boolean;
    enable: number[];
    content: string;
  };
  location: {
    isUse: boolean;
    enable: number[];
    content: string;
  };
  gender: {
    isUse: boolean;
    enable: number[];
    content: string;
  };
}

function JobPostDetails(props: { access: string }) {
  const theme: any = useTheme();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [jobName, setJobName] = useState("");

  const [search, setSearch] = useState(state?.search || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch({
      type: SET_BREADCRUMBS,
      payload: [
        { name: "Home", path: "/Dashboard", bold: false, state: null },
        {
          name: "Job Post",
          path: "/job-posts",
          bold: true,
          state: null,
        },
        {
          name: Number(id) === 0 ? "Add Job Post" : jobName,
          path: "",
          bold: true,
          state: null,
        },
      ],
    });
  }, [jobName]);

  useEffect(() => {
    getJobPostList(search);
  }, [search]);

  const getJobPostList = (searchValue: string) => {
    setIsLoading(false);
    const values = {
      activeState: undefined,
      searchTerm: searchValue === "" ? undefined : searchValue,
    };
    console.log(values);
  };

  return (
    <Grid container justifyContent="center" spacing={3}>
      <Grid item xs={12}>
        <PageHeaders HeaderIcon={<WorkIcon />} headerTitle={"Job Post Management"} />
      </Grid>
      <Grid item xs={10}>
        <MainCard title={Number(id) === 0 ? "Add Job Post" : "Update Job Post"}>
          <Formik
            initialValues={{
              userName: "",
              education: {
                enable: [],
                isUse: false,
                content: "",
              },
              location: {
                enable: [],
                isUse: false,
                content: "",
              },
              gender: {
                enable: [],
                isUse: false,
                content: "",
              },
            }}
            validationSchema={applyGlobalValidations(
              Yup.object().shape({
                userName: Yup.string().notRequired(),
              })
            )}
            onSubmit={(values: any) => {
              // setPage(0);
              setSearch(values.userName || "");
            }}
          >
            {() => (
              <Form>
                <Grid container spacing={1}>
                  <Grid item container spacing={1} xs={12}>
                    <Grid item xs={12}>
                      <Divider textAlign="left">
                        <Typography variant="body1" fontWeight={"bold"} color={theme.palette.text.secondary}>
                          Job Details
                        </Typography>
                      </Divider>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label="Job Title" placeholder="e.g. Senior Software Engineer" name="jobTitle" fullWidth required size={"small"} />
                    </Grid>
                    <Grid item xs={4}>
                      <SelectWrapper
                        name={"jobCategory"}
                        label="Job Category"
                        customHandleChange={() => {}}
                        options={[]}
                        fullWidth
                        required
                        size={"small"}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <SelectWrapper name={"jobType"} label="Job Type" customHandleChange={() => {}} options={[]} fullWidth required size={"small"} />
                    </Grid>
                    <Grid item xs={4}>
                      <SelectWrapper
                        name={"jobWorkType"}
                        label="Work Type"
                        customHandleChange={() => {}}
                        options={[]}
                        fullWidth
                        required
                        size={"small"}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label="Location" placeholder="e.g. Colombo Srilanka" name="location" fullWidth required size={"small"} multiline />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Job Description"
                        placeholder="Describe the role. company culture and waht makes this position exciting..."
                        name="descriotion"
                        fullWidth
                        required
                        size={"small"}
                        multiline
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Job Responsibilities"
                        placeholder="List the main responsinbilities and duties..."
                        name="responsibilities"
                        fullWidth
                        required
                        size={"small"}
                        multiline
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Job Qualifications"
                        placeholder="List required qulifications, skills and experiance..."
                        name="qualifications"
                        fullWidth
                        required
                        size={"small"}
                        multiline
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider textAlign="left">
                        <Typography variant="body1" fontWeight={"bold"} color={theme.palette.text.secondary}>
                          Application Basic Information
                        </Typography>
                      </Divider>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField label="First Name" placeholder="" name="firstName" fullWidth disabled size={"small"} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField label="Last Name" placeholder="" name="lastName" fullWidth disabled size={"small"} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField label="Email Address" placeholder="" name="email" fullWidth disabled size={"small"} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField label="NIC" placeholder="" name="nic" fullWidth disabled size={"small"} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField label="Contact Number" placeholder="" name="contact" fullWidth disabled size={"small"} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Upload your CV"
                        placeholder=""
                        name="cv"
                        fullWidth
                        disabled
                        size={"small"}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <CloudUploadIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Address"
                        placeholder="Enter complete address"
                        name="address"
                        disabled
                        fullWidth
                        required
                        size={"small"}
                        multiline
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <Divider textAlign="left">
                        <Typography variant="body1" fontWeight={"bold"} color={theme.palette.text.secondary}>
                          Selection Criteria
                        </Typography>
                      </Divider>
                    </Grid>
                    <Grid item xs={12} sx={{ border: 2, borderColor: theme.palette.grey[500], borderRadius: 1, mt: 2 }}>
                      <Grid container spacing={1} sx={{ py: "5px", px: "15px" }}>
                        <Grid item xs={3}>
                          <CheckboxWrapper legend={"Age Range"} name={"age.isUse"} customHandleChange={() => {}} />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField label="Min Age" name="age.min" required size={"small"} />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField label="Max Age" name="age.max" required size={"small"} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField label="Question for Candidate" name="age.question" multiline required size={"small"} />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{ border: 2, borderColor: theme.palette.grey[500], borderRadius: 1, mt: 2 }}>
                      <Grid container spacing={1} sx={{ py: "5px", px: "15px" }}>
                        <Grid item xs={3}>
                          <CheckboxWrapper legend={"Experience (Years)"} name={"experience.isUse"} customHandleChange={() => {}} />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField label="Min Experience" name="experience.min" required size={"small"} />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField label="Max Experience" name="experience.max" required size={"small"} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField label="Question for Candidate" name="experience.question" multiline required size={"small"} />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{ border: 1, borderColor: theme.palette.grey[300], borderRadius: 1, mt: 2 }}>
                      <Grid container spacing={1} sx={{ py: "5px", pl: "15px" }}>
                        <Grid item xs={3}>
                          <CheckboxWrapper legend={"Expected Salary Range"} name={"salary.isUse"} customHandleChange={() => {}} />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField label="Min salary" name="salary.min" required size={"small"} />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField label="Max salary" name="salary.max" required size={"small"} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField label="Question for Candidate" name="salary.question" multiline required size={"small"} />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{ border: 1, borderColor: theme.palette.grey[300], borderRadius: 1, mt: 2 }}>
                      <Grid container spacing={1} sx={{ py: "5px", pl: "15px" }}>
                        <Grid item xs={3}>
                          <CheckboxWrapper legend={"Higher Education"} name={"education.isUse"} customHandleChange={() => {}} />
                        </Grid>
                        <Grid item xs={8}>
                          <MultipleSelectCheckmarksWrapper
                            name={"education.enable"}
                            label="Education Level"
                            customHandleChange={() => {}}
                            options={[]}
                            fullWidth
                            required
                            size={"small"}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField label="Question for Candidate" name="age.question" multiline required size={"small"} />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{ border: 1, borderColor: theme.palette.grey[300], borderRadius: 1, mt: 2 }}>
                      <Grid container spacing={1} sx={{ py: "5px", pl: "15px" }}>
                        <Grid item xs={3}>
                          <CheckboxWrapper legend={"Location Preference"} name={"location.isUse"} customHandleChange={() => {}} />
                        </Grid>
                        <Grid item xs={8}>
                          <MultipleSelectCheckmarksWrapper
                            name={"location.enable"}
                            label="Location Preferencea"
                            customHandleChange={() => {}}
                            options={[]}
                            fullWidth
                            required
                            size={"small"}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField label="Question for Candidate" name="age.question" multiline required size={"small"} />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{ border: 1, borderColor: theme.palette.grey[300], borderRadius: 1, mt: 2 }}>
                      <Grid container spacing={1} sx={{ py: "5px", px: "15px" }}>
                        <Grid item xs={3}>
                          <CheckboxWrapper legend={"Gender Preference"} name={"gender.isUse"} customHandleChange={() => {}} />
                        </Grid>
                        <Grid item xs={8}>
                          <MultipleSelectCheckmarksWrapper
                            name={"gender.enable"}
                            label="Gender Preferences"
                            customHandleChange={() => {}}
                            options={[]}
                            fullWidth
                            required
                            size={"small"}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField label="Question for Candidate" name="age.question" multiline required size={"small"} />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container columnSpacing={1} justifyContent={"flex-end"}>
                      <Grid item>
                        <Button color="primary" variant="contained" sx={{ ...theme.typography.button }} type="submit">
                          Reset
                        </Button>
                      </Grid>
                      {props.access[0] === "1" && (
                        <Grid item>
                          <Button color="primary" sx={{ ...theme.typography.button }} variant="contained" type="button" fullWidth onClick={() => {}}>
                            {Number(id) === 0 ? "Save Job Post" : "Update Job Post"}
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default JobPostDetails;
