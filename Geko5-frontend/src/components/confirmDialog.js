import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import {strings} from '../strings'
import { Check, Close } from '@mui/icons-material';


export default function ConfirmDialog(props) {
    
    const {actionFuncion, setActionFuncion} = props;

    const {
        title = strings.confirm,
        body = strings.deleteConfirm
    } = props;


    return (

        <Dialog
            open={actionFuncion !== null}
            onClose={(event, reason) => { if (reason && reason === "backdropClick") return; setActionFuncion(null) }}
            aria-labelledby="draggable-dialog-title"
            fullWidth={true}
        >
            <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                {body}
            </DialogContent>

            <DialogActions>
                <Button variant="contained" color="error" endIcon={<Close />} onClick={e => setActionFuncion(null)}>{strings.cancel}</Button>
                <Button variant="contained" color="primary" endIcon={<Check />} onClick={() => actionFuncion.f( actionFuncion.id ) }>{strings.delete}</Button>
            </DialogActions>
        </Dialog>
    )
}