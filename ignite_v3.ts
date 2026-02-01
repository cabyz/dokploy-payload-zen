#!/usr/bin/env npx tsx
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * IGNITE V3 - Sovereign Payload CMS Deployment
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This script handles the FULL deployment of a Payload CMS v3 application to Dokploy.
 * 
 * LESSONS LEARNED (from V1/V2 failures):
 * 1. MongoDB service names have RANDOM SUFFIX - must use appName, not name
 * 2. MongoDB must be explicitly DEPLOYED after creation (status goes from "idle" to "done")
 * 3. The Dockerfile MUST include `generate:importmap` BEFORE `next build`
 * 4. HOSTNAME=0.0.0.0 must be set for Next.js to accept external connections
 * 5. Use client.projects.remove() not client.project.remove() for deletion
 * 6. Wait for MongoDB to be healthy before deploying the application
 * 
 * REQUIREMENTS:
 * - Environment variables: DOKPLOY_TOKEN, DOKPLOY_URL
 * - GitHub repo must be accessible by Dokploy's GitHub integration
 * - The repo must have a Dockerfile with ImportMap generation step
 * 
 * @version 3.0.0
 * @author Zen Sovereign Agent (Elliot Mode)
 */

import { Dokploy } from "dokploy-sdk";

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION - Edit these values
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
    // Project
    projectName: "WLF Staging",
    projectDescription: "Payload CMS v3 - Staging Environment",

    // GitHub Repository (must be connected to Dokploy GitHub integration)
    githubRepo: "dokploy-payload-zen", // Just the repo name, not full path
    branch: "main",

    // MongoDB
    mongoName: "wlf-mongo",
    mongoUser: "root",
    mongoPassword: "rootpassword123",
    mongoImage: "mongo:6",

    // Application
    appName: "wlf-cms",

    // Domain (staging - use sslip.io for instant SSL or your own subdomain)
    domain: "staging.wlf.com.mx",

    // R2 Storage (Cloudflare)
    r2: {
        bucket: "wolf-media",
        accountId: "5fa6c26b9bd2ac548a0ef88eddcbcffb",
        accessKeyId: "ee3ad8837ae5c5b4ab8ebc961e6a2904",
        secretAccessKey: "c9f9c6c76e7b9f9a5517cf0e5459cd40ec6c07e2b193fd0b2b3aa82546b3df79",
        publicEndpoint: "https://media.wlf.com.mx",
    },

    // Secrets
    payloadSecret: "7f8e9d1c2b3a4f5e6d7c8b9a0f1e2d3c4r5t6y7u8i9o0p",
    cronSecret: "zen-cron-secret-2026",
    previewSecret: "zen-preview-secret-2026",
};

// ═══════════════════════════════════════════════════════════════════════════════
// SDK INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

const DOKPLOY_TOKEN = process.env.DOKPLOY_TOKEN;
const DOKPLOY_URL = process.env.DOKPLOY_URL;

if (!DOKPLOY_TOKEN || !DOKPLOY_URL) {
    console.error("❌ Missing DOKPLOY_TOKEN or DOKPLOY_URL environment variables");
    process.exit(1);
}

const client = new Dokploy({
    serverURL: `${DOKPLOY_URL}/api`,
    apiKeyAuth: DOKPLOY_TOKEN,
}) as any; // Type assertion to access all SDK methods

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function log(step: number, total: number, message: string) {
    console.log(`\n[${step}/${total}] ${message}`);
}

function success(message: string) {
    console.log(`✅ ${message}`);
}

