import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/axios"; // Use custom instance
import { AxiosError } from "axios";
import { RootState } from "../store";

export interface ProductDetails {
  id: string;
  name: string;
  price: number;
  discount_price?: number;
  image: string;
  size: string;
  slug: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  unit: string;
  product?: ProductDetails;
}

interface FetchCartResponse {
  items: CartItem[];
  cartTotal: number;
  vatEstimate: number;
}

interface CartState {
  items: CartItem[];
  cartTotal: number;
  loading: boolean;
  error: string | null;
}

interface BackendError {
  message: string;
}

const initialState: CartState = {
  items: [],
  cartTotal: 0,
  loading: false,
  error: null,
};

// --- ASYNC THUNKS ---

// 1. Fetch Cart
export const fetchCart = createAsyncThunk<
  FetchCartResponse,
  void,
  { rejectValue: string; state: RootState }
>("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/cart");
    return response.data;
  } catch (err) {
    const error = err as AxiosError<{ message: string }>;
    return rejectWithValue(
      error.response?.data.message || "Failed to fetch cart",
    );
  }
});

// 2. Add/Update Item
export const addToCartAsync = createAsyncThunk<
  CartItem,
  { product_id: string; quantity: number },
  { rejectValue: string }
>(
  "cart/addToCart",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/cart", payload);

      return response.data;
    } catch (err) {
      const error = err as AxiosError<BackendError>;

      return rejectWithValue(
        error.response?.data.message || "Failed to add item"
      );
    }
  }
);

// 3. Remove Item
export const removeFromCartAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string; state: RootState }
>("cart/removeFromCart", async (cartItemId, { rejectWithValue }) => {
  try {
    await api.delete(`/api/cart/${cartItemId}`);
    return cartItemId;
  } catch (err) {
    const error = err as AxiosError<BackendError>;
    return rejectWithValue(
      error.response?.data.message || "Failed to remove item",
    );
  }
});

// 4. Update Quantity
export const updateQuantityAsync = createAsyncThunk<
  void,
  { cartItemId: string; quantity: number },
  { rejectValue: string; state: RootState }
>(
  "cart/updateQuantity",
  async ({ cartItemId, quantity }, { dispatch, rejectWithValue }) => {
    try {
      await api.patch(`/api/cart/${cartItemId}/quantity`, { quantity });
      await dispatch(fetchCart()).unwrap();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      return rejectWithValue(error.response?.data?.message || "Update failed");
    }
  },
);

// --- THE SLICE ---

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.cartTotal = 0;
    },
    mockAddToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.product_id === action.payload.product_id,
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.cartTotal = state.items.reduce(
        (total, item) => total + (item.product?.price || 0) * item.quantity,
        0,
      );
    },
    mockRemoveFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.cartTotal = state.items.reduce(
        (total, item) => total + (item.product?.price || 0) * item.quantity,
        0,
      );
    },
    mockUpdateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>,
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      state.cartTotal = state.items.reduce(
        (total, item) => total + (item.product?.price || 0) * item.quantity,
        0,
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
  // Prevent empty response from wiping cart
  if (action.payload?.items?.length > 0) {
    state.items = action.payload.items;
  }
})
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Remove Item (Optimistic UI Update)
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const {
  clearCart,
  mockAddToCart,
  mockRemoveFromCart,
  mockUpdateQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
