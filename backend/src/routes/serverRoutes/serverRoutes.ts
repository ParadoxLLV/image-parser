import express from 'express';
import {
  checkoutSession,
  convertImage,
  getCheckoutInfo,
  removeCredits,
  removeCreditsRoute,
} from '../../controllers/Controllers/serverController';
import { clearCookie } from '../../hooks/clearCookie';
import multer from 'multer';

const serverRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

serverRouter.post('/processFile', upload.single('file'), convertImage);
serverRouter.post('/clearCookie', clearCookie);
serverRouter.post('/removeCredits', removeCreditsRoute);
serverRouter.post('/create-checkout-session', checkoutSession);
serverRouter.post('/getCheckoutSessionInfo', getCheckoutInfo);

export default serverRouter;
