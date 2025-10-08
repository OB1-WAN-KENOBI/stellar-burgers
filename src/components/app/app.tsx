import { ConstructorPage, Feed, ForgotPassword, Login, Profile, ProfileOrders, Register, ResetPassword, NotFound404 } from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { Routes, Route, Navigate } from 'react-router-dom';
import { IngredientDetails, OrderInfo } from '@components';
import { Modal } from '@components/modal/modal';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { fetchUser } from '../../services/slices/authSlice';

const ProtectedRoute = ({ element, isAuth, isAuthChecked }: { element: JSX.Element; isAuth: boolean; isAuthChecked: boolean }) => {
  if (!isAuthChecked) return <Preloader />;
  return isAuth ? element : <Navigate to="/login" replace />;
};

const App = () => {
  const { user, isAuthChecked } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

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
      <Routes>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<ProtectedRoute isAuthChecked={isAuthChecked} isAuth={Boolean(user)} element={<Profile />} />} />
        <Route path="/profile/orders" element={<ProtectedRoute isAuthChecked={isAuthChecked} isAuth={Boolean(user)} element={<ProfileOrders />} />} />
        <Route path="*" element={<NotFound404 />} />

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
    </div>
  );
};

export default App;
