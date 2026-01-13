import { supabaseAdmin } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
        }

        // Use the admin client for server-side operations
        const supabase = supabaseAdmin;

        const { error } = await supabase
            .from('waitlist')
            .insert({ email });

        if (error) {
            if (error.code === '23505') { // Unique violation
                return NextResponse.json({ message: 'You are already on the list!' }, { status: 200 });
            }
            console.error('Waitlist error:', error);
            return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Welcome to the inner circle.' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
