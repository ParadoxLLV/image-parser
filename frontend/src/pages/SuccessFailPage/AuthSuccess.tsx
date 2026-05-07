import { useNavigate, useSearchParams } from 'react-router';
import CustomLink from '../../components/CustomLink';
import { useEffect, useState } from 'react';

const AuthSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const successCause = params.get('successCause');
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
      {successCause === 'SuccessfulLogin' && (
        <div className="flex flex-col w-full text-xl gap-2">
          <span className="text-black dark:text-white">
            Login attempt successful. Redirecting in:
            {navigateTimer}...
          </span>
        </div>
      )}
      {successCause === 'SuccessfulRegister' && (
        <div className="flex flex-col w-full text-xl gap-2">
          <span className="text-black dark:text-white">
            Register attempt successful. Redirecting in:
            {navigateTimer}...
          </span>
        </div>
      )}
      <span>or</span>
      <CustomLink to="/">Back to homepage</CustomLink>
    </>
  );
};

export default AuthSuccess;
