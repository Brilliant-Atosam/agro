import TextField from "@mui/material/TextField";
export default function DatePicker({ value, event }) {
  return (
    <TextField
      id="date"
      label="Expiry date"
      type="date"
      onChange={event}
      placeholder="Expiry date"
      value={value}
      sx={{ width: "100%" }}
    />
  );
}
