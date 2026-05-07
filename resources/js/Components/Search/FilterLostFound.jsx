import React from 'react';

export default function FilterLostFound({ selected, onChange }) {
    const filters = [
        { id: 'lost', label: 'Lost' },
        { id: 'found', label: 'Found' },
    ];

    return (
        <div className="flex gap-3 flex-wrap">
            {filters.map((f) => {
                const isSelected = selected === f.id;
                return (
                    <button
                        key={f.id}
                        onClick={() => onChange(isSelected ? 'all' : f.id)}
                        className={`px-8 py-2 rounded-full font-quicksand font-bold transition-all shadow-md ${
                            isSelected
                                ? 'bg-highlight text-tertiary'
                                : 'bg-base text-tertiary hover:bg-gray-100'
                        }`}
                    >
                        {f.label}
                    </button>
                );
            })}
        </div>
    );
}
