import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { gridSpacing } from "../../../store/constants";

// custom components
import PageHeaders from "../../../utils/ui-components/PageHeaders";
import TextField from "../../../utils/ui-components/FormsUI/TextField";

// mui
import {
  Grid,
  Button,
  CircularProgress,
  Typography,
  Pagination,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Box,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

// mui icon
import { convertToCents, convertToRupees, currencyFormat } from "../../../utils/utils";
import dayjs from "dayjs";
import { listSalaryRecords, updateSalaryRecords } from "../../../assets/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useLocation, useNavigate } from "react-router-dom";
import { SET_BREADCRUMBS } from "../../../redux/actions/actions";
import { useDispatch } from "react-redux";
import MainCard from "../../../utils/ui-components/MainCard";
import { openSuccessDialog } from "../../../utils/ui-components/pop-ups/SuccessDialog";

function BulkUpdateSalaryRecords(props: { access: string; role: any }) {
  const theme: any = useTheme();
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [count, setCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch({
      type: SET_BREADCRUMBS,
      payload: [
        { name: "Home", path: "/Dashboard", bold: false, state: null },
        {
          name: "Payroll",
          path: "/staff/payroll",
          bold: true,
          state: state,
        },
        {
          name: "Bulk Update Pay Sheets",
          path: null,
          bold: false,
        },
      ],
    });
  }, []);

  useEffect(() => {
    if (!state) {
      navigate("/staff/payroll");
    }
    window.scrollTo(0, 0);
    window.history.replaceState({}, "");
  }, []);

  const salaryRecords = useQuery({
    queryKey: ["listSalaryRecords", state?.divisoinId, state?.month, state?.year, page, 20, undefined, true],
    queryFn: () =>
      listSalaryRecords({
        divisionId: state?.divisoinId,
        month: state?.month,
        year: state?.year,
        page: page,
        pageSize: 20,
        joinUser: true,
      }),
    select: (res) => {
      return {
        ...res.data,
        data: res.data.data.map((item) => ({
          ...item,
          salaryBasic: convertToRupees(item.salaryBasic),
          salaryBudgeted: convertToRupees(item.salaryBudgeted),
          salaryWages: convertToRupees(item.salaryWages),
          salaryAllowance: convertToRupees(item.salaryAllowance),
          salaryVehicleAllowance: convertToRupees(item.salaryVehicleAllowance),
          salaryTravelAllowance: convertToRupees(item.salaryTravelAllowance),
          salaryBata: convertToRupees(item.salaryBata),
          salaryOutstation: convertToRupees(item.salaryOutstation),
          salaryOt: convertToRupees(item.salaryOt),
          salaryTotal: convertToRupees(item.salaryTotal),
          deductionEpf8: convertToRupees(item.deductionEpf8),
          deductionEpf12: convertToRupees(item.deductionEpf12),
          deductionEtf: convertToRupees(item.deductionEtf),
          deductionNoPay: convertToRupees(item.deductionNoPay),
          deductionLoan: convertToRupees(item.deductionLoan),
          deductionAdvance: convertToRupees(item.deductionAdvance),
          deductionPayee: convertToRupees(item.deductionPayee),
          deductionOther: convertToRupees(item.deductionOther),
          deductionTotal: convertToRupees(item.deductionTotal),
          finalTotal: convertToRupees(item.finalTotal),
        })),
      };
    },
  });

  const updateSalaraRecords = useMutation({
    mutationFn: updateSalaryRecords,
  });

  useEffect(() => {
    if (salaryRecords.data?.totalCount && salaryRecords.data.totalCount !== count) {
      setCount(salaryRecords.data.totalCount);
    }
  }, [salaryRecords.data?.totalCount, count]);

  // Validation schema for Formik
  const editableFields = [
    "salaryBata",
    "salaryOutstation",
    "salaryOt",
    "deductionEpf12",
    "deductionEtf",
    "deductionEpf8",
    "deductionNoPay",
    "deductionLoan",
    "deductionAdvance",
    "deductionPayee",
    "deductionOther",
  ];

  const paysheetValidation = Yup.array().of(
    Yup.object(
      editableFields.reduce((acc, field) => {
        acc[field] = Yup.number().typeError("Must be a number").required("Required").min(0, "Must be greater than or equal to 0");
        return acc;
      }, {} as Record<string, any>)
    )
  );

  const FORM_VALIDATION = Yup.object().shape({
    paysheet: paysheetValidation,
  });

  const handleSalaryChange = (field: string, value: string | number, setFieldValue: (field: string, value: any) => void, values, index) => {
    const numericValue = Number(value);
    const fieldName = field.split(".")[1];

    setFieldValue(field, numericValue);

    const total =
      values.salaryTotal +
      (fieldName === "salaryBata" ? numericValue : values.salaryBata) +
      (fieldName === "salaryOt" ? numericValue : values.salaryOt) +
      (fieldName === "salaryOutstation" ? numericValue : values.salaryOutstation) -
      (fieldName === "deductionEpf8" ? numericValue : values.deductionEpf8) -
      (fieldName === "deductionAdvance" ? numericValue : values.deductionAdvance) -
      (fieldName === "deductionLoan" ? numericValue : values.deductionLoan) -
      (fieldName === "deductionNoPay" ? numericValue : values.deductionNoPay) -
      (fieldName === "deductionPayee" ? numericValue : values.deductionPayee) -
      (fieldName === "deductionOther" ? numericValue : values.deductionOther);

    setFieldValue(`paysheet[${index}].finalTotal`, total);

    console.log(values);
  };

  return (
    <Grid container justifyContent="center" spacing={gridSpacing}>
      <Grid item lg={12} md={12} sm={12} xs={12}>
        <PageHeaders headerTitle="Employee Payroll" HeaderIcon={<AccountBalanceIcon />} />
      </Grid>
      <Grid item xs={12}>
        <MainCard>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h4" fontWeight="bold" color={theme.palette.text.secondary}>
                  Month : {dayjs().set("year", state?.year).set("month", state?.month).format("MMMM YYYY")}
                </Typography>
              </Grid>
              <Grid item>
                <Pagination
                  count={Math.ceil((salaryRecords.data?.totalCount || 0) / 20)}
                  page={page + 1}
                  onChange={(_, value) => setPage(value - 1)}
                  shape="rounded"
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              {/* Show loading or error */}
              {salaryRecords.isLoading ? (
                <Grid container justifyContent="center" alignItems="center" style={{ minHeight: 200 }}>
                  <CircularProgress />
                </Grid>
              ) : salaryRecords.isError ? (
                <Typography color="error">Failed to load salary records.</Typography>
              ) : (
                <>
                  {salaryRecords.data?.data && salaryRecords.data.data.length > 0 ? (
                    <Formik
                      validateOnMount={true}
                      enableReinitialize
                      initialValues={{ paysheet: salaryRecords.data.data }}
                      validationSchema={FORM_VALIDATION}
                      onSubmit={(values, { setSubmitting }) => {
                        setIsLoading(true);
                        updateSalaraRecords.mutate(
                          values.paysheet.map((item) => ({
                            id: item?.id,
                            salaryBasic: convertToCents(item.salaryBasic),
                            salaryBudgeted: convertToCents(item.salaryBudgeted),
                            salaryWages: convertToCents(item.salaryWages),
                            salaryAllowance: convertToCents(item.salaryAllowance),
                            salaryVehicleAllowance: convertToCents(item.salaryVehicleAllowance),
                            salaryTravelAllowance: convertToCents(item.salaryTravelAllowance),
                            salaryBata: convertToCents(item.salaryBata),
                            salaryOutstation: convertToCents(item.salaryOutstation),
                            salaryOt: convertToCents(item.salaryOt),
                            deductionEpf8: convertToCents(item.deductionEpf8),
                            deductionEpf12: convertToCents(item.deductionEpf12),
                            deductionEtf: convertToCents(item.deductionEtf),
                            deductionNoPay: convertToCents(item.deductionNoPay),
                            deductionLoan: convertToCents(item.deductionLoan),
                            deductionAdvance: convertToCents(item.deductionAdvance),
                            deductionPayee: convertToCents(item.deductionPayee),
                            deductionOther: convertToCents(item.deductionOther),
                          })),
                          {
                            onSuccess: () => {
                              setSubmitting(false);
                              setIsLoading(false);
                              openSuccessDialog("Success", "Employee salary records updated successfully.");
                              salaryRecords.refetch();
                            },
                            onError: (error) => {
                              setSubmitting(false);
                              setIsLoading(false);
                              console.error("Error updating salary records:", error);
                            },
                          }
                        );
                      }}
                    >
                      {({ isValid, isSubmitting, dirty, setFieldValue, values }) => (
                        <Form>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Stack direction={"row"} justifyContent={"space-between"}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  Salary Records
                                </Typography>
                                {props.access[2] === "1" && (
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    disabled={!isValid || isSubmitting || !dirty}
                                    startIcon={
                                      isLoading && (
                                        <CircularProgress
                                          size={"20px"}
                                          sx={{
                                            mr: 1,
                                            color: "gray",
                                          }}
                                        />
                                      )
                                    }
                                  >
                                    Update Salary Records
                                  </Button>
                                )}
                              </Stack>
                            </Grid>
                            <Grid item xs={12}>
                              <Box sx={{ overflowX: "auto" }}>
                                <Table sx={{ minWidth: 1200 }} size="small">
                                  <TableHead>
                                    {/* Table header rows definition */}
                                    <TableRow>
                                      <TableCell sx={{ position: "sticky", left: 0, zIndex: 1, minWidth: 200 }} rowSpan={2}>
                                        Employee
                                      </TableCell>
                                      <TableCell sx={{ minWidth: 150 }} rowSpan={2}>
                                        Last Updated At
                                      </TableCell>
                                      <TableCell sx={{ minWidth: 100 }} rowSpan={2} align="right">
                                        Basic
                                      </TableCell>
                                      <TableCell sx={{ minWidth: 400 }} colSpan={4} align="center">
                                        Allowance
                                      </TableCell>
                                      <TableCell sx={{ minWidth: 100 }} rowSpan={2} align="right">
                                        Wages
                                      </TableCell>
                                      <TableCell sx={{ minWidth: 100 }} rowSpan={2} align="right">
                                        Gross
                                      </TableCell>
                                      <TableCell sx={{ minWidth: 100 }} rowSpan={2} align="right">
                                        Bata
                                      </TableCell>
                                      <TableCell sx={{ minWidth: 100 }} rowSpan={2} align="right">
                                        Outstation
                                      </TableCell>
                                      <TableCell sx={{ minWidth: 100 }} rowSpan={2} align="right">
                                        OT
                                      </TableCell>
                                      <TableCell sx={{ minWidth: 100 }} rowSpan={2} align="right">
                                        EPF 12%
                                      </TableCell>
                                      <TableCell sx={{ minWidth: 100 }} rowSpan={2} align="right">
                                        ETF
                                      </TableCell>
                                      <TableCell sx={{ minWidth: 300 }} colSpan={6} align="center">
                                        Deduction
                                      </TableCell>
                                      <TableCell sx={{ minWidth: 100 }} rowSpan={2} align="right">
                                        Total Deduction
                                      </TableCell>
                                      <TableCell sx={{ minWidth: 100 }} rowSpan={2} align="right">
                                        Salary
                                      </TableCell>
                                    </TableRow>
                                    <TableRow>
                                      {["Budgeted", "Allowance", "Vehicle", "Travel"].map((label) => (
                                        <TableCell key={label} sx={{ minWidth: 100 }} align="right">
                                          {label}
                                        </TableCell>
                                      ))}
                                      {["EPF 8%", "No Pay", "Loan", "Advance", "Payee", "Other"].map((label) => (
                                        <TableCell key={label} sx={{ minWidth: 100 }} align="right">
                                          {label}
                                        </TableCell>
                                      ))}
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {salaryRecords.data.data.map((item, idx) => (
                                      <TableRow key={idx}>
                                        <TableCell
                                          sx={{
                                            position: "sticky",
                                            left: 0,
                                            backgroundColor: idx % 2 === 0 ? theme.palette.grey[100] : theme.palette.background.paper,
                                            zIndex: 1,
                                          }}
                                        >
                                          <Stack direction="column">
                                            <Typography variant="caption" fontWeight="bold">
                                              {item.user?.employeeNumber}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                              {item.user?.nameInitials}
                                            </Typography>
                                          </Stack>
                                        </TableCell>
                                        <TableCell>
                                          <Typography variant="caption">{dayjs(item.updatedAt).format("D MMM - hh:mm:ss a")}</Typography>
                                        </TableCell>
                                        <TableCell align="right">{currencyFormat(item.salaryBasic, "", 2)}</TableCell>

                                        {[item.salaryBudgeted, item.salaryAllowance, item.salaryVehicleAllowance, item.salaryTravelAllowance].map(
                                          (val, i) => (
                                            <TableCell key={i} align="right">
                                              {currencyFormat(val, "", 2)}
                                            </TableCell>
                                          )
                                        )}
                                        <TableCell align="right">{currencyFormat(item.salaryWages, "", 2)}</TableCell>
                                        <TableCell align="right" sx={{ backgroundColor: theme.palette.grey[300] }}>
                                          {currencyFormat(item.salaryTotal, "", 2)}
                                        </TableCell>
                                        {/* Editable columns start */}
                                        {[
                                          { name: `paysheet[${idx}].salaryBata`, sx: {} },
                                          { name: `paysheet[${idx}].salaryOutstation`, sx: {} },
                                          { name: `paysheet[${idx}].salaryOt`, sx: {} },
                                          { name: `paysheet[${idx}].deductionEpf12`, sx: {} },
                                          { name: `paysheet[${idx}].deductionEtf`, sx: {} },
                                          { name: `paysheet[${idx}].deductionEpf8`, sx: { backgroundColor: theme.palette.red[200] } },
                                          { name: `paysheet[${idx}].deductionNoPay`, sx: { backgroundColor: theme.palette.red[200] } },
                                          { name: `paysheet[${idx}].deductionLoan`, sx: { backgroundColor: theme.palette.red[200] } },
                                          { name: `paysheet[${idx}].deductionAdvance`, sx: { backgroundColor: theme.palette.red[200] } },
                                          { name: `paysheet[${idx}].deductionPayee`, sx: { backgroundColor: theme.palette.red[200] } },
                                          { name: `paysheet[${idx}].deductionOther`, sx: { backgroundColor: theme.palette.red[200] } },
                                        ].map((field) => (
                                          <TableCell align="right" key={field.name} sx={field.sx}>
                                            <TextField
                                              name={field.name}
                                              type="text"
                                              onInput={(e) => {
                                                const input = e.target as HTMLInputElement;
                                                input.value = input.value.replace(/\D/g, "");
                                              }}
                                              size="small"
                                              variant="standard"
                                              onChange={(e) =>
                                                handleSalaryChange(field.name, e.target.value, setFieldValue, values.paysheet[idx], idx)
                                              }
                                            />
                                          </TableCell>
                                        ))}
                                        {/* End editable columns */}
                                        <TableCell align="right" sx={{ backgroundColor: theme.palette.red[200] }}>
                                          {currencyFormat(item.deductionTotal, "", 2)}
                                        </TableCell>
                                        <TableCell
                                          align="right"
                                          sx={{
                                            backgroundColor: theme.palette.green.light,
                                            borderLeft: "1px solid",
                                            borderColor: theme.palette.primary.main,
                                          }}
                                        >
                                          {currencyFormat(values.paysheet[idx].finalTotal, "", 2)}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </Box>
                            </Grid>
                          </Grid>
                        </Form>
                      )}
                    </Formik>
                  ) : (
                    <Typography>No salary records found.</Typography>
                  )}
                </>
              )}
            </Grid>
          </Grid>
        </MainCard>
      </Grid>
    </Grid>
  );
}

export default BulkUpdateSalaryRecords;
