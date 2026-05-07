import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/auth/fetchUser', () => {
    return HttpResponse.json([
      {
        id: 1,
        username: 'user1',
        email: 'user1@gmail.com',
        auth_provider: 'email',
        created_at: new Date('2026-01-31T15:20:03.089Z'),
        subscription: 'plus',
        credits: 1000,
        role: 'member',
        picture: null,
        user_history: [],
        stripe_customer_id: 'cus_DHWdjwenwewed',
        password: 'dweehujofdrewfbhbhuwhdewdfhrewhdwedjfwurihrewdnwhufrw',
        updated_at: new Date('2026-03-16T17:50:10.000Z'),
      },
    ]);
  }),

  http.post(
    'http://localhost:3000/api/server/create-checkout-session',
    async () => {
      return HttpResponse.json({ url: 'https://stripeTestUrl.com' });
    },
  ),

  http.post('http://localhost:3000/api/server/processFile', async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const convertingToFormat = formData.get('convertingToFormat') as string;
    const fileName = file.name.split(".")[0];
    const blob = new Blob([await file.arrayBuffer()]);
    return new HttpResponse(blob, {
      headers: {
        'Content-Type': `image/jpeg`,
        'Content-Disposition': `attachment; filename='${fileName}.${convertingToFormat}'`,
      },
    });
  }),
];
