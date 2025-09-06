import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { applyGlobalValidations, formatMobile } from "../../utils/utils";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SET_BREADCRUMBS } from "../../redux/actions/actions";
import WorkIcon from "@mui/icons-material/Work";
import { isMobile } from "react-device-detect";

// mui
import { Box, Button, Chip, Grid, IconButton, InputAdornment, LinearProgress, Stack, Tooltip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// custom components
// import CreateClient from "./ClientDetails";
import MainCard from "../../utils/ui-components/MainCard";
import PageHeaders from "../../utils/ui-components/PageHeaders";
import ViewEditDialog from "../../utils/ui-components/ViewEditDialog";
import TextFieldWrapper from "../../utils/ui-components/FormsUI/TextField";
import EmptyResultDataGrid from "../../utils/ui-components/EmptyResultDataGrid";

// mui icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import PortraitIcon from "@mui/icons-material/Portrait";
import VisibilityIcon from "@mui/icons-material/Visibility";
import dayjs from "dayjs";

const statusMap = {
  ACTIVE: { label: "Ongoing", color: "success" },
  INACTIVE: { label: "Closed", color: "error" },
  PENDING: { label: "Pending", color: "warning" },
} as const;

export interface ClientInterface {
  id: number | string;
  company_name: string;
  company_contact: string;
  company_address: string;
  company_email: string;
  contact_person: string;
  person_mobile: string;
  status: boolean;
  discription: string;
}

const INITIAL_FORM_STATE: ClientInterface = {
  id: "",
  company_name: "",
  company_contact: "",
  company_address: "",
  company_email: "",
  contact_person: "",
  person_mobile: "",
  status: true,
  discription: "",
};

function Reports(props: { access: string }) {
  const theme: any = useTheme();
  const dispatch = useDispatch();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
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
  const [open, setOpen] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [initialItem, setInitialItem] = useState<ClientInterface>(INITIAL_FORM_STATE);
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
    };

    // ProjectService.getClientList(values, paginationModel.page, paginationModel.pageSize).then((response) => {
    //   if (response.isSuccess) {
    //     setClients(
    //       response.data.data.map((client) => ({
    //         id: client.id,
    //         company_name: client.businessName,
    //         company_contact: client.businessPhone || "",
    //         company_address: client.businessAddress || "",
    //         company_email: client.businessEmail || "",
    //         contact_person: client.personName || "",
    //         person_mobile: client.personPhone || "",
    //         status: client.activeState,
    //         discription: client.description || "",
    //       }))
    //     );
    //     setCount(response.data.totalCount || count);
    //     setIsLoading(false);
    //   } else {
    //     setCount(0);
    //     setClients([]);
    //     setIsLoading(false);
    //   }
    // });
  };

  //   const dialog = useMemo(
  //     () =>
  //       ViewEditDialog(CreateClient)({
  //         open: open,
  //         setOpen: setOpen,
  //         dialogTitle: dialogTitle,
  //         initialItem: initialItem,
  //         fetchData: () => {
  //           getCustomerList(search, paginationModel);
  //         },
  //         theme: theme,
  //         maxWidth: "sm",
  //         initialData: {},
  //       }),
  //     [open]
  //   );

  const handleClickOpen = (dialogTitle: string, formState: ClientInterface) => {
    setOpen(true);
    setDialogTitle(dialogTitle);
    setInitialItem(formState);
  };

  const columns = [
    {
      field: "action",
      headerName: "",
      minWidth: 50,
      maxWidth: 50,
      headerClassName: "stickyActionHeader",
      cellClassName: "stickyColumn",
      renderCell: (params: any) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View">
            <IconButton
              aria-label="view"
              color="primary"
              onClick={() => {
                navigate(`/reports/${params.row.id}`);
              }}
            >
              <VisibilityIcon fontSize="inherit" color="primary" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
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
      field: "sortCount",
      headerName: "Sorted Candidate Count",
      minWidth: 120,
      flex: 1,
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
        <PageHeaders HeaderIcon={<WorkIcon />} headerTitle={"Report - Job Post"} />
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
        <Grid item lg={open && !matchDownSM ? 7 : 12} md={open && !matchDownSM ? 7 : 12} sm={12} xs={12}>
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
        {/* {open && !matchDownSM ? (
          <Grid item lg={5} md={5}>
            <MainCard title={dialogTitle}>
              <CreateClient
                fetchData={() => {
                  getCustomerList(search, paginationModel);
                }}
                initialData={{}}
                initialItem={initialItem}
                setOpen={setOpen}
              />
            </MainCard>
          </Grid>
        ) : (
          dialog
        )} */}
      </Grid>
    </Grid>
  );
}

export default Reports;
