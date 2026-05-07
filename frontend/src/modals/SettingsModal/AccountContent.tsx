import ModalRow from '../../components/Modal/ModalRow';
import { useAppSelector } from '../../Redux/reduxHooks/reduxHooks';
import { isAuthUser } from '../../helpers/utils/isAuthUser';
import CustomLink from '../../components/CustomLink';

const AccountContent = () => {
  const user = useAppSelector((state) => state.user.user);
  return (
    <>
      {isAuthUser(user) && (
        <>
          {user.subscription !== 'free' && (
            <ModalRow>
              <span>Current subscription</span>
              <CustomLink
                className='px-0'
                to="https://billing.stripe.com/p/login/test_dRm7sM9QJ1Fs4p29QJdQQ00"
                textSize="sm"
              >
                Manage
              </CustomLink>
            </ModalRow>
          )}
          <ModalRow>
            <span>Subscription plan</span>
            <span>{user.subscription[0].toUpperCase() + user.subscription.slice(1)}</span>
          </ModalRow>
          <ModalRow>
            <span>Username</span>
            <span>{user.username}</span>
          </ModalRow>
          <ModalRow>
            <span>Email</span>
            <span>{user.email}</span>
          </ModalRow>
        </>
      )}
    </>
  );
};

export default AccountContent;
