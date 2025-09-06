import * as Yup from "yup";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";

// mui
import {
  Box,
  Button,
  Chip,
  Collapse,
  Grid,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";

// custom components
import Spinner from "../../../../utils/ui-components/Spinner";
import MainCard from "../../../../utils/ui-components/MainCard";
import EmptyResult from "../../../../utils/ui-components/EmptyResult";
import TextFieldWrapper from "../../../../utils/ui-components/FormsUI/TextField";

// mui icons
// import ClearIcon from "@mui/icons-material/Clear";
// import CheckIcon from "@mui/icons-material/Check";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ProjectService } from "../../../../assets/_services/project-service";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { useNavigate } from "react-router-dom";
import { applyGlobalValidations } from "../../../../utils/utils";

const statusMap = {
  ONGOING: { label: "Ongoing", color: "success" },
  COMPLETED: { label: "Completed", color: "error" },
  PENDING: { label: "Pending", color: "warning" },
} as const;

function Row(props: { job; isOdd }) {
  const { job, isOdd } = props;
  const [open] = useState(false);
  const navigate = useNavigate();
  const theme: any = useTheme();
  const bgColor = isOdd ? theme.palette.grey[100] : theme.palette.background.paper;

  const { label, color } = statusMap[job.status] ?? {
    label: "Unknown",
    color: "default",
  };

  return (
    <React.Fragment>
      <TableRow
      // sx={{ "& > *": { borderBottom: "unset" }, cursor: "pointer" }}
      // onClick={() => {
      //   setOpen(!open);
      // }}
      >
        <TableCell sx={{ backgroundColor: theme.palette.primary.light }}>
          <Tooltip title="View">
            <IconButton
              aria-label="view"
              color="primary"
              onClick={() => {
                navigate(`/project/jobs/${job?.id}`, { state: { data: job } });
              }}
            >
              <VisibilityIcon
                fontSize="inherit"
                color="primary"
                // sx={{color: 'Background'}}
              />
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell sx={{ backgroundColor: bgColor }}>{job.jobName}</TableCell>
        <TableCell sx={{ backgroundColor: bgColor }}>{job.division.name}</TableCell>
        <TableCell sx={{ backgroundColor: bgColor }} align="center">
          {job.isOutstation ? <CheckBoxIcon color={"action"} /> : <CheckBoxOutlineBlankIcon color="disabled" />}
        </TableCell>
        <TableCell align="center" sx={{ backgroundColor: bgColor }}>
          <Chip color={color} label={label} size="small" />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Project Details here ....
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function JobList({ divisionType, clientId }: { divisionType: { id: number; name: string; count: number }; clientId: number }) {
  const theme: any = useTheme();

  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [jobs, setJobs] = useState<
    {
      id: number;
      jobName: string;
      division: {
        id: number;
        name: string;
      };
      client: { id: number; name: string };
      isOutstation: boolean;
      address: string;
      location: {
        latitude: number;
        longitude: number;
      };
      status: string;
    }[]
  >([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchProjectList();
  }, [page, rowsPerPage, search]);

  const fetchProjectList = () => {
    setIsLoading(true);
    const data = {
      clientId: clientId === 0 ? undefined : clientId,
      divisionId: divisionType.id === 0 ? undefined : divisionType.id,
      state: undefined,
      searchTerm: search === "" ? undefined : search,
    };
    ProjectService.getProjectList(data, page, rowsPerPage).then((response) => {
      if (response.isSuccess && response.data) {
        // console.log("response", response.data.data);

        setJobs(
          response.data.data.map((project) => ({
            id: project.id,
            jobName: project.name,
            division: {
              id: project.divisionId,
              name: project.division?.name || "",
            },
            client: {
              id: project.clientId || 0,
              name: String(project.clientId),
            },
            isOutstation: project.isOutstation,
            address: "Address",
            location: {
              latitude: project.location[0],
              longitude: project.location[1],
            },
            status: project.processingState,
          }))
        );
        setCount(response?.data?.totalCount || count);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Grid container spacing={1}>
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
                    placeholder="Username.."
                    name="userName"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    size={"small"}
                    sx={{ minWidth: "250px" }}
                    fullWidth={true}
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
      <Grid item lg={12} sm={12} xs={12}>
        <MainCard>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={60} />
                  <TableCell>Project Name</TableCell>
                  <TableCell>Division</TableCell>
                  <TableCell align="center">Outstation</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {jobs.map((job, index) => {
                  return <Row key={job.id} job={job} isOdd={index % 2 !== 1} />;
                })}
              </TableBody>
            </Table>
          </TableContainer>
          {!jobs?.length && !isLoading ? (
            <EmptyResult />
          ) : isLoading ? (
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                minHeight: "40vh",
              }}
            >
              <Spinner />
            </Box>
          ) : null}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
          {/* </TableContainer> */}
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default JobList;
