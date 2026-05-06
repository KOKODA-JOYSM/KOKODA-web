export default function RankingsList({ users }) {
    const getInitials = (name) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (!users || users.length === 0) return null;

    return (
        <div className="space-y-3">
            {users.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center gap-4 bg-tertiary rounded-lg p-5 shadow-md hover:shadow-lg hover:opacity-70 transition-all cursor-pointer"
                        >
                            <div className="font-quicksand font-bold text-base text-lg w-8">
                                {user.rank}
                            </div>
                            <div className="w-14 h-14 rounded-full bg-primary border-2 border-secondary flex items-center justify-center flex-shrink-0 shadow overflow-hidden">
                                {user.image ? (
                                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-lg font-bold text-tertiary">{getInitials(user.name)}</span>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-quicksand font-semibold text-base text-base truncate">
                                    {user.name}
                                </p>
                            </div>
                            <div className="font-quicksand font-bold text-base text-lg">
                                {user.points} pts
                            </div>
                        </div>
            ))}
        </div>
    );
}
