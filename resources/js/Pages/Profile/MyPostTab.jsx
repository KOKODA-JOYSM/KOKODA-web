import { Link } from '@inertiajs/react';

export default function MyPostTab({ posts }) {
    if (posts.length === 0) {
        return (
            <div className="text-center py-12 bg-secondary/10 rounded-2xl text-tertiary font-semibold">
                Kamu belum membuat postingan apapun.
            </div>
        );
    }

    return (
        <>
            {posts.map((item) => (
                <div key={item.id} className="bg-secondary rounded-[20px] p-3 shadow-sm">
                    <div className="bg-base rounded-xl p-4 flex flex-col sm:flex-row gap-5 items-stretch">
                        <div className="w-full sm:w-48 h-36 rounded-lg overflow-hidden shrink-0 bg-gray-200">
                            <img 
                                src={item.image_url || 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=400&auto=format&fit=crop'} 
                                alt={item.title} 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col justify-between flex-1">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold text-tertiary mb-1.5">{item.title}</h3>
                                    <span className={`text-xs px-2.5 py-0.5 rounded font-bold uppercase ${item.type === 'lost' ? 'bg-label-lost text-base' : 'bg-label-found text-base'}`}>
                                        {item.type}
                                    </span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 bg-tertiary text-base text-xs font-semibold px-3 py-1 rounded-full mb-3">
                                    <span>{item.location || 'Lokasi tidak diketahui'}</span>
                                </div>
                                <p className="text-sm text-tertiary/80 line-clamp-2 mb-2 font-medium">{item.description}</p>
                                <Link href={`/posts/${item.id}`} className="text-xs text-secondary font-bold hover:underline">Read More</Link>
                            </div>
                            <div className="flex justify-end gap-2 mt-4 sm:mt-0">
                                <Link href={`/posts/${item.id}/edit`} className="bg-highlight text-tertiary hover:bg-yellow-400 text-sm font-bold px-4 py-1.5 rounded-lg shadow-sm transition-all duration-200">
                                    Edit
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}
