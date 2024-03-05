import {FC} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

type ConfirmationDialogProps = {
    open: boolean;
    title: string;
    content: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmationDialog: FC<ConfirmationDialogProps> = (props: ConfirmationDialogProps) => {
    return (
        <Dialog
            open={props.open}
            onClose={props.onCancel}
            aria-labelledby={'alert-dialog-title'}
            aria-describedby={'alert-dialog-description'}
        >
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.content}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onCancel} color={'error'}>Cancel</Button>
                <Button onClick={props.onConfirm} color={'success'}>Confirm</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmationDialog;