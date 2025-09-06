import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import CancelIcon from "@mui/icons-material/Cancel";
import {Container, Grid} from "@mui/material";
import {create} from "zustand";
import {ModelButton, ModelClose, ModelContentText, ModelTitle, StatusIcon} from "../styles";

type SuccessDialogStore = {
    title: string;
    message: string;
    close: boolean;
};

const useSuccessDialogStore = create<SuccessDialogStore>((set) => ({
    title: "",
    message: "",
    close: false,
}));

export const openSuccessDialog = (title: string, message: string) => {
    useSuccessDialogStore.setState({
        title: title,
        message: message,
        close: true,
    });
};

export const closeSuccessDialog = () => {
    useSuccessDialogStore.setState({
        close: false,
    });
};

const SuccessDialog = () => {
    const {title, message, close} = useSuccessDialogStore();

    const handleClose = () => {
        useSuccessDialogStore.setState({
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
                    style: {borderRadius: 15},
                }}
            >
                <ModelClose
                    color="success"
                    onClick={handleClose}
                >
                    <CancelIcon/>
                </ModelClose>
                <Container>
                    <Grid
                        container
                        style={{marginTop: "40px", justifyContent: "center"}}
                        direction="row"
                    >
                        <Grid item>
                            <StatusIcon color="success">check_circle</StatusIcon>
                        </Grid>
                    </Grid>
                </Container>
                <ModelTitle color="success">{title}</ModelTitle>
                <DialogContent style={{textAlign: "center"}}>
                    <ModelContentText dangerouslySetInnerHTML={{ __html: message }} />
                    {/* <ModelContentText>{message}</ModelContentText> */}
                </DialogContent>
                <DialogActions style={{display: "flex", justifyContent: "center"}}>
                    <ModelButton
                        onClick={handleClose}
                        variant="contained"
                        color="success"
                    >
                        OK
                    </ModelButton>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SuccessDialog;
