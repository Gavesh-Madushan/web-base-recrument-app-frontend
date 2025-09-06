import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useDispatch } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { applyGlobalValidations, formatMobile } from "../../../utils/utils";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SET_BREADCRUMBS } from "../../../redux/actions/actions";
import WorkIcon from "@mui/icons-material/Work";
import { isMobile } from "react-device-detect";

// mui
import { Box, Button, Chip, Grid, IconButton, InputAdornment, LinearProgress, Stack, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// custom components
// import CreateClient from "./ClientDetails";
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
import dayjs from "dayjs";

const statusMap = {
  SUBMITED: { label: "Submitted", color: "success" },
  REJECTED: { label: "Rejected", color: "error" },
  PENDING: { label: "Pending", color: "warning" },
  INTERVIEW_SCHEDULED: { label: "Interview Scheduled", color: "primary" },
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

function SortedCandidateList(props: { access: string }) {
  const theme: any = useTheme();
  const dispatch = useDispatch();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
  const { state } = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState(state?.search || "");
  const [isLoading, setIsLoading] = useState(false);
  const [jobPosts, setClients] = useState<
    {
      id: number;
      name: string;
      email: string;
      mobile: string;
      apply_date: string;
      interview_date: string;
      status: "PENDING" | "SUBMITED" | "INTERVIEW_SCHEDULED" | "REJECTED";
    }[]
  >([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      mobile: "+94 771234567",
      apply_date: "2025-08-01T10:00:00Z",
      status: "PENDING",
      interview_date: "",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      mobile: "+94 772345678",
      apply_date: "2025-08-02T14:30:00Z",
      status: "SUBMITED",
      interview_date: "",
    },
    {
      id: 3,
      name: "Michael Johnson",
      email: "michael.j@example.com",
      mobile: "+94 773456789",
      apply_date: "2025-08-03T09:15:00Z",
      status: "INTERVIEW_SCHEDULED",
      interview_date: "2025-08-10T10:00:00Z",
    },
    {
      id: 4,
      name: "Emily Brown",
      email: "emily.brown@example.com",
      mobile: "+94 774567890",
      apply_date: "2025-08-04T11:45:00Z",
      status: "REJECTED",
      interview_date: "",
    },
    {
      id: 5,
      name: "David Lee",
      email: "david.lee@example.com",
      mobile: "+94 775678901",
      apply_date: "2025-08-05T16:20:00Z",
      status: "PENDING",
      interview_date: "",
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
      headerName: "Actions",
      minWidth: 150,
      maxWidth: 150,
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
            <IconButton size="small" onClick={() => {}}>
              <Typography variant="caption" color={""}>
                Submit
              </Typography>
            </IconButton>
            <IconButton size="small" onClick={() => {}} color="error">
              <Typography variant="caption" color={"error"}>
                {" "}
                Reject
              </Typography>
            </IconButton>
          </Stack>
        );
      },
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "createdAt",
      headerName: "Apply Date",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => dayjs(params.row?.createdAt).format("YYYY-MM-DD"),
    },
    {
      field: "interview_date",
      headerName: "Interview Scheduled Date",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => (params.row?.interview_date ? dayjs(params.row?.interview_date).format("YYYY-MM-DD") : ""),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 170,
      maxWidth: 170,
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
      <Grid item container xs={12} spacing={1}>
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

export default SortedCandidateList;
