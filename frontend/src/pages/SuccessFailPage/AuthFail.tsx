import { useNavigate, useSearchParams } from 'react-router';
import CustomLink from '../../components/CustomLink';
import { useEffect, useState } from 'react';

const AuthFail = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const failCause = params.get('failCause');
  const [navigateTimer, setNavigateTimer] = useState(3);

  useEffect(() => {
    if (navigateTimer === 0) {
      navigate('/');
      return;
    }
    const timer = setTimeout(() => {
      setNavigateTimer((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigateTimer, navigate]);

  useEffect(() => {
    console.log('UseEffect CAlled');
    window.history.replaceState(
      null,
      '',
      window.location.pathname + window.location.search
    );
  }, []);

  return (
    <>
      {failCause === 'UnsuccessfulLogin' && (
        <div className="flex flex-col w-full text-xl gap-2">
          <span className="text-black dark:text-white">
            Login attempt unsuccessful, try again. Returning to homepage in:
            {navigateTimer}...
          </span>
        </div>
      )}
      {failCause === 'UnsuccessfulRegister' && (
        <div className="flex flex-col w-full text-xl gap-2">
          <span className="text-black dark:text-white">
            Register attempt unsuccessful, try again. Returning to homepage in:
            {navigateTimer}...
          </span>
        </div>
      )}
      {failCause === 'RegisterAccountExists' && (
        <div className="flex flex-col w-full text-2xl gap-2 items-center justify-center text-white">
          <span className='text-black dark:text-white'>
            The account that you tried registering on already exists, try
            logging in with that same account. Returning to homepage in:
            {navigateTimer}...
          </span>
        </div>
      )}
      {failCause === 'LoginAccountDoesntExist' && (
        <div className="flex flex-col w-full text-xl gap-2">
          <span className="text-black dark:text-white">
            The account of the login attempt doesn't exist, try registering.
            Returning to homepage in:
            {navigateTimer}...
          </span>
        </div>
      )}
      <span>or</span>
      <CustomLink to="login">Back to login</CustomLink>
    </>
  );
};

export default AuthFail;
