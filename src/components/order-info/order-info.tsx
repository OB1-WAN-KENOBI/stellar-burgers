import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { fetchOrderByNumber as fetchFeedOrderByNumber } from '../../services/slices/feedSlice';
import { fetchOrderByNumber as fetchOrdersOrderByNumber } from '../../services/slices/ordersSlice';
import { useParams, useLocation } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();
  const location = useLocation();
  const ingredients: TIngredient[] = useSelector((s) => s.ingredients.items);
  const ingredientsLoading = useSelector((s) => s.ingredients.loading);

  // Определяем, откуда загружать данные в зависимости от пути
  const isProfileOrder = location.pathname.includes('/profile/orders/');
  const orderData = useSelector((s) =>
    isProfileOrder ? s.orders.current : s.feed.current
  );

  useEffect(() => {
    if (number) {
      if (isProfileOrder) {
        dispatch(fetchOrdersOrderByNumber(Number(number)));
      } else {
        dispatch(fetchFeedOrderByNumber(Number(number)));
      }
    }
  }, [dispatch, number, isProfileOrder]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length || ingredientsLoading) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients, ingredientsLoading]);

  if (!orderInfo || ingredientsLoading) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
