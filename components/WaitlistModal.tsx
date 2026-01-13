"use client";

import { useState } from 'react';
import { X, Check, Loader2, ArrowRight } from 'lucide-react';

interface WaitlistModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    if (!isOpen) return null;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');

        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(data.message);
                setTimeout(() => {
                    onClose();
                    setStatus('idle');
                    setEmail('');
                }, 3000);
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong');
            }
        } catch (err) {
            setStatus('error');
            setMessage('Failed to connect.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-md bg-gray-900 border border-green-900/50 rounded-2xl shadow-2xl p-8 overflow-hidden">
                {/* Glow effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-500/20 rounded-full blur-[60px]" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="relative z-10 text-center">
                    {status === 'success' ? (
                        <div className="py-8 animate-in fade-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Check className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold text-white mb-2">You're In.</h3>
                            <p className="text-gray-400">{message}</p>
                        </div>
                    ) : (
                        <>
                            <h3 className="text-2xl font-serif font-bold text-white mb-2">Join the Inner Circle</h3>
                            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                                Verdict AI is currently limiting access to ensure quality analysis.
                                Join the waitlist to secure your spot.
                            </p>

                            <form onSubmit={handleSubmit} className="relative">
                                <input
                                    type="email"
                                    placeholder="founder@startup.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all mb-4"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-green-600 hover:bg-green-500 text-black font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group"
                                >
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            Join Waitlist <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                                {status === 'error' && (
                                    <p className="text-red-400 text-xs mt-3">{message}</p>
                                )}
                                <p className="text-gray-500 text-xs mt-4">
                                    Limited to 100 spots this week.
                                </p>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
