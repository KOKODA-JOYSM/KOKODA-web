import React, { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import { X } from 'lucide-react';
import GooglePlacesInput from '@/Components/Common/GooglePlacesInput';
import { useTranslation } from '@/hooks/useTranslation';
import ImageCropper from '@/Components/Common/ImageCropper';

export default function CreatePostModal({ onClose }) {
    const { t } = useTranslation();
    const [preview, setPreview] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState({});
    const [cropperSrc, setCropperSrc] = useState(null);
    const modalRef = useRef(null);

    const [data, setDataState] = useState({
        title: '',
        description: '',
        location_name: '',
        latitude: null,
        longitude: null,
        type: 'lost',
        image_url: null,
    });

    const setData = (key, value) => {
        setDataState(prev => ({ ...prev, [key]: value }));
        if (errors[key]) {
            setErrors(prev => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
    };

    const handleLocationSelect = ({ place_name, latitude, longitude }) => {
        setDataState(prev => ({
            ...prev,
            location_name: place_name,
            latitude,
            longitude,
        }));
        if (errors.location_name || errors.latitude || errors.longitude) {
            setErrors(prev => {
                const next = { ...prev };
                delete next.location_name;
                delete next.latitude;
                delete next.longitude;
                return next;
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setCropperSrc(ev.target.result);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    };

    const handleCropComplete = (croppedFile, previewUrl) => {
        setData('image_url', croppedFile);
        setPreview(previewUrl);
        setCropperSrc(null);
        if (errors.image_url) {
            setErrors(prev => {
                const next = { ...prev };
                delete next.image_url;
                return next;
            });
        }
    };

    const handleCropCancel = () => {
        setCropperSrc(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newErrors = {};

        if (!data.title || !data.title.trim()) {
            newErrors.title = t('post.titleRequired') || 'Judul postingan wajib diisi.';
        }

        if (!data.location_name || !data.location_name.trim()) {
            newErrors.location_name = t('post.locationRequired') || 'Lokasi wajib diisi.';
        } else if (data.latitude === null || data.latitude === '' || data.longitude === null || data.longitude === '') {
            newErrors.location_name = t('post.locationSelectRequired') || 'Silakan pilih lokasi dari daftar saran agar lokasi terdeteksi.';
        }

        if (!data.description || !data.description.trim()) {
            newErrors.description = t('post.descriptionRequired') || 'Deskripsi postingan wajib diisi.';
        }

        if (!data.image_url) {
            newErrors.image_url = t('post.imageRequired') || 'Gambar/Foto barang wajib diunggah.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            if (modalRef.current) {
                modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
            return;
        }

        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('location_name', data.location_name);
        formData.append('latitude', data.latitude ?? '');
        formData.append('longitude', data.longitude ?? '');
        formData.append('type', data.type);
        if (data.image_url instanceof File) {
            formData.append('image_url', data.image_url);
        }

        router.post(route('posts.store'), formData, {
            forceFormData: true,
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
                onClose();
            },
            onError: (errs) => {
                setProcessing(false);
                setErrors(errs);
                if (modalRef.current) {
                    modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                }
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
                ref={modalRef}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-base rounded-2xl w-11/12 max-w-5xl max-h-[90vh] overflow-y-auto z-50 shadow-2xl animate-slideUp px-6 md:px-12"
            >
                {/* Header */}
                <div className="flex justify-between items-center py-10 md:py-14 border-b border-secondary sticky top-0 bg-base mb-4 z-10">
                    <h2 className="absolute left-1/2 transform -translate-x-1/2 font-quicksand text-2xl md:text-3xl font-bold text-tertiary m-0">
                        {t('post.createPost')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="absolute right-5 bg-none border-none text-2xl cursor-pointer text-gray-500 p-0 w-8 h-8 flex items-center justify-center"
                    >
                        <X size={32} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-3 md:p-5">

                    {/* Top Error Alert Banner */}
                    {Object.keys(errors).length > 0 && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-400 rounded-xl font-quicksand text-sm md:text-base font-bold flex items-start gap-3 shadow-sm animate-fadeIn" style={{ color: '#311A05' }}>
                            <span className="text-2xl leading-none flex-shrink-0">⚠️</span>
                            <div>
                                <div style={{ color: '#311A05', fontWeight: '700' }}>{t('post.validationError') || 'Mohon lengkapi semua kolom yang wajib diisi.'}</div>
                                <ul className="mt-1.5 mb-0 pl-4 text-xs md:text-sm font-semibold list-disc space-y-0.5" style={{ color: '#311A05' }}>
                                    {Object.values(errors).map((err, idx) => (
                                        <li key={idx} style={{ color: '#311A05' }}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Warning Alert */}
                    <div className="mb-6 md:mb-8 p-4 px-4 md:px-8 bg-highlight rounded-lg border border-primary flex gap-3 items-start">
                        <div className="text-3xl md:text-5xl flex-shrink-0 leading-none py-1 md:py-4">
                            ⚠️
                        </div>
                        <p className="m-0 font-quicksand text-sm md:text-base py-1 md:py-4 font-bold leading-relaxed" style={{ color: '#311A05' }}>
                            {t('post.falseClaimWarning')}
                        </p>
                    </div>

                    {/* Type Selection */}
                    <div className="mb-6 md:mb-8">
                        <label className="block font-quicksand text-2xl md:text-3xl font-semibold text-tertiary mb-3 md:mb-4">
                            {t('post.itemType')} <span className="text-label-lost">*</span>
                        </label>
                        <div className="flex rounded-lg p-1.5 shadow-md gap-1.5 w-fit border-2 border-primary bg-primary">
                            {['lost', 'found'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setData('type', type)}
                                    className={`px-8 md:px-12 py-3 rounded-lg border-none font-bold cursor-pointer font-quicksand transition-all duration-300 uppercase tracking-wide text-tertiary ${
                                        data.type === type
                                            ? 'bg-highlight shadow-sm'
                                            : 'bg-base'
                                        }`}
                                    type="button"
                                >
                                    {type === 'lost' ? t('home.lost') : t('home.found')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="mb-6 md:mb-8">
                        <label className="block font-quicksand text-2xl md:text-3xl font-semibold text-tertiary mb-3 md:mb-4">
                            {t('post.title')} <span className="text-label-lost">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder={t('post.itemTitlePlaceholder')}
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className={`w-full px-3 py-2.5 rounded-lg border-2 text-base md:text-xl font-quicksand box-border transition-colors outline-none ${
                                errors.title ? 'border-red-500 bg-red-50' : 'border-primary focus:border-secondary'
                            }`}
                        />
                        {errors.title && <div className="text-label-lost text-sm mt-1">{errors.title}</div>}
                    </div>

                    {/* Location — Google Places Autocomplete */}
                    <div className="mb-6 md:mb-8">
                        <label className="block font-quicksand text-2xl md:text-3xl font-semibold text-tertiary mb-3 md:mb-4">
                            {t('profile.location')} <span className="text-label-lost">*</span>
                        </label>
                        <GooglePlacesInput
                            value={data.location_name}
                            onSelect={handleLocationSelect}
                            placeholder={t('post.searchLocationPlaceholder')}
                            className={`w-full py-2.5 pr-3 rounded-lg border-2 text-base md:text-xl font-quicksand box-border transition-colors outline-none ${
                                (errors.location_name || errors.latitude) ? 'border-red-500 bg-red-50' : 'border-primary focus:border-secondary'
                            }`}
                        />
                        {(errors.location_name || errors.latitude) && (
                            <div className="text-label-lost text-sm mt-1">
                                {errors.location_name || errors.latitude}
                            </div>
                        )}

                    </div>

                    {/* Description */}
                    <div className="mb-6 md:mb-8">
                        <label className="block font-quicksand text-2xl md:text-3xl font-semibold text-tertiary mb-3 md:mb-4">
                            {t('post.description')} <span className="text-label-lost">*</span>
                        </label>
                        <textarea
                            placeholder={t('post.describeItem')}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows="4"
                            className={`w-full px-3 py-5 rounded-lg border-2 text-base md:text-xl font-quicksand box-border transition-colors outline-none resize-vertical min-h-[100px] ${
                                errors.description ? 'border-red-500 bg-red-50' : 'border-primary focus:border-secondary'
                            }`}
                        />
                        {errors.description && <div className="text-label-lost text-sm mt-1">{errors.description}</div>}
                    </div>

                    {/* Image Upload */}
                    <div className="mb-6 md:mb-8">
                        <label className="block font-quicksand text-2xl md:text-3xl font-semibold text-tertiary mb-3 md:mb-4">
                            {t('post.image')} <span className="text-label-lost">*</span>
                        </label>
                        <div className={`border-2 border-dashed rounded-lg py-16 md:py-24 px-4 text-center cursor-pointer transition-all hover:bg-orange-100 ${
                            errors.image_url ? 'border-red-500 bg-red-50' : 'border-primary'
                        }`}
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
                                        <img src={preview} alt="Preview" className="max-w-full max-h-[200px] rounded-lg mx-auto mb-2" />
                                        <p className="text-xs text-gray-600 m-0">{t('post.clickToChange')}</p>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="text-5xl font-bold mb-1 text-tertiary">+</div>
                                        <p className="text-xs text-gray-600 m-0">{t('post.clickToUpload')}</p>
                                    </div>
                                )}
                            </label>
                        </div>
                        {errors.image_url && <div className="text-label-lost text-xs mt-1">{errors.image_url}</div>}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2.5 mt-5 mb-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 px-2.5 py-3 bg-primary text-white border-none rounded-lg text-base md:text-xl font-semibold cursor-pointer font-quicksand transition-all hover:bg-secondary disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {processing ? t('post.creating') : t('post.post')}
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

            {cropperSrc && (
                <ImageCropper
                    imageSrc={cropperSrc}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                />
            )}
        </>
    );
}
