import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import feedReducer from './slices/feedSlice';
import ordersReducer from './slices/ordersSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  ingredients: ingredientsReducer,
  feed: feedReducer,
  orders: ordersReducer
});

export default rootReducer;
