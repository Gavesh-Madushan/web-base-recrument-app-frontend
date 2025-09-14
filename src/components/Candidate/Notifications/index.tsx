import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { applyGlobalValidations } from "../../../utils/utils";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SET_BREADCRUMBS } from "../../../redux/actions/actions";

// mui
import { Avatar, Button, Chip, Grid, IconButton, InputAdornment, Pagination, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// custom components
import PageHeaders from "../../../utils/ui-components/PageHeaders";
import TextFieldWrapper from "../../../utils/ui-components/FormsUI/TextField";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import SendIcon from "@mui/icons-material/Send";

// mui icons
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import dayjs from "dayjs";
import MainCard from "../../../utils/ui-components/MainCard";
import relativeTime from "dayjs/plugin/relativeTime";
import DatePickerWrapper from "../../../utils/ui-components/FormsUI/DatePicker";
import { useListJobPostings } from "../../../kubb";
import { SearchInterface } from "../../JobPosts";
import { JobPostDetails } from "../../JobPosts/AddorUpdateJobPost";

dayjs.extend(relativeTime);

function JobNotifications(props: { access: string }) {
  const theme: any = useTheme();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState<SearchInterface>({
    createdFrom: null,
    createdTo: null,
    name: "",
  });

  const [count, setCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState(
    state?.paginationModel || {
      page: 0,
      pageSize: 10,
    }
  );

  useEffect(() => {
    dispatch({
      type: SET_BREADCRUMBS,
      payload: [
        { name: "Home", path: "/Dashboard", bold: false, state: null },
        {
          name: "Job Notifications",
          path: null,
          bold: true,
          state: null,
        },
      ],
    });
  }, []);

  const listItems = useListJobPostings({
    createdFrom: search.createdFrom ? search.createdFrom.toISOString() : undefined,
    createdTo: search.createdTo ? search.createdTo.toISOString() : undefined,
    pageSize: paginationModel.pageSize,
    page: paginationModel.page,
    location: undefined,
    name: search.name ? search.name : undefined,
    positionId: undefined,
    processingState: undefined,
    type: undefined,
    workMode: undefined,
  });

  if (listItems.data?.totalCount && listItems.data.totalCount !== count) {
    setCount(listItems.data.totalCount);
  }

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPaginationModel({
      ...paginationModel,
      page: value - 1,
    });
  };

  return (
    <Grid container justifyContent="center" spacing={1}>
      <Grid item xs={12}>
        <PageHeaders HeaderIcon={<CircleNotificationsIcon />} headerTitle={"Job Notifications"} />
      </Grid>
      <Grid item container xs={12} spacing={1}>
        <Grid item xs={12}>
          <Formik
            initialValues={{
              createdFrom: null,
              createdTo: null,
              name: "",
            }}
            validationSchema={applyGlobalValidations(
              Yup.object().shape({
                name: Yup.string().notRequired(),
                createdFrom: Yup.date().notRequired().typeError("please enter a valid date"),
                createdTo: Yup.date().notRequired().typeError("please enter a valid date"),
              })
            )}
            onSubmit={(values: any) => {
              setPaginationModel({
                page: 0,
                pageSize: 10,
              });
              setCount(0);
              setSearch({
                createdFrom: values.createdFrom ? values.createdFrom.startOf("day") : null,
                createdTo: values.createdTo ? values.createdTo.endOf("day") : null,
                name: values.name ? values.name : null,
              });
            }}
          >
            {({ values }) => (
              <Form>
                <Grid container columnSpacing={1} justifyContent={"flex-end"}>
                  <Grid item lg={2.5} md={3} sm={4} xs={12} xl={2}>
                    <DatePickerWrapper name="createdFrom" label="Created From" placeholder="Created From" maxDate={values.createdTo} />
                  </Grid>
                  <Grid item lg={2.5} md={3} sm={4} xs={12} xl={2}>
                    <DatePickerWrapper name="createdTo" label="Created To" placeholder="Created To" minDate={values.createdFrom} />
                  </Grid>
                  <Grid item>
                    <TextFieldWrapper
                      label="Search"
                      placeholder="Job Post Name"
                      name="name"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      size={"small"}
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
        <Grid item lg={12} md={12} sm={12} xs={12}>
          {/* <Box sx={{ minHeight: 400, width: "100%" }}>
            <DataGrid
              columns={columns}
              loading={isLoading}
              rows={jobPosts}
              slots={{
                noRowsOverlay: EmptyResultDataGrid,
                loadingOverlay: () => <LinearProgress />,
              }}
              style={{ overflow: "auto" }}
              sx={{
                "& .MuiDataGrid-cell.stickyColumn": {
                  position: "sticky",
                  left: 0,
                  backgroundColor: `${theme.palette.mode === "light" ? theme.palette.primary.light : theme.palette.background.paper}`,
                  zIndex: 1,
                },
                "& .clicked-row": {
                  backgroundColor: `${theme.palette.secondary.light} !important`,
                },
              }}
              pagination
              getRowId={(row: any) => row.id}
              paginationMode="server"
              rowCount={count}
              disableRowSelectionOnClick
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
            />
          </Box> */}

          {listItems?.isLoading && (
            <MainCard>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Grid container alignItems="center" justifyContent="space-between" spacing={1}>
                    <Grid item xs zeroMinWidth>
                      <Grid container spacing={1}>
                        <Grid item xs={12}>
                          <Skeleton variant="text" />
                        </Grid>
                        <Grid item xs={12}>
                          <Skeleton variant="rectangular" height={20} />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Skeleton variant="rectangular" height={50} width={80} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </MainCard>
          )}
          {!listItems?.isLoading &&
            listItems?.data?.data.map((job) => {
              const data = job;
              const formData: JobPostDetails = {
                id: data.id,
                logoPath: {
                  file: null,
                  path: data.logoPath,
                },
                jobTitle: data.name,
                jobCategory: data.position.categoryId,
                jobPosition: data.positionId,
                jobType: data.type,
                jobWorkMode: data.workMode,
                jobLocation: data.location,
                jobDescription: data.descriptionMain,
                jobResponsibilities: data.descriptionResponsibilities,
                jobQualifications: data.descriptionQualifications,
                age: {
                  isUse: data.questionDob ? true : false,
                  min: data.queryDobFrom ? dayjs(data.queryDobFrom).diff(dayjs("1970-01-01"), "year") : 0,
                  max: data.queryDobTo ? dayjs(data.queryDobTo).diff(dayjs("1970-01-01"), "year") : 0,
                  content: data.questionDob ?? "",
                },
                experience: {
                  isUse: data.questionExperienceYears ? true : false,
                  min: data.queryExperienceYearsFrom ? data.queryExperienceYearsFrom : 0,
                  max: data.queryExperienceYearsTo ? data.queryExperienceYearsTo : 0,
                  content: data.questionExperienceYears ?? "",
                },
                salary: {
                  isUse: data.questionExpectedSalary ? true : false,
                  min: data.queryExpectedSalaryFrom ? data.queryExpectedSalaryFrom : 0,
                  max: data.queryExpectedSalaryTo ? data.queryExpectedSalaryTo : 0,
                  content: data.questionExpectedSalary ?? "",
                },
                qulification: {
                  isUse: data.queryQualificationLevels ? true : false,
                  enable: data.queryQualificationLevels ? (data.queryQualificationLevels || "").split(",").map((item) => ({ value: item })) : [],
                  content: data.queryQualificationLevels ?? "",
                },
                location: {
                  isUse: data.queryPreferredLocation ? true : false,
                  enable: data.queryPreferredLocation ? (data.queryPreferredLocation || "").split(",").map((item) => ({ value: item })) : [],
                  content: data.queryPreferredLocation ?? "",
                },
                gender: {
                  isUse: data.questionGender ? true : false,
                  enable: data.queryGender ?? "",
                  content: data.questionGender ?? "",
                },
              };
              return (
                <Grid key={job.id} item xs={12} sx={{ marginBottom: "10px" }}>
                  <MainCard>
                    <Grid container spacing={2} direction={"row"}>
                      <Grid item xs={1}>
                        <Avatar src={job.logoPath}></Avatar>
                      </Grid>
                      <Grid item container xs={9} spacing={1} alignContent={"center"} justifyContent={"space-between"}>
                        <Grid item xs={6}>
                          <Typography>{job.name}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Chip label={job?.type} color="secondary" size="small" />
                        </Grid>
                        <Grid item>
                          <Typography>{job?.position?.name}</Typography>
                        </Grid>
                        <Grid item>
                          <Typography>Posted at: {dayjs(job.createdAt).fromNow()}</Typography>
                        </Grid>
                        <Grid item>
                          <Typography>Closing Date: {dayjs(job.updatedAt).format("YYYY-MM-DD")}</Typography>
                        </Grid>
                      </Grid>
                      <Grid item container xs={2} alignContent={"center"} justifyContent={"flex-end"} spacing={1}>
                        <Grid item alignContent={"center"}>
                          <Tooltip title="View">
                            <IconButton
                              aria-label="view"
                              color="primary"
                              onClick={() => {
                                navigate(`/reports/${job.id}`, { state: { formData } });
                              }}
                            >
                              <VisibilityIcon fontSize="inherit" color="primary" />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                        <Grid item>
                          <Button variant="contained" color="primary" endIcon={<SendIcon />} onClick={() => {}}>
                            Apply
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </MainCard>
                </Grid>
              );
            })}
        </Grid>
        <Grid item xs={12} sx={{ mt: "5px" }}>
          <Stack spacing={2} alignItems={"flex-end"}>
            {/* <Pagination count={count / 10} variant="outlined" shape="rounded" color="primary" /> */}
            <Pagination
              count={Math.ceil(count / 10)}
              title={""}
              page={paginationModel.page + 1}
              onChange={handleChange}
              shape="rounded"
              color="primary"
            />
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default JobNotifications;
