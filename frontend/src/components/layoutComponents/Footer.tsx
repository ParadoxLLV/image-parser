import { useEffect, useState } from 'react';
import ImageParserDarkLogo from '../../assets/ImageParserDarkLogo.png';
import ImageParserWhiteLogo from '../../assets/ImageParserWhiteLogo.png';
import CustomLink from '../../components/CustomLink';

const Footer = () => {
  const [userTheme, setUserTheme] = useState(localStorage.getItem('themeMode'));
  useEffect(() => {
    const handleThemeChange = () => {
      setUserTheme(localStorage.getItem('themeMode'));
    };

    window.addEventListener('themeChanged', handleThemeChange);
    return () => {
      window.removeEventListener('themeChanged', handleThemeChange);
    };
  }, []);
  return (
    <div className="p-4 lg:p-6 flex h-full justify-end items-center w-full transition duration-300 bg-accent/20 dark:bg-accent-dark/15 rounded-t-xl flex-col gap-2 my-4 lg:my-6">
      <img
        src={userTheme === 'light' ? ImageParserWhiteLogo : ImageParserDarkLogo}
        className="w-15"
        alt=""
      />
      <div className="w-full flex items-center justify-center flex-col">
        <h1 className="text-xl text-text dark:text-text-dark">Links</h1>
        <CustomLink to="pricing">Pricing</CustomLink>
        <CustomLink to="login">Login</CustomLink>
        <CustomLink to="register">Register</CustomLink>
        <CustomLink to="about">About</CustomLink>
      </div>
    </div>
  );
};

export default Footer;
