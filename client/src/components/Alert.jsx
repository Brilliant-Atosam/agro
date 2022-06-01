import { Alert, IconButton, Collapse } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
export default function AlertComponent({ open, close, severity, message }) {
  return (
    <div className="alert">
      <Collapse in={open}>
        <Alert
          severity={severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={close}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
         {message}
        </Alert>
      </Collapse>
    </div>
  );
}
