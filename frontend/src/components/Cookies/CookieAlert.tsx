import { useEffect, useState } from 'react';
import CustomLink from '../CustomLink';
import { CustomButton } from '../CustomButton';

const CookieAlert = () => {
  const [agreeCookies, setAgreeCookies] = useState<'true' | 'false' | 'null'>(
    'null',
  );

  useEffect(() => {
    const storedValue = localStorage.getItem('agreedToCookies');

    if (storedValue === 'true' || storedValue === 'false') {
      setAgreeCookies(storedValue);
    } else {
      localStorage.setItem('agreedToCookies', 'null');
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('agreedToCookies', 'true');
    setAgreeCookies('true');
  };

  const handleReject = () => {
    localStorage.setItem('agreedToCookies', 'false');
    setAgreeCookies('false');
  };

  return (
    agreeCookies === 'null' && (
      <div className="fixed bottom-7 left-0 w-full px-4 z-50">
        <div className="mx-auto max-w-5xl bg-accent-dark/10 flex text-text dark:text-text-dark items-center backdrop-blur-md rounded-lg p-2 lg:p-3 gap-2 justify-between flex-wrap pointer-events-auto">
          <div className="flex items-center">
            <h2>
              By using Image Parser, you agree to the use of cookies. For more
              info, visit our
              <CustomLink lineVariant="green" variant="green" to="/">
                Cookie Policy
              </CustomLink>
            </h2>
          </div>
          <div className="flex gap-2">
            <CustomButton onClick={handleAccept} variant="default">
              Accept
            </CustomButton>
            <CustomButton onClick={handleReject} variant="danger">
              Reject
            </CustomButton>
          </div>
        </div>
      </div>
    )
  );
};

export default CookieAlert;
