import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface IOrderState {
  orderId: string;
}
const initialState: IOrderState = {
  orderId: "",
};
const orderSlice = createSlice({
  name: "order",
  initialState: initialState,
  reducers: {
    updateOrderId: (state, action: PayloadAction<string>) => {
      state.orderId = action.payload;
    },
  },
});

export const { updateOrderId } = orderSlice.actions;
export default orderSlice.reducer;
