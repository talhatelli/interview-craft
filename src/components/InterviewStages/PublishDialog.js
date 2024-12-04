import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { DIALOG_TEXT } from '../../constants/text';

export default function PublishDialog({ open, onClose, onConfirm, isEdit }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEdit ? DIALOG_TEXT.UPDATE_TITLE : DIALOG_TEXT.PUBLISH_TITLE}</DialogTitle>
      <DialogContent>
        <Typography>
          {isEdit ? DIALOG_TEXT.UPDATE_CONFIRM : DIALOG_TEXT.PUBLISH_CONFIRM}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {DIALOG_TEXT.CANCEL}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="primary"
          autoFocus
          sx={{
            backgroundColor: '#6200ee',
            '&:hover': {
              backgroundColor: '#6200ee',
              opacity: 0.9,
            }
          }}
        >
          {isEdit ? DIALOG_TEXT.UPDATE_CONFIRM_BUTTON : DIALOG_TEXT.PUBLISH_CONFIRM_BUTTON}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
