"use client";

import Link from 'next/link';
import { ArrowRight, ShieldAlert, BarChart3, Lock, Zap, CheckCircle2, TrendingUp, Users, Mail, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { usePostHog } from 'posthog-js/react';
import { PricingSection } from './PricingSection';

import { LandingPageHeader } from './LandingPageHeader';

export function LandingPage() {
    const posthog = usePostHog();

    const trackClick = (ctaName: string) => {
        posthog.capture('cta_clicked', {
            cta_name: ctaName,
            page: 'landing_page'
        });
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white selection:bg-green-900 selection:text-green-50 overflow-hidden font-sans">

            {/* Background Effects */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-green-900/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-green-900/10 blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <LandingPageHeader />

            {/* Hero */}
            <main className="relative z-10 pt-32 pb-32 max-w-7xl mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-green-900/50 bg-green-900/10 text-green-400 text-xs font-medium uppercase tracking-widest mb-8">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        The AI Venture Partner
                    </div>

                    <h1 className="font-serif text-6xl md:text-8xl font-medium tracking-tight leading-[1.1] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
                        Stop building products <br />
                        <span className="italic text-white">nobody wants.</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        Get a brutally honest, data-driven investment verdict on your startup idea in 30 seconds. We roast your pitch before the market does.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => {
                                trackClick('hero_get_started');
                                window.open(process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_URL || "#", '_blank');
                            }}
                            className="group relative px-8 py-4 bg-green-600 hover:bg-green-500 text-black font-bold text-lg rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(22,163,74,0.5)] cursor-pointer"
                        >
                            Get Started
                            <ArrowRight className="inline-block w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="mt-12 text-sm text-gray-500 font-mono">
                        JOIN 5,000+ FOUNDERS Validating IDEAS
                    </div>
                </div>

                {/* Feature Grid (The Filter) */}
                <div className="grid md:grid-cols-3 gap-6 mb-32">
                    {[
                        {
                            icon: ShieldAlert,
                            title: "Kill The Noise",
                            desc: "90% of ideas fail because of no market need. We define the 'Kill' criteria instantly."
                        },
                        {
                            icon: BarChart3,
                            title: "Market Intelligence",
                            desc: "We scan Reddit, Hacker News, and competitors to find the real 'Hair on Fire' pain points."
                        },
                        {
                            icon: Lock,
                            title: "Confidential Memo",
                            desc: "Receive a professional 6-page Deal Memo analyzing your risks, moats, and distribution."
                        }
                    ].map((feature, i) => (
                        <div key={i} className="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <feature.icon className="w-24 h-24 text-white" />
                            </div>
                            <feature.icon className="w-10 h-10 text-green-500 mb-6" />
                            <h3 className="font-serif text-2xl font-medium text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* The Dashboard Preview (Tilt) */}
                <div className="relative mx-auto max-w-5xl perspective-1000 mb-40">
                    <div className="absolute inset-0 bg-green-500/20 blur-[100px] rounded-full z-0" />
                    <div className="relative z-10 bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden transform rotate-x-12 hover:rotate-0 transition-transform duration-700 ease-out">
                        <div className="h-8 bg-gray-800 border-b border-white/5 flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                        <div className="p-12 flex flex-col items-center justify-center text-center bg-gray-950/50 backdrop-blur-xl h-[400px]">
                            <span className="px-4 py-2 bg-green-900/30 border border-green-500/30 text-green-400 rounded-lg text-sm font-mono mb-4 animate-pulse">
                                AI ANALYSIS COMPLETE
                            </span>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">
                                VERDICT: <span className="text-green-500">GO</span>
                            </h2>
                            <p className="text-gray-400 max-w-md">
                                "Strong founder-market fit with clear demand signals in the B2B Fintech sector. Execution risk is moderate but manageable."
                            </p>
                        </div>
                    </div>
                </div>

                {/* About Section */}
                <div id="about" className="mb-40 max-w-4xl mx-auto text-center scroll-mt-24">
                    <h2 className="font-serif text-4xl mb-6 text-white">The Anti-"Yes Man" Philosophy</h2>
                    <p className="text-xl text-gray-400 leading-relaxed mb-8">
                        Most founders are surrounded by friends and family who say "that's a great idea" because they're nice. The market isn't nice. The market is brutal. We built Verdict.ai to be the brutally honest co-founder who tells you your baby is ugly *before* you spend 6 months building a nursery.
                    </p>
                    <div className="grid md:grid-cols-2 gap-8 text-left mt-12">
                        <div className="p-6 border-l-2 border-green-500 bg-white/5 rounded-r-xl">
                            <h3 className="font-bold text-white mb-2 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-500" /> Speed to Truth</h3>
                            <p className="text-gray-400">Don't spend weeks researching. Get a directional verdict in 30 seconds.</p>
                        </div>
                        <div className="p-6 border-l-2 border-white/20 bg-white/5 rounded-r-xl">
                            <h3 className="font-bold text-white mb-2 flex items-center gap-2"><Users className="w-5 h-5 text-gray-400" /> Founder Focus</h3>
                            <p className="text-gray-400">We analyze Founder-Market fit, not just the market itself.</p>
                        </div>
                    </div>
                </div>

                {/* Pricing Section */}
                <PricingSection />


                {/* Contact Section */}
                <div id="contact" className="mb-32 text-center max-w-2xl mx-auto scroll-mt-24">
                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <Mail className="w-12 h-12 text-gray-400 mx-auto mb-6" />
                        <h2 className="font-serif text-3xl mb-4 text-white">Get in Touch</h2>
                        <p className="text-gray-400 mb-8">
                            Have questions about the methodology? Want to partner with us? We read every email from a founder.
                        </p>
                        <a
                            href="mailto:getverdictai@gmail.com"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium"
                        >
                            getverdictai@gmail.com
                        </a>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="text-center">
                    <h2 className="font-serif text-4xl md:text-5xl font-medium text-white mb-8">
                        Ready to face the truth?
                    </h2>
                    <button
                        onClick={() => {
                            trackClick('footer_analyze_idea');
                            window.open(process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_URL || "#", '_blank');
                        }}
                        className="inline-flex items-center px-8 py-4 bg-white text-black font-bold text-lg rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        Analyze My Idea <Zap className="w-5 h-5 ml-2 fill-black" />
                    </button>
                </div>

            </main>

            {/* Footer */}
        </div>
    );
}
