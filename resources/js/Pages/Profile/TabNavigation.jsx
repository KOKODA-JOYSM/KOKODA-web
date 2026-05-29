import React from 'react';

export default function TabNavigation({ activeTab, setActiveTab }) {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between pb-3 border-b-2 border-secondary/30 relative">
                {['request', 'my_post', 'history'].map((tab) => (
                    <React.Fragment key={tab}>
                        <div className="flex-1 flex justify-center">
                            <button
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-2.5 rounded-xl font-bold text-lg transition-all duration-200 capitalize ${
                                    activeTab === tab
                                        ? 'bg-secondary text-base shadow-md'
                                        : 'text-tertiary hover:text-secondary'
                                }`}
                            >
                                {tab.replace('_', ' ')}
                            </button>
                        </div>
                        {tab !== 'history' && <div className="h-8 w-0.5 bg-secondary/30"></div>}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
