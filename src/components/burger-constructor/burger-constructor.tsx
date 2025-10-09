import { FC, useMemo, useState } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { createOrder } from '../../services/slices/ordersSlice';
import { resetConstructor } from '../../services/slices/constructorSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector((s) => s.burgerConstructor);
  const { user } = useSelector((s) => s.auth);
  const { loading: orderLoading, current: orderData } = useSelector(
    (s) => s.orders
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showOrderModal, setShowOrderModal] = useState(false);

  const onOrderClick = async () => {
    if (!constructorItems?.bun || orderLoading) return;

    if (!user) {
      // Сохраняем текущее состояние конструктора и перенаправляем на логин
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const ingredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ing) => ing._id),
      constructorItems.bun._id
    ];

    try {
      const result = await dispatch(createOrder(ingredients));
      if (result.type.endsWith('/fulfilled')) {
        setShowOrderModal(true);
        dispatch(resetConstructor());
      }
    } catch (error) {
      console.error('Ошибка создания заказа:', error);
    }
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
  };

  const price = useMemo(
    () =>
      (constructorItems?.bun
        ? (constructorItems.bun as TConstructorIngredient).price * 2
        : 0) +
      (constructorItems?.ingredients || []).reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderLoading}
      constructorItems={constructorItems}
      orderModalData={showOrderModal ? orderData : null}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
