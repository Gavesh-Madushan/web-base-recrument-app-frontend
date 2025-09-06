import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MainCard from "../../../utils/ui-components/MainCard";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EmptyResultDataGrid from "../../../utils/ui-components/EmptyResultDataGrid";
import LinearProgress from "@mui/material/LinearProgress";

function CampaignSummary() {
  const theme = useTheme();

  const [campaignsData, setCampaignsData]: any = useState(data);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [count, setCount] = useState(data.length);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (newPageSize: number) => {
    setRowsPerPage(newPageSize);
    setPage(0);
  };

  const columns = [
    {
      field: "id",
      hide: true,
      filterable: false,
      headerName: "ID",
      sortable: false,
      disableExport: false,
    },
    {
      field: "no",
      filterable: true,
      headerName: "No",
      sortable: true,
      disableExport: false,
      minWidth: 100,
      flex: 2,
    },
    {
      field: "name",
      filterable: true,
      headerName: "Name",
      sortable: true,
      disableExport: false,
      minWidth: 150,
      flex: 3,
    },
    {
      field: "sender",
      filterable: true,
      headerName: "Sender",
      sortable: true,
      disableExport: false,
      minWidth: 150,
      flex: 3,
    },
    {
      field: "scheduled",
      filterable: true,
      headerName: "Scheduled",
      sortable: false,
      disableExport: false,
      minWidth: 200,
      flex: 4,
    },
    {
      field: "view",
      hide: false,
      filterable: false,
      headerName: "View",
      sortable: false,
      renderCell: (params: any) => {
        return (
          <IconButton onClick={() => {}}>
            <VisibilityIcon fontSize="inherit" color="primary" />
          </IconButton>
        );
      },
      disableExport: true,
      disableColumnMenu: true,
      minWidth: 50,
      flex: 1,
    },
  ];

  return (
    <MainCard title="Scheduled Campaigns">
      <Box sx={{ minHeight: 400, width: "100%" }}>
        <DataGrid
          autoHeight
          columns={columns}
          loading={isLoading}
          rows={campaignsData}
          components={{
            Toolbar: GridToolbar,
            NoRowsOverlay: EmptyResultDataGrid,
            LoadingOverlay: LinearProgress,
          }}
          componentsProps={{
            toolbar: {
              csvOptions: { disableToolbarButton: true },
              printOptions: { disableToolbarButton: true },
              showQuickFilter: false,
              quickFilterProps: { debounceMs: 250 },
            },
          }}
          pagination
          paginationMode="server"
          rowCount={count}
          rowsPerPageOptions={[5, 10, 25, 50]}
          page={page}
          pageSize={rowsPerPage}
          onPageChange={handleChangePage}
          onPageSizeChange={handleChangeRowsPerPage}
        />
      </Box>
    </MainCard>
  );
}

export default CampaignSummary;

const data = [
  {
    id: 1,
    no: "12342",
    name: "test 1",
    sender: "sender 1",
    scheduled: "2023-08-18T14:04:55.000Z",
  },
  {
    id: 2,
    no: "12562",
    name: "test 2",
    sender: "sender 2",
    scheduled: "2023-08-02T14:04:55.000Z",
  },
  {
    id: 3,
    no: "14562",
    name: "test 3",
    sender: "sender 3",
    scheduled: "2023-08-10T10:04:55.000Z",
  },
  {
    id: 4,
    no: "66674",
    name: "test 4",
    sender: "sender 4",
    scheduled: "2023-07-18T14:04:55.000Z",
  },
];
