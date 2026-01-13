import { Sidebar } from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-green-900 selection:text-green-50">
            <Sidebar />
            <main className="pl-64 min-h-screen">
                <div className="max-w-7xl mx-auto px-8 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
