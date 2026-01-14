"use client";

import Link from 'next/link';

interface LandingPageHeaderProps {
    onWaitlistClick?: () => void;
}

export function LandingPageHeader({ onWaitlistClick }: LandingPageHeaderProps) {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            // If on a different page (like /pricing), redirect to home with hash
            window.location.href = `/#${id}`;
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-gray-950/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center font-serif font-black text-xl text-black">V</div>
                    <span className="font-serif font-bold text-xl tracking-tight text-white">Verdict.ai</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <button onClick={() => scrollToSection('about')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Philosophy</button>
                    <button onClick={() => scrollToSection('pricing')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Pricing</button>
                    <button onClick={() => scrollToSection('contact')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Contact</button>
                </div>

                <div className="flex items-center gap-6">
                    <Link href="/auth" className="text-sm font-medium text-gray-400 hover:text-white transition-colors hidden sm:block">Sign In</Link>
                    <Link
                        href="/auth"
                        className="px-5 py-2 bg-white text-black font-bold text-sm rounded-full hover:bg-gray-200 transition-colors text-center"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </nav>
    );
}
