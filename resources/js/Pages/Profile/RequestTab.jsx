import { Link } from '@inertiajs/react';

export default function RequestTab({ posts }) {
    if (posts.length === 0) {
        return (
            <div className="text-center py-12 bg-secondary/10 rounded-2xl text-tertiary font-semibold">
                You haven't made any requests yet.
            </div>
        );
    }

    return (
        <>
            {posts.map((item) => (
                <div key={item.id} className="bg-secondary rounded-[20px] p-3 shadow-sm">
                    <div className="bg-base rounded-xl p-4 flex flex-col sm:flex-row gap-5 items-stretch">
                        {/* Gambar Item DB */}
                        <div className="w-full sm:w-48 h-36 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                            <img
                                src={item.image_url || 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=400&auto=format&fit=crop'}
                                alt={item.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Deskripsi & Detail DB */}
                        <div className="flex flex-col justify-between flex-1">
                            <div>
                                <h3 className="text-xl font-bold text-tertiary mb-1.5">{item.title}</h3>

                                <div className="inline-flex items-center gap-1.5 bg-tertiary text-base text-xs font-semibold px-3 py-1 rounded-full mb-3">
                                    <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                    </svg>
                                    <span>{(typeof item.location === 'object' ? item.location?.place_name : item.location) || 'Unknown location'}</span>
                                </div>

                                <p className="text-sm text-tertiary/80 line-clamp-2 mb-2 font-medium">
                                    {item.description}
                                </p>

                                {/* Link menuju detail halaman postingan */}
                                <Link href={`/posts/${item.id}`} className="text-xs text-secondary font-bold hover:underline">
                                    Read More
                                </Link>
                            </div>

                            {/* Action Button */}
                            <div className="flex justify-end mt-4 sm:mt-0">
                                <button className="bg-label-found hover:bg-blue-600 text-base text-sm font-bold px-5 py-1.5 rounded-lg shadow-sm transition-all duration-200">
                                    {item.type === 'lost' ? 'Found Item' : 'Claim Item'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}
