import AppLayout from '@/Layouts/AppLayout';
import TopRankings from '@/Components/Leaderboard/TopRankings';
import RankingsList from '@/Components/Leaderboard/RankingsList';
import CurrentUserCard from '@/Components/Leaderboard/CurrentUserCard';

export default function Leaderboard({ leaderboard = [], currentUser = null }) {
    const topThree = leaderboard.slice(0, 3);
    const restRanking = leaderboard.slice(3, 10);

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
                    <div className="bg-secondary rounded-lg p-3 shadow-lg flex flex-col h-[70vh] max-h-[600px] min-h-[400px]">
                        <div className="flex-1 overflow-y-auto no-scrollbar">
                            <RankingsList users={restRanking} />
                        </div>
                        {currentUser && (
                            <div className="mt-4 pt-4 border-t border-tertiary/20 shrink-0">
                                <CurrentUserCard user={currentUser} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

