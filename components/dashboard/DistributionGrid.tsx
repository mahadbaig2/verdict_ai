import { Share2, Users, Globe, UserCheck } from 'lucide-react';

interface Collaborator {
    name: string;
    type: 'Influencer' | 'Platform' | 'Community' | 'Marketplace';
    leverage_reason: string;
    url?: string;
}

export function DistributionGrid({ collaborators }: { collaborators: Collaborator[] }) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'Influencer': return <UserCheck className="w-5 h-5 text-purple-400" />;
            case 'Platform': return <Globe className="w-5 h-5 text-blue-400" />;
            case 'Community': return <Users className="w-5 h-5 text-green-400" />;
            default: return <Share2 className="w-5 h-5 text-gray-400" />;
        }
    };

    return (
        <div className="mb-8">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5" /> Distribution Levers
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
                {collaborators.map((collab, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all hover:translate-y-[-2px] hover:shadow-lg hover:shadow-green-900/10">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                                {getIcon(collab.type)}
                            </div>
                            <div className="overflow-hidden">
                                <h3 className="font-bold text-white truncate text-sm">{collab.name}</h3>
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{collab.type}</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed border-t border-white/5 pt-2 font-light">
                            {collab.leverage_reason}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
