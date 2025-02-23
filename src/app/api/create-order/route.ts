import axios from 'axios';
import { NextResponse } from 'next/server';

const CASHFREE_API_URL = 'https://sandbox.cashfree.com/pg/orders';

export async function POST(request: Request) {
  try {
    const { amount, email, phone } = await request.json();

    if (!amount || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const orderData = {
      order_id: `order_${Date.now()}`,
      order_amount: amount,
      order_currency: 'INR',
      customer_details: {
        customer_id: `customer_${Date.now()}`,
        customer_email: email,
        customer_phone: phone,
      },
      order_meta: {
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-status?order_id={order_id}`,
      },
    };

    const response = await axios.post(CASHFREE_API_URL, orderData, {
      headers: {
        'x-client-id': process.env.NEXT_PUBLIC_CASHFREE_CLIENT_ID,
        'x-client-secret': process.env.NEXT_PUBLIC_CASHFREE_CLIENT_SECRET,
        'x-api-version': '2023-08-01',
        'Content-Type': 'application/json',
      },
    });

    return NextResponse.json({
      paymentSessionId: response.data.payment_session_id,
    });
  } catch (error: any) {
    console.error(
      'Error creating order:',
      error.response?.data || error.message
    );

    // Log additional details for debugging
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    return NextResponse.json(
      {
        error: 'Failed to create order',
        details: error.response?.data || error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
