import React from 'react';
import AppLayout from '@/Layouts/AppLayout';

export default function TermsOfService() {
    return (
        <AppLayout title="Terms of Service">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8 sm:p-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Terms of Service</h1>
                    <div className="prose prose-blue max-w-none text-gray-600">
                        <p className="mb-6">Last updated: {new Date().toLocaleDateString()}</p>
                        
                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
                        <p className="mb-4">
                            By accessing or using the KOKODA platform, you agree to be bound by these Terms of Service. 
                            If you do not agree to all the terms and conditions of this agreement, you may not access the website or use any services.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Description of Service</h2>
                        <p className="mb-4">
                            KOKODA provides a platform for users to report lost and found items. We aim to help reunite owners with their lost belongings through community engagement.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Conduct</h2>
                        <p className="mb-4">
                            You agree to use the platform only for lawful purposes. You are prohibited from:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2">
                            <li>Posting false, inaccurate, or misleading information about lost or found items.</li>
                            <li>Attempting to claim items that do not belong to you.</li>
                            <li>Harassing, intimidating, or threatening other users.</li>
                            <li>Using the service for any illegal or unauthorized purpose.</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Content Ownership</h2>
                        <p className="mb-4">
                            You retain all rights to the content you post on KOKODA. However, by posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, and display that content in connection with the service.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Disclaimer of Warranties</h2>
                        <p className="mb-4">
                            The service is provided on an "AS IS" and "AS AVAILABLE" basis. KOKODA makes no warranties, expressed or implied, regarding the accuracy, reliability, or success of finding lost items.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Limitation of Liability</h2>
                        <p className="mb-4">
                            In no event shall KOKODA be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Contact Information</h2>
                        <p className="mb-4">
                            If you have any questions about these Terms, please contact us at support@kokoda.com.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
