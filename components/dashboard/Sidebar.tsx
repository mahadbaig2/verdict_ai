"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Zap, LogOut, Settings, BarChart3 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    async function handleSignOut() {
        await supabase.auth.signOut();
        router.push('/');
    }

    const isActive = (path: string) => pathname === path;

    return (
        <aside className="w-64 bg-gray-950 border-r border-white/10 flex flex-col h-screen fixed left-0 top-0 z-40">
            {/* Header */}
            <div className="h-16 flex items-center px-6 border-b border-white/5">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center font-serif font-black text-xs text-black">V</div>
                    <span className="font-serif font-bold text-lg text-white tracking-tight">Verdict.ai</span>
                </Link>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-6 space-y-1">
                <Link
                    href="/dashboard"
                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive('/dashboard')
                            ? 'bg-white/10 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <LayoutDashboard className="w-4 h-4" />
                    My Portfolio
                </Link>

                <Link
                    href="/dashboard/new"
                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors group ${isActive('/dashboard/new')
                            ? 'bg-green-600/20 text-green-400 border border-green-600/20'
                            : 'text-gray-400 hover:text-green-400 hover:bg-green-600/10'
                        }`}
                >
                    <Zap className={`w-4 h-4 ${isActive('/dashboard/new') ? 'fill-green-400' : 'group-hover:fill-green-400'}`} />
                    New Analysis
                </Link>

                <Link
                    href="/dashboard/settings"
                    className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isActive('/dashboard/settings')
                            ? 'bg-white/10 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Settings className="w-4 h-4" />
                    Settings
                </Link>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/5">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-lg w-full transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
