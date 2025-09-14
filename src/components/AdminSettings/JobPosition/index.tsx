import { useTheme } from "@mui/material/styles";
import { useMemo, useState } from "react";
import { Box, Button, Grid, InputAdornment, LinearProgress, useMediaQuery } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { DataGrid } from "@mui/x-data-grid";

import CreateJobPosition from "./CreatePosition";
import { listJobPositions, useListJobCategories, useListJobPositions } from "../../../kubb";
import ViewEditDialog from "../../../utils/ui-components/ViewEditDialog";
import { applyGlobalValidations } from "../../../utils/utils";
import TextFieldWrapper from "../../../utils/ui-components/FormsUI/TextField";
import EmptyResultDataGrid from "../../../utils/ui-components/EmptyResultDataGrid";
import MainCard from "../../../utils/ui-components/MainCard";
import PageHeaders from "../../../utils/ui-components/PageHeaders";
import ListAltIcon from "@mui/icons-material/ListAlt";

export interface JobPositionValues {
  id: number;
  categoryId: number;
  name: string;
}

type TableData = Awaited<ReturnType<typeof listJobPositions>>["data"][number];

function JobPositionList() {
  const INITIAL_FORM_DATA: JobPositionValues = {
    id: 0,
    categoryId: 0,
    name: "",
  };
  const theme: any = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("lg"));
  const [highlightedRow, setHighlightedRow] = useState<number | null>(null);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  console.log(searchTerm);
  const [count, setCount] = useState(0);

  const [openCreateDriver, setOpenCreateDriver] = useState(false);
  const [openUpdateDriver, setOpenUpdateDriver] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [initialFormData, setInitialFormData] = useState<JobPositionValues>(INITIAL_FORM_DATA);

  const listItems = useListJobPositions({
    ...paginationModel,
  });

  if (listItems.data?.totalCount && listItems.data.totalCount !== count) {
    setCount(listItems.data.totalCount);
  }

  const listCategory = useListJobCategories({
    page: 0,
    pageSize: 50,
  });

  const dialogCreateDriver = useMemo(
    () =>
      ViewEditDialog(CreateJobPosition)({
        open: openCreateDriver,
        setOpen: setOpenCreateDriver,
        dialogTitle: dialogTitle,
        initialItem: initialFormData,
        fetchData: listItems.refetch,
        theme: theme,
        maxWidth: "sm",
      }),
    [openCreateDriver]
  );

  const handleClickDriverCreateOpen = (dialogTitle: string, formState: JobPositionValues) => {
    setDialogTitle(dialogTitle);
    setInitialFormData(formState);
    setOpenCreateDriver(true);
  };

  const columns = [
    {
      field: "id" satisfies keyof TableData,
      filterable: true,
      headerName: "ID",
      sortable: true,
      disableExport: false,
      minWidth: 200,
      flex: 1.5,
    },
    {
      field: "name" satisfies keyof TableData,
      filterable: true,
      headerName: "Name",
      sortable: true,
      disableExport: false,
      minWidth: 200,
      flex: 1.5,
    },
    {
      field: "categoryId",
      filterable: true,
      headerName: "Category",
      sortable: true,
      disableExport: false,
      minWidth: 200,
      flex: 1.5,
      renderCell: (params) => {
        return listCategory.data?.data.find((item) => item.id === params.row.categoryId)?.name;
      },
    },
  ];

  return (
    <Box width="100%">
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <PageHeaders HeaderIcon={<ListAltIcon />} headerTitle={"Job Categories"} />
        </Grid>
        <Grid item lg={12} md={12} sm={12} xs={12}>
          <Formik
            initialValues={{
              search: "",
            }}
            validationSchema={applyGlobalValidations(
              Yup.object().shape({
                search: Yup.string().notRequired(),
              })
            )}
            onSubmit={(values: any) => {
              setPaginationModel({
                ...paginationModel,
                page: 0,
              });
              setCount(0);
              setSearchTerm(values.search === "" ? undefined : values.search.slice(0, 10).trim());
            }}
            enableReinitialize
          >
            {({ isValid }) => (
              <Form>
                <Grid container columnSpacing={1} justifyContent={"flex-end"}>
                  <Grid item>
                    <TextFieldWrapper
                      label="Search"
                      placeholder="Type here to search.."
                      name="search"
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
                    <Button color="primary" variant="contained" sx={{ ...theme.typography.customInput }} type="submit" disabled={!isValid}>
                      View
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      color="primary"
                      sx={{ ...theme.typography.customInput }}
                      variant="contained"
                      type="button"
                      fullWidth
                      disabled={openCreateDriver}
                      onClick={() => {
                        setHighlightedRow(null);
                        handleClickDriverCreateOpen(`Add Job Position`, INITIAL_FORM_DATA);
                      }}
                      startIcon={<AddIcon />}
                    >
                      Create Job Position
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
        <Grid item lg={openCreateDriver && !matchDownSM ? 7 : 12} md={openCreateDriver && !matchDownSM ? 7 : 12} sm={12} xs={12}>
          <Box sx={{ minHeight: 400, width: "100%" }}>
            <DataGrid
              autoHeight
              columns={columns}
              loading={listItems.isLoading}
              rows={listItems.data ? listItems.data.data : []}
              slots={{
                noRowsOverlay: EmptyResultDataGrid,
                loadingOverlay: () => <LinearProgress />,
              }}
              style={{ overflow: "auto" }}
              sx={{
                "& .MuiDataGrid-cell.stickyColumn": {
                  position: "sticky",
                  left: 0,
                  backgroundColor: `${theme.palette.primary.light}`,
                  zIndex: 1,
                },
              }}
              getRowClassName={(params) => (params.row.id == highlightedRow ? "custom-highlight-row" : "")}
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
        {openCreateDriver && !matchDownSM ? (
          <Grid item lg={5} md={5}>
            <MainCard title={dialogTitle}>
              <CreateJobPosition initialItem={initialFormData} setOpen={setOpenCreateDriver} fetchData={listItems.refetch} />
            </MainCard>
          </Grid>
        ) : (
          dialogCreateDriver
        )}
        {openUpdateDriver && !matchDownSM && (
          <Grid item lg={5} md={5}>
            <MainCard title={dialogTitle}>
              <CreateJobPosition initialItem={initialFormData} setOpen={setOpenUpdateDriver} fetchData={listItems.refetch} />
            </MainCard>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

export default JobPositionList;
