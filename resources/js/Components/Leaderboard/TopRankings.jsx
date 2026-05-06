export default function TopRankings({ users }) {
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
        <div className="mb-20">
            <div className="flex flex-col md:flex-row items-end justify-center gap-6 md:gap-8 lg:gap-12 px-4 max-w-6xl mx-auto">
                {/* 2nd Place - Left */}
                {users[1] && (
                    <div className="flex flex-col items-center">
                        <div className="relative mb-4">
                            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 border-2 border-secondary flex items-center justify-center shadow-lg overflow-hidden">
                                {users[1].image ? (
                                    <img src={users[1].image} alt={users[1].name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl font-bold text-tertiary">{getInitials(users[1].name)}</span>
                                )}
                            </div>
                            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-secondary text-tertiary rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg border-2 border-secondary">
                                2
                            </div>
                        </div>
                        <h3 className="font-quicksand font-bold text-tertiary text-center text-base mt-4">
                            {users[1].name}
                        </h3>
                        <p className="font-quicksand font-semibold text-tertiary text-xl">
                            {users[1].points} pts
                        </p>
                    </div>
                )}

                {/* 1st Place - Center */}
                {users[0] && (
                    <div className="flex flex-col items-center order-first md:order-none">
                        <div className="text-6xl md:text-2xl"></div>
                        <div className="relative mb-4">
                            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-cyan-200 to-cyan-400 border-2 border-secondary flex items-center justify-center shadow-lg overflow-hidden">
                                {users[0].image ? (
                                    <img src={users[0].image} alt={users[0].name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-6xl font-bold text-tertiary">{getInitials(users[0].name)}</span>
                                )}
                            </div>
                            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-secondary text-tertiary rounded-full w-12 h-12 flex items-center justify-center font-bold text-2xl shadow-lg border-2 border-secondary">
                                1
                            </div>
                        </div>
                        <h3 className="font-quicksand font-bold text-tertiary text-center text-xl mt-4">
                            {users[0].name}
                        </h3>
                        <p className="font-quicksand font-semibold text-tertiary text-2xl">
                            {users[0].points} pts
                        </p>
                    </div>
                )}

                {/* 3rd Place - Right */}
                {users[2] && (
                    <div className="flex flex-col items-center">
                        <div className="relative mb-4">
                            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 border-2 border-secondary flex items-center justify-center shadow-lg overflow-hidden">
                                {users[2].image ? (
                                    <img src={users[2].image} alt={users[2].name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl font-bold text-white">{getInitials(users[2].name)}</span>
                                )}
                            </div>
                            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-secondary text-tertiary rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg border-2 border-secondary">
                                3
                            </div>
                        </div>
                        <h3 className="font-quicksand font-bold text-tertiary text-center text-base mt-4">
                            {users[2].name}
                        </h3>
                        <p className="font-quicksand font-semibold text-tertiary text-xl">
                            {users[2].points} pts
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
