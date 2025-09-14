import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { _setBlobToFile, applyGlobalValidations } from "../../utils/utils";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SET_BREADCRUMBS } from "../../redux/actions/actions";
import WorkIcon from "@mui/icons-material/Work";

// mui
import { Button, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// custom components
import PageHeaders from "../../utils/ui-components/PageHeaders";
import TextField from "../../utils/ui-components/FormsUI/TextField";

// mui icons
import MainCard from "../../utils/ui-components/MainCard";
import SelectWrapper from "../../utils/ui-components/FormsUI/Select";
import CheckboxWrapper from "../../utils/ui-components/FormsUI/Checkbox";
import MultipleSelectCheckmarksWrapper from "../../utils/ui-components/FormsUI/MultipleSelectCheckmarks";
import { createUpload, fetchUpload, listJobPositions, useCreateJobPosting, useListJobCategories, useReplaceJobPosting } from "../../kubb";
import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { openSuccessDialog } from "../../utils/ui-components/pop-ups/SuccessDialog";
import ItemImageUpload from "../../utils/ui-components/FormsUI/ItemImageUpload/item-image-upload.component";
import { IMAGE_SIZE } from "../../store/constants";

interface JobPostDetails {
  id: number;
  jobTitle: string;
  logoPath: {
    file: File | null;
    path: string;
  };
  jobCategory: string;
  jobPosition: string;
  jobType: string;
  jobWorkMode: string;
  jobLocation: string;
  jobDescription: string;
  jobResponsibilities: string;
  jobQualifications: string;
  // firstName: string;
  // lastName: string;
  // email: string;
  // nic: string;
  // contact: string;
  // cv: string;
  // address: string;
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
  qulification: {
    isUse: boolean;
    enable: { value: number }[];
    content: string;
  };
  location: {
    isUse: boolean;
    enable: { value: number }[];
    content: string;
  };
  gender: {
    isUse: boolean;
    enable: string;
    content: string;
  };
}

const INITIAL_STATE: JobPostDetails = {
  id: 0,
  logoPath: {
    file: null,
    path: "",
  },
  jobTitle: "",
  jobCategory: "",
  jobPosition: "",
  jobType: "",
  jobWorkMode: "",
  jobLocation: "",
  jobDescription: "",
  jobResponsibilities: "",
  jobQualifications: "",
  age: {
    isUse: false,
    min: 0,
    max: 0,
    content: "",
  },
  experience: {
    isUse: false,
    min: 0,
    max: 0,
    content: "",
  },
  salary: {
    isUse: false,
    min: 0,
    max: 0,
    content: "",
  },
  qulification: {
    isUse: false,
    enable: [],
    content: "",
  },
  location: {
    isUse: false,
    enable: [],
    content: "",
  },
  gender: {
    isUse: false,
    enable: "",
    content: "",
  },
};

export const JOB_CATEGORIES = [
  { value: "1", label: "HR" },
  { value: "2", label: "Marketing" },
  // { value: "3", label: "Design" },
  // { value: "4", label: "Sales" },
];

export const JOB_TYPES = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
];
export const WORK_MODES = [
  { value: "ON_SITE", label: "On-site" },
  { value: "REMOTE", label: "Remote" },
  { value: "HYBRID", label: "Hybrid" },
];
export const EDUCATION = [
  { value: 1, label: "High School Diploma" },
  { value: 2, label: "Associate Degree" },
  { value: 3, label: "Bachelor's Degree" },
  { value: 4, label: "Master's Degree" },
  { value: 5, label: "PhD" },
];
export const GENDER = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
  { value: "OTHER", label: "Other" },
];

