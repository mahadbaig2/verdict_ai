import { supabase } from './supabase';

export async function signUp(email: string, password: string, firstName?: string, lastName?: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName,
            }
        }
    });

    if (error) throw error;

    // If signup is successful, ensure the public user record is created/updated
    // Usually a trigger handles this, but we can do it explicitly for safety
    if (data.user) {
        await supabase.from('users').upsert({
            id: data.user.id,
            email: email,
            first_name: firstName,
            last_name: lastName,
            plan: 'free',
            credits: 0
        });
    }

    return data;
}

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    return data;
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
}

export async function getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
}

export async function updatePassword(password: string) {
    const { data, error } = await supabase.auth.updateUser({
        password: password
    });
    if (error) throw error;
    return data;
}
