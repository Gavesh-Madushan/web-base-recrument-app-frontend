import { useTheme } from "@mui/material/styles";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DataGrid, GridAlignment } from "@mui/x-data-grid";
import { useDispatch } from "react-redux";
import { SET_BREADCRUMBS } from "../../../../redux/actions/actions";
import EmptyResultDataGrid from "../../../../utils/ui-components/EmptyResultDataGrid";
import { formatMobile } from "../../../../utils/utils";

// mui
import { Avatar, Box, Chip, Grid, IconButton, LinearProgress, Stack, Tooltip, Typography } from "@mui/material";

// mui icon
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { StaffService } from "../../../../assets/_services/staff-service";
import KeyIcon from "@mui/icons-material/Key";
import ViewEditDialog from "../../../../utils/ui-components/ViewEditDialog";
import ResetEmployeePassword from "./ResetEmployeePassword";
import { UploadService } from "../../../../assets/_services/upload-service";

const statusMap = {
  ACTIVE: { label: "Active", color: "success" },
  INACTIVE: { label: "Inactive", color: "error" },
  RESIGNED: { label: "Resigned", color: "error" },
  pending: { label: "Pending", color: "warning" },
} as const;

function EmployeeList(props: {
  division: number | string;
  search: {
    search: string;
    empClass: string | number;
    division: string | number;
  };
  access: string;
}) {
  // console.log(props);
  const navigate = useNavigate();
  const theme: any = useTheme();
  const dispatch = useDispatch();
  const { state } = useLocation();

  const [isLoading, setIsLoading] = useState(false);
  const [openResetPassword, setOpenResetPassword] = useState(false);
  const [selectEmpData, setSelectEmpData] = useState({});
  const [employees, setEmployees] = useState<
    {
      id: number;
      emp_no: string;
      division: string;
      empClass: string;
      designation: "MANAGER" | "DIVISION_HEAD" | "HR_MANAGER" | "FINANCE_MANAGER" | "ENGINEER" | "TECHNICIAN" | "ASSISTANT_ENGINEER";
      nic: string;
      name_with_initials: string;
      name: string;
      mobile: string;
      status: string;
    }[]
  >([]);
  const [paginationModel, setPaginationModel] = useState<{
    page: number;
    pageSize: number;
  }>(
    state?.paginationModel || {
      page: 0,
      pageSize: 10,
    }
  );
  const [count, setCount] = useState(0);

  useEffect(() => {
    dispatch({
      type: SET_BREADCRUMBS,
      payload: [
        { name: "Home", path: "/Dashboard", bold: false, state: null },
        {
          name: "Employee",
          path: null,
          bold: true,
          state: state,
        },
      ],
    });
  }, []);

  useEffect(() => {
    fetchApiUserList(props.division, props.search);
  }, [paginationModel, props.search, props.division]);

  const fetchApiUserList = (
    division: number | string,
    searchValue: {
      search: string;
      empClass: string | number;
      division: string | number;
    }
  ) => {
    setIsLoading(true);

    StaffService.getEmployeeList(
      {
        activeState: undefined,
        designation:
          searchValue.empClass === "ALL"
            ? undefined
            : (searchValue.empClass as
                | "MANAGER"
                | "DIVISION_HEAD"
                | "HR_MANAGER"
                | "FINANCE_MANAGER"
                | "ENGINEER"
                | "TECHNICIAN"
                | "ASSISTANT_ENGINEER"),
        searchTerm: searchValue.search === "" ? undefined : searchValue.search,
        divisionId: division ? Number(division) : undefined,
        joinDivision: true,
      },
      paginationModel.page,
      paginationModel.pageSize
    ).then(async (response) => {
      if (response.isSuccess) {
        const withAvatars = await Promise.all(
          response.data.data.map(async (emp) => {
            let avatar: any = null;
            if (emp?.profilePicturePath) {
              const fileSrc: any = await UploadService.getFile(emp?.profilePicturePath);
              avatar = URL.createObjectURL(fileSrc);
            }
            return {
              id: emp?.id,
              src: avatar,
              emp_no: emp.employeeNumber,
              division: emp.division?.name ?? "",
              designation: emp.designation,
              empClass: emp.class,
              nic: emp.nic,
              name: emp.name,
              name_with_initials: emp?.nameInitials,
              mobile: emp?.mobile,
              status: emp?.resignedAt ? "RESIGNED" : emp?.activeState,
            };
          })
        );
        setEmployees(withAvatars);
        setCount(response?.data?.totalCount || count);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setCount(0);
        setEmployees([]);
      }
    });
  };

  const handleResetPassword = (empData) => {
    setSelectEmpData(empData);
    setOpenResetPassword(true);
  };
  const dialog = useMemo(
    () =>
      ViewEditDialog(ResetEmployeePassword)({
        open: openResetPassword,
        initialItem: selectEmpData,
        setOpen: setOpenResetPassword,
        dialogTitle: "Reset Password",
        theme: theme,
        maxWidth: "sm",
      }),
    [openResetPassword]
  );

  const columns = [
    {
      field: "action",
      headerName: "",
      minWidth: props.access[2] === "1" ? (props.access[4] === "1" ? 105 : 80) : props.access[4] === "1" ? 80 : 50,
      maxWidth: props.access[2] === "1" ? (props.access[4] === "1" ? 105 : 80) : props.access[4] === "1" ? 80 : 50,
      headerClassName: "stickyActionHeader",
      cellClassName: "stickyColumn",
      renderCell: (params) => {
        return (
          <>
            {props.access[1] === "1" && (
              <Tooltip title="View">
                <IconButton aria-label="view" color="primary" onClick={() => navigate(`/staff/employee/profile/${params.row.id}`)}>
                  <VisibilityIcon fontSize="inherit" color="primary" />
                </IconButton>
              </Tooltip>
            )}
            {props.access[4] === "1" && (
              <Tooltip title="Change Password">
                <IconButton aria-label="view" color="primary" onClick={() => handleResetPassword(params.row)}>
                  <KeyIcon fontSize="inherit" color="primary" />
                </IconButton>
              </Tooltip>
            )}
            {props.access[2] === "1" && (
              <Tooltip title="Edit">
                <IconButton aria-label="view" color="primary" onClick={() => navigate(`/staff/employee/${params.row.id}`)}>
                  <EditIcon fontSize="inherit" color="primary" />
                </IconButton>
              </Tooltip>
            )}
          </>
        );
      },
    },
    {
      field: "emp_image",
      headerName: "Employee No",
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack alignItems={"center"} direction={"row"} spacing={2}>
            <Avatar key={params.row.id} src={params.row?.src} />
            <Typography>{params.row?.emp_no}</Typography>
          </Stack>
        );
      },
    },
    {
      field: "name_with_initials",
      headerName: "Name With Initials",
      minWidth: 200,
      flex: 1,
      renderCell: (params) => {
        return (
          <Stack direction={"column"}>
            <Typography>{params.row?.name_with_initials}</Typography>
            <Typography variant="caption">{params.row?.name}</Typography>
          </Stack>
        );
      },
    },
    {
      field: "division",
      headerName: "Division",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "empClass",
      headerName: "Designation",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "nic",
      headerName: "NIC No",
      minWidth: 120,
      maxWidth: 150,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      width: 130,
      renderCell: (params) => {
        return formatMobile(params.row?.mobile);
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      maxWidth: 120,
      flex: 1,
      align: "center" as GridAlignment,
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
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Box sx={{ minHeight: 400, width: "100%" }}>
          <DataGrid
            columns={columns}
            loading={isLoading}
            rows={employees}
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
            density="standard"
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
      {dialog}
    </Grid>
  );
}

export default EmployeeList;