function JobPostDetails(props: { access: string }) {
  const theme: any = useTheme();
  const dispatch = useDispatch();
  const { state } = useLocation();

  const navigate = useNavigate();
  const { id } = useParams();
  const [jobName, setJobName] = useState("");
  const [initialItem, setInitialValues] = useState<JobPostDetails>(INITIAL_STATE);
  const [categoryId, setCategoryId] = useState(0);

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
    if (state) {
      setInitialValues(state.formData ?? INITIAL_STATE);
      setJobName(state?.formData?.jobTitle ?? "");
      setCategoryId(state?.formData?.jobCategory ?? 0);
    }
  }, []);

  const listJobCategory = useListJobCategories({
    page: 0,
    pageSize: 50,
  });

  const listJobPosition = useQuery({
    queryKey: ["job-positions", Number(categoryId)],
    queryFn: () =>
      listJobPositions({
        categoryId: Number(categoryId),
        page: 0,
        pageSize: 50,
      }),
    // enabled: false,s
    select: (res) => {
      return res.data.map((item) => ({
        value: item.id,
        label: item.name,
      }));
    },
  });

  const imageFile = useQuery({
    queryKey: ["/uploads", initialItem.logoPath?.path, initialItem.id],
    queryFn: async () => {
      const response = await fetchUpload(initialItem.logoPath.path);
      const filename = initialItem.logoPath.path.split("/").pop() || "uploaded_file";
      const file = await _setBlobToFile(response.data, filename);
      return file;
    },
    enabled: !!initialItem.logoPath.path,
    select: (file) => file,
  });

  const mutation = useMutation({
    mutationFn: ({ file, category }: { file: File; category: "RESUMES" }) =>
      createUpload(
        { file },
        {
          category: category,
        }
      ),
  });

  const handleImageUpload = async (file: File, setFieldValue: (field: string, value: any) => void) => {
    try {
      if (file && file instanceof File && file.size > 0) {
        const imageResponse = await mutation.mutateAsync({
          file: file,
          category: "RESUMES",
        });
        setFieldValue("logoPath.path", imageResponse.staticPath);
        return imageResponse;
      }
    } catch (e) {
      setFieldValue("logoPath.path", initialItem.logoPath?.path || "");
      setFieldValue("logoPath.file", initialItem.logoPath?.file || null);
    }
  };

  const createJobPost = useCreateJobPosting();
  const updateJobPost = useReplaceJobPosting();

  return (
    <Grid container justifyContent="center" spacing={3}>
      <Grid item xs={12}>
        <PageHeaders HeaderIcon={<WorkIcon />} headerTitle={"Job Post Management"} />
      </Grid>
      <Grid item xs={10}>
        {/* <MainCard title={Number(id) === 0 ? "Add Job Post" : "Update Job Post"}> */}
        <Formik
          initialValues={{
            ...initialItem,
            busImage: imageFile.data
              ? {
                  file: imageFile.data as File,
                  path: initialItem.logoPath?.path || "",
                }
              : { file: null, path: initialItem.logoPath?.path || "" },
          }}
          enableReinitialize
          validationSchema={applyGlobalValidations(
            Yup.object().shape({
              userName: Yup.string().notRequired(),
            })
          )}
          onSubmit={async (values: JobPostDetails, { setSubmitting, setFieldValue }) => {
            if (values.id) {
              try {
                if (values.logoPath.file) {
                  await handleImageUpload(values.logoPath.file as File, setFieldValue).then(async (res) => {
                    const updateResponse = await updateJobPost.mutateAsync({
                      id: values.id,
                      data: {
                        createdAt: dayjs().toISOString(),
                        updatedAt: dayjs().toISOString(),
                        name: values.jobTitle,
                        positionId: Number(values.jobPosition),
                        type: values.jobType as "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP",
                        workMode: values.jobWorkMode as "ON_SITE" | "REMOTE" | "HYBRID",
                        location: values.jobLocation,
                        descriptionMain: values.jobDescription,
                        descriptionResponsibilities: values.jobResponsibilities,
                        descriptionQualifications: values.jobQualifications,
                        processingState: "PENDING",
                        logoPath: res?.staticPath ?? "",
                        questionDob: values.age.isUse ? values.age.content : null,
                        queryDobFrom: values.age.isUse ? dayjs("1970-01-01").add(values.age.min, "year").toISOString() : null,
                        queryDobTo: values.age.isUse ? dayjs("1970-01-01").add(values.age.max, "year").toISOString() : null,
                        questionExperienceYears: values.experience.isUse ? values.experience.content : null,
                        queryExperienceYearsFrom: values.experience.isUse ? values.experience.min : null,
                        queryExperienceYearsTo: values.experience.isUse ? values.experience.max : null,
                        questionExpectedSalary: values.salary.isUse ? values.salary.content : null,
                        queryExpectedSalaryFrom: values.salary.isUse ? values.salary.min : null,
                        queryExpectedSalaryTo: values.salary.isUse ? values.salary.max : null,
                        questionQualificationLevel: values.qulification.isUse ? values.qulification.content : null,
                        queryQualificationLevels: values.qulification.isUse ? values.qulification.enable.map((item) => item.value).join(",") : null,
                        questionPreferredLocation: values.location.isUse ? values.location.content : null,
                        queryPreferredLocation: values.location.isUse ? values.location.enable.map((item) => item.value).join(",") : null,
                        questionGender: values.gender.isUse ? values.gender.content : null,
                        queryGender: values.gender.isUse ? (values.gender.enable as "MALE" | "FEMALE" | "OTHER") : null,
                      },
                    });
                    navigate("/job-posts");
                    openSuccessDialog("Success", `job post ${updateResponse?.name} updated successfully`);
                  });
                } else {
                  const updateResponse = await updateJobPost.mutateAsync({
                    id: values.id,
                    data: {
                      createdAt: dayjs().toISOString(),
                      updatedAt: dayjs().toISOString(),
                      name: values.jobTitle,
                      positionId: Number(values.jobPosition),
                      type: values.jobType as "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP",
                      workMode: values.jobWorkMode as "ON_SITE" | "REMOTE" | "HYBRID",
                      location: values.jobLocation,
                      descriptionMain: values.jobDescription,
                      descriptionResponsibilities: values.jobResponsibilities,
                      descriptionQualifications: values.jobQualifications,
                      processingState: "PENDING",
                      logoPath: values.logoPath?.path ?? "",
                      questionDob: values.age.isUse ? values.age.content : null,
                      queryDobFrom: values.age.isUse ? dayjs("1970-01-01").add(values.age.min, "year").toISOString() : null,
                      queryDobTo: values.age.isUse ? dayjs("1970-01-01").add(values.age.max, "year").toISOString() : null,
                      questionExperienceYears: values.experience.isUse ? values.experience.content : null,
                      queryExperienceYearsFrom: values.experience.isUse ? values.experience.min : null,
                      queryExperienceYearsTo: values.experience.isUse ? values.experience.max : null,
                      questionExpectedSalary: values.salary.isUse ? values.salary.content : null,
                      queryExpectedSalaryFrom: values.salary.isUse ? values.salary.min : null,
                      queryExpectedSalaryTo: values.salary.isUse ? values.salary.max : null,
                      questionQualificationLevel: values.qulification.isUse ? values.qulification.content : null,
                      queryQualificationLevels: values.qulification.isUse ? values.qulification.enable.map((item) => item.value).join(",") : null,
                      questionPreferredLocation: values.location.isUse ? values.location.content : null,
                      queryPreferredLocation: values.location.isUse ? values.location.enable.map((item) => item.value).join(",") : null,
                      questionGender: values.gender.isUse ? values.gender.content : null,
                      queryGender: values.gender.isUse ? (values.gender.enable as "MALE" | "FEMALE" | "OTHER") : null,
                    },
                  });
                  navigate("/job-posts");
                  openSuccessDialog("Success", `job post ${updateResponse?.name} updated successfully`);
                }
              } catch (error) {
                console.error("Error during submission:", error);
              } finally {
                setSubmitting(false);
              }
            } else {
              try {
                await handleImageUpload(values.logoPath.file as File, setFieldValue).then(async (res) => {
                  const createResponse = await createJobPost.mutateAsync({
                    data: {
                      createdAt: dayjs().toISOString(),
                      updatedAt: dayjs().toISOString(),
                      name: values.jobTitle,
                      positionId: Number(values.jobPosition),
                      type: values.jobType as "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP",
                      workMode: values.jobWorkMode as "ON_SITE" | "REMOTE" | "HYBRID",
                      location: values.jobLocation,
                      descriptionMain: values.jobDescription,
                      descriptionResponsibilities: values.jobResponsibilities,
                      descriptionQualifications: values.jobQualifications,
                      processingState: "PENDING",
                      logoPath: res?.staticPath ?? "",
                      questionDob: values.age.isUse ? values.age.content : null,
                      queryDobFrom: values.age.isUse ? dayjs("1970-01-01").add(values.age.min, "year").toISOString() : null,
                      queryDobTo: values.age.isUse ? dayjs("1970-01-01").add(values.age.max, "year").toISOString() : null,
                      questionExperienceYears: values.experience.isUse ? values.experience.content : null,
                      queryExperienceYearsFrom: values.experience.isUse ? values.experience.min : null,
                      queryExperienceYearsTo: values.experience.isUse ? values.experience.max : null,
                      questionExpectedSalary: values.salary.isUse ? values.salary.content : null,
                      queryExpectedSalaryFrom: values.salary.isUse ? values.salary.min : null,
                      queryExpectedSalaryTo: values.salary.isUse ? values.salary.max : null,
                      questionQualificationLevel: values.qulification.isUse ? values.qulification.content : null,
                      queryQualificationLevels: values.qulification.isUse ? values.qulification.enable.map((item) => item.value).join(",") : null,
                      questionPreferredLocation: values.location.isUse ? values.location.content : null,
                      queryPreferredLocation: values.location.isUse ? values.location.enable.map((item) => item.value).join(",") : null,
                      questionGender: values.gender.isUse ? values.gender.content : null,
                      queryGender: values.gender.isUse ? (values.gender.enable as "MALE" | "FEMALE" | "OTHER") : null,
                    },
                  });
                  navigate("/job-posts");
                  openSuccessDialog("Success", `job post ${createResponse?.name} added successfully`);
                });
              } catch (error) {
                console.error("Error during submission:", error);
              } finally {
                setSubmitting(false);
              }
            }
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <MainCard title={"Job Details"}>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <ItemImageUpload
                          accept=".jpg,.png,.jpeg"
                          label="Upload your logo"
                          maxFileSizeInBytes={IMAGE_SIZE}
                          name="logoPath.file"
                          // onUpload={(file) => handleImageUpload(file, setFieldValue)}
                        />
                      </Grid>
                      <Grid item xs={6} container>
                        <Grid item xs={12}>
                          <TextField
                            label="Job Title"
                            placeholder="e.g. Senior Software Engineer"
                            name="jobTitle"
                            fullWidth
                            required
                            size={"small"}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <SelectWrapper
                            name={"jobCategory"}
                            label="Job Category"
                            customHandleChange={(e) => {
                              setCategoryId(e.target.value);
                              setFieldValue("jobPosition", "");
                            }}
                            options={(listJobCategory.data?.data || []).map((item) => ({ value: item.id, label: item.name }))}
                            fullWidth
                            required
                            size={"small"}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <SelectWrapper
                            name={"jobPosition"}
                            label="Job Position"
                            customHandleChange={() => {}}
                            options={listJobPosition.data || []}
                            fullWidth
                            required
                            size={"small"}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <SelectWrapper
                            name={"jobType"}
                            label="Job Type"
                            customHandleChange={() => {}}
                            options={JOB_TYPES}
                            fullWidth
                            required
                            size={"small"}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <SelectWrapper
                            name={"jobWorkMode"}
                            label="Work Mode"
                            customHandleChange={() => {}}
                            options={WORK_MODES}
                            fullWidth
                            required
                            size={"small"}
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Location"
                          placeholder="e.g. Colombo Srilanka"
                          name="jobLocation"
                          fullWidth
                          required
                          size={"small"}
                          multiline
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Job Description"
                          placeholder="Describe the role. company culture and waht makes this position exciting..."
                          name="jobDescription"
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
                          name="jobResponsibilities"
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
                          name="jobQualifications"
                          fullWidth
                          required
                          size={"small"}
                          multiline
                        />
                      </Grid>
                    </Grid>
                  </MainCard>
                </Grid>

                {/* <Grid item xs={12}>
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
                    </Grid> */}
                <Grid item xs={12}>
                  <MainCard title={"Selection Criteria"}>
                    <Grid container spacing={1}>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          border: 1,
                          borderColor: values.age.isUse ? theme.palette.primary.main : theme.palette.grey[300],
                          borderRadius: 3,
                          mt: 2,
                        }}
                      >
                        <Grid container spacing={1} sx={{ py: "5px", px: "15px" }}>
                          <Grid item xs={3}>
                            <CheckboxWrapper legend={"Age Range"} name={"age.isUse"} customHandleChange={() => {}} />
                          </Grid>
                          {values.age.isUse && (
                            <>
                              <Grid item xs={4}>
                                <TextField label="Min Age" name="age.min" required size={"small"} />
                              </Grid>
                              <Grid item xs={4}>
                                <TextField label="Max Age" name="age.max" required size={"small"} />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField label="Question for Candidate" name="age.content" multiline required size={"small"} />
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          border: 1,
                          borderColor: values.experience.isUse ? theme.palette.primary.main : theme.palette.grey[300],
                          borderRadius: 3,
                          mt: 2,
                        }}
                      >
                        <Grid container spacing={1} sx={{ py: "5px", px: "15px" }}>
                          <Grid item xs={3}>
                            <CheckboxWrapper legend={"Experience (Years)"} name={"experience.isUse"} customHandleChange={() => {}} />
                          </Grid>
                          {values.experience.isUse && (
                            <>
                              <Grid item xs={4}>
                                <TextField label="Min Experience" name="experience.min" required size={"small"} />
                              </Grid>
                              <Grid item xs={4}>
                                <TextField label="Max Experience" name="experience.max" required size={"small"} />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField label="Question for Candidate" name="experience.content" multiline required size={"small"} />
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          border: 1,
                          borderColor: values.salary.isUse ? theme.palette.primary.main : theme.palette.grey[300],
                          borderRadius: 3,
                          mt: 2,
                        }}
                      >
                        <Grid container spacing={1} sx={{ py: "5px", px: "15px" }}>
                          <Grid item xs={3}>
                            <CheckboxWrapper legend={"Expected Salary Range"} name={"salary.isUse"} customHandleChange={() => {}} />
                          </Grid>
                          {values.salary.isUse && (
                            <>
                              <Grid item xs={4}>
                                <TextField label="Min salary" name="salary.min" required size={"small"} />
                              </Grid>
                              <Grid item xs={4}>
                                <TextField label="Max salary" name="salary.max" required size={"small"} />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField label="Question for Candidate" name="salary.content" multiline required size={"small"} />
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          border: 1,
                          borderColor: values.qulification.isUse ? theme.palette.primary.main : theme.palette.grey[300],
                          borderRadius: 3,
                          mt: 2,
                        }}
                      >
                        <Grid container spacing={1} sx={{ py: "5px", px: "15px" }}>
                          <Grid item xs={3}>
                            <CheckboxWrapper legend={"Higher Education"} name={"qulification.isUse"} customHandleChange={() => {}} />
                          </Grid>
                          {values.qulification.isUse && (
                            <>
                              <Grid item xs={8}>
                                <MultipleSelectCheckmarksWrapper
                                  name={"qulification.enable"}
                                  label="Education Level"
                                  options={EDUCATION}
                                  fullWidth
                                  required
                                  size={"small"}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField label="Question for Candidate" name="qulification.content" multiline required size={"small"} />
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          border: 1,
                          borderColor: values.location.isUse ? theme.palette.primary.main : theme.palette.grey[300],
                          borderRadius: 3,
                          mt: 2,
                        }}
                      >
                        <Grid container spacing={1} sx={{ py: "5px", px: "15px" }}>
                          <Grid item xs={3}>
                            <CheckboxWrapper legend={"Location Preference"} name={"location.isUse"} customHandleChange={() => {}} />
                          </Grid>
                          {values.location.isUse && (
                            <>
                              <Grid item xs={8}>
                                <MultipleSelectCheckmarksWrapper
                                  name={"location.enable"}
                                  label="Location Preferencea"
                                  options={[]}
                                  fullWidth
                                  required
                                  size={"small"}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField label="Question for Candidate" name="location.content" multiline required size={"small"} />
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sx={{
                          border: 1,
                          borderColor: values.gender.isUse ? theme.palette.primary.main : theme.palette.grey[300],
                          borderRadius: 3,
                          mt: 2,
                        }}
                      >
                        <Grid container spacing={1} sx={{ py: "5px", px: "15px" }}>
                          <Grid item xs={3}>
                            <CheckboxWrapper legend={"Gender Preference"} name={"gender.isUse"} customHandleChange={() => {}} />
                          </Grid>
                          {values.gender.isUse && (
                            <>
                              <Grid item xs={8}>
                                <SelectWrapper
                                  name={"gender.enable"}
                                  label="Gender Preferences"
                                  options={GENDER}
                                  fullWidth
                                  required
                                  size={"small"}
                                  customHandleChange={() => {}}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField label="Question for Candidate" name="gender.content" multiline required size={"small"} />
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </MainCard>
                </Grid>

                <Grid item xs={12}>
                  <Grid container columnSpacing={1} justifyContent={"flex-end"}>
                    <Grid item>
                      <Button color="primary" variant="contained" sx={{ ...theme.typography.button }} type="button">
                        Reset
                      </Button>
                    </Grid>
                    {props.access[0] === "1" && (
                      <Grid item>
                        <Button color="primary" sx={{ ...theme.typography.button }} variant="contained" type="submit" fullWidth onClick={() => {}}>
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
        {/* </MainCard> */}
      </Grid>
    </Grid>
  );
}

export default JobPostDetails;
