import React from 'react';

export default function FilterLocation({ selected, onChange }) {
    const locations = [
        'All Locations',
        'Jogja',
        'Boyolali',
        'Jakarta',
        'Bandung',
        'Semarang',
        'Surabaya'
    ];

    return (
        <div className="flex">
            <div className="relative">
                <select
                    value={selected}
                    onChange={(e) => onChange(e.target.value)}
                    className="appearance-none bg-[#2D1606] text-white rounded-full font-quicksand py-2 pl-10 pr-6 focus:outline-none shadow-md cursor-pointer font-semibold text-sm h-[40px]"
                >
                    {locations.map((loc) => (
                        <option key={loc} value={loc}>
                            {loc}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
            </div>
        </div>
    );
}
