import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { X } from 'lucide-react';

export default function CreatePostModal({ onClose }) {
    const [preview, setPreview] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});

    const [data, setDataState] = useState({
        title: '',
        description: '',
        location: '',
        type: 'lost',
        category: '',
        image_url: null,
    });

    const setData = (key, value) => {
        setDataState(prev => ({ ...prev, [key]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image_url', file);
            const reader = new FileReader();
            reader.onload = (ev) => {
                setPreview(ev.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('location', data.location);
        formData.append('type', data.type);
        formData.append('category', data.category);
        if (data.image_url instanceof File) {
            formData.append('image_url', data.image_url);
        }

        router.post(route('posts.store'), formData, {
            forceFormData: true,
            onSuccess: () => {
                setProcessing(false);
                onClose();
                window.location.href = '/home';
            },
            onError: (errs) => {
                setProcessing(false);
                setErrors(errs);
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    };

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fadeIn"
            />

            {/* Modal */}
            <div
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-base rounded-2xl w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto z-50 shadow-2xl animate-slideUp px-12"
            >
                {/* Header */}
                <div className="flex justify-between items-center py-14 border-b border-secondary sticky top-0 bg-base mb-4">
                    <h2 className="absolute left-1/2 transdorm -translate-x-1/2 font-quicksand text-3xl font-bold text-tertiary m-0">
                        Create Post
                    </h2>
                    <button
                        onClick={onClose}
                        className="absolute right-5 bg-none border-none text-2xl cursor-pointer text-gray-500 p-0 w-8 h-8 flex items-center justify-center"
                    >
                        <X size={64}/>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5">

                    {/* Warning Alert */}
                    <div className="mb-8 p-4 px-8 bg-highlight rounded-lg border border-primary flex gap-3 items-start">
                        <div className="text-4xl md:text-7xl flex-shrink-0 leading-none py-2 md:py-8">
                            ⚠️
                        </div>
                        <p className="m-0 font-quicksand text-sm md:text-xl py-2 md:py-8 font-bold text-label-lost leading-relaxed">
                            Untuk mencegah klaim palsu, mohon tidak mendeskripsikan ciri-ciri spesifik barang secara lengkap. Simpan beberapa detail unik sebagai pertanyaan validasi kepada pihak yang mengklaim nantinya.
                        </p>
                    </div>

                    {/* Type Selection */}
                    <div className="mb-8">
                        <label className="block font-quicksand text-5xl font-semibold text-tertiary mb-4">
                            Item Type <span className="text-label-lost">*</span>
                        </label>
                        <div className="flex rounded-lg p-2 shadow-md gap-0 w-fit border-2 border-primary">
                            {['lost', 'found'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setData('type', type)}
                                    className={`px-12 py-3 rounded-lg border-none text-base font-bold cursor-pointer font-quicksand transition-all duration-300 uppercase tracking-wide ${data.type === type
                                        ? (type === 'lost' ? 'bg-label-lost text-base' : 'bg-label-found text-base')
                                        : 'bg-transparent text-tertiary hover:bg-gray-200 hover:bg-opacity-20'
                                        }`}
                                    type="button"
                                >
                                    {type === 'lost' ? 'Lost' : 'Found'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="mb-8">
                        <label className="block font-quicksand text-5xl font-semibold text-tertiary mb-4">
                            Title <span className="text-label-lost">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Item title"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg border-2 border-primary text-xl font-quicksand box-border transition-colors focus:border-secondary outline-none"
                        />
                        {errors.title && <div className="text-label-lost text-xl mt-0.75">{errors.title}</div>}
                    </div>

                    {/* Category */}
                    <div className="mb-8">
                        <label className="block font-quicksand text-5xl font-semibold text-tertiary mb-4">
                            Category
                        </label>
                        <input
                            type="text"
                            placeholder="e.g., Wallet, Phone, Keys"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg border-2 border-primary text-xl font-quicksand box-border transition-colors focus:border-secondary outline-none"
                        />
                        {errors.category && <div className="text-label-lost text-xl mt-0.75">{errors.category}</div>}
                    </div>

                    {/* Location */}
                    <div className="mb-8">
                        <label className="block font-quicksand text-5xl font-semibold text-tertiary mb-4">
                            Location <span className="text-label-lost">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Where found/lost?"
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg border-2 border-primary text-xl font-quicksand box-border transition-colors focus:border-secondary outline-none"
                        />
                        {errors.location && <div className="text-label-lost text-xl mt-0.75">{errors.location}</div>}
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <label className="block font-quicksand text-5xl font-semibold text-tertiary mb-4">
                            Description <span className="text-label-lost">*</span>
                        </label>
                        <textarea
                            placeholder="Describe the item..."
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows="4"
                            className="w-full px-3 py-5 rounded-lg border-2 border-primary text-xl font-quicksand box-border transition-colors focus:border-secondary outline-none resize-vertical min-h-[100px]"
                        />
                        {errors.description && <div className="text-label-lost text-xl mt-0.75">{errors.description}</div>}
                    </div>

                    {/* Image Upload */}
                    <div className="mb-8">
                        <label className="block font-quicksand text-5xl font-semibold text-tertiary mb-4">
                            Image
                        </label>
                        <div className="border-2 border-dashed border-primary rounded-lg py-32 px-4 text-center cursor-pointer transition-all hover:bg-orange-100"
                            onDragOver={(e) => {
                                e.preventDefault();
                                e.currentTarget.style.backgroundColor = '#FFF5E6';
                            }}
                            onDragLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'transparent';
                            }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="modal-image-input"
                            />
                            <label htmlFor="modal-image-input" className="cursor-pointer">
                                {preview ? (
                                    <div>
                                        <img src={preview} alt="Preview" className="max-w-full max-h-[240px] rounded-lg mx-auto mb-2" />
                                        <p className="text-xs text-gray-600 m-0">
                                            Click to change
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="text-2xl mb-1">📸</div>
                                        <p className="text-xs text-gray-600 m-0">
                                            Click to upload
                                        </p>
                                    </div>
                                )}
                            </label>
                        </div>
                        {errors.image_url && <div className="text-label-lost text-xs mt-0.75">{errors.image_url}</div>}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2.5 mt-5">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 px-2.5 py-2 bg-primary text-white border-none rounded-lg text-2xl font-semibold cursor-pointer font-quicksand transition-all hover:bg-secondary disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Creating...' : 'Post'}
                        </button>
                    </div>
                </form>

                {/* CSS Animations */}
                <style>{`
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes slideUp {
                        from {
                            opacity: 0;
                            transform: translate(-50%, -40%);
                        }
                        to {
                            opacity: 1;
                            transform: translate(-50%, -50%);
                        }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.2s ease;
                    }
                    .animate-slideUp {
                        animation: slideUp 0.3s ease;
                    }
                `}</style>
            </div>
        </>
    );
}
