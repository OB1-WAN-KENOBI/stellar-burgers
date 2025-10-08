import { ConstructorPage, Feed, ForgotPassword, Login, Profile, ProfileOrders, Register, ResetPassword, NotFound404 } from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { Routes, Route, Navigate, useLocation, type Location } from 'react-router-dom';
import { IngredientDetails, OrderInfo, Modal } from '@components';
import { useCallback, useEffect, ReactElement } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { fetchUser } from '../../services/slices/authSlice';
import type { RootState } from '../../services/store';

const ProtectedRoute = ({ element, isAuth, isAuthChecked }: { element: ReactElement; isAuth: boolean; isAuthChecked: boolean }) => {
  if (!isAuthChecked) return <Preloader />;
  return isAuth ? element : <Navigate to="/login" replace />;
};

const GuestRoute = ({ element, isAuth, isAuthChecked }: { element: ReactElement; isAuth: boolean; isAuthChecked: boolean }) => {
  if (!isAuthChecked) return <Preloader />;
  return isAuth ? <Navigate to="/" replace /> : element;
};

const App = () => {
  const { user, isAuthChecked } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const state = location.state as { background?: Location } | undefined;

  useEffect(() => {
    if (!isAuthChecked) {
      dispatch(fetchUser());
    }
  }, [dispatch, isAuthChecked]);

  const handleCloseModal = useCallback(() => {
    window.history.back();
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      {/* Базовые страничные маршруты */}
      <Routes location={state?.background || location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/login" element={<GuestRoute isAuthChecked={isAuthChecked} isAuth={Boolean(user)} element={<Login />} />} />
        <Route path="/register" element={<GuestRoute isAuthChecked={isAuthChecked} isAuth={Boolean(user)} element={<Register />} />} />
        <Route path="/forgot-password" element={<GuestRoute isAuthChecked={isAuthChecked} isAuth={Boolean(user)} element={<ForgotPassword />} />} />
        <Route path="/reset-password" element={<GuestRoute isAuthChecked={isAuthChecked} isAuth={Boolean(user)} element={<ResetPassword />} />} />
        <Route path="/profile" element={<ProtectedRoute isAuthChecked={isAuthChecked} isAuth={Boolean(user)} element={<Profile />} />} />
        <Route path="/profile/orders" element={<ProtectedRoute isAuthChecked={isAuthChecked} isAuth={Boolean(user)} element={<ProfileOrders />} />} />
        {/* Страничные версии деталей */}
        <Route path="/ingredients/:id" element={<IngredientDetails />} />
        <Route path="/feed/:number" element={<OrderInfo />} />
        <Route path="/profile/orders/:number" element={<ProtectedRoute isAuthChecked={isAuthChecked} isAuth={Boolean(user)} element={<OrderInfo />} />} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {/* Модальные маршруты поверх background */}
      {state?.background && (
        <Routes>
          <Route
            path="/feed/:number"
            element={
              <Modal title="" onClose={handleCloseModal}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute
                isAuthChecked={isAuthChecked}
                isAuth={Boolean(user)}
                element={
                  <Modal title="" onClose={handleCloseModal}>
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
