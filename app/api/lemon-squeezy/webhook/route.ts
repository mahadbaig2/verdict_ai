import { NextResponse } from 'next/server';
import { verifyLemonSqueezyWebhook } from '@/lib/lemonsqueezy';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-signature');

        // Verify signature
        const isValid = await verifyLemonSqueezyWebhook(rawBody, signature);
        if (!isValid) {
            return new NextResponse('Invalid signature', { status: 401 });
        }

        const payload = JSON.parse(rawBody);
        const eventName = payload.meta.event_name;
        console.log('Lemon Squeezy Webhook:', eventName);

        if (eventName === 'order_created') {
            const { attributes } = payload.data;
            const customData = payload.meta.custom_data;
            const userId = customData?.user_id;

            if (!userId) {
                console.error('No user_id in webhook custom_data');
                return new NextResponse('Missing user_id', { status: 400 });
            }

            // Get current user credits
            const { data: user, error: fetchError } = await supabaseAdmin
                .from('users')
                .select('credits')
                .eq('id', userId)
                .single();

            if (fetchError || !user) {
                console.error('User not found in webhook handler:', userId);
                return new NextResponse('User not found', { status: 404 });
            }

            // Update user with lifetime access and credits
            const { error: updateError } = await supabaseAdmin
                .from('users')
                .update({
                    lemon_squeezy_customer_id: attributes.customer_id?.toString(),
                    lemon_squeezy_order_id: payload.data.id.toString(),
                    has_lifetime_access: true,
                    plan: 'pro',
                    credits: (user.credits || 0) + 100, // Grant 100 credits
                    updated_at: new Date().toISOString(),
                })
                .eq('id', userId);

            if (updateError) {
                console.error('Failed to update user from LS webhook:', updateError);
                return new NextResponse('Update failed', { status: 500 });
            }

            console.log(`✅ Success: Granted lifetime access to user ${userId}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook processing error:', error);
        return new NextResponse('Webhook error', { status: 500 });
    }
}
