import React, { useState } from 'react';

export default function FilterLocation({ selected, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(selected === 'All Locations' ? '' : selected);

    const handleApply = () => {
        onChange(inputValue || 'All Locations');
        setIsOpen(false);
    };

    return (
        <div className="flex">
            {/* The Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="relative bg-[#2D1606] text-white rounded-full font-quicksand py-2 pl-10 pr-6 focus:outline-none shadow-md cursor-pointer font-semibold text-sm h-[40px] flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
                <div className="absolute left-3">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <span>{selected}</span>
            </button>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    {/* Modal Content */}
                    <div className="bg-[#FEFBF6] w-full max-w-md rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex justify-between items-center p-5 border-b-2 border-gray-200/50">
                            <h2 className="text-2xl font-quicksand font-bold text-[#2D1606]">Location</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="bg-[#2D1606] text-[#FEFBF6] rounded-lg p-1.5 hover:opacity-80 transition-opacity"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-5 flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-quicksand text-gray-500 font-bold tracking-wide">Fill Location</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-white">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="e.g. Magetan"
                                        className="w-full bg-[#2D1606] text-white rounded-md py-2.5 pl-9 pr-3 font-quicksand text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-600/50 transition-all placeholder:text-gray-400"
                                    />
                                </div>
                            </div>

                            {/* Map Container */}
                            <div className="w-full h-56 md:h-64 rounded-xl overflow-hidden border border-[#2D1606]/10 relative bg-gray-100">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(inputValue || 'Indonesia')}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                                ></iframe>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-5 pt-0 mt-2">
                            <button
                                onClick={handleApply}
                                className="w-full bg-[#2D1606] text-white rounded-xl py-3 font-quicksand font-bold text-base hover:bg-[#3d1e09] transition-colors shadow-md"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
