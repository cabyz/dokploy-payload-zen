import { getGlobals } from '@/lib/api'

export async function Footer() {
    // Fetch footer data from CMS API
    const footer = await getGlobals('footer', { revalidate: 60 })

    return (
        <footer className="border-t bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} WLF. All rights reserved.
                    </p>
                    <nav className="flex items-center gap-4">
                        {footer?.navItems?.map((item: any, i: number) => (
                            <a
                                key={i}
                                href={item.link?.url || '#'}
                                className="text-sm text-gray-500 hover:text-gray-900"
                            >
                                {item.link?.label}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>
        </footer>
    )
}
