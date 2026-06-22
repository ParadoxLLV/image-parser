import axios from 'axios';
import { Spinner } from '../../components/Spinner/Spinner';
import CustomModal from '../../components/Modal/CustomModal';
import {
  useAppDispatch,
  useAppSelector,
} from '../../Redux/reduxHooks/reduxHooks';
import { toggleModal } from '../../Redux/reducers/modalReducer';
import type { checkoutInfoType, lineItemType } from '../../lib/types';
import { CustomButton } from '../../components/CustomButton';
import { useEffect, useState } from 'react';
import { IoCheckmarkCircleOutline } from 'react-icons/io5';
import type { UserSchema } from '../../helpers/Schemas/userSchema';

const StripeSuccess = () => {
  const params = new URLSearchParams(window.location.search);
  const checkoutUrl = params.get('session_id');
  console.log(`CHECKOUT URL FOUND IN STRIPE SUCCESS PAGE: ${checkoutUrl}`);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const [purchaseInfo, setPurchaseInfo] = useState<checkoutInfoType | null>(
    null,
  );
  const [productsInfo, setProductsInfo] = useState<lineItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          'http://localhost:3000/api/server/getCheckoutSessionInfo',
          { checkoutUrl },
          {
            headers: {
              'Content-Type': 'application/json',
              fingerprint: user.fingerprint,
            },
            withCredentials: true,
          },
        );
        console.log(`fetchSession response:`);
        console.log(response);

        const dataResponse = response.data.checkoutData;
        if (dataResponse) {
          setPurchaseInfo({
            amount: dataResponse.amount,
            email: dataResponse.email,
          });
          setProductsInfo(dataResponse.products);
        }
      } catch (err) {
        setError(
          'Something went wrong while processing checkout items. The requested items should still be available for use.',
        );
        console.error('Failed to fetch checkout session', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [checkoutUrl, user.fingerprint]);

  useEffect(() => {
    if (loading || error) return;
    dispatch(
      toggleModal(purchaseInfo ? 'checkoutSucceeded' : 'checkoutFailed'),
    );
  }, [loading, purchaseInfo, dispatch, error]);

  if (purchaseInfo) {
    return (
      <>
        <CustomModal modalName="checkoutSucceeded">
          <div className="flex flex-col gap-2 rounded-md">
            <h1 className="dark:text-white text-lg text-black text-center">
              Thanks for purchasing, {(user.user as UserSchema).username}!
            </h1>
            <div className="flex gap-2 dark:text-white text-black">
              {productsInfo.map((product) => (
                <div className="w-full flex dark:bg-teal-700/50 justify-center flex-col items-center border-accent/20 border-4 rounded-lg p-3">
                  <div className="w-full flex items-center justify-center py-2">
                    <img className="h-16" src={product.image}></img>
                  </div>
                  <span className="text-xl">{product.name}</span>
                  <div className="text-xl">
                    <span>
                      {product.price.toString().includes('.')
                        ? '$' +
                          product.price.toString().split('.', 2)[0] +
                          ',' +
                          product.price.toString().split('.', 2)[1]
                        : '$' + product.price.toString()}
                    </span>
                  </div>
                  <div className="w-11/12 sm:w-9/12 text-center">
                    <span className="text-md text-center">
                      {product.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full flex justify-center gap-3 flex-col">
              <div className="w-full flex items-center justify-center gap-1 pt-1">
                <h1 className="text-xl sm:text-2xl text-center uppercase dark:text-accent-dark text-accent">
                  payment successful
                </h1>
                <IoCheckmarkCircleOutline className="text-accent font-bold text-3xl" />
              </div>
              <CustomButton
                onClick={() => dispatch(toggleModal('checkoutSucceeded'))}
              >
                Close
              </CustomButton>
            </div>
          </div>
        </CustomModal>
        <div className="w-full flex justify-center items-center">
          <CustomButton
            className="p-3 text-xl w-full"
            onClick={() => dispatch(toggleModal('checkoutSucceeded'))}
          >
            Show purchase info
          </CustomButton>
        </div>
      </>
    );
  }

  if (error?.length > 0) {
    return (
      <CustomModal modalName="checkoutFailed">
        <p>{error}</p>
      </CustomModal>
    );
  }
  
  return (
    <div className="w-full flex justify-center items-center">
      <Spinner variant="reverseDefault" size="xxl" />
    </div>
  );
};

export default StripeSuccess;
