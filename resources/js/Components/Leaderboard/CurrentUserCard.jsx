import { Link } from '@inertiajs/react';

export default function CurrentUserCard({ user }) {
    const getInitials = (name) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (!user) return null;

    return (
        <div className="flex items-center gap-4 bg-highlight rounded-lg p-5 shadow-md border-2 border-secondary">
                <div className="font-quicksand font-bold text-tertiary text-xl w-8 text-right tabular-nums flex-shrink-0">
                    {user.rank}
                </div>
                <div className="w-14 h-14 rounded-full bg-base border-2 border-secondary flex items-center justify-center flex-shrink-0 shadow overflow-hidden">
                    {user.profile_picture || user.image ? (
                        <img src={user.profile_picture || user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-lg font-bold text-tertiary">{getInitials(user.name)}</span>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-quicksand font-semibold text-tertiary text-lg truncate">
                        {user.name}
                    </p>
                </div>
                <div className="font-quicksand font-bold text-tertiary text-lg">
                    {user.points} pts
                </div>
        </div>
    );
}

