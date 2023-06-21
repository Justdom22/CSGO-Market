import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CartItem } from "@/types";

const initialState: CartItem[] = [];

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<string>) => {
      state.push({ market_hash_name: action.payload });
    },

    removeItem: (state, action: PayloadAction<string>) => {
      const item = state.find((item) => item.market_hash_name === action.payload);

      if (!item) return;

      const index = state.findIndex((item) => item.market_hash_name === action.payload);
      state.splice(index, 1);
    },
  },
});

export const cartReducer = cartSlice.reducer;

export const { addItem, removeItem } = cartSlice.actions;
