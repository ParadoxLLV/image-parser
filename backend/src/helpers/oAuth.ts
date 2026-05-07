import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';

let oAuth2ClientInstance: OAuth2Client | null = null;

export const getOAuth2Client = () => {
  if (!oAuth2ClientInstance) {
    oAuth2ClientInstance = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );
    
  }
  return oAuth2ClientInstance;
};
export const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
  'openid',
];

export const getUseroAuthInfo = async () => {
  const oauth2 = google.oauth2({
    auth: getOAuth2Client(),
    version: 'v2',
  });

  const { data } = await oauth2.userinfo.get();
  return data;
};