function warn(message: string) {
    console.log(`⚠️  ${message}`);
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN DEPLOYMENT SEQUENCE
// ═══════════════════════════════════════════════════════════════════════════════

async function ignite() {
    console.log("═══════════════════════════════════════════════════════════════════");
    console.log("🚀 IGNITE V3 - Sovereign Payload CMS Deployment");
    console.log("═══════════════════════════════════════════════════════════════════");
    console.log(`📦 Target: ${CONFIG.projectName}`);
    console.log(`🔗 Dokploy: ${DOKPLOY_URL}`);
    console.log("");

    const TOTAL_STEPS = 7;

    try {
        // ─────────────────────────────────────────────────────────────────────────
        // STEP 1: Create Project
        // ─────────────────────────────────────────────────────────────────────────
        log(1, TOTAL_STEPS, "Creating Project...");

        const project = await client.project.create({
            name: CONFIG.projectName,
            description: CONFIG.projectDescription,
            env: "",
        });

        const projectId = project.projectId;
        const environmentId = project.environments?.[0]?.environmentId;

        if (!projectId || !environmentId) {
            throw new Error("Project creation returned invalid response - missing IDs");
        }

        success(`Project Created: ${projectId}`);
        success(`Environment ID: ${environmentId}`);

        // ─────────────────────────────────────────────────────────────────────────
        // STEP 2: Create MongoDB Service
        // ─────────────────────────────────────────────────────────────────────────
        log(2, TOTAL_STEPS, "Creating MongoDB Service...");

        const mongo = await client.mongo.create({
            environmentId: environmentId,
            name: CONFIG.mongoName,
            appName: CONFIG.mongoName, // SDK will append random suffix
            databaseUser: CONFIG.mongoUser,
            databasePassword: CONFIG.mongoPassword,
            dockerImage: CONFIG.mongoImage,
        });

        const mongoId = mongo.mongoId;

        // CRITICAL: The actual service name includes a random suffix
        // We need to get the REAL appName from the response
        const mongoAppName = mongo.appName; // e.g., "wlf-mongo-abc123"

        if (!mongoId || !mongoAppName) {
            throw new Error("MongoDB creation returned invalid response - missing mongoId or appName");
        }

        success(`MongoDB Created: ${mongoId}`);
        success(`MongoDB AppName: ${mongoAppName} ← This is the Docker service name!`);

        // ─────────────────────────────────────────────────────────────────────────
        // STEP 3: Deploy MongoDB (CRITICAL - was missing in V1/V2)
        // ─────────────────────────────────────────────────────────────────────────
        log(3, TOTAL_STEPS, "Deploying MongoDB...");

        await client.mongo.deploy({ mongoId: mongoId });
        success(`MongoDB deployment triggered`);

        // Wait for MongoDB to be ready
        console.log("   Waiting 10s for MongoDB to initialize...");
        await sleep(10000);

        // Verify MongoDB is running
        const mongoStatus = await client.mongo.getOne({ mongoId: mongoId });
        if (mongoStatus.applicationStatus !== "done") {
            warn(`MongoDB status is ${mongoStatus.applicationStatus}, might need more time`);
        } else {
            success(`MongoDB is running!`);
        }

        // ─────────────────────────────────────────────────────────────────────────
        // STEP 4: Create Application
        // ─────────────────────────────────────────────────────────────────────────
        log(4, TOTAL_STEPS, "Creating Application...");

        const app = await client.application.create({
            environmentId: environmentId,
            name: CONFIG.appName,
            appName: CONFIG.appName,
        });

        const applicationId = app.applicationId;
        const appAppName = app.appName; // e.g., "wlf-cms-xyz789"

        if (!applicationId) {
            throw new Error("Application creation returned invalid response - missing applicationId");
        }

        success(`Application Created: ${applicationId}`);
        success(`App Docker Name: ${appAppName}`);

        // ─────────────────────────────────────────────────────────────────────────
        // STEP 5: Configure Git & Build Settings
        // ─────────────────────────────────────────────────────────────────────────
        log(5, TOTAL_STEPS, "Configuring Git & Build Settings...");

        // Configure GitHub provider
        await client.application.saveGitProdiver({
            applicationId: applicationId,
            repository: CONFIG.githubRepo,
            branch: CONFIG.branch,
            buildPath: "/",
        });
        success(`Git provider configured: ${CONFIG.githubRepo}@${CONFIG.branch}`);

        // Set build type to Dockerfile (not nixpacks)
        await client.application.saveBuildType({
            applicationId: applicationId,
            buildType: "dockerfile",
            dockerfile: "/Dockerfile",
        });
        success(`Build type set to: Dockerfile`);

        // ─────────────────────────────────────────────────────────────────────────
        // STEP 6: Inject Environment Variables
        // ─────────────────────────────────────────────────────────────────────────
        log(6, TOTAL_STEPS, "Injecting Environment Variables...");

        // CRITICAL: Use the ACTUAL mongoAppName (with suffix) in the DATABASE_URI
        const databaseUri = `mongodb://${CONFIG.mongoUser}:${CONFIG.mongoPassword}@${mongoAppName}:27017/wlf-cms?authSource=admin`;

        const envPayload = `DATABASE_URI=${databaseUri}
PAYLOAD_SECRET=${CONFIG.payloadSecret}
NEXT_PUBLIC_SERVER_URL=https://${CONFIG.domain}
CRON_SECRET=${CONFIG.cronSecret}
PREVIEW_SECRET=${CONFIG.previewSecret}
R2_BUCKET=${CONFIG.r2.bucket}
R2_ACCOUNT_ID=${CONFIG.r2.accountId}
R2_ACCESS_KEY_ID=${CONFIG.r2.accessKeyId}
R2_SECRET_ACCESS_KEY=${CONFIG.r2.secretAccessKey}
R2_PUBLIC_ENDPOINT=${CONFIG.r2.publicEndpoint}
NODE_ENV=production
HOSTNAME=0.0.0.0`;

        await client.application.saveEnvironment({
            applicationId: applicationId,
            env: envPayload,
        });

        success(`Environment variables injected`);
        console.log(`   DATABASE_URI points to: ${mongoAppName}:27017`);

        // ─────────────────────────────────────────────────────────────────────────
        // STEP 7: Trigger Deployment
        // ─────────────────────────────────────────────────────────────────────────
        log(7, TOTAL_STEPS, "Triggering Build & Deploy...");

        await client.application.deploy({ applicationId: applicationId });
        success(`Build & Deploy triggered!`);

        // ─────────────────────────────────────────────────────────────────────────
        // SUMMARY
        // ─────────────────────────────────────────────────────────────────────────
        console.log("\n═══════════════════════════════════════════════════════════════════");
        console.log("🎉 IGNITION COMPLETE!");
        console.log("═══════════════════════════════════════════════════════════════════");
        console.log("");
        console.log("📌 Resource IDs:");
        console.log(`   Project ID:     ${projectId}`);
        console.log(`   Environment ID: ${environmentId}`);
        console.log(`   MongoDB ID:     ${mongoId}`);
        console.log(`   Application ID: ${applicationId}`);
        console.log("");
        console.log("📌 Docker Service Names:");
        console.log(`   MongoDB:        ${mongoAppName}`);
        console.log(`   Application:    ${appAppName}`);
        console.log("");
        console.log("📌 Next Steps:");
        console.log(`   1. Point DNS for ${CONFIG.domain} to your Dokploy server IP`);
        console.log(`   2. Add domain in Dokploy: ${CONFIG.appName} -> Domains -> ${CONFIG.domain}`);
        console.log(`   3. Enable HTTPS (Let's Encrypt)`);
        console.log(`   4. Monitor build logs in Dokploy dashboard`);
        console.log("");
        console.log("📌 CRITICAL DOCKERFILE REQUIREMENTS:");
        console.log("   Your Dockerfile MUST include before 'next build':");
        console.log("   RUN pnpm generate:importmap");
        console.log("   RUN rm -rf .next");
        console.log("");

    } catch (error: any) {
        console.error("\n❌ IGNITION FAILED!");
        console.error("Error:", error.message || error);

        if (error.body) {
            console.error("API Response:", JSON.stringify(error.body, null, 2));
        }

        process.exit(1);
    }
}

// Run
ignite();
