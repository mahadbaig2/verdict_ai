'use client';

import { useState } from 'react';
import { Zap, Check, Shield, Sparkles } from 'lucide-react';
import { usePostHog } from 'posthog-js/react';
import { useRouter } from 'next/navigation';

export function PricingSection() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const posthog = usePostHog();

    const trackClick = (ctaName: string) => {
        posthog.capture('cta_clicked', {
            cta_name: ctaName,
            page: 'pricing_section'
        });
    };

    const features = [
        "100 AI Analysis Credits",
        "Deep Competitor Analysis",
        "Market Sentiment Insights",
        "Risk Matrix & Mitigation Plans",
        "Full PDF Readiness Reports",
        "Lifetime Access to Dashboard",
        "Priority Support",
        "Community Access"
    ];

    return (
        <section id="pricing" className="pb-24 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                        Invest in your <span className="text-green-500 italic">vision</span>.
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Stop guessing. Start iterating with data-backed verdicts. Get full lifetime access for a one-time payment.
                    </p>
                </div>

                <div className="max-w-md mx-auto">
                    <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group hover:border-green-500/30 transition-all duration-500">
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-white font-serif text-2xl font-bold mb-1">Lifetime Pass</h3>
                                    <p className="text-gray-500 text-sm">One payment, forever access.</p>
                                </div>
                                <div className="bg-green-600/20 text-green-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-500/20">
                                    Limited Time
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-white font-serif text-5xl font-bold">$19</span>
                                    <span className="text-gray-500 text-lg">.00</span>
                                </div>
                                <p className="text-gray-500 text-xs mt-2 line-through font-mono opacity-50">REGULAR PRICE: $99.00</p>
                            </div>

                            <div className="space-y-4 mb-10">
                                {features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-5 h-5 bg-green-600/10 rounded-full flex items-center justify-center border border-green-600/20">
                                            <Check className="w-3 h-3 text-green-500" />
                                        </div>
                                        <span className="text-gray-300 text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => {
                                    trackClick('pricing_get_lifetime_access');
                                    window.location.href = process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_URL || "#";
                                }}
                                disabled={loading}
                                className="w-full py-4 bg-green-600 hover:bg-green-500 text-black font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg hover:shadow-green-500/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                                ) : (
                                    <Zap className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                                )}
                                {loading ? 'Preparing...' : 'Get Lifetime Access'}
                            </button>


                            <div className="mt-6 flex items-center justify-center gap-6 text-[10px] text-gray-500 font-mono uppercase tracking-tighter">
                                <div className="flex items-center gap-1">
                                    <Shield className="w-3 h-3" /> Secure Payment
                                </div>
                                <div className="flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" /> Instant Setup
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">

                </div>
            </div>


        </section>
    );
}
