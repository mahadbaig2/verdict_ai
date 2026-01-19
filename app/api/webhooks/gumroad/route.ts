import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const contentType = req.headers.get('content-type') || '';
        let payload: any = {};

        if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            payload = Object.fromEntries(formData.entries());
        } else {
            payload = await req.json();
        }

        console.log('Gumroad Webhook Received:', {
            contentType,
            payload
        });

        const email = payload.email || payload.purchaser_email;

        if (!email) {
            console.error('Gumroad Webhook Error: No email found in payload', payload);
            return new NextResponse('Missing email', { status: 400 });
        }

        const genericPassword = "VerdictAI2026";

        console.log(`Attempting to create/update user: ${email}`);

        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password: genericPassword,
            email_confirm: true,
        });

        if (authError) {
            if (authError.message.includes('already registered') || authError.status === 422) {
                console.log('User already exists in Auth, fetching profile to upgrade');

                // Fetch user by email to get ID
                const { data: userData, error: userError } = await supabaseAdmin
                    .from('users')
                    .select('id')
                    .eq('email', email)
                    .single();

                if (userError || !userData) {
                    console.error('Error fetching existing user profile:', userError);
                    // If profile doesn't exist but auth does, we might need to create profile
                    // This could happen if trigger failed previously
                    return new NextResponse('User exists but profile missing', { status: 500 });
                }

                console.log(`Upgrading existing user ${userData.id} to Pro`);
                const { error: updateError } = await supabaseAdmin.from('users').update({
                    plan: 'pro',
                    credits: 100
                }).eq('id', userData.id);

                if (updateError) {
                    console.error('Error updating profile:', updateError);
                    return new NextResponse('Update error', { status: 500 });
                }
            } else {
                console.error('Supabase Auth Admin Error:', authError);
                return new NextResponse(`Auth error: ${authError.message}`, { status: 500 });
            }
        } else if (authData.user) {
            console.log(`New user created: ${authData.user.id}. Upserting Pro profile.`);

            const { error: dbError } = await supabaseAdmin.from('users').upsert({
                id: authData.user.id,
                email: email,
                plan: 'pro',
                credits: 100
            });

            if (dbError) {
                console.error('Supabase DB Upsert Error:', dbError);
                return new NextResponse('DB error', { status: 500 });
            }
        }

        console.log('Gumroad Webhook Processed Successfully');
        return new NextResponse('Success', { status: 200 });
    } catch (error: any) {
        console.error('Gumroad Webhook Crash:', error);
        return new NextResponse(`Internal Error: ${error.message}`, { status: 500 });
    }
}
