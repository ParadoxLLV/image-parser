import { useEffect, useState } from 'react';
import ImageParserDarkLogo from '../../assets/ImageParserDarkLogo.png';
import ImageParserWhiteLogo from '../../assets/ImageParserWhiteLogo.png';
import ImageParserDark from '../../assets/ImageParserDark.png';
import ImageParserWhite from '../../assets/ImageParserWhite.png';
import { CustomButton } from '../../components/CustomButton';
import { MdLightMode } from 'react-icons/md';
import { Link } from 'react-router';
import {
  useAppDispatch,
  useAppSelector,
} from '../../Redux/reduxHooks/reduxHooks';
import { getCurrentUser, logoutUser } from '../../Redux/reducers/userReducer';
import { toggleModal } from '../../Redux/reducers/modalReducer';
import { FaCog } from 'react-icons/fa';
import CustomDropdown from '../CustomDropdown';
import { HiOutlineLogout } from 'react-icons/hi';
import { RiMenuUnfold2Fill } from 'react-icons/ri';

const Navbar = () => {
  const [userTheme, setUserTheme] = useState<'dark' | 'light'>(
    (localStorage.getItem('themeMode') as 'dark' | 'light') || 'light',
  );
  const [changeThemeHovered, setChangeThemeHovered] = useState<boolean>(false);
  const user = useAppSelector((state) => state.user.user);
  const fingerprint = useAppSelector(
    (state) => state.user.fingerprint as string,
  );

  const dispatch = useAppDispatch();

  const changeThemeMode = () => {
    const head = document.documentElement;
    const newTheme = userTheme === 'dark' ? 'light' : 'dark';

    localStorage.setItem('themeMode', newTheme);
    if (newTheme === 'dark') {
      head.classList.add('dark');
    } else {
      head.classList.remove('dark');
    }
    setUserTheme(newTheme);
    window.dispatchEvent(new Event('themeChanged'));
  };

  const openSettings = () => {
    dispatch(toggleModal('settings'));
  };

  const onLogout = () => {
    dispatch(logoutUser(fingerprint));
    dispatch(getCurrentUser());
  };

  useEffect(() => {
    const head = document.documentElement;
    if (userTheme === 'dark') {
      head.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <>
      <div className="p-4 lg:p-6 z-50 top-0 sticky flex h-fit justify-center items-center dark:bg-background-dark/10 bg-background/10 transition duration-300">
        <div className="w-full flex justify-between outline-2 drop-shadow-lg dark:drop-shadow-text-dark/15 duration-300 transition dark:bg-background-dark/10 bg-background/10 backdrop-blur-sm items-center outline-text/15 dark:outline-text-dark/15 rounded-lg p-1 md:p-2">
          <Link to="/" className="flex items-center h-6">
            <img
              src={userTheme === 'dark' ? ImageParserDark : ImageParserWhite}
              alt=""
              className="ml-2 h-full w-auto object-contain duration-300 transition hidden md:block"
            />
            <img
              className="ml-2 h-full w-auto object-contain duration-300 transition block md:hidden"
              src={
                userTheme === 'dark'
                  ? ImageParserDarkLogo
                  : ImageParserWhiteLogo
              }
              alt=""
            />
          </Link>
          <div className="flex gap-2 h-10">
            {user?.isGuest ? (
              <>
                <CustomButton>
                  <a href="login">Login</a>
                </CustomButton>
                <CustomButton>
                  <a href="register">Register</a>
                </CustomButton>
              </>
            ) : (
              <>
                <CustomDropdown
                  options={[
                    {
                      children: `Credits: ${user?.credits}`,
                      className: 'cursor-auto',
                    },
                    {
                      onClick: () => onLogout(),
                      children: 'Logout',
                      icon: <HiOutlineLogout />,
                    },
                  ]}
                >
                  <span>
                    <RiMenuUnfold2Fill />
                  </span>
                </CustomDropdown>
              </>
            )}
            <CustomButton
              className="aspect-square"
              onClick={() => changeThemeMode()}
              onMouseEnter={() => setChangeThemeHovered(true)}
              onMouseLeave={() => setChangeThemeHovered(false)}
              tooltipText={
                userTheme === 'dark' ? 'Toggle light mode' : 'Toggle dark mode'
              }
              icon={
                <MdLightMode
                  className={`text-text-dark dark:text-text text-xl transition duration-500 ${
                    changeThemeHovered && 'rotate-180'
                  }`}
                />
              }
            ></CustomButton>
            <CustomButton
              className="aspect-square"
              onClick={() => openSettings()}
              tooltipText="Open settings"
              icon={
                <FaCog
                  className={`text-text-dark dark:text-text text-xl transition duration-500`}
                />
              }
            ></CustomButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
