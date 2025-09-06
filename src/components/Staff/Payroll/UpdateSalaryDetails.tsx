import * as Yup from "yup";
import { Form, Formik } from "formik";
import { Button, CircularProgress, Grid, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { gridSpacing } from "../../../store/constants";
import { useState } from "react";

// custom components
import TextField from "../../../utils/ui-components/FormsUI/TextField";

// mui icons
import { openSuccessDialog } from "../../../utils/ui-components/pop-ups/SuccessDialog";
import { applyGlobalValidations, convertToCents, currencyFormat } from "../../../utils/utils";
import { updateSalaryRecord } from "../../../assets/api";
import { useMutation } from "@tanstack/react-query";
import { SalaryInterface } from "./PayrollList";

function UpdateSalaryDetails({
  initialItem,
  fetchData,
  setOpen,
}: {
  initialItem: SalaryInterface;
  initialData: object;
  fetchData: () => void;
  setOpen: (boolean) => void;
}) {
  const theme: any = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));

  const [isLoading, setIsLoading] = useState(false);

  const updateSalary = useMutation({
    mutationFn: updateSalaryRecord,
  });

  const FORM_VALIDATION = Yup.object().shape({
    // salaryBasic: Yup.number().min(0).required("Please enter basic salary"),
    // salaryBudgeted: Yup.number().min(0).required("Please enter Budgeted Allowance"),
    // salaryWages: Yup.number().min(0).required("Please enter Wage  salary"),
    // salaryAllowance: Yup.number().min(0).required("Please enter Allowance"),
    // salaryVehicleAllowance: Yup.number().min(0).required("Please enter Vehicle Allowance"),
    // salaryTravelAllowance: Yup.number().min(0).required("Please enter Travel Allowance"),
    salaryBata: Yup.number().min(0).required("Please enter bata"),
    salaryOutstation: Yup.number().min(0).required("Please enter outstation"),
    salaryOt: Yup.number().min(0).required("Please enter OT salary"),
    // salaryTotal: Yup.number().min(0).required("Please enter Gross salary"),
    deductionEpf8: Yup.number().min(0).required("Please enter EPF 8%"),
    deductionEpf12: Yup.number().min(0).required("Please enter EPF 12%"),
    deductionEtf: Yup.number().min(0).required("Please enter ETF"),
    deductionNoPay: Yup.number().min(0).required("Please enter nopay deduction"),
    deductionLoan: Yup.number().min(0).required("Please enter loan deduction"),
    deductionAdvance: Yup.number().min(0).required("Please enter advance deduction"),
    deductionPayee: Yup.number().min(0).required("Please enter payee deduction"),
    deductionOther: Yup.number().min(0).required("Please enter other deduction"),
    comment: Yup.string().max(100, "Maximum limit reached: Please enter no more than 100 characters.").required("Comment is required"),
  });

  const handleSalaryChange = (field: string, value: string | number, setFieldValue: (field: string, value: any) => void, values: SalaryInterface) => {
    const numericValue = Number(value);

    setFieldValue(field, numericValue);

    const total =
      values.salaryTotal +
      (field === "salaryBata" ? numericValue : values.salaryBata) +
      (field === "salaryOt" ? numericValue : values.salaryOt) +
      (field === "salaryOutstation" ? numericValue : values.salaryOutstation) -
      (field === "deductionEpf8" ? numericValue : values.deductionEpf8) -
      // (field === "deductionEpf12" ? numericValue : values.deductionEpf12) -
      // (field === "deductionEtf" ? numericValue : values.deductionEtf) -
      (field === "deductionAdvance" ? numericValue : values.deductionAdvance) -
      (field === "deductionLoan" ? numericValue : values.deductionLoan) -
      (field === "deductionNoPay" ? numericValue : values.deductionNoPay) -
      (field === "deductionPayee" ? numericValue : values.deductionPayee) -
      (field === "deductionOther" ? numericValue : values.deductionOther);

    setFieldValue("finalTotal", total);
  };

  return (
    <Grid container justifyContent="center" spacing={gridSpacing}>
      <Grid item xs={12}>
        <Formik
          validateOnMount={true}
          enableReinitialize
          initialValues={initialItem}
          validationSchema={applyGlobalValidations(FORM_VALIDATION)}
          onSubmit={(values, { setSubmitting }) => {
            setIsLoading(true);
            updateSalary.mutate(
              {
                ...values,
                salaryBasic: convertToCents(values.salaryBasic),
                salaryBudgeted: convertToCents(values.salaryBudgeted),
                salaryWages: convertToCents(values.salaryWages),
                salaryAllowance: convertToCents(values.salaryAllowance),
                salaryVehicleAllowance: convertToCents(values.salaryVehicleAllowance),
                salaryTravelAllowance: convertToCents(values.salaryTravelAllowance),
                salaryBata: convertToCents(values.salaryBata),
                salaryOutstation: convertToCents(values.salaryOutstation),
                salaryOt: convertToCents(values.salaryOt),
                deductionEpf8: convertToCents(values.deductionEpf8),
                deductionEpf12: convertToCents(values.deductionEpf12),
                deductionEtf: convertToCents(values.deductionEtf),
                deductionNoPay: convertToCents(values.deductionNoPay),
                deductionLoan: convertToCents(values.deductionLoan),
                deductionAdvance: convertToCents(values.deductionAdvance),
                deductionPayee: convertToCents(values.deductionPayee),
                deductionOther: convertToCents(values.deductionOther),
              },
              {
                onSuccess: () => {
                  openSuccessDialog("Success", `Employee salary updated successfully`);
                  setIsLoading(false);
                  setOpen(false);
                  fetchData();
                },
                onError: () => {
                  setSubmitting(false);
                  setIsLoading(false);
                },
              }
            );
          }}
        >
          {({ values, dirty, isSubmitting, isValid, setFieldValue }) => (
            <Form>
              <Grid container columnSpacing={1}>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Stack direction={"row"} justifyContent={"space-between"} px={1}>
                      <Typography variant="caption" fontWeight={"bold"}>
                        Basic Salary
                      </Typography>
                      <Typography variant="caption" fontWeight={"bold"}>
                        {currencyFormat(values.salaryBasic, "", 2)}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction={"row"} justifyContent={"space-between"} px={1}>
                      <Typography variant="caption" fontWeight={"bold"}>
                        Budgeted Allowance
                      </Typography>
                      <Typography variant="caption" fontWeight={"bold"}>
                        {currencyFormat(values.salaryBudgeted, "", 2)}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction={"row"} justifyContent={"space-between"} px={1}>
                      <Typography variant="caption" fontWeight={"bold"}>
                        Console Basic Salary
                      </Typography>
                      <Typography variant="caption" fontWeight={"bold"} sx={{ borderTop: "1px solid" }}>
                        {currencyFormat(values.salaryBudgeted + values.salaryBasic, "", 2)}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction={"row"} justifyContent={"space-between"} px={1}>
                      <Typography variant="caption" fontWeight={"bold"}>
                        Wage Salary
                      </Typography>
                      <Typography variant="caption" fontWeight={"bold"}>
                        {currencyFormat(values.salaryWages, "", 2)}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction={"row"} justifyContent={"space-between"} px={1}>
                      <Typography variant="caption" fontWeight={"bold"}>
                        Allowance
                      </Typography>
                      <Typography variant="caption" fontWeight={"bold"}>
                        {currencyFormat(values.salaryAllowance, "", 2)}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction={"row"} justifyContent={"space-between"} px={1}>
                      <Typography variant="caption" fontWeight={"bold"}>
                        Vehicle Allowance
                      </Typography>
                      <Typography variant="caption" fontWeight={"bold"}>
                        {currencyFormat(values.salaryVehicleAllowance, "", 2)}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction={"row"} justifyContent={"space-between"} px={1}>
                      <Typography variant="caption" fontWeight={"bold"}>
                        Travel Allowance
                      </Typography>
                      <Typography variant="caption" fontWeight={"bold"}>
                        {currencyFormat(values.salaryTravelAllowance, "", 2)}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction={"row"} justifyContent={"space-between"} px={1}>
                      <Typography variant="caption" fontWeight={"bold"}>
                        Gross Salary
                      </Typography>
                      <Typography variant="caption" fontWeight={"bold"} sx={{ borderTop: "1px solid" }}>
                        {currencyFormat(values.salaryTotal, "", 2)}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction={"row"} justifyContent={"space-between"} px={1}>
                      <Typography variant="caption" fontWeight={"bold"}>
                        Bata
                      </Typography>
                      <TextField
                        required
                        name="salaryBata"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");
                        }}
                        onChange={(e) => handleSalaryChange("salaryBata", e.target.value, setFieldValue, values)}
                        variant="standard"
                        sx={{
                          width: "100px",
                        }}
                        size="small"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction={"row"} justifyContent={"space-between"} px={1}>
                      <Typography variant="caption" fontWeight={"bold"}>
                        OT
                      </Typography>
                      <TextField
                        required
                        name="salaryOt"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");
                        }}
                        variant="standard"
                        sx={{
                          width: "100px",
                        }}
                        onChange={(e) => handleSalaryChange("salaryOt", e.target.value, setFieldValue, values)}
                        size="small"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction={"row"} justifyContent={"space-between"} px={1}>
                      <Typography variant="caption" fontWeight={"bold"}>
                        Outstation
                      </Typography>
                      <TextField
                        required
                        name="salaryOutstation"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");
                        }}
                        variant="standard"
                        sx={{
                          width: "100px",
                        }}
                        onChange={(e) => handleSalaryChange("salaryOutstation", e.target.value, setFieldValue, values)}
                        size="small"
                      />
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <Stack direction={"row"} justifyContent={"space-between"} px={1}>
                      <Typography variant="caption" fontWeight={"bold"}>
                        ETF
                      </Typography>
                      <TextField
                        required
                        name="deductionEtf"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");
                        }}
                        variant="standard"
                        onChange={(e) => handleSalaryChange("deductionEtf", e.target.value, setFieldValue, values)}
                        size="small"
                        sx={{
                          width: "100px",
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction={"row"} justifyContent={"space-between"} px={1}>
                      <Typography variant="caption" fontWeight={"bold"}>
                        EPF(12%)
                      </Typography>
                      <TextField
                        required
                        name="deductionEpf12"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");
                        }}
                        variant="standard"
                        onChange={(e) => handleSalaryChange("deductionEpf12", e.target.value, setFieldValue, values)}
                        size="small"
                        sx={{
                          width: "100px",
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction={"row"} justifyContent={"space-between"} px={1}>
                      <Typography variant="caption" fontWeight={"bold"} color={"error"}>
                        EPF(8%)
                      </Typography>
                      <TextField
                        required
                        name="deductionEpf8"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");
                        }}
                        variant="standard"
                        sx={{
                          width: "100px",
                        }}
                        onChange={(e) => handleSalaryChange("deductionEpf8", e.target.value, setFieldValue, values)}
                        size="small"
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction={"row"} justifyContent={"space-between"} px={1}>
                      <Typography variant="caption" fontWeight={"bold"} color={"error"}>
                        Advance Deduction
                      </Typography>
                      <TextField
                        required
                        name="deductionAdvance"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");
                        }}
                        variant="standard"
                        onChange={(e) => handleSalaryChange("deductionAdvance", e.target.value, setFieldValue, values)}
                        size="small"
                        sx={{
                          width: "100px",
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction={"row"} justifyContent={"space-between"} px={1}>
                      <Typography variant="caption" fontWeight={"bold"} color={"error"}>
                        Loan Deduction
                      </Typography>
                      <TextField
                        required
                        name="deductionLoan"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");
                        }}
                        variant="standard"
                        onChange={(e) => handleSalaryChange("deductionLoan", e.target.value, setFieldValue, values)}
                        size="small"
                        sx={{
                          width: "100px",
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction={"row"} justifyContent={"space-between"} px={1}>
                      <Typography variant="caption" fontWeight={"bold"} color={"error"}>
                        NoPay Deduction
                      </Typography>
                      <TextField
                        required
                        name="deductionNoPay"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");
                        }}
                        variant="standard"
                        onChange={(e) => handleSalaryChange("deductionNoPay", e.target.value, setFieldValue, values)}
                        size="small"
                        sx={{
                          width: "100px",
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction={"row"} justifyContent={"space-between"} px={1}>
                      <Typography variant="caption" fontWeight={"bold"} color={"error"}>
                        Payee Deduction
                      </Typography>
                      <TextField
                        required
                        name="deductionPayee"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");
                        }}
                        variant="standard"
                        onChange={(e) => handleSalaryChange("deductionPayee", e.target.value, setFieldValue, values)}
                        size="small"
                        sx={{
                          width: "100px",
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction={"row"} justifyContent={"space-between"} px={1}>
                      <Typography variant="caption" fontWeight={"bold"} color={"error"}>
                        Other Deductions
                      </Typography>
                      <TextField
                        required
                        name="deductionOther"
                        type="number"
                        onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                          e.target.value = e.target.value.replace(/[^0-9]/g, "");
                        }}
                        variant="standard"
                        onChange={(e) => handleSalaryChange("deductionOther", e.target.value, setFieldValue, values)}
                        size="small"
                        sx={{
                          width: "100px",
                        }}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction={"row"} justifyContent={"space-between"} px={1} sx={{ borderTop: "1px solid", pt: 1 }}>
                      <Typography fontWeight={"bold"}>Employee Salary</Typography>
                      <Typography fontWeight={"bold"}>{currencyFormat(values.finalTotal, "LKR ", 2)}</Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField required label="Comment" name="comment" type="text" multiline />
                  </Grid>
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
                      Update Payesheet
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Grid>
    </Grid>
  );
}

export default UpdateSalaryDetails;
