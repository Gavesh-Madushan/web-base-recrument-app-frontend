import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// mui
import { Box, Chip, Grid, IconButton, LinearProgress, Stack, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// custom components
import EmptyResultDataGrid from "../../../utils/ui-components/EmptyResultDataGrid";

// mui icons
import VisibilityIcon from "@mui/icons-material/Visibility";
import dayjs from "dayjs";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { useListJobApplications } from "../../../kubb";
import { JobPostDetails } from "../../JobPosts/AddorUpdateJobPost";

const statusMap = {
  PENDING: { label: "Pending", color: "warning" },
  SHORTLISTED: { label: "Short Listed", color: "success" },
  INTERVIEW_SCHEDULED: { label: "Interview Scheduled", color: "primary" },
  REJECTED: { label: "Rejected", color: "error" },
} as const;

function SortedCandidateList(props: {
  access: string;
  state: JobPostDetails;
  status: "PENDING" | "SHORTLISTED" | "INTERVIEW_SCHEDULED" | "ACCEPTED" | "REJECTED";
}) {
  const theme: any = useTheme();
  const navigate = useNavigate();
  console.log(props.state);

  const [count, setCount] = useState(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const listItems = useListJobApplications({
    page: paginationModel.page,
    pageSize: paginationModel.pageSize,
    ...(props.status !== "REJECTED"
      ? {
          dobFrom: props.state.age.isUse ? dayjs("1970-01-01").add(props.state.age.min, "years").toISOString() : undefined,
          dobTo: props.state.age.isUse ? dayjs("1970-01-01").add(props.state.age.max, "years").toISOString() : undefined,
          expectedSalaryFrom: props.state.salary.isUse ? props.state.salary.min : undefined,
          expectedSalaryTo: props.state.salary.isUse ? props.state.salary.max : undefined,
          experienceYearsFrom: props.state.experience.isUse ? props.state.experience.min : undefined,
          experienceYearsTo: props.state.experience.isUse ? props.state.experience.max : undefined,
          gender: props.state.gender.isUse ? (props.state.gender.enable as "MALE" | "FEMALE" | "OTHER") : undefined,
          jobPostingId: Number(props.state.jobPosition),
          qualificationLevels: props.state.qulification.isUse ? props.state.qulification.enable.map((item) => item.value).join(",") : undefined,
        }
      : {}),
    processingState: props.status,
  });

  if (listItems.data?.totalCount && listItems.data.totalCount !== count) {
    setCount(listItems.data.totalCount);
  }

  const columns = [
    {
      field: "action",
      headerName: "Actions",
      minWidth: 120,
      maxWidth: 120,
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
              <ThumbUpIcon fontSize="inherit" color="success" />
            </IconButton>
            <IconButton size="small" onClick={() => {}} color="error">
              <ThumbDownIcon fontSize="inherit" color="error" />
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
      renderCell: (params) => {
        return params.row.firstName + " " + params.row.lastName;
      },
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
      renderCell: (params) =>
        params.row?.interview1At && params.row?.processingState === "INTERVIEW_SCHEDULED" ? dayjs(params.row?.interview1At).format("YYYY-MM-DD") : "",
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 170,
      maxWidth: 170,
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
      <Grid item container xs={12} spacing={1}>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Box sx={{ minHeight: 400, width: "100%" }}>
            <DataGrid
              columns={columns}
              loading={listItems.isLoading}
              rows={listItems.data?.data || []}
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

export default SortedCandidateList;
