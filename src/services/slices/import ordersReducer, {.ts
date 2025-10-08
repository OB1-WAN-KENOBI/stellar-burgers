import ordersReducer, {
import * as api from '@api';
import { TOrder } from '@utils-types';
import { AnyAction } from '@reduxjs/toolkit';

// src/services/slices/ordersSlice.test.ts
  setOrdersRealtime,
  clearOrders,
  fetchOrders,
  fetchOrderByNumber,
  createOrder,
} from './ordersSlice';

jest.mock('@api');

const mockOrder: TOrder = {
  _id: '1',
  number: 123,
  ingredients: ['a', 'b'],
  status: 'done',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  name: 'Test Burger',
};

const initialState = {
  orders: [],
  current: null,
  loading: false,
  error: null,
};

describe('ordersSlice reducer', () => {
  it('should return the initial state', () => {
    expect(ordersReducer(undefined, {} as AnyAction)).toEqual(initialState);
  });

  it('should handle setOrdersRealtime', () => {
    const orders = [mockOrder];
    const state = ordersReducer(initialState, setOrdersRealtime(orders));
    expect(state.orders).toEqual(orders);
  });

  it('should handle clearOrders', () => {
    const state = ordersReducer({ ...initialState, orders: [mockOrder] }, clearOrders());
    expect(state.orders).toEqual([]);
  });
});

describe('ordersSlice thunks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetchOrders fulfilled', async () => {
    (api.getOrdersApi as jest.Mock).mockResolvedValue([mockOrder]);
    const action = await fetchOrders();
    const state = ordersReducer(initialState, { type: fetchOrders.fulfilled.type, payload: [mockOrder] });
    expect(state.orders).toEqual([mockOrder]);
    expect(state.loading).toBe(false);
  });

  it('fetchOrders rejected', () => {
    const error = { message: 'error' };
    const state = ordersReducer(initialState, { type: fetchOrders.rejected.type, error });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('error');
  });

  it('fetchOrderByNumber fulfilled', async () => {
    (api.getOrderByNumberApi as jest.Mock).mockResolvedValue({ orders: [mockOrder] });
    const state = ordersReducer(initialState, { type: fetchOrderByNumber.fulfilled.type, payload: mockOrder });
    expect(state.current).toEqual(mockOrder);
    expect(state.loading).toBe(false);
  });

  it('fetchOrderByNumber rejected', () => {
    const error = { message: 'not found' };
    const state = ordersReducer(initialState, { type: fetchOrderByNumber.rejected.type, error });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('not found');
  });

  it('createOrder fulfilled', async () => {
    (api.orderBurgerApi as jest.Mock).mockResolvedValue({ order: mockOrder });
    const state = ordersReducer(initialState, { type: createOrder.fulfilled.type, payload: mockOrder });
    expect(state.current).toEqual(mockOrder);
    expect(state.loading).toBe(false);
  });

  it('createOrder rejected', () => {
    const error = { message: 'fail' };
    const state = ordersReducer(initialState, { type: createOrder.rejected.type, error });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('fail');
  });

  it('should handle loading on pending', () => {
    let state = ordersReducer(initialState, { type: fetchOrders.pending.type });
    expect(state.loading).toBe(true);
    state = ordersReducer(initialState, { type: fetchOrderByNumber.pending.type });
    expect(state.loading).toBe(true);
    state = ordersReducer(initialState, { type: createOrder.pending.type });
    expect(state.loading).toBe(true);
  });
});