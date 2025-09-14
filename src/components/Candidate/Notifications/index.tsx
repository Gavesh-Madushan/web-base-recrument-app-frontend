import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { applyGlobalValidations } from "../../../utils/utils";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SET_BREADCRUMBS } from "../../../redux/actions/actions";

// mui
import { Avatar, Button, Grid, IconButton, InputAdornment, Pagination, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
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

dayjs.extend(relativeTime);

function JobNotifications(props: { access: string }) {
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
      sortCount: number;
      status: "ACTIVE" | "INACTIVE";
    }[]
  >([
    {
      id: 1,
      name: "TechNova Solutions",
      title: "Frontend Developer",
      createdAt: "2025-08-01T09:00:00Z",
      endAt: "2025-09-01T17:00:00Z",
      sortCount: 10,
      status: "ACTIVE",
    },
    {
      id: 2,
      name: "FinEdge Pvt Ltd",
      title: "Backend Engineer",
      createdAt: "2025-07-25T10:30:00Z",
      endAt: "2025-08-25T18:00:00Z",
      sortCount: 5,
      status: "INACTIVE",
    },
    {
      id: 3,
      name: "MediCare Systems",
      title: "UI/UX Designer",
      createdAt: "2025-08-10T11:15:00Z",
      endAt: "2025-09-10T17:30:00Z",
      sortCount: 8,
      status: "ACTIVE",
    },
    {
      id: 4,
      name: "EduLearn Inc.",
      title: "Full Stack Developer",
      createdAt: "2025-07-20T08:00:00Z",
      endAt: "2025-08-20T16:00:00Z",
      sortCount: 2,
      status: "INACTIVE",
    },
    {
      id: 5,
      name: "GreenTech Labs",
      title: "Data Analyst",
      createdAt: "2025-08-15T14:20:00Z",
      endAt: "2025-09-15T19:00:00Z",
      sortCount: 12,
      status: "ACTIVE",
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
          name: "Job Notifications",
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
    };
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
                      // sx={{ minWidth: "250px" }}
                      // fullWidth={true}
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

          {isLoading && (
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
          {jobPosts.map((job) => (
            <Grid key={job.id} item xs={12} sx={{ marginBottom: "10px" }}>
              <MainCard>
                <Grid container spacing={2} direction={"row"}>
                  <Grid item xs={1}>
                    <Avatar></Avatar>
                  </Grid>
                  <Grid item container xs={9} spacing={1} alignContent={"center"} justifyContent={"space-between"}>
                    <Grid item xs={12}>
                      <Typography>{job.title}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography>{job.name}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography>Posted at: {dayjs(job.createdAt).fromNow()}</Typography>
                    </Grid>
                    <Grid item>
                      <Typography>Closing Date: {dayjs(job.endAt).format("YYYY-MM-DD")}</Typography>
                    </Grid>
                  </Grid>
                  <Grid item container xs={2} alignContent={"center"} justifyContent={"flex-end"} spacing={1}>
                    <Grid item alignContent={"center"}>
                      <Tooltip title="View">
                        <IconButton
                          aria-label="view"
                          color="primary"
                          onClick={() => {
                            navigate(`/reports/1`);
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
          ))}
        </Grid>
        <Grid item xs={12} sx={{ mt: "5px" }}>
          <Stack spacing={2} alignItems={"flex-end"}>
            <Pagination count={10} variant="outlined" shape="rounded" color="primary" />
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default JobNotifications;
