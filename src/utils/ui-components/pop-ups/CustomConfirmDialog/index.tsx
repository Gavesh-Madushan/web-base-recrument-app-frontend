import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import CancelIcon from "@mui/icons-material/Cancel";
import { Form, Formik, FormikValues } from "formik";
import * as Yup from "yup";
import { Box, CircularProgress, Container, Grid } from "@mui/material";
import { create } from "zustand";
import {
  ModelButton,
  ModelClose,
  ModelContentText,
  ModelTitle,
  StatusIcon,
} from "../styles";

type CustomConfirmDialogStore = {
  title: string;
  message: string;
  data: any;
  onSubmit?: (p: any, values: FormikValues, setSubmitting: any) => void;
  confirmBtnDisable?: boolean;
  initialFormState?: object;
  formValidation?: Yup.AnySchema;
  Component?: any;
  close: boolean;
  handleExited?: () => void;
};

const useCustomConfirmDialogStore = create<CustomConfirmDialogStore>((set) => ({
  title: "",
  message: "",
  data: undefined,
  onSubmit: undefined,
  checkBtnDisable: false,
  initialFormState: undefined,
  formValidation: undefined,
  Component: () => {},
  close: false,
  handleExited: () => {},
}));

export const openCustomConfirmDialog = ({
  title,
  message,
  data,
  onSubmit,
  confirmBtnDisable,
  initialFormState,
  formValidation,
  Component,
  close,
  handleExited,
}: CustomConfirmDialogStore) => {
  useCustomConfirmDialogStore.setState({
    title: title,
    message: message,
    data: data,
    onSubmit: onSubmit,
    confirmBtnDisable: confirmBtnDisable,
    Component: Component,
    initialFormState: initialFormState,
    formValidation: formValidation,
    close: close,
    handleExited: handleExited,
  });
};

export const disableBtnCustomConfirmDialog = (val: boolean) => {
  useCustomConfirmDialogStore.setState({
    confirmBtnDisable: val,
  });
};

export const closeCustomConfirmDialog = () => {
  useCustomConfirmDialogStore.setState({
    close: false,
  });
};

const CustomConfirmDialog: React.FC = () => {
  const {
    title,
    message,
    data,
    onSubmit,
    confirmBtnDisable,
    Component,
    initialFormState,
    formValidation,
    close,
    handleExited,
  } = useCustomConfirmDialogStore();

  const handleClose = () => {
    useCustomConfirmDialogStore.setState({
      close: false,
    });
  };

  return (
    <Box>
      <Dialog
        open={close}
        onClose={handleClose}
        onTransitionExited={handleExited}
        fullWidth={true}
        PaperProps={{
          style: { borderRadius: 15 },
        }}
      >
        <ModelClose color="warning" onClick={handleClose}>
          <CancelIcon />
        </ModelClose>
        <Container>
          <Grid
            container
            style={{ marginTop: "40px", justifyContent: "center" }}
            direction="row"
          >
            <Grid item>
              <StatusIcon color="warning">error</StatusIcon>
            </Grid>
          </Grid>
        </Container>
        <Formik
          initialValues={{
            ...initialFormState,
          }}
          validationSchema={formValidation}
          onSubmit={(values, { setSubmitting }) => {
            if (onSubmit) {
              onSubmit(data, values, setSubmitting);
            }
          }}
          enableReinitialize
        >
          {({ values, isSubmitting }) => (
            <Form>
              <ModelTitle color="warning">{title}</ModelTitle>
              <DialogContent style={{ textAlign: "center" }}>
                <ModelContentText>{message}</ModelContentText>
                <Component values={values} />
              </DialogContent>
              <DialogActions
                style={{ display: "flex", justifyContent: "center" }}
              >
                <ModelButton
                  onClick={handleClose}
                  variant="outlined"
                  color="primary"
                >
                  Cancel
                </ModelButton>
                <Box style={{ width: 10 }} />
                <ModelButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={confirmBtnDisable || isSubmitting}
                  startIcon={
                    isSubmitting && (
                      <CircularProgress
                        color="inherit"
                        sx={{ mr: 1 }}
                        size={20}
                      />
                    )
                  }
                >
                  Confirm
                </ModelButton>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Box>
  );
};

export default CustomConfirmDialog;
