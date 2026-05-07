import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router';
import App from './App.tsx';
import { Provider } from 'react-redux';
import store from './Redux/store.ts';
import { CookiesProvider } from 'react-cookie';

createRoot(document.getElementById('root')!).render(
  <CookiesProvider>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </CookiesProvider>
);
