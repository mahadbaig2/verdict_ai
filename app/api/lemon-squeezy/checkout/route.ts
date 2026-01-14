import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { setupLemonSqueezy } from '@/lib/lemonsqueezy';
import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js';

export async function POST(req: Request) {
    try {
        const { variantId } = await req.json();

        // Ensure Lemon Squeezy is configured
        setupLemonSqueezy();

        const storeId = process.env.LEMON_SQUEEZY_STORE_ID;
        if (!storeId) {
            throw new Error('Missing LEMON_SQUEEZY_STORE_ID');
        }

        // Get authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // Create checkout session
        const { data, error } = await createCheckout(storeId, variantId || process.env.NEXT_PUBLIC_LEMON_SQUEEZY_VARIANT_ID, {
            checkoutData: {
                email: user.email,
                custom: {
                    user_id: user.id,
                },
            },
            productOptions: {
                redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success`,
            },
        });

        if (error) {
            console.error('Lemon Squeezy Checkout Error:', error);
            return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });
        }

        return NextResponse.json({ url: data?.data.attributes.url });
    } catch (error) {
        console.error('Checkout error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
