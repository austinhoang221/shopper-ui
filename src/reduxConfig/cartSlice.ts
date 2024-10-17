import { ProductResponse } from "@/api/services/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type CartItem = {
  item: ProductResponse;
  select: boolean;
  quantity: number;
};
interface ICartState {
  cartItems: CartItem[];
}

const initialState: ICartState = {
  cartItems: [],
};
const cartSlice = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<ProductResponse>) => {
      const itemExists = state.cartItems.find(
        (product) => product.item.id === action.payload.id
      );

      if (itemExists) {
        state?.cartItems?.map((i) =>
          i.item === itemExists.item
            ? { ...action.payload, quantity: i.quantity++ }
            : i
        );
      } else {
        state.cartItems.push({
          item: action.payload,
          quantity: 1,
          select: true,
        });
      }
    },

    toggle: (state, action) => {
      const item = state.cartItems.find(
        (product) => product.item.id?.toString() === action.payload.id
      );
      if (item) item.select = action.payload.select;
    },

    toggleCheckAll: (state, action: PayloadAction<boolean>) => {
      state.cartItems.map((item) => (item.select = action.payload));
    },

    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find(
        (product) => product.item.id?.toString() === action.payload
      );
      if (item) item.quantity++;
    },
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.cartItems.find(
        (product) => product.item.id?.toString() === action.payload
      );
      if (item) {
        if (item.quantity === 1) {
          const index = state.cartItems.findIndex(
            (product) => product.item.id?.toString() === action.payload
          );
          state.cartItems.splice(index, 1);
        } else {
          item.quantity--;
        }
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const index = state.cartItems.findIndex(
        (product) => product.item.id?.toString() === action.payload
      );
      state.cartItems.splice(index, 1);
    },
  },
});
export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  toggle,
  toggleCheckAll,
} = cartSlice.actions;
export default cartSlice.reducer;
