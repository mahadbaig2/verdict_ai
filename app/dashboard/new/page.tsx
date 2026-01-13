'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Zap, Loader2 } from 'lucide-react';

export default function NewIdeaPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const [formData, setFormData] = useState({
        idea_summary: '',
        target_customer: '',
        geography: '',
        pricing: '',
        founder_background: '',
    });

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const session = await getSession();
            if (!session) {
                router.push('/auth');
                return;
            }

            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to analyze idea');
            }

            // Redirect to verdict page
            router.push(`/dashboard/idea/${data.idea_id}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setLoading(false);
        }
    }

    function updateField(field: string, value: string) {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }

    return (
        <div>
            <div className="mb-8 border-b border-white/5 pb-6">
                <h1 className="font-serif text-3xl font-medium text-white mb-2">New Analysis</h1>
                <p className="text-gray-400 font-light">
                    Submit your startup idea for a brutal, AI-driven investment verdict.
                </p>
            </div>

            <div className="max-w-3xl">
                {loading ? (
                    <div className="bg-white/5 backdrop-blur-lg rounded-xl p-12 border border-white/10 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-green-500/5 animate-pulse" />
                        <div className="relative z-10">
                            <div className="animate-spin mb-6 mx-auto w-12 h-12 text-green-500">
                                <Loader2 className="w-12 h-12" />
                            </div>
                            <h3 className="font-serif text-2xl font-bold text-white mb-3 tracking-wide">
                                CONSULTING THE COMMITTEE...
                            </h3>
                            <p className="text-gray-400 font-mono text-sm tracking-wider">
                                ANALYZING COMPETITORS • CHECKING REDDIT • CALCULATING RISK
                            </p>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Idea Summary */}
                        <div className="space-y-3">
                            <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">
                                1. What's the idea?
                            </label>
                            <textarea
                                value={formData.idea_summary}
                                onChange={(e) => updateField('idea_summary', e.target.value)}
                                required
                                rows={4}
                                className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600 transition-all font-light text-lg"
                                placeholder="e.g. A SaaS tool that automates..."
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Target Customer */}
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">
                                    2. Target Customer
                                </label>
                                <input
                                    type="text"
                                    value={formData.target_customer}
                                    onChange={(e) => updateField('target_customer', e.target.value)}
                                    required
                                    className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600 transition-all"
                                    placeholder="e.g. B2B Sales Teams"
                                />
                            </div>

                            {/* Geography */}
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">
                                    3. Target Geography
                                </label>
                                <input
                                    type="text"
                                    value={formData.geography}
                                    onChange={(e) => updateField('geography', e.target.value)}
                                    required
                                    className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600 transition-all"
                                    placeholder="e.g. US & Europe"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Pricing */}
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">
                                    4. Pricing Model
                                </label>
                                <input
                                    type="text"
                                    value={formData.pricing}
                                    onChange={(e) => updateField('pricing', e.target.value)}
                                    required
                                    className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600 transition-all"
                                    placeholder="e.g. $49/mo subscription"
                                />
                            </div>

                            {/* Founder Fit */}
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-300 uppercase tracking-wider">
                                    5. Your Background
                                </label>
                                <input
                                    type="text"
                                    value={formData.founder_background}
                                    onChange={(e) => updateField('founder_background', e.target.value)}
                                    required
                                    className="w-full px-5 py-4 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-600/50 focus:border-green-600 transition-all"
                                    placeholder="e.g. Ex-sales @ Oracle"
                                />
                                <p className="text-xs text-gray-500">
                                    Helper: We use this to calculate Founder-Market Fit.
                                </p>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
                                {error}
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group w-full px-6 py-4 bg-green-600 hover:bg-green-500 text-black text-lg font-bold rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-[0_0_20px_-5px_rgba(22,163,74,0.3)]"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Get The Verdict <Zap className="w-5 h-5 fill-black group-hover:scale-110 transition-transform" />
                                </span>
                            </button>
                            <p className="text-center text-gray-500 text-xs mt-4">
                                Analysis takes ~5-10 minutes.
                            </p>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
