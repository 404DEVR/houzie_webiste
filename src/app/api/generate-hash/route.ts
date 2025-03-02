import { toast } from '@/hooks/use-toast';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

const PAYU_KEY = process.env.NEXT_PUBLIC_PAYU_KEY;
const PAYU_SALT = process.env.NEXT_PUBLIC_PAYU_SALT;

export async function POST(request: Request) {
  try {
    const { txnid, amount, productinfo, firstname, email } =
      await request.json();

    if (!txnid || !amount || !productinfo || !firstname || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Ensure to include placeholders for udf1 to udf5
    const hashString = `${PAYU_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${PAYU_SALT}`;
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    return NextResponse.json({ hash });
  } catch {
    toast({ title: 'Error generating hash:' });
    return NextResponse.json(
      {
        error: 'Failed to generate hash',
      },
      { status: 500 }
    );
  }
}
