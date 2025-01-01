import { GetByUserIdItemResponse } from "@/app/api/services/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ICartState {
  isLoading: boolean;
  cartItems: GetByUserIdItemResponse[];
}
export type AddToCartType = {
  item: GetByUserIdItemResponse;
  quantity: number;
};
const initialState: ICartState = {
  isLoading: true,
  cartItems: [],
};
const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    updateCart: (state, action: PayloadAction<GetByUserIdItemResponse[]>) => {
      state.cartItems = action.payload;
      state.isLoading = false;
    },
    addToCart: (state, action: PayloadAction<AddToCartType>) => {
      const itemExists = state.cartItems.find(
        (product) => product.productId === action.payload.item.productId
      );

      if (itemExists) {
        state?.cartItems?.map((i) =>
          i.productId === itemExists.productId
            ? {
                ...action.payload.item,
                quantity: (i.quantity! += action.payload.quantity),
              }
            : i
        );
      } else {
        state.cartItems.push({
          ...action.payload.item,
          quantity: action.payload.quantity ?? 1,
        } as GetByUserIdItemResponse);
      }
    },

    // toggle: (state, action) => {
    //   const item = state.cartItems.find(
    //     (product) => product.id?.toString() === action.payload.id
    //   );
    //   if (item) item.select = action.payload.select;
    // },

    // toggleCheckAll: (state, action: PayloadAction<boolean>) => {
    //   state.cartItems.map((item) => (item.select = action.payload));
    // },
    updateQuantity: (state, action) => {
      const item = state.cartItems.find(
        (product) => product.productId?.toString() === action.payload.productId
      );
      if (item) item.quantity = action.payload.quantity;
    },
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find(
        (product) => product.productId?.toString() === action.payload
      );
      if (item) item.quantity!++;
    },
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find(
        (product) => product.productId?.toString() === action.payload
      );
      if (item) {
        if (item.quantity === 1) {
          const index = state.cartItems.findIndex(
            (product) => product.productId?.toString() === action.payload
          );
          state.cartItems.splice(index, 1);
        } else {
          item.quantity!--;
        }
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const index = state.cartItems.findIndex(
        (product) => product.productId?.toString() === action.payload
      );
      state.cartItems.splice(index, 1);
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});
export const {
  updateCart,
  updateQuantity,
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
  //   toggle,
  //   toggleCheckAll,
} = cartSlice.actions;
export default cartSlice.reducer;
