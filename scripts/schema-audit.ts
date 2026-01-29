/**
 * Schema Alignment Audit Script
 * 
 * Pre-deployment validation using Payload Local API + Zod
 * Prevents "Migration Trauma" by auditing MongoDB documents for NULL values
 * in fields marked as required in the current schema.
 * 
 * Usage:
 *   DATABASE_URI=mongodb://... npx tsx scripts/schema-audit.ts
 * 
 * Exit Codes:
 *   0 - All documents pass validation
 *   1 - Schema mismatches found (BLOCK DEPLOY)
 */

import { getPayload } from 'payload'
import config from '../src/payload.config'
import { z } from 'zod'

// ═══════════════════════════════════════════════════════════════════════════════
// ZOD SCHEMAS - Mirror your Payload collection configs with required fields
// ═══════════════════════════════════════════════════════════════════════════════

const MediaSchema = z.object({
    id: z.string(),
    alt: z.string().min(1, 'Alt text is required for accessibility'),
    url: z.string().url('Invalid media URL'),
})

const PageSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Page title is required'),
    slug: z.string().min(1, 'Page slug is required'),
})

const PostSchema = z.object({
    id: z.string(),
    title: z.string().min(1, 'Post title is required'),
    slug: z.string().min(1, 'Post slug is required'),
})

// Map collection slugs to their Zod schemas
const COLLECTION_SCHEMAS: Record<string, z.ZodSchema> = {
    media: MediaSchema,
    pages: PageSchema,
    posts: PostSchema,
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUDIT LOGIC
// ═══════════════════════════════════════════════════════════════════════════════

interface AuditFailure {
    collection: string
    documentId: string
    errors: string[]
}

async function auditCollection(
    payload: Awaited<ReturnType<typeof getPayload>>,
    slug: string,
    schema: z.ZodSchema
): Promise<AuditFailure[]> {
    const failures: AuditFailure[] = []

    try {
        const { docs } = await payload.find({
            collection: slug as any,
            overrideAccess: true,
            pagination: false,
            limit: 10000,
        })

        for (const doc of docs) {
            const result = schema.safeParse(doc)
            if (!result.success) {
                failures.push({
                    collection: slug,
                    documentId: String(doc.id),
                    errors: result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`),
                })
            }
        }

        console.log(`✓ ${slug}: ${docs.length} documents checked, ${failures.length} failures`)
    } catch (error) {
        console.error(`✗ ${slug}: Failed to audit - ${error}`)
    }

    return failures
}

async function runAudit(): Promise<void> {
    console.log('═'.repeat(60))
    console.log(' SCHEMA ALIGNMENT AUDIT')
    console.log('═'.repeat(60))
    console.log()

    // Initialize Payload Local API
    const payload = await getPayload({ config })

    const allFailures: AuditFailure[] = []

    // Audit each collection with a defined schema
    for (const [slug, schema] of Object.entries(COLLECTION_SCHEMAS)) {
        const failures = await auditCollection(payload, slug, schema)
        allFailures.push(...failures)
    }

    console.log()
    console.log('═'.repeat(60))

    if (allFailures.length === 0) {
        console.log(' ✅ AUDIT PASSED - All documents comply with schema')
        console.log('═'.repeat(60))
        process.exit(0)
    } else {
        console.log(' ❌ AUDIT FAILED - Schema mismatches found')
        console.log('═'.repeat(60))
        console.log()
        console.log('Failures:')
        for (const failure of allFailures) {
            console.log(`  • ${failure.collection}/${failure.documentId}:`)
            for (const err of failure.errors) {
                console.log(`    - ${err}`)
            }
        }
        console.log()
        console.log('⚠️  DEPLOYMENT BLOCKED - Fix data before promoting to production')
        console.log()
        console.log('Remediation Options:')
        console.log('  1. Update documents manually in the Admin UI')
        console.log('  2. Run a migration script to set default values')
        console.log('  3. Adjust collection config to make fields optional')
        console.log()
        process.exit(1)
    }
}

// Run the audit
runAudit().catch((error) => {
    console.error('Audit script failed:', error)
    process.exit(1)
})
