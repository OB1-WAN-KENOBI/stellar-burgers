import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi, getOrderByNumberApi, orderBurgerApi } from '@api';

type OrdersState = {
  orders: TOrder[];
  current: TOrder | null;
  loading: boolean;
  error: string | null;
};

const initialState: OrdersState = {
  orders: [],
  current: null,
  loading: false,
  error: null
};

export const fetchOrders = createAsyncThunk('orders/fetch', async () => {
  const res = await getOrdersApi();
  return res;
});

export const fetchOrderByNumber = createAsyncThunk('orders/fetchByNumber', async (number: number) => {
  const res = await getOrderByNumberApi(number);
  return res.orders[0] ?? null;
});

export const createOrder = createAsyncThunk('orders/create', async (ingredients: string[]) => {
  const res = await orderBurgerApi(ingredients);
  return res.order;
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrdersRealtime(state, action: PayloadAction<TOrder[]>) {
      state.orders = action.payload;
    },
    clearOrders(state) {
      state.orders = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<TOrder[]>) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action: PayloadAction<TOrder | null>) => {
        state.current = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<TOrder>) => {
        state.current = action.payload;
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      });
  }
});

export const { setOrdersRealtime, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
