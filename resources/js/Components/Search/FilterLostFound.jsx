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
                        className={`px-8 py-2 rounded-full font-quicksand font-bold transition-all shadow-md border-2 ${
                            isSelected
                                ? 'bg-highlight text-tertiary border-secondary'
                                : 'bg-white text-tertiary border-primary hover:bg-primary/30'
                        }`}
                    >
                        {f.label}
                    </button>
                );
            })}
        </div>
    );
}
