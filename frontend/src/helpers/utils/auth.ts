import axios from 'axios';
import type { actionType, providerType } from '../../lib/types';

export async function auth(provider: providerType, type: actionType) {
  const response = await axios.get(
    `http://localhost:3000/api/auth/generateAuthUrl?provider=${provider}&type=${type}`,
  );
  if (response.data) {
    console.log(response.data);
    window.location.href = response.data.url;
  }
}
