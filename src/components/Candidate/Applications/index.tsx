import * as Yup from "yup";
import { Form, Formik } from "formik";
import { applyGlobalValidations } from "../../../utils/utils";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// mui
import { Avatar, Button, Chip, Grid, IconButton, InputAdornment, Pagination, Skeleton, Stack, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// custom components
import PageHeaders from "../../../utils/ui-components/PageHeaders";
import TextFieldWrapper from "../../../utils/ui-components/FormsUI/TextField";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";

// mui icons
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import dayjs from "dayjs";
import MainCard from "../../../utils/ui-components/MainCard";
import relativeTime from "dayjs/plugin/relativeTime";
import { useListJobApplications } from "../../../kubb";
import EmptyResult from "../../../utils/ui-components/EmptyResult";

dayjs.extend(relativeTime);

function MyJobApplications(props: { access: string }) {
  console.log(props);
  const theme: any = useTheme();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState(state?.search || "");
  const [count, setCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState(
    state?.paginationModel || {
      page: 0,
      pageSize: 10,
    }
  );

  const listItems = useListJobApplications({
    createdFrom: search.createdFrom ? search.createdFrom.toISOString() : undefined,
    createdTo: search.createdTo ? search.createdTo.toISOString() : undefined,
    pageSize: paginationModel.pageSize,
    page: paginationModel.page,
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
          {listItems.isLoading && (
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
          {count > 0
            ? listItems.data?.data?.map((job) => (
                <Grid key={job.id} item xs={12} sx={{ marginBottom: "10px" }}>
                  <MainCard>
                    <Grid container spacing={2} direction={"row"}>
                      <Grid item xs={1}>
                        <Avatar></Avatar>
                      </Grid>
                      <Grid item container xs={9} spacing={1} alignContent={"center"} justifyContent={"space-between"}>
                        <Grid item xs={12}>
                          <Typography>{job.id}</Typography>
                        </Grid>
                        <Grid item xs={2}>
                          <Chip label={job.processingState} color="primary" size="small" />
                        </Grid>
                        <Grid item>
                          <Typography>Posted at: {dayjs(job.createdAt).fromNow()}</Typography>
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
                      </Grid>
                    </Grid>
                  </MainCard>
                </Grid>
              ))
            : !listItems?.isLoading && <EmptyResult />}
        </Grid>
        <Grid item xs={12} sx={{ mt: "5px" }}>
          <Stack spacing={2} alignItems={"flex-end"}>
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

export default MyJobApplications;
