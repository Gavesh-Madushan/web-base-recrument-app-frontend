import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import CancelIcon from "@mui/icons-material/Cancel";
import { Container, Grid } from "@mui/material";
import { create } from "zustand";
import { ModelButton, ModelClose, ModelContentText, ModelTitle, StatusIcon } from "../styles";

type ErrorDialogStore = {
  title: string;
  message: string;
  close: boolean;
};

const useErrorDialogStore = create<ErrorDialogStore>((set) => ({
  title: "",
  message: "",
  close: false,
}));

export const openErrorDialog = (title: string, message: string) => {
  useErrorDialogStore.setState({
    title: title,
    message: message,
    close: true,
  });
};

export const closeErrorDialog = () => {
  useErrorDialogStore.setState({
    close: false,
  });
};

const ErrorDialog: React.FC = () => {
  const { title, message, close } = useErrorDialogStore();

  const handleClose = () => {
    useErrorDialogStore.setState({
      close: false,
    });
  };

  return (
    <div>
      <Dialog
        open={close}
        onClose={handleClose}
        fullWidth={true}
        PaperProps={{
          style: { borderRadius: 15 },
        }}
      >
        <ModelClose color="error" onClick={handleClose}>
          <CancelIcon />
        </ModelClose>
        <Container>
          <Grid container style={{ marginTop: "40px", justifyContent: "center" }} direction="row">
            <Grid item>
              <StatusIcon color="error">cancel</StatusIcon>
            </Grid>
          </Grid>
        </Container>
        <ModelTitle color="error">{title}</ModelTitle>
        <DialogContent style={{ textAlign: "center" }}>
          <ModelContentText>{message}</ModelContentText>
        </DialogContent>
        <DialogActions style={{ display: "flex", justifyContent: "center" }}>
          <ModelButton onClick={handleClose} variant="contained" color="error">
            OK
          </ModelButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ErrorDialog;
