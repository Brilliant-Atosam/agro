import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
export default function ResponsiveDialog({
  open,
  handleClose,
  event,
  title,
  DialContent,
  option1,
  option2,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
         {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{DialContent}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className="btn" onClick={handleClose}>
            {option1}
          </Button>
          <Button onClick={event}>
            {option2}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
