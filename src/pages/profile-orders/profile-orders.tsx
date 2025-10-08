import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrders } from '../../services/slices/ordersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector((s) => s.orders.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
