import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const payload = Object.fromEntries(formData.entries());

        console.log('Gumroad Webhook Payload:', payload);

        // Gumroad sends price in cents? Or as a string? 
        // Let's check the most common fields: email, sale_id, price
        const email = payload.email as string;
        const price = payload.price as string; // pricing in cents usually
        const seller_id = payload.seller_id as string;

        if (!email) {
            return new NextResponse('Missing email', { status: 400 });
        }

        const genericPassword = process.env.GUMROAD_GENERIC_PASSWORD;
        if (!genericPassword) {
            console.error('Missing GUMROAD_GENERIC_PASSWORD');
            return new NextResponse('Configuration error', { status: 500 });
        }

        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password: genericPassword,
            email_confirm: true,
        });

        // User already exists maybe?
        if (authError) {
            if (authError.message.includes('already registered')) {
                console.log('User already exists, updating plan and credits');
                // Fetch user by email to get ID
                const { data: userData, error: userError } = await supabaseAdmin
                    .from('users')
                    .select('id')
                    .eq('email', email)
                    .single();

                if (userData) {
                    await supabaseAdmin.from('users').update({
                        plan: 'pro',
                        credits: 100
                    }).eq('id', userData.id);
                }
            } else {
                console.error('Supabase Auth Error:', authError);
                return new NextResponse('Auth error', { status: 500 });
            }
        } else if (authData.user) {
            // New user created, trigger handle_new_user should have been called, 
            // but let's ensure pro plan and credits are set.
            // Wait a small bit for the trigger to finish or just upsert.
            const { error: dbError } = await supabaseAdmin.from('users').upsert({
                id: authData.user.id,
                email: email,
                plan: 'pro',
                credits: 100
            });

            if (dbError) {
                console.error('Supabase DB Error:', dbError);
            }
        }

        return new NextResponse('Success', { status: 200 });
    } catch (error) {
        console.error('Gumroad webhook error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
