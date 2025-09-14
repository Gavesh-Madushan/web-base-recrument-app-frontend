import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { applyGlobalValidations } from "../../utils/utils";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SET_BREADCRUMBS } from "../../redux/actions/actions";
import WorkIcon from "@mui/icons-material/Work";

// mui
import { Box, Button, Chip, Grid, IconButton, InputAdornment, LinearProgress, Stack, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// custom components
import PageHeaders from "../../utils/ui-components/PageHeaders";
import TextFieldWrapper from "../../utils/ui-components/FormsUI/TextField";
import EmptyResultDataGrid from "../../utils/ui-components/EmptyResultDataGrid";

// mui icons
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import dayjs from "dayjs";
import { useListJobPostings } from "../../kubb";
import { SearchInterface, statusMap } from "../JobPosts";
import DatePickerWrapper from "../../utils/ui-components/FormsUI/DatePicker";
import { JobPostDetails } from "../JobPosts/AddorUpdateJobPost";

function Reports() {
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
          name: "Job Posts",
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

  const columns = [
    {
      field: "action",
      headerName: "",
      minWidth: 50,
      maxWidth: 50,
      headerClassName: "stickyActionHeader",
      cellClassName: "stickyColumn",
      renderCell: (params: any) => {
        const data = params.row;
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
            content: data.questionDob,
          },
          experience: {
            isUse: data.questionExperienceYears ? true : false,
            min: data.queryExperienceYearsFrom ? data.queryExperienceYearsFrom : 0,
            max: data.queryExperienceYearsTo ? data.queryExperienceYearsTo : 0,
            content: data.questionExperienceYears,
          },
          salary: {
            isUse: data.questionExpectedSalary ? true : false,
            min: data.queryExpectedSalaryFrom ? data.queryExpectedSalaryFrom : 0,
            max: data.queryExpectedSalaryTo ? data.queryExpectedSalaryTo : 0,
            content: data.questionExpectedSalary,
          },
          qulification: {
            isUse: data.queryQualificationLevels ? true : false,
            enable: (data.queryQualificationLevels || "").split(",").map((item) => ({ value: item })),
            content: data.queryQualificationLevels,
          },
          location: {
            isUse: data.queryPreferredLocation ? true : false,
            enable: (data.queryPreferredLocation || "").split(",").map((item) => ({ value: item })),
            content: data.queryPreferredLocation,
          },
          gender: {
            isUse: data.questionGender ? true : false,
            enable: data.queryGender ?? "",
            content: data.questionGender,
          },
        };
        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title="View">
              <IconButton
                aria-label="view"
                color="primary"
                onClick={() => {
                  navigate(`/reports/${params.row.id}`, { state: { formData } });
                }}
              >
                <VisibilityIcon fontSize="inherit" color="primary" />
              </IconButton>
            </Tooltip>
          </Stack>
        );
      },
    },
    {
      field: "name",
      headerName: "Job Post Name",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "positionId",
      headerName: "Job Title",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => params.row?.position?.name,
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => dayjs(params.row?.createdAt).format("YYYY-MM-DD"),
    },
    {
      field: "updatedAt",
      headerName: "Posted Date",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => dayjs(params.row?.updatedAt).format("YYYY-MM-DD"),
    },
    {
      field: "processingState",
      headerName: "Status",
      minWidth: 120,
      maxWidth: 150,
      flex: 1,
      renderCell: (params) => {
        const { label, color } = statusMap[params.row?.processingState] ?? {
          label: "Unknown",
          color: "default",
        };
        return <Chip color={color} label={label} size="small" />;
      },
    },
  ];

  return (
    <Grid container justifyContent="center" spacing={1}>
      <Grid item xs={12}>
        <PageHeaders HeaderIcon={<WorkIcon />} headerTitle={"Report - Job Post"} />
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
          <Box sx={{ minHeight: 400, width: "100%" }}>
            <DataGrid
              columns={columns}
              loading={listItems?.isLoading}
              rows={listItems?.data?.data ?? []}
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
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Reports;
