'use client';

import Link from 'next/link';

export const Footer = () => {
    return (
        <footer className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <p className="text-base font-medium text-slate-900 dark:text-slate-50">© 2024 XD Code All Rights Reserved</p>
            <div className="flex flex-wrap gap-x-2">
                <Link
                    href="/privacy-policy"
                    className="link"
                >
                    Privacy Policy
                </Link>
                <Link
                    href="/terms-of-service"
                    className="link"
                >
                    Terms of Service
                </Link>
            </div>
        </footer>
    );
};
