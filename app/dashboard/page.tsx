'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Loader2, Plus, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Idea {
    id: string;
    idea_summary: string;
    created_at: string;
    verdicts: Array<{
        verdict: 'go' | 'pivot' | 'kill';
        created_at: string;
    }>;
}

export default function DashboardPage() {
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        try {
            const currentUser = await getCurrentUser();
            if (!currentUser) {
                router.push('/auth');
                return;
            }

            const { data: ideasData } = await supabase
                .from('ideas')
                .select(`
          id,
          idea_summary,
          created_at,
          verdicts (
            verdict,
            created_at
          )
        `)
                .eq('user_id', currentUser.id)
                .order('created_at', { ascending: false });

            setIdeas(ideasData || []);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    }

    function getVerdictStyles(verdict: 'go' | 'pivot' | 'kill') {
        switch (verdict) {
            case 'go':
                return 'text-green-400 bg-green-500/10 border-green-500/20';
            case 'pivot':
                return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
            case 'kill':
                return 'text-red-400 bg-red-500/10 border-red-500/20';
            default:
                return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-end mb-12 border-b border-white/5 pb-6">
                <div>
                    <h1 className="font-serif text-3xl font-medium text-white mb-2">My Portfolio</h1>
                    <p className="text-gray-400 font-light">
                        Time to find the next unicorn or kill a bad idea before it starts.
                    </p>
                </div>
                <Link
                    href="/dashboard/new"
                    className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-black font-bold text-sm rounded-lg transition-all hover:scale-105 active:scale-95"
                >
                    <Plus className="w-4 h-4" /> New Analysis
                </Link>
            </div>

            {/* Content */}
            {ideas.length === 0 ? (
                <div className="text-center py-24 bg-white/[0.02] border border-white/5 rounded-xl border-dashed">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="font-serif text-xl font-medium text-white mb-2">No ideas analyzed yet</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                        Your portfolio is empty. Time to find the next unicorn or kill a bad idea before it starts.
                    </p>
                    <Link
                        href="/dashboard/new"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold text-sm rounded-full hover:bg-gray-200 transition-colors"
                    >
                        Start First Analysis
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {ideas.map((idea) => {
                        const verdict = idea.verdicts[0];
                        return (
                            <Link
                                key={idea.id}
                                href={`/dashboard/idea/${idea.id}`}
                                className="group block bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 rounded-xl p-6 transition-all"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-white group-hover:text-green-400 transition-colors mb-2 line-clamp-1">
                                            {idea.idea_summary}
                                        </h3>
                                        <p className="text-gray-500 text-xs font-mono">
                                            ANALYZED {new Date(idea.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            }).toUpperCase()}
                                        </p>
                                    </div>

                                    {verdict ? (
                                        <div className={`px-3 py-1 rounded text-xs font-bold tracking-wider uppercase border ${getVerdictStyles(verdict.verdict)}`}>
                                            {verdict.verdict}
                                        </div>
                                    ) : (
                                        <div className="px-3 py-1 rounded text-xs font-bold tracking-wider uppercase border border-gray-700 text-gray-500">
                                            PENDING
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
