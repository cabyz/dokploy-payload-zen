import { getGlobals } from '@/lib/api'

export async function Header() {
    // Fetch header data from CMS API
    const header = await getGlobals('header', { revalidate: 60 })

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur dark:bg-gray-900/80">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <a href="/" className="text-xl font-bold">
                    WLF
                </a>
                <nav className="flex items-center gap-6">
                    {header?.navItems?.map((item: any, i: number) => (
                        <a
                            key={i}
                            href={item.link?.url || '#'}
                            className="text-sm font-medium hover:text-blue-600"
                        >
                            {item.link?.label}
                        </a>
                    ))}
                </nav>
            </div>
        </header>
    )
}
