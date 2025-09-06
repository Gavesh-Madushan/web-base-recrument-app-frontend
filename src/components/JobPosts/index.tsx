import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { applyGlobalValidations } from "../../utils/utils";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SET_BREADCRUMBS } from "../../redux/actions/actions";
import WorkIcon from "@mui/icons-material/Work";
import { isMobile } from "react-device-detect";

// mui
import { Box, Button, Chip, Grid, IconButton, InputAdornment, LinearProgress, Stack, Tooltip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// custom components
import PageHeaders from "../../utils/ui-components/PageHeaders";
import TextFieldWrapper from "../../utils/ui-components/FormsUI/TextField";
import EmptyResultDataGrid from "../../utils/ui-components/EmptyResultDataGrid";

// mui icons
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import dayjs from "dayjs";

const statusMap = {
  ACTIVE: { label: "Ongoing", color: "success" },
  INACTIVE: { label: "Closed", color: "error" },
  PENDING: { label: "Pending", color: "warning" },
} as const;

function JobPostsList(props: { access: string }) {
  const theme: any = useTheme();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState(state?.search || "");
  const [isLoading, setIsLoading] = useState(false);
  const [jobPosts, setJobPosts] = useState<
    {
      id: number;
      name: string;
      title: string;
      createdAt: string;
      endAt: string;
      status: "ACTIVE" | "INACTIVE";
      discription: string;
    }[]
  >([
    {
      id: 1,
      name: "TechNova Solutions",
      title: "Frontend Developer",
      createdAt: "2025-08-01T09:00:00Z",
      endAt: "2025-09-01T17:00:00Z",
      status: "ACTIVE",
      discription: "Looking for a React.js developer with 2+ years of experience.",
    },
    {
      id: 2,
      name: "FinEdge Pvt Ltd",
      title: "Backend Engineer",
      createdAt: "2025-07-25T10:30:00Z",
      endAt: "2025-08-25T18:00:00Z",
      status: "INACTIVE",
      discription: "Hiring Node.js engineers experienced in REST APIs and databases.",
    },
    {
      id: 3,
      name: "MediCare Systems",
      title: "UI/UX Designer",
      createdAt: "2025-08-10T11:15:00Z",
      endAt: "2025-09-10T17:30:00Z",
      status: "ACTIVE",
      discription: "Creative designer needed to improve healthcare web platform UI.",
    },
    {
      id: 4,
      name: "EduLearn Inc.",
      title: "Full Stack Developer",
      createdAt: "2025-07-20T08:00:00Z",
      endAt: "2025-08-20T16:00:00Z",
      status: "INACTIVE",
      discription: "Work on MERN stack applications for the e-learning platform.",
    },
    {
      id: 5,
      name: "GreenTech Labs",
      title: "Data Analyst",
      createdAt: "2025-08-15T14:20:00Z",
      endAt: "2025-09-15T19:00:00Z",
      status: "ACTIVE",
      discription: "Analyze renewable energy datasets and generate insights.",
    },
  ]);
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

  useEffect(() => {
    getJobPostList(search, paginationModel);
  }, [paginationModel, search]);

  const getJobPostList = (searchValue: string, paginationModel: { page: number; pageSize: number }) => {
    setIsLoading(false);
    const values = {
      activeState: undefined,
      searchTerm: searchValue === "" ? undefined : searchValue,
      ...paginationModel,
    };
    console.log(values);
  };

  const columns = [
    {
      field: "action",
      headerName: "",
      minWidth: 50,
      maxWidth: 50,
      headerClassName: "stickyActionHeader",
      cellClassName: "stickyColumn",
      renderCell: (params: any) => {
        return (
          <Stack direction="row" spacing={1}>
            {/* View Button */}
            <Tooltip title="View">
              <IconButton
                aria-label="view"
                color="primary"
                onClick={() => {
                  navigate(`/jobs/${params.row.id}`, {
                    state: { data: params.row },
                  });
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
      field: "title",
      headerName: "Job Title",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Posted Date",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => dayjs(params.row?.createdAt).format("YYYY-MM-DD"),
    },
    {
      field: "endAt",
      headerName: "End Date",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => dayjs(params.row?.endAt).format("YYYY-MM-DD"),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 120,
      maxWidth: 150,
      flex: 1,
      renderCell: (params) => {
        const { label, color } = statusMap[params.row?.status] ?? {
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
        <PageHeaders HeaderIcon={<WorkIcon />} headerTitle={"Job Post Management"} />
      </Grid>
      <Grid item container xs={12} spacing={1}>
        <Grid item xs={12}>
          <Formik
            initialValues={{
              userName: "",
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
                <Grid container columnSpacing={1} justifyContent={"flex-end"}>
                  <Grid item>
                    <TextFieldWrapper
                      label="Search"
                      placeholder="Search.."
                      name="userName"
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
                  {props.access[0] === "1" && (
                    <Grid item>
                      <Button
                        color="primary"
                        sx={{ ...theme.typography.button }}
                        variant="contained"
                        type="button"
                        fullWidth
                        onClick={() => {
                          navigate("/job-post/0");
                        }}
                        startIcon={!isMobile && <AddIcon />}
                      >
                        {isMobile ? <AddIcon fontSize="medium" /> : "Create Job Post"}
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Box sx={{ minHeight: 400, width: "100%" }}>
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
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default JobPostsList;
