import { gridSpacing } from "../../store/constants";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SET_BREADCRUMBS } from "../../redux/actions/actions";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

// mui
import {
  Box,
  Button,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

// custom components

// mui icons
import { useMutation, useQuery } from "@tanstack/react-query";
import { createDivision, listDivision, updatDivision } from "../../assets/api";
import EmptyResult from "../../utils/ui-components/EmptyResult";
import Spinner from "../../utils/ui-components/Spinner";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import { Form, Formik } from "formik";
import { applyGlobalValidations } from "../../utils/utils";
import TextField from "../../utils/ui-components/FormsUI/TextField";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { openSuccessDialog } from "../../utils/ui-components/pop-ups/SuccessDialog";
import MainCard from "../../utils/ui-components/MainCard";

// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import GridViewIcon from "@mui/icons-material/GridView";
// import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
// import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
// import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";

function DivisionManagement(props: { access: string }) {
  const theme: any = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  const { state } = useLocation();
  const dispatch = useDispatch();
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [open, setOpen] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [initialItem, setInitialItem] = useState<{ id: number; divisionName: string }>({
    id: 0,
    divisionName: "",
  });

  const listDivisions = useQuery({
    queryKey: ["listDivision", page, pageSize],
    queryFn: () =>
      listDivision({
        page,
        pageSize,
      }),
    select: (res) => res.data,
    enabled: true,
  });

  if (listDivisions.data && listDivisions.data.totalCount && listDivisions.data.totalCount !== count) {
    setCount(listDivisions.data.totalCount);
  }
  useEffect(() => {
    dispatch({
      type: SET_BREADCRUMBS,
      payload: [
        { name: "Home", path: "/Dashboard", bold: false, state: null },
        {
          name: "Confuigurations",
          path: "",
          bold: true,
          state: state,
        },
        {
          name: "Division Management",
          path: "",
          bold: true,
          state: state,
        },
      ],
    });
  }, []);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickOpen = (dialogTitle: string, formState: { id: number; divisionName: string }) => {
    setInitialItem(formState);
    setDialogTitle(dialogTitle);
    setOpen(true);
  };

  const createNewDivision = useMutation({
    mutationFn: createDivision,
  });

  const updateDivision = useMutation({
    mutationFn: updatDivision,
  });

  return (
    <MainCard title="Division Management">
      <Grid container justifyContent="center" spacing={gridSpacing}>
        {!open && (
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              color="primary"
              variant="contained"
              type="button"
              size="medium"
              startIcon={<AddIcon />}
              onClick={() => {
                setInitialItem({
                  id: 0,
                  divisionName: "",
                });
                setDialogTitle("Create Division");
                setOpen(true);
              }}
            >
              Add Division
            </Button>
          </Grid>
        )}
        <Grid item lg={open && !matchDownSM ? 7 : 12} md={open && !matchDownSM ? 7 : 12} sm={12} xs={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell width={"100px"}>ID</TableCell>
                  <TableCell>Division Name</TableCell>
                  <TableCell align="center" width={"50px"} />
                </TableRow>
              </TableHead>
              <TableBody>
                {listDivisions.data?.data?.length &&
                  !listDivisions.isFetching &&
                  listDivisions.data?.data.map((division, index) => (
                    <TableRow key={index}>
                      <TableCell>{division.id}</TableCell>
                      <TableCell>
                        <Typography>{division.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Edit Division">
                          <span>
                            <IconButton
                              onClick={() => {
                                window.scrollTo(0, 0);
                                handleClickOpen(`Update Division ( ID: ${division.id})`, {
                                  id: division.id,
                                  divisionName: division.name,
                                });
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {!listDivisions.data?.data?.length && !listDivisions.isFetching ? (
              <EmptyResult />
            ) : listDivisions.isFetching ? (
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
              rowsPerPage={pageSize}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableContainer>
        </Grid>
        {open && !matchDownSM && (
          <Grid item lg={5} md={5}>
            <Formik
              validateOnMount={true}
              enableReinitialize
              initialValues={{
                ...initialItem,
              }}
              validationSchema={applyGlobalValidations(
                Yup.object().shape({
                  divisionName: Yup.string().trim().required("Please enter the division name"),
                })
              )}
              onSubmit={(values, { setSubmitting }) => {
                // setIsLoading(true);
                if (initialItem.id) {
                  updateDivision.mutate(
                    {
                      id: values.id,
                      name: values.divisionName,
                    },
                    {
                      onSuccess: () => {
                        openSuccessDialog("Success", `${values.divisionName} updated successfully`);
                        // setIsLoading(false);
                        setOpen(false);
                        listDivisions.refetch();
                      },
                      onError: () => {
                        setSubmitting(false);
                        // setIsLoading(false);
                      },
                    }
                  );
                } else {
                  createNewDivision.mutate(
                    {
                      name: values.divisionName,
                    },
                    {
                      onSuccess: () => {
                        openSuccessDialog("Success", `${values.divisionName} updated successfully`);
                        // setIsLoading(false);
                        setOpen(false);
                        listDivisions.refetch();
                      },
                      onError: () => {
                        setSubmitting(false);
                        // setIsLoading(false);
                      },
                    }
                  );
                }
              }}
            >
              {({ dirty, isSubmitting, isValid }) => (
                <Form>
                  <Grid container spacing={1}>
                    <Grid item xl={12} xs={12} md={12}>
                      <Typography>{dialogTitle}</Typography>
                    </Grid>
                    <Grid item xl={12} xs={12} md={12}>
                      <TextField required label="Division Name" name="divisionName" type="text" />
                    </Grid>

                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <Grid
                        item
                        xs={12}
                        gap={1}
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          py: 2,
                        }}
                      >
                        {!matchDownSM && (
                          <Button
                            color="primary"
                            variant="contained"
                            type="button"
                            size="medium"
                            sx={{ ...theme.typography.button }}
                            onClick={() => setOpen(false)}
                          >
                            Cancel
                          </Button>
                        )}

                        <Button
                          color="primary"
                          variant="contained"
                          type="submit"
                          sx={{ ...theme.typography.button }}
                          size="medium"
                          disabled={!dirty || isSubmitting || !isValid}
                          // startIcon={
                          //   isLoading && (
                          //     <CircularProgress
                          //       size={"20px"}
                          //       sx={{
                          //         mr: 1,
                          //         color: "gray",
                          //       }}
                          //     />
                          //   )
                          // }
                        >
                          {initialItem.id ? "Update" : "Create"} Division
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Grid>
        )}
      </Grid>
    </MainCard>
  );
}

export default DivisionManagement;
