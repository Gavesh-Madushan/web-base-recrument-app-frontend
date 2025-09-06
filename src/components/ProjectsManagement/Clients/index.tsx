import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { applyGlobalValidations, formatMobile } from "../../../utils/utils";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SET_BREADCRUMBS } from "../../../redux/actions/actions";
import { isMobile } from "react-device-detect";

// mui
import { Box, Button, Chip, Grid, IconButton, InputAdornment, LinearProgress, Stack, Tooltip, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// custom components
import CreateClient from "./ClientDetails";
import MainCard from "../../../utils/ui-components/MainCard";
import PageHeaders from "../../../utils/ui-components/PageHeaders";
import ViewEditDialog from "../../../utils/ui-components/ViewEditDialog";
import TextFieldWrapper from "../../../utils/ui-components/FormsUI/TextField";
import EmptyResultDataGrid from "../../../utils/ui-components/EmptyResultDataGrid";

// mui icons
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import PortraitIcon from "@mui/icons-material/Portrait";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ProjectService } from "../../../assets/_services/project-service";

const statusMap = {
  ACTIVE: { label: "Active", color: "success" },
  INACTIVE: { label: "Inactive", color: "error" },
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

function ClientList(props: { access: string }) {
  const theme: any = useTheme();
  const dispatch = useDispatch();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const { state } = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState(state?.search || "");
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<
    {
      id: number;
      company_name: string;
      company_contact: string;
      company_address: string;
      company_email: string;
      contact_person: string;
      person_mobile: string;
      status: "ACTIVE" | "INACTIVE";
      discription: string;
    }[]
  >([]);
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
          name: "Customers",
          path: null,
          bold: true,
          state: null,
        },
      ],
    });
  }, []);

  useEffect(() => {
    getCustomerList(search, paginationModel);
  }, [paginationModel, search]);

  const getCustomerList = (searchValue: string, paginationModel: { page: number; pageSize: number }) => {
    setIsLoading(true);
    const values = {
      activeState: undefined,
      searchTerm: searchValue === "" ? undefined : searchValue,
    };

    ProjectService.getClientList(values, paginationModel.page, paginationModel.pageSize).then((response) => {
      if (response.isSuccess) {
        setClients(
          response.data.data.map((client) => ({
            id: client.id,
            company_name: client.businessName,
            company_contact: client.businessPhone || "",
            company_address: client.businessAddress || "",
            company_email: client.businessEmail || "",
            contact_person: client.personName || "",
            person_mobile: client.personPhone || "",
            status: client.activeState,
            discription: client.description || "",
          }))
        );
        setCount(response.data.totalCount || count);
        setIsLoading(false);
      } else {
        setCount(0);
        setClients([]);
        setIsLoading(false);
      }
    });
  };

  const dialog = useMemo(
    () =>
      ViewEditDialog(CreateClient)({
        open: open,
        setOpen: setOpen,
        dialogTitle: dialogTitle,
        initialItem: initialItem,
        fetchData: () => {
          getCustomerList(search, paginationModel);
        },
        theme: theme,
        maxWidth: "sm",
        initialData: {},
      }),
    [open]
  );

  const handleClickOpen = (dialogTitle: string, formState: ClientInterface) => {
    setOpen(true);
    setDialogTitle(dialogTitle);
    setInitialItem(formState);
  };

  const columns = [
    {
      field: "action",
      headerName: "",
      minWidth: props.access[2] === "1" ? 80 : 50,
      maxWidth: props.access[2] === "1" ? 80 : 50,
      headerClassName: "stickyActionHeader",
      cellClassName: "stickyColumn",
      renderCell: (params: any) => {
        return (
          <Stack direction="row" spacing={1}>
            <Tooltip title="view">
              <IconButton
                aria-label="view"
                color="primary"
                onClick={() => {
                  navigate(`/project/client/${params.row.id}`, {
                    state: { data: params.row },
                  });
                }}
              >
                <VisibilityIcon
                  fontSize="inherit"
                  color="primary"
                  // sx={{color: 'Background'}}
                />
              </IconButton>
            </Tooltip>
            {props.access[2] === "1" && (
              <Tooltip title="Edit">
                <IconButton
                  aria-label="view"
                  color="primary"
                  onClick={() => {
                    window.scrollTo(0, 0);
                    handleClickOpen(`Update Customer`, {
                      id: params.row.id,
                      company_name: params.row?.company_name,
                      company_contact: params.row?.company_contact || "",
                      company_address: params.row?.company_address || "",
                      company_email: params.row?.company_email || "",
                      contact_person: params.row?.contact_person || "",
                      person_mobile: params.row?.person_mobile || "",
                      status: params.row?.status === "ACTIVE" ? true : false,
                      discription: params.row.discription || "",
                    });
                  }}
                >
                  <EditIcon
                    fontSize="inherit"
                    color="primary"
                    // sx={{color: 'Background'}}
                  />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        );
      },
    },
    {
      field: "company_name",
      headerName: "Company Name",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "company_contact",
      headerName: "Company Contact",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        return formatMobile(params.row?.company_contact);
      },
    },

    {
      field: "company_address",
      headerName: "Company Address",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "contact_person",
      headerName: "Contact Person",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "person_mobile",
      headerName: "Person's Contact",
      width: 150,
      renderCell: (params) => {
        return formatMobile(params.row?.person_contact);
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      maxWidth: 130,
      flex: 1,
      renderCell: (params) => {
        const { label, color } = statusMap[params.row?.status] ?? {
          label: "Unknown",
          color: "default",
        };
        return <Chip color={color} label={label} size="small" />;
      },
    },
    {
      field: "company_email",
      headerName: "Company Email",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "discription",
      headerName: "Discription",
      minWidth: 100,
      flex: 1,
    },
  ];

  return (
    <Grid container justifyContent="center" spacing={1}>
      <Grid item xs={12}>
        <PageHeaders HeaderIcon={<PortraitIcon />} headerTitle={"Customer Management"} />
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
                  {props.access[0] === "1" && (
                    <Grid item>
                      <Button
                        color="primary"
                        sx={{ ...theme.typography.button }}
                        variant="contained"
                        type="button"
                        fullWidth
                        disabled={open}
                        onClick={() => {
                          window.scrollTo(0, 0);
                          handleClickOpen(`Create Customer`, INITIAL_FORM_STATE);
                        }}
                        startIcon={!isMobile && <AddIcon />}
                      >
                        {isMobile ? <AddIcon fontSize="medium" /> : "Create Customer"}
                      </Button>
                    </Grid>
                  )}
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
              rows={clients}
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
        {open && !matchDownSM ? (
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
        )}
      </Grid>
    </Grid>
  );
}

export default ClientList;
