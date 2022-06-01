import { request } from "../request";
import { drugsStart, drugsSuccess, drugsFailure } from "./drugs";
import { salesStart, salesSuccess, salesFailure } from "./sales";
export const RefreshAllData = async (dispatch) => {
  dispatch(drugsStart());
  dispatch(salesStart());
  try {
    const drugs = await request.get("/drugs");
    dispatch(drugsSuccess(drugs.data));
    const sales = await request.get("/drugs");
    dispatch(salesSuccess(sales.data));
  } catch (err) {
    dispatch(drugsFailure());
    dispatch(salesFailure());
  }
};
