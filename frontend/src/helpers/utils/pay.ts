import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import axiosInstance from './axiosInterceptor';
import { useAppSelector } from '../../Redux/reduxHooks/reduxHooks';

export const pay = async (
  mode: 'payment' | 'subscription',
  priceId: string,
  fingerprint: string | null
) => {
  try {
    const data = {
      priceId: priceId,
      mode,
    };
    const response = await axiosInstance.post(
      `http://localhost:3000/api/server/create-checkout-session`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          fingerprint: fingerprint,
        },
        withCredentials: true,
      },
    );
    window.location.href = response.data.url;
  } catch (error) {
    const axiosError = error as AxiosError<{
      error: string;
      subscription: string;
    }>;
    toast.error(
      `${axiosError.response?.data.error}: ${axiosError.response?.data.subscription}. Manage your subscription to update it's status in the settings.`,
    );
    console.log(error);
  }
};
