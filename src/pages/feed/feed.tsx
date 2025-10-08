import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeed, setFeedRealtime, clearFeed } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((s) => s.feed);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  // Realtime обновление через WebSocket (публичная лента)
  useEffect(() => {
    const ws = new WebSocket('wss://norma.nomoreparties.space/orders/all');
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.success && data.orders) {
          dispatch(setFeedRealtime({ orders: data.orders, total: data.total, totalToday: data.totalToday }));
        }
      } catch {}
    };
    return () => {
      ws.close();
      dispatch(clearFeed());
    };
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders as TOrder[]} handleGetFeeds={() => dispatch(fetchFeed())} />;
};
