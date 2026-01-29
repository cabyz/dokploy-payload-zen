import { getPage } from '@/lib/api'

// Simple text extractor for Lexical rich text
function extractText(richText: unknown): string {
    if (!richText || typeof richText !== 'object') return ''
    const root = (richText as { root?: { children?: unknown[] } }).root
    if (!root?.children) return ''

    return root.children.map((node: unknown) => {
        const n = node as { text?: string; children?: unknown[] }
        if (n.text) return n.text
        if (n.children) return extractText({ root: { children: n.children } })
        return ''
    }).join(' ')
}

export default async function HomePage() {
    const pageData = await getPage('home', { revalidate: 60 })
    const page = pageData.docs[0]

    if (!page) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                <div className="text-center text-white">
                    <h1 className="text-5xl font-bold mb-4">WLF Platform</h1>
                    <p className="text-xl text-slate-300">No content yet. Create a &quot;home&quot; page in CMS.</p>
                </div>
            </main>
        )
    }

    const heroText = extractText(page.hero?.richText)
    const pageTitle = page.title || 'WLF'
    const metaDescription = page.meta?.description || ''

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        {pageTitle}
                    </h1>
                    {heroText && (
                        <p className="text-2xl text-slate-300 mb-8">{heroText}</p>
                    )}
                    {metaDescription && (
                        <p className="text-lg text-slate-400">{metaDescription}</p>
                    )}
                </div>
            </section>

            {/* Data Proof Section */}
            <section className="py-16 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                        <h2 className="text-2xl font-bold text-white mb-4">✅ Split-Head Architecture Working</h2>
                        <div className="grid gap-4 text-slate-300">
                            <div className="flex items-center gap-3">
                                <span className="text-green-400">●</span>
                                <span>Frontend: Cloudflare Pages Edge</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-green-400">●</span>
                                <span>CMS API: Dokploy VPS</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-green-400">●</span>
                                <span>Data fetched via REST: /api/pages</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Raw Data Debug */}
            <section className="py-8 px-6">
                <div className="max-w-4xl mx-auto">
                    <details className="bg-black/30 rounded-xl p-4">
                        <summary className="text-white cursor-pointer font-semibold">View Raw CMS Data</summary>
                        <pre className="mt-4 text-xs text-green-400 overflow-auto max-h-64">
                            {JSON.stringify(page, null, 2)}
                        </pre>
                    </details>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 text-center text-slate-500">
                <p>© 2026 WLF • Powered by Payload CMS + Cloudflare Pages</p>
            </footer>
        </main>
    )
}
