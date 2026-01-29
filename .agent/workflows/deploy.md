---
description: Deploy PayloadCMS to Dokploy - Verified workflow to prevent white screen issues
---

# Deploy PayloadCMS to Dokploy

This workflow ensures a clean, working deployment without the white screen issue.

## Prerequisites Checklist

Before deploying, verify these files exist in your repo:
- [ ] `.dockerignore` with `.next` and `node_modules`
- [ ] `package.json` has `generate:importmap` in the build script
- [ ] `Dockerfile` passes build-time args for `NEXT_PUBLIC_SERVER_URL`

## Deployment Steps

### 1. Verify Local Code
```bash
cd /root/zen/payloads/dokploy-hosted-fixed
git status  # Should be clean
git log --oneline -1  # Note the commit hash
```

### 2. Push to GitHub
// turbo
```bash
git push origin main
```

### 3. SSH to Dokploy VPS and Update Code
```bash
ssh root@143.198.49.232 "cd /etc/dokploy/applications/payload-cms-uk3xw9/code && git fetch origin && git reset --hard origin/main && git log --oneline -1"
```

### 4. Build Docker Image (Directly on VPS)
```bash
ssh root@143.198.49.232 "cd /etc/dokploy/applications/payload-cms-uk3xw9/code && docker build -t payload-cms-uk3xw9:latest \
  --build-arg NEXT_PUBLIC_SERVER_URL=https://cms.wlf.com.mx \
  --build-arg PAYLOAD_SECRET=7f8e9d1c2b3a4f5e6d7c8b9a0f1e2d3c4r5t6y7u8i9o0p \
  --build-arg DATABASE_URI='mongodb://root:rootpassword@mongo-wjsixq:27017/payload-cms?authSource=admin' . 2>&1"
```

**Expected output should include:**
```
Generating import map
Writing import map to /app/src/app/(payload)/admin/importMap.js
```

### 5. Update Docker Swarm Service
```bash
ssh root@143.198.49.232 "docker service update --force --image payload-cms-uk3xw9:latest payload-cms-uk3xw9"
ssh root@143.198.49.232 "docker service scale payload-cms-uk3xw9=1"
```

### 6. Verify Deployment
```bash
# Check service is running
ssh root@143.198.49.232 "docker service ls | grep payload"

# Check logs (should NOT have importMap errors)
ssh root@143.198.49.232 "docker service logs payload-cms-uk3xw9 --tail 20"

# Test admin panel
curl -sI https://cms.wlf.com.mx/admin | head -5
```

### 7. Purge Cloudflare Cache (Optional but Recommended)
Log into Cloudflare for wlf.com.mx → Caching → Purge Everything

## Rollback Procedure

If something goes wrong, rollback to last known good version:

```bash
# On VPS
ssh root@143.198.49.232 "cd /etc/dokploy/applications/payload-cms-uk3xw9/code && git checkout v1.4.0-whitescreenfix"

# Rebuild with known good code
ssh root@143.198.49.232 "cd /etc/dokploy/applications/payload-cms-uk3xw9/code && docker build -t payload-cms-uk3xw9:latest \
  --build-arg NEXT_PUBLIC_SERVER_URL=https://cms.wlf.com.mx \
  --build-arg PAYLOAD_SECRET=7f8e9d1c2b3a4f5e6d7c8b9a0f1e2d3c4r5t6y7u8i9o0p \
  --build-arg DATABASE_URI='mongodb://root:rootpassword@mongo-wjsixq:27017/payload-cms?authSource=admin' ."

# Restart service
ssh root@143.198.49.232 "docker service update --force payload-cms-uk3xw9 && docker service scale payload-cms-uk3xw9=1"
```

## Known Good Tags

| Tag | Description | Status |
|-----|-------------|--------|
| `v1.4.0-whitescreenfix` | ImportMap + .dockerignore fix | ✅ STABLE |
| `v1.3.0-full-template` | Full frontend before customization | ⚠️ Has white screen bug |
| `v1.0.0-before-splithead` | Pre-monorepo monolith | ⚠️ Old architecture |

## Troubleshooting

### White Screen on /admin
1. Check logs for `getFromImportMap: PayloadComponent not found`
2. If present → `generate:importmap` didn't run
3. Fix: Ensure `package.json` build script starts with `pnpm generate:importmap &&`

### ChunkLoadError / 404 on JS files
1. HTML references wrong chunk hashes
2. Causes: Stale Docker cache, Cloudflare cache, or missing `.dockerignore`
3. Fix: Add `.dockerignore`, rebuild with `--no-cache`, purge Cloudflare

### Service at 0/0 replicas
1. Service was scaled down or crashed
2. Fix: `docker service scale payload-cms-uk3xw9=1`
