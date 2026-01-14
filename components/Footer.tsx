// components/Footer.tsx
import Link from 'next/link';
import React, { JSX } from 'react';   // optional with Next.js 13+, but harmless

export function Footer(): JSX.Element {
    return (
        <footer className="border-t border-white/5 py-12 bg-black text-sm">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-white rounded flex items-center justify-center font-serif font-bold text-black text-xs">
                            V
                        </div>
                        <span className="font-serif text-white/50">
                            Verdict.ai Ventures
                        </span>
                    </div>

                    <div className="flex gap-8 text-gray-500">
                        <Link href="/terms" className="hover:text-white transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="/privacy" className="hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                    </div>

                    <div className="text-xs font-mono text-gray-600">
                        © {new Date().getFullYear()} VERDICT AI.
                    </div>
                </div>
            </div>
        </footer>
    );
}