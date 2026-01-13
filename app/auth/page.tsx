'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/auth';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function AuthPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isSignUp) {
                await signUp(email, password);
                alert('Check your email to confirm your account!');
            } else {
                await signIn(email, password);
                router.push('/dashboard');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Authentication failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block mb-4">
                        <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center font-serif font-black text-3xl text-black mx-auto">V</div>
                    </Link>
                    <h1 className="text-3xl font-serif font-bold text-white mb-2">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h1>
                    <p className="text-gray-400 text-sm">
                        {isSignUp ? 'Start evaluating your startup ideas' : 'Sign in to access your dashboard'}
                    </p>
                </div>

                {/* Auth Form */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:bg-white/[0.06] focus:border-green-500/50 transition-all font-mono text-sm"
                                placeholder="you@company.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full px-4 py-3 bg-white/[0.03] border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:bg-white/[0.06] focus:border-green-500/50 transition-all font-mono text-sm"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-xs font-medium flex items-center gap-2">
                                <span className="block w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-4 bg-green-600 hover:bg-green-500 text-black font-bold uppercase tracking-wider rounded-lg transition-all transform hover:translate-y-[-1px] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? 'Authenticating...' : isSignUp ? 'Sign Up' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-white/5 text-center">
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setError('');
                            }}
                            className="text-gray-400 hover:text-white text-xs uppercase tracking-wider font-bold transition-colors"
                        >
                            {isSignUp
                                ? 'Existing user? Sign In'
                                : "No account? Create one"}
                        </button>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/" className="text-gray-600 hover:text-gray-400 text-xs font-mono transition-colors">
                        ← RETURN TO HOMEPAGE
                    </Link>
                </div>
            </div>
        </div>
    );
}
