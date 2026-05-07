import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { useForm } from '@inertiajs/react';
import tailwindConfig from '../../../../tailwind.config.js';

const { colors } = tailwindConfig.theme.extend;
const COLOR_PRIMARY = colors.primary;    // '#F4C799'
const COLOR_SECONDARY = colors.secondary; // '#C0976C'

export default function Edit({ post }) {
    const [preview, setPreview] = useState(post.image_url ? `/storage/${post.image_url}` : null);
    const { data, setData, patch, processing, errors } = useForm({
        title: post.title,
        description: post.description,
        location: post.location,
        type: post.type,
        category: post.category || '',
        status: post.status,
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('posts.update', post.id), {
            onSuccess: () => {
                // Redirect to post show page
                window.location.href = `/posts/${post.id}`;
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
    };

    const errorStyle = {
        color: '#D56666',
        fontSize: '12px',
        marginTop: '4px',
    };

    return (
        <AppLayout title={`Edit Post - KOKODA`}>
            <div style={{ padding: '32px 28px', maxWidth: '600px', margin: '0 auto' }}>
                
                <h1 style={{
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#311A05',
                    margin: '0 0 24px 0',
                }}>
                    Edit Post
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
                            Item Type <span style={{ color: '#D56666' }}>*</span>
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
                                        {type === 'lost' ? '❌ Lost Item' : '✅ Found Item'}
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
                            Title <span style={{ color: '#D56666' }}>*</span>
                        </label>
                        <input
                            type="text"
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

                    {/* Category */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#311A05',
                            marginBottom: '8px',
                        }}>
                            Category
                        </label>
                        <input
                            type="text"
                            value={data.category}
                            onChange={(e) => setData('category', e.target.value)}
                            style={formFieldStyle}
                            onFocus={(e) => {
                                e.target.style.borderColor = COLOR_SECONDARY;
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = COLOR_PRIMARY;
                            }}
                        />
                        {errors.category && <div style={errorStyle}>{errors.category}</div>}
                    </div>

                    {/* Location */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#311A05',
                            marginBottom: '8px',
                        }}>
                            Location <span style={{ color: '#D56666' }}>*</span>
                        </label>
                        <input
                            type="text"
                            value={data.location}
                            onChange={(e) => setData('location', e.target.value)}
                            style={formFieldStyle}
                            onFocus={(e) => {
                                e.target.style.borderColor = COLOR_SECONDARY;
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = COLOR_PRIMARY;
                            }}
                        />
                        {errors.location && <div style={errorStyle}>{errors.location}</div>}
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
                            Description <span style={{ color: '#D56666' }}>*</span>
                        </label>
                        <textarea
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

                    {/* Status */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            fontFamily: "'Quicksand', sans-serif",
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#311A05',
                            marginBottom: '10px',
                        }}>
                            Status <span style={{ color: '#D56666' }}>*</span>
                        </label>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            {['active', 'resolved'].map(status => (
                                <label key={status} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    cursor: 'pointer',
                                }}>
                                    <input
                                        type="radio"
                                        name="status"
                                        value={status}
                                        checked={data.status === status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                    <span style={{
                                        fontSize: '14px',
                                        color: '#333',
                                    }}>
                                        {status === 'active' ? 'Active' : 'Resolved'}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Current Image Preview */}
                    {preview && (
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{
                                display: 'block',
                                fontFamily: "'Quicksand', sans-serif",
                                fontSize: '14px',
                                fontWeight: '600',
                                color: '#311A05',
                                marginBottom: '8px',
                            }}>
                                Current Image
                            </label>
                            <img
                                src={preview}
                                alt="Current"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '200px',
                                    borderRadius: '8px',
                                    border: `2px solid ${COLOR_PRIMARY}`,
                                }}
                            />
                        </div>
                    )}

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
                            Cancel
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
                            {processing ? 'Updating...' : 'Update Post'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
