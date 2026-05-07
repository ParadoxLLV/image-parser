import app from './app.ts';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

app.listen(process.env.PORT, () => {
  console.log(`Server running on PORT ${process.env.PORT}`);
  console.log('Connection String:', process.env.PGCONNECTIONSTRING);
});