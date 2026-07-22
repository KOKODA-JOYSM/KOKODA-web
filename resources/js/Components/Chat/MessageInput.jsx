import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Send, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function MessageInput({ value, onChange, onSend, onSendImage, disabled = false }) {
    const { t } = useTranslation();
    const fileInputRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            if (disabled) return;
            if (selectedFile) {
                handleSendImage();
            } else {
                onSend();
            }
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert(t('chat.unsupportedFileFormat'));
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert(t('chat.fileTooLarge'));
            return;
        }

        setSelectedFile(file);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);

        // Reset file input so same file can be re-selected
        event.target.value = '';
    };

    const handleCancelPreview = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
        setSelectedFile(null);
    };

    const handleSendImage = () => {
        if (selectedFile && onSendImage) {
            onSendImage(selectedFile, value.trim());
            // Cleanup preview
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
            setImagePreview(null);
            setSelectedFile(null);
            onChange('');
        }
    };

    const handleSendClick = () => {
        if (selectedFile) {
            handleSendImage();
        } else {
            onSend();
        }
    };

    const canSend = selectedFile || value.trim();

    return (
        <div className="shrink-0 border-t border-secondary/25 bg-[#FBF4E8] px-4 py-4 md:px-6 md:py-5">
            {/* Image Preview */}
            {imagePreview && (
                <div className="mx-auto mb-3 flex w-full max-w-[760px] items-start gap-3">
                    <div className="relative inline-block">
                        <div className="overflow-hidden rounded-xl border-2 border-secondary/40 bg-base shadow-md">
                            <img
                                src={imagePreview}
                                alt={t('chat.previewAlt')}
                                className="h-24 w-24 object-cover md:h-28 md:w-28"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleCancelPreview}
                            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-transform hover:scale-110"
                            aria-label={t('chat.cancelImage')}
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>
                    <div className="flex flex-col justify-center pt-2">
                        <p className="font-roboto text-[12px] font-medium text-tertiary/70">
                            {t('chat.readyToSend')}
                        </p>
                        <p className="font-roboto text-[11px] text-tertiary/40">
                            {(selectedFile.size / 1024).toFixed(0)} KB • {selectedFile.name}
                        </p>
                    </div>
                </div>
            )}

            {/* Input Bar */}
            <div className="mx-auto flex w-full max-w-[760px] items-center gap-2 rounded-full border border-secondary/35 bg-base px-3 py-2 shadow-[0_8px_18px_rgba(0,0,0,0.08)] md:gap-3 md:px-4">
                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    onChange={handleFileSelect}
                />

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-secondary/45 text-tertiary/70 transition-colors hover:bg-primary/50"
                    aria-label={t('chat.attachImage')}
                    disabled={disabled}
                >
                    <ImageIcon className="h-4 w-4" />
                </button>

                <input
                    type="text"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={selectedFile ? t('chat.pressEnterToSendImage') : t('chat.typeMessage')}
                    className="min-w-0 flex-1 border-0 bg-transparent px-0 py-0 font-roboto text-[13px] text-tertiary placeholder:text-tertiary/35 focus:outline-none focus:ring-0 md:text-[14px]"
                />

                <button
                    type="button"
                    onClick={handleSendClick}
                    className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-tertiary transition-transform hover:scale-105 hover:bg-secondary/70 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={t('chat.sendMessage')}
                    disabled={!canSend || disabled}
                >
                    <Send className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
