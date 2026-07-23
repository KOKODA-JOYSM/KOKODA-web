import React from 'react';
import AppLayout from '@/Layouts/AppLayout';

export default function ContactSupport() {
    return (
        <AppLayout title="Contact Support">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 sm:p-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Contact Support</h1>
                    <p className="text-lg text-gray-600 mb-8 text-center">
                        Need help with KOKODA? We're here for you.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-blue-50 p-6 rounded-xl">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Get in Touch</h2>
                            <p className="text-gray-600 mb-4">
                                Our support team is available Monday through Friday, 9:00 AM to 5:00 PM (WIB).
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center text-gray-600">
                                    <svg className="h-6 w-6 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    support@kokoda.com
                                </li>
                                <li className="flex items-center text-gray-600">
                                    <svg className="h-6 w-6 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    +62 812-3456-7890
                                </li>
                            </ul>
                        </div>

                        <div>
                            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                    <input type="text" id="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="Your Name" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" id="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="your@email.com" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                    <textarea id="message" rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="How can we help you?"></textarea>
                                </div>
                                <button type="button" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
