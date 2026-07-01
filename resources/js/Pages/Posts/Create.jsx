import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@inertiajs/react';
import GooglePlacesInput from '@/Components/Common/GooglePlacesInput';
import tailwindConfig from '../../../../tailwind.config.js';
import { useTranslation } from '@/hooks/useTranslation';

const { colors } = tailwindConfig.theme.extend;
const COLOR_PRIMARY = colors.primary;    // '#F4C799'
const COLOR_SECONDARY = colors.secondary; // '#C0976C'

export default function Create() {
    const { t } = useTranslation();
    const [preview, setPreview] = useState(null);
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        location_name: '',
        latitude: '',
        longitude: '',
        type: 'lost', // or 'found'
        image_url: null,
    });

    const handleLocationSelect = ({ place_name, latitude, longitude }) => {
        setData(prev => ({
            ...prev,
            location_name: place_name,
            latitude: latitude ?? '',
            longitude: longitude ?? '',
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image_url', file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create FormData for multipart/form-data
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('location_name', data.location_name);
        formData.append('latitude', data.latitude);
        formData.append('longitude', data.longitude);
        formData.append('type', data.type);
        if (data.image_url) {
            formData.append('image_url', data.image_url);
        }

        // Use Inertia post with FormData
        post(route('posts.store'), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                // Clear form on success
                setData({
                    title: '',
                    description: '',
                    location_name: '',
                    latitude: '',
                    longitude: '',
                    type: 'lost',
                    image_url: null,
                });
                setPreview(null);
            },
        });
    };

    const formFieldStyle = {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '8px',
        border: `2px solid ${COLOR_PRIMARY}`,
        fontSize: '14px',
        fontFamily: "'Quicksand', sans-serif",
        boxSizing: 'border-box',
        transition: 'border-color 0.2s ease',
        color: '#311A05',
        backgroundColor: '#FFFFFF',
    };

    const errorStyle = {
        color: '#D56666',
        fontSize: '12px',
        marginTop: '4px',
    };

    return (
        <AppLayout title="Create Post - KOKODA">
            <div style={{ padding: '32px 28px', maxWidth: '600px', margin: '0 auto' }}>

                <h1 style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#311A05',
                    margin: '0 0 24px 0',
                }}>
                    {t('post.reportLostOrFound')}
                </h1>

                <form onSubmit={handleSubmit}>

                    {/* Type Selection */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#311A05',
                            marginBottom: '10px',
                        }}>
                            {t('post.itemType')} <span style={{ color: '#D56666' }}>*</span>
                        </label>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {['lost', 'found'].map(type => (
                                <label key={type} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    cursor: 'pointer',
                                }}>
                                    <input
                                        type="radio"
                                        name="type"
                                        value={type}
                                        checked={data.type === type}
                                        onChange={(e) => setData('type', e.target.value)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <span style={{
                                        fontSize: '14px',
                                        color: '#333',
                                    }}>
                                        {type === 'lost' ? `❌ ${t('profile.lostItem')}` : `✅ ${t('profile.foundItem')}`}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#311A05',
                            marginBottom: '8px',
                        }}>
                            {t('post.title')} <span style={{ color: '#D56666' }}>*</span>
                        </label>
                        <input
                            type="text"
                            placeholder={t('post.titleExamplePlaceholder')}
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            onFocus={(e) => {
                                e.target.style.borderColor = COLOR_SECONDARY;
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = COLOR_PRIMARY;
                            }}
                            style={formFieldStyle}
                        />
                        {errors.title && <div style={errorStyle}>{errors.title}</div>}
                    </div>

                    {/* Location — Google Places Autocomplete */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#311A05',
                            marginBottom: '8px',
                        }}>
                            {t('profile.location')} <span style={{ color: '#D56666' }}>*</span>
                        </label>
                        <GooglePlacesInput
                            value={data.location_name}
                            onSelect={handleLocationSelect}
                            placeholder={t('post.searchLocationPlaceholder')}
                            inputStyle={{
                                ...formFieldStyle,
                                paddingLeft: '36px',
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = COLOR_SECONDARY;
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = COLOR_PRIMARY;
                            }}
                        />
                        {(errors.location_name || errors.latitude) && (
                            <div style={errorStyle}>{errors.location_name || errors.latitude}</div>
                        )}

                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#311A05',
                            marginBottom: '8px',
                        }}>
                            {t('post.description')} <span style={{ color: '#D56666' }}>*</span>
                        </label>
                        <textarea
                            placeholder={t('post.describeItemDetail')}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows="5"
                            style={{
                                ...formFieldStyle,
                                resize: 'vertical',
                                fontFamily: "'Quicksand', sans-serif",
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = COLOR_SECONDARY;
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = COLOR_PRIMARY;
                            }}
                        />
                        {errors.description && <div style={errorStyle}>{errors.description}</div>}
                    </div>

                    {/* Image Upload */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#311A05',
                            marginBottom: '8px',
                        }}>
                            {t('post.uploadImage')}
                        </label>
                        <div style={{
                            border: `2px dashed ${COLOR_PRIMARY}`,
                            borderRadius: '8px',
                            padding: '20px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
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
                                style={{ display: 'none' }}
                                id="image-input"
                            />
                            <label htmlFor="image-input" style={{ cursor: 'pointer' }}>
                                {preview ? (
                                    <div>
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '200px',
                                                borderRadius: '8px',
                                                marginBottom: '12px',
                                            }}
                                        />
                                        <p style={{
                                            fontSize: '12px',
                                            color: '#666',
                                            margin: 0,
                                        }}>
                                            {t('post.clickToChangeImage')}
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{
                                            fontSize: '32px',
                                            marginBottom: '8px',
                                        }}>
                                            📸
                                        </div>
                                        <p style={{
                                            fontSize: '14px',
                                            color: '#666',
                                            margin: 0,
                                        }}>
                                            {t('post.clickToUploadDrag')}
                                        </p>
                                    </div>
                                )}
                            </label>
                        </div>
                        {errors.image_url && <div style={errorStyle}>{errors.image_url}</div>}
                    </div>

                    {/* Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        marginTop: '32px',
                    }}>
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            style={{
                                flex: 1,
                                padding: '12px 20px',
                                backgroundColor: '#E8E8E8',
                                color: '#333',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                fontFamily: "'Quicksand', sans-serif",
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#D0D0D0';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#E8E8E8';
                            }}
                        >
                            {t('profile.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            style={{
                                flex: 1,
                                padding: '12px 20px',
                                backgroundColor: COLOR_PRIMARY,
                                color: '#FFF',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: processing ? 'not-allowed' : 'pointer',
                                fontFamily: "'Quicksand', sans-serif",
                                opacity: processing ? 0.6 : 1,
                                transition: 'all 0.2s ease',
                            }}
                            onMouseEnter={(e) => {
                                if (!processing) {
                                    e.currentTarget.style.backgroundColor = COLOR_SECONDARY;
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!processing) {
                                    e.currentTarget.style.backgroundColor = COLOR_PRIMARY;
                                }
                            }}
                        >
                            {processing ? t('post.creating') : t('post.createPost')}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
