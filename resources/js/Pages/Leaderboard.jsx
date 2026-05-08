import AppLayout from '@/Layouts/AppLayout';
import TopRankings from '@/Components/Leaderboard/TopRankings';
import RankingsList from '@/Components/Leaderboard/RankingsList';
import CurrentUserCard from '@/Components/Leaderboard/CurrentUserCard';

export default function Leaderboard() {
    // Mock data - ganti dengan API call nanti
    const mockLeaderboard = [
        { id: 1, name: 'John Liberto', points: 45, rank: 1 },
        { id: 2, name: 'Jennifer Blue', points: 40, rank: 2 },
        { id: 3, name: 'Dominic Cole', points: 38, rank: 3 },
        { id: 4, name: 'Joe Stanford', points: 36, rank: 4 },
        { id: 5, name: 'Juhoon Cotis', points: 35, rank: 5 },
        { id: 6, name: 'Lucas Sterling', points: 35, rank: 6 },
        { id: 7, name: 'Dominic Vane', points: 33, rank: 7 },
        { id: 8, name: 'Silas Thorne', points: 32, rank: 8 },
        { id: 9, name: 'Marcus Rhodes', points: 31, rank: 9 },
        { id: 10, name: 'Nathaniel Cole', points: 29, rank: 10 },
    ];

    const mockCurrentUser = { rank: 2301, name: 'You', points: 35 };

    const topThree = mockLeaderboard.slice(0, 3);
    const restRanking = mockLeaderboard.slice(3, 10);

    return (
        <AppLayout title="Leaderboard">
            <div className="min-h-screen bg-background px-6 pb-6 pt-[calc(4rem+1.5rem)] -mt-16 md:px-12 md:pb-12 md:pt-[calc(4rem+3rem)] lg:mt-0 lg:p-12">
                {/* Title */}
                <div className="mb-16">
                    <h1 className="font-quicksand text-3xl md:text-6xl font-bold text-secondary text-center drop-shadow-md">
                        Leaderboard
                    </h1>   
                </div>

                {/* Top 3 Rankings Component */}
                <TopRankings users={topThree} />

                {/* Combined Rankings Component */}
                <div className="max-w-3xl mx-auto px-4 w-full">
                    <div className="bg-secondary rounded-lg p-3 shadow-lg flex flex-col h-[100vh] min-h-[400px]">
                        <div className="flex-1 overflow-y-auto no-scrollbar">
                            <RankingsList users={restRanking} />
                        </div>
                        <div className="mt-4 pt-4 border-t border-tertiary/20 shrink-0">
                            <CurrentUserCard user={mockCurrentUser} />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
