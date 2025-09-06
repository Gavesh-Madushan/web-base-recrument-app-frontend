import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import CancelIcon from "@mui/icons-material/Cancel";
import Stack from "@mui/material/Stack";
import {Form, Formik, FormikValues} from "formik";
import * as Yup from "yup";
import {Box, Container, Grid} from "@mui/material";
import {create} from "zustand";
import TextField from "../../FormsUI/TextField";
import {ModelButton, ModelClose, ModelContentText, ModelTitle, StatusIcon} from "../styles";

type ConfirmWithCommentDialogStore = {
    title: string;
    message: string;
    data: any;
    onSubmit?: (p: any, values: FormikValues) => void;
    confirmBtnDisable?: boolean,
    close: boolean;
};

const useConfirmWithCommentDialogStore = create<ConfirmWithCommentDialogStore>((set) => ({
    title: "",
    message: "",
    data: undefined,
    onSubmit: undefined,
    checkBtnDisable: false,
    close: false,
}));

export const openConfirmWithCommentDialog = (
    title: string,
    message: string,
    data: any,
    onSubmit?: (p: any, values: any) => void,
) => {
    useConfirmWithCommentDialogStore.setState({
        title: title,
        message: message,
        data: data,
        onSubmit: onSubmit,
        confirmBtnDisable: false,
        close: true,
    });
};

export const disableBtnConfirmWithCommentDialog = (val: boolean) => {
    useConfirmWithCommentDialogStore.setState({
        confirmBtnDisable: val,
    });
};

export const closeConfirmWithCommentDialog = () => {
    useConfirmWithCommentDialogStore.setState({
        close: false,
    });
};

const ConfirmWithCommentDialog: React.FC = () => {
    const {title, message, data, onSubmit, confirmBtnDisable, close} = useConfirmWithCommentDialogStore();


    const INITIAL_FORM_STATE = {
        comment: "",
    };

    const FORM_VALIDATION = Yup.object().shape({
        comment: Yup.string().required("Please Enter your comment here"),
    });

    const handleClose = () => {
        useConfirmWithCommentDialogStore.setState({
            close: false,
        });
    };

    return (
        <Box>
            <Dialog
                open={close}
                onClose={handleClose}
                fullWidth={true}
                PaperProps={{
                    style: {borderRadius: 15},
                }}
            >
                <ModelClose
                    color="warning"
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
                            <StatusIcon color="warning">error</StatusIcon>
                        </Grid>
                    </Grid>
                </Container>
                <Formik
                    initialValues={{
                        ...INITIAL_FORM_STATE,
                    }}
                    validationSchema={FORM_VALIDATION}
                    onSubmit={(values) => {
                        if (onSubmit) {
                            onSubmit(data, values);
                        }
                    }}
                >
                    <Form>
                        <ModelTitle color="warning">{title}</ModelTitle>
                        <DialogContent style={{textAlign: "center"}}>
                            <ModelContentText>{message}</ModelContentText>

                            <Stack direction="row" margin={"15px 0px 15px 0px"}>
                                <TextField
                                    type={"text"}
                                    name="comment"
                                    label="Comment"
                                    placeholder="Comment"
                                />
                            </Stack>
                        </DialogContent>
                        <DialogActions
                            style={{display: "flex", justifyContent: "center"}}
                        >
                            <ModelButton
                                onClick={handleClose}
                                variant="outlined"
                                color='warning'
                            >
                                Cancel
                            </ModelButton>
                            <Box style={{width: 10}}/>
                            <ModelButton
                                type="submit"
                                variant="contained"
                                color='warning'
                                disabled={confirmBtnDisable}
                            >
                                Confirm
                            </ModelButton>
                        </DialogActions>
                    </Form>
                </Formik>
            </Dialog>
        </Box>
    );
};

export default ConfirmWithCommentDialog;
