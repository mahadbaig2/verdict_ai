'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser, updatePassword } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Loader2, ShieldCheck, User, CreditCard, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserProfile {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    plan: 'free' | 'pro';
    credits: number;
}

export default function SettingsPage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        try {
            const currentUser = await getCurrentUser();
            if (!currentUser) {
                router.push('/auth');
                return;
            }

            const { data: userData, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', currentUser.id)
                .single();

            if (error) throw error;
            setProfile(userData);
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handlePasswordChange(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' });
            return;
        }

        setPasswordLoading(true);
        try {
            await updatePassword(newPassword);
            setMessage({ type: 'success', text: 'Password updated successfully' });
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update password' });
        } finally {
            setPasswordLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-12 border-b border-white/5 pb-6">
                <h1 className="font-serif text-3xl font-medium text-white mb-2">Account Settings</h1>
                <p className="text-gray-400 font-light">
                    Manage your account details, security, and subscription.
                </p>
            </div>

            <div className="space-y-8">
                {/* Profile Card */}
                <section className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="px-8 py-6 border-b border-white/5 bg-white/[0.01]">
                        <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-gray-400" />
                            <h2 className="text-white font-medium">Profile Information</h2>
                        </div>
                    </div>
                    <div className="p-8 grid md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-gray-500 text-xs font-mono uppercase tracking-widest mb-2">Full Name</label>
                            <div className="text-white text-lg">
                                {profile.first_name} {profile.last_name}
                                {!profile.first_name && <span className="text-gray-600 italic">Not set</span>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-500 text-xs font-mono uppercase tracking-widest mb-2">Email Address</label>
                            <div className="text-white text-lg">{profile.email}</div>
                        </div>
                    </div>
                </section>

                {/* Subscription Card */}
                <section className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="px-8 py-6 border-b border-white/5 bg-white/[0.01]">
                        <div className="flex items-center gap-3">
                            <CreditCard className="w-5 h-5 text-gray-400" />
                            <h2 className="text-white font-medium">Subscription & Usage</h2>
                        </div>
                    </div>
                    <div className="p-8 flex flex-wrap gap-8 items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div>
                                <label className="block text-gray-500 text-xs font-mono uppercase tracking-widest mb-2">Current Plan</label>
                                <div className="flex items-center gap-2">
                                    <span className={`text-lg font-bold uppercase tracking-tight ${profile.plan === 'pro' ? 'text-green-500' : 'text-white'}`}>
                                        {profile.plan === 'pro' ? 'Lifetime Pro Access' : 'Free Plan'}
                                    </span>
                                    {profile.plan === 'pro' && <ShieldCheck className="w-5 h-5 text-green-500" />}
                                </div>
                            </div>
                            <div className="w-px h-10 bg-white/5 hidden sm:block"></div>
                            <div>
                                <label className="block text-gray-500 text-xs font-mono uppercase tracking-widest mb-2">Available Credits</label>
                                <div className="text-white text-2xl font-serif">{profile.credits}</div>
                            </div>
                        </div>

                        {profile.plan === 'free' && (
                            <button
                                onClick={() => router.push('/pricing')}
                                className="px-6 py-2.5 bg-green-600 hover:bg-green-500 text-black font-bold text-sm rounded-lg transition-all"
                            >
                                Upgrade to Pro
                            </button>
                        )}
                    </div>
                </section>

                {/* Security Card */}
                <section className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-2xl shadow-green-950/20">
                    <div className="px-8 py-6 border-b border-white/5 bg-white/[0.01]">
                        <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5 text-gray-400" />
                            <h2 className="text-white font-medium">Security & Password</h2>
                        </div>
                    </div>
                    <div className="p-8">
                        <form onSubmit={handlePasswordChange} className="max-w-md space-y-6">
                            {message && (
                                <div className={`flex items-center gap-3 p-4 rounded-xl border ${message.type === 'success'
                                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                                    }`}>
                                    {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    <p className="text-sm">{message.text}</p>
                                </div>
                            )}

                            <div>
                                <label className="block text-gray-500 text-xs font-mono uppercase tracking-widest mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-700 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all"
                                    placeholder="Enter at least 6 characters"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-500 text-xs font-mono uppercase tracking-widest mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-700 focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all"
                                    placeholder="Confirm your new password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={passwordLoading}
                                className="w-full py-4 bg-white hover:bg-gray-200 disabled:bg-gray-800 disabled:text-gray-600 text-black font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                {passwordLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Update Password'}
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
}
