import { DataGrid } from "@mui/x-data-grid";
export default function DataTable({ rows, columns }) {
  return (
    <div style={{ height: 550, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={8}
        rowsPerPageOptions={[8]}
        key={(Math.floor(Math.random() * 100000) + 100000)
          .toString()
          .substring(1)}
      />
    </div>
  );
}
