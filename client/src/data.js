import { CurrencyExchange, Visibility } from "@mui/icons-material";
export const itemsColumn = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "name", headerName: "Drug", width: 130 },
  { field: "stock", headerName: "Stock", width: 130 },
  { field: "price", headerName: "Price", width: 130 },
  {
    field: "action",
    headerName: "Action",
    width: 120,
    renderCell: (params) => (
      <div className="action-btn">
        <Visibility className="action-icon" />
        <CurrencyExchange className="action-icon" />
      </div>
    ),
  },
];
export const salesColumn = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "item_name", headerName: "Drug", width: 200 },
  { field: "quantity", headerName: "Qty", width: 40 },
  { field: "cost", headerName: "Cost", width: 130 },
  { field: "mode", headerName: "Issuer", width: 130 },
  {
    field: "createdAt",
    headerName: "Date",
    width: 180,
    renderCell: (params) => <>{params.row.createdAt}</>,
  },
];
export const itemSalesColumn = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "createdAt",
    headerName: "Date",
    width: 170,
    renderCell: (params) => <>{params.row.createdAt}</>,
  },
  { field: "quantity", headerName: "Qty", width: 40 },
  { field: "cost", headerName: "Cost", width: 130 },
  { field: "mode", headerName: "Issuer", width: 130 },
];
