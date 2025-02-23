import axios from 'axios';
import { NextResponse } from 'next/server';

const CASHFREE_API_URL = 'https://sandbox.cashfree.com/pg/orders';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const order_id = searchParams.get('order_id');

  if (!order_id) {
    return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
  }

  try {
    const response = await axios.get(`${CASHFREE_API_URL}/${order_id}`, {
      headers: {
        'x-client-id': process.env.NEXT_PUBLIC_CASHFREE_CLIENT_ID,
        'x-client-secret': process.env.NEXT_PUBLIC_CASHFREE_CLIENT_SECRET,
        'x-api-version': '2023-08-01',
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(
      'Error fetching payment status:',
      error.response?.data || error.message
    );
    return NextResponse.json(
      {
        error: 'Failed to fetch payment status',
        details: error.response?.data || error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
