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
import { redirect } from 'react-router';

const StripeSuccess = () => {
  const params = new URLSearchParams(window.location.search);
  const checkoutUrl = params.get('session_id');
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  if (!user) {
    redirect('');
  }

  const [purchaseInfo, setPurchaseInfo] = useState<checkoutInfoType | null>(
    null,
  );
  const [productsInfo, setProductsInfo] = useState<lineItemType[]>([]);

  useEffect(() => {
    console.log('STRIPESUCCESS');
    console.log(checkoutUrl);
    const fetch = async () => {
      const response = await axios.post(
        'http://localhost:3000/api/server/getCheckoutSessionInfo',
        { checkoutUrl },
        {
          withCredentials: true,
        },
      );
      if (response.data.checkoutData && productsInfo.length == 0) {
        const dataResponse = response.data.checkoutData;
        setPurchaseInfo({
          amount: dataResponse.amount,
          email: dataResponse.email,
        });

        dataResponse.products.map((product: lineItemType) => {
          setProductsInfo((prev) => [...prev, product]);
        });
      } else if (response.data.err) {
        setPurchaseInfo(null);
      }
    };
    fetch();
  }, [checkoutUrl]);

  if (purchaseInfo) {
    dispatch(toggleModal('checkoutSucceeded'));
    return (
      <>
        <CustomModal
          modalName="checkoutSucceeded"
        >
          <div className="flex flex-col gap-2 rounded-md">
            <div className="flex gap-2">
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
                    <span className="text-xl text-center">
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
  } else {
    dispatch(toggleModal('checkoutFailed'));
    return (
      <CustomModal modalName="checkoutFailed">
        <div className="flex justify-center py-3">
          <Spinner variant="reverseDefault" size="xxl"></Spinner>
        </div>
      </CustomModal>
    );
  }
};

export default StripeSuccess;
