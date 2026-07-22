import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { useTranslation } from '@/hooks/useTranslation';

// Helper function to get cropped image
const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

export async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);

    ctx.drawImage(
        image,
        safeArea / 2 - image.width / 2,
        safeArea / 2 - image.height / 2
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
        data,
        Math.round(0 - safeArea / 2 + image.width / 2 - pixelCrop.x),
        Math.round(0 - safeArea / 2 + image.height / 2 - pixelCrop.y)
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((file) => {
            if (file) {
                file.name = 'cropped.jpeg';
                resolve(file);
            } else {
                reject(new Error('Canvas is empty'));
            }
        }, 'image/jpeg');
    });
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel }) {
    const { t } = useTranslation();
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            const croppedFile = new File([croppedImageBlob], "image.jpg", { type: "image/jpeg" });
            const previewUrl = URL.createObjectURL(croppedImageBlob);
            onCropComplete(croppedFile, previewUrl);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/90">
            <div className="relative flex-1 w-full h-full">
                <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={4 / 3}
                    onCropChange={setCrop}
                    onCropComplete={handleCropComplete}
                    onZoomChange={setZoom}
                />
            </div>
            <div className="p-4 bg-white/10 flex flex-col sm:flex-row items-center gap-4 justify-between">
                <div className="w-full sm:w-1/3 flex items-center gap-3">
                    <span className="text-white text-sm">Zoom</span>
                    <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e) => setZoom(e.target.value)}
                        className="w-full accent-primary"
                    />
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button
                        onClick={onCancel}
                        className="flex-1 sm:flex-none px-6 py-2.5 bg-gray-600 text-white rounded-lg font-quicksand font-bold hover:bg-gray-700 transition-colors"
                    >
                        {t('profile.cancel')}
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 sm:flex-none px-6 py-2.5 bg-primary text-white rounded-lg font-quicksand font-bold hover:bg-secondary transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
