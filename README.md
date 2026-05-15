# Image Parser

An app for converting images to different formats. Has multiple different subscription plans, one-time purchases and more.

## Tech Stack

**Client:** React, Redux, TailwindCSS, Class Variance Authority (cva), zod and FingerprintJS

**Server:** Node, Express, Stripe integration, bcrypt, Redis, Sharp, Multer

**Tests:** Supertest and Vitest

**Database:** Local postgres database running in pgAdmin4

JWTs and OAuth are used for authentificating real users, meanwhile guest users get stored in a redis database.

## Showcase
<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/f417ae49-ceca-48b6-9a21-13781b8b711e" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/9a89428c-7806-4704-9597-64675e07b107" />

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/6b3c4cd9-4ba9-45d5-9429-4eaa5f698d3e" />

# Setup
Follow the steps below to run Image Parser on a local machine

## 1. Building

To install the required dependencies, run

```bash
  pnpm i
```


## 2. Finishing off

Finally, to start the project in a new browser window, navigate to the frontend folder and run

```bash
  pnpm dev
```

To test out every feature this app has to offer, you will also have to complete the actions below

## Environment variables
This app includes quite a few environment variables that need to be filled in so it works properly (put this inside the .env file inside the root folder)

```bash
PORT - port of the backend server
REDIS_PORT - port of the redis server
PGCONNECTIONSTRING - database connection string
FRONTEND_URL - url of the frontend
BACKEND_URL - url of the backend
JWT_SECRET - secret used in signing the JWT, can be completely random
STRIPE_PUBLISHABLE_KEY - public key used by the frontend to initialize Stripe payments
STRIPE_SECRET_KEY - secret key used by the backend to create payments, subscriptions, and manage Stripe resources
STRIPE_WEBHOOK_SECRET - secret used to verify incoming Stripe webhook events
STRIPE_BILLING_PORTAL - URL to the Stripe billing portal where users can manage subscriptions and payment methods
STRIPE_PLUS_PRICE_ID - Stripe price ID for the Plus subscription plan
STRIPE_PREMIUM_PRICE_ID - Stripe price ID for the Premium subscription plan
STRIPE_PRO_PRICE_ID - Stripe price ID for the Pro subscription plan
STRIPE_1000_CREDITS_PRICE_ID - Stripe price ID for purchasing a package of 1000 credits
STRIPE_500_CREDITS_PRICE_ID - Stripe price ID for purchasing a package of 500 credits
STRIPE_250_CREDITS_PRICE_ID - Stripe price ID for purchasing a package of 250 credits

VITE_CLIENT_ID - OAuth client ID used by the frontend application built with Vite for authentication providers

GOOGLE_CLIENT_ID - OAuth client ID issued by Google for Google login
GOOGLE_CLIENT_SECRET - OAuth client secret used by the backend to exchange authorization codes with Google
GOOGLE_REDIRECT_URI - backend URL where Google redirects users after successful authentication

GITHUB_CLIENT_ID - OAuth client ID issued by GitHub for GitHub login
GITHUB_CLIENT_SECRET - OAuth client secret used by the backend to exchange authorization codes with GitHub
GITHUB_REDIRECT_URI - backend URL where GitHub redirects users after successful authentication
```


And for tests, create a new file called .test.env inside the root folder and assign this variable:
```bash
PGCONNECTIONSTRING - A connection string for a seperate database used for testing purposes. I recommend to use pgAdmin4 for creating databases, but it's for you to decide
```

## Setting up Redis
If you are on Windows and Redis is not available natively, you can use WSL or Docker in order for this to work. 
Open up Ubuntu and run these commands
```bash
redis-cli
PING
```
You should get a response back saying
```bash
PONG
```

## Setting up Stripe
Inside the root folder of the project, go into the terminal and run
```bash
cd backend
stripe login
```
A prompt will appear asking if you trust the source, click Allow access. After that, go back to the terminal and run
```bash
pnpm stripe-forward
```
Now you should be able to receive various Stripe events that come from operations such as successful payments, subscription updates and more.

## Running tests
This project has both unit and integration tests. To run unit tests navigate into the frontend folder, for integration tests navigate into the backend folder and run this command
```bash
pnpm test
```
After some time you should see the results of those tests. 
