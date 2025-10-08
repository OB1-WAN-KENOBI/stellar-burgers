import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrders, setOrdersRealtime, clearOrders } from '../../services/slices/ordersSlice';
import { getCookie } from '../../utils/cookie';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector((s) => s.orders.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Realtime обновление истории заказов (требует токен)
  useEffect(() => {
    const token = getCookie('accessToken');
    if (!token) return;
    const ws = new WebSocket(`wss://norma.nomoreparties.space/orders?token=${token.replace('Bearer ', '')}`);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.success && data.orders) {
          dispatch(setOrdersRealtime(data.orders));
        }
      } catch {}
    };
    return () => {
      ws.close();
      dispatch(clearOrders());
    };
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
