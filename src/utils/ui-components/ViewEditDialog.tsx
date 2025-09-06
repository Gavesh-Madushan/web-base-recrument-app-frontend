import {Button, Dialog, DialogActions, DialogContent, Divider, Typography} from "@mui/material";
import React from "react";
import Slide from "@mui/material/Slide";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import {TransitionProps} from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const ViewEditDialog = (Component: any) => ({
                                                open,
                                                setOpen,
                                                dialogTitle,
                                                initialItem,
                                                id,
                                                fetchData,
                                                initialData,
                                                theme,
                                                maxWidth,
                                            }: any) => {
    const handleClose = () => {
        setOpen(false);
    };

    return <Dialog
        maxWidth={maxWidth}
        fullWidth={true}
        open={open}
        onClose={handleClose}
        PaperProps={{
            style: {
                borderRadius: 15,
                boxShadow: "none",
            },
        }}
        TransitionComponent={Transition}
    >
        <DialogTitle {...{component: 'div'}}><Typography
            sx={{color: theme.palette.primary.main}}
            variant="h4"
        >
            {dialogTitle}
        </Typography>
        </DialogTitle>
        <Divider/>
        <DialogContent>
            <Component initialItem={initialItem} setOpen={setOpen} fetchData={fetchData}
                       initialData={initialData} theme={theme} id={id}/>
        </DialogContent>
        <Divider/>
        <DialogActions>
            <Button onClick={handleClose} variant="outlined">Close</Button>
        </DialogActions>
    </Dialog>;
};

export default ViewEditDialog;

ViewEditDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    dialogTitle: PropTypes.string.isRequired,
    initialItem: PropTypes.object.isRequired,
    fetchData: PropTypes.func,
    initialData: PropTypes.any,
    theme: PropTypes.func.isRequired
}