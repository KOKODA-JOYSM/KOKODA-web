import ApplicationLogo from '@/Components/Auth/ApplicationLogo';
import { Link } from '@inertiajs/react';
import LanguageSwitcher from '@/Components/Common/LanguageSwitcher';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0 relative">
            <div className="absolute top-4 right-4 w-32">
                <LanguageSwitcher className="w-full" />
            </div>
            
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
