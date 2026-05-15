import { Route, Routes } from 'react-router';
import { useEffect } from 'react';
import { useAppDispatch } from './Redux/reduxHooks/reduxHooks';
import Layout from './Layout';
import Homepage from './pages/HomePage/Homepage';
import LoginPage from './pages/AuthPage/LoginPage';
import RegisterPage from './pages/AuthPage/RegisterPage';
import Pricing from './pages/PricingPage/Pricing';
import { getCurrentUser, setFingerprint } from './Redux/reducers/userReducer';
import AuthSuccess from './pages/SuccessFailPage/AuthSuccess';
import AuthFail from './pages/SuccessFailPage/AuthFail';
import { Toaster } from 'react-hot-toast';
import StripeSuccess from './pages/SuccessFailPage/StripeSuccess';
import StripeFail from './pages/SuccessFailPage/StripeFail';
import SettingsModal from './modals/SettingsModal/SettingsModal';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import axios from 'axios';
import About from './pages/AboutPage/About';

axios.defaults.withCredentials = true;

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Homepage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="pricing" element={<Pricing />}></Route>
          <Route path="about" element={<About />}></Route>
          <Route path="auth-success" element={<AuthSuccess />} />
          <Route path="auth-fail" element={<AuthFail />} />
          <Route path="stripe-success" element={<StripeSuccess />} />
          <Route path="stripe-fail" element={<StripeFail />} />
        </Route>
      </Routes>
      <SettingsModal />
      <Toaster />
    </>
  );
}

export default App;
