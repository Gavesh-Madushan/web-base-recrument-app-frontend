import * as React from "react";
import MuiAlert, { AlertColor, AlertProps } from "@mui/material/Alert";
import { Snackbar } from "@mui/material";
import { create } from "zustand";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type SnackBarStore = {
  message: string;
  severity: AlertColor;
  autoHideDuration: number;
  open: boolean;
};

const useSnackBarStore = create<SnackBarStore>((set) => ({
  message: "",
  severity: "success",
  autoHideDuration: 6000,
  open: false,
}));

export const openSnackBar = (
  message: string,
  severity: AlertColor,
  autoHideDuration: number
) => {
  useSnackBarStore.setState({
    message: message,
    severity: severity,
    autoHideDuration: autoHideDuration,
    open: true,
  });
};

export const closeSnackBar = () => {
  useSnackBarStore.setState({
    open: false,
  });
};

export default function CustomizedSnackbar() {
  const { message, severity, autoHideDuration, open } = useSnackBarStore();

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    useSnackBarStore.setState({
      open: false,
    });
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
}
