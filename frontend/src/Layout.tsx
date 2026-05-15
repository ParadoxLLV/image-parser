import Navbar from './components/layoutComponents/Navbar';
import Container from './components/Container';
import { Outlet } from 'react-router';
import Footer from './components/layoutComponents/Footer';
import Breadcrumb from './components/layoutComponents/Breadcrumb';
import CookieAlert from './components/Cookies/CookieAlert';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen font-jost transition duration-300">
      <Navbar />
      <Container>
        <Breadcrumb />
      </Container>
      <Container className='flex-grow'>
        <div className="flex flex-col transition duration-300">
          <Outlet />
          <CookieAlert />
        </div>
      </Container>
      <Container className="justify-end">
        <Footer />
      </Container>
    </div>
  );
};

export default Layout;
