import { Backdrop, CircularProgress } from "@mui/material";

export default function Loading({ open }) {
  return (
    <div>
      <Backdrop
        sx={{ color: "#087a75", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
