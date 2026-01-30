# 🚀 WLF CMS Operations Guide

**For: Developers & Content Creators**  
**Last Updated:** 2026-01-30

---

## 📋 Table of Contents

1. [Quick Start for Content Creators](#-quick-start-for-content-creators)
2. [Developer Setup](#-developer-setup)
3. [Environments (Staging vs Production)](#-environments)
4. [GitHub Secrets Setup](#-github-secrets-setup)
5. [Deployment Workflow](#-deployment-workflow)
6. [Best Practices](#-best-practices)
7. [Troubleshooting](#-troubleshooting)

---

## 👥 Quick Start for Content Creators

### Where to Work

| Environment | URL | Purpose |
|-------------|-----|---------|
| **CMS Admin** | `https://cms.wlf.com.mx/admin` | Create & edit content |
| **CMS Preview** | `https://cms.wlf.com.mx/[slug]` | Preview changes with LivePreview |
| **Production** | Your Cloudflare Pages URL | Final published site |

### Content Workflow

```
1. Login to CMS → cms.wlf.com.mx/admin
2. Create/Edit content (Pages, Posts, Media)
3. Use "Preview" to see changes live
4. Click "Publish" when ready
5. Wait 60 seconds for production to update
   (or trigger rebuild for instant update)
```

### ✅ Safe Content Operations

| Action | Safe? | Notes |
|--------|-------|-------|
| Create new Page | ✅ | Won't affect existing content |
| Edit draft | ✅ | Only visible in preview |
| Upload media | ✅ | Goes to R2 storage |
| Publish changes | ⚠️ | Will appear on production |
| Delete published page | ⚠️ | Breaks existing links |

### ❌ Things That Can Break Production

| Don't Do This | Why |
|---------------|-----|
| Delete the "home" page | Breaks the homepage |
| Change slugs of linked pages | Breaks internal links |
| Delete media in use | Shows broken images |
| Edit live during high traffic | Can cause cache misses |

---

## 💻 Developer Setup

### Prerequisites

```bash
# Install Node 22+ and pnpm
node -v  # Should be 22.x
pnpm -v  # Should be 10.x
```

### Clone & Install

```bash
git clone https://github.com/cabyz/dokploy-payload-zen.git
cd dokploy-payload-zen
pnpm install
```

### Environment Variables

Create `.env` in the root:

```env
# Database
DATABASE_URI=mongodb://localhost:27017/payload-cms

# Security
PAYLOAD_SECRET=your-32-character-secret-here

# URLs
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Storage (optional for local dev)
S3_BUCKET=your-bucket
S3_ACCESS_KEY_ID=your-key
S3_SECRET_ACCESS_KEY=your-secret
S3_REGION=auto
S3_ENDPOINT=https://your-account.r2.cloudflarestorage.com
```

### Run Locally

```bash
# CMS only (for admin development)
pnpm dev

# Frontend only (for static site development)
pnpm web:dev

# Both in parallel (with Turbo)
pnpm dev:all
```

---

## 🌍 Environments

### Current Setup

| Environment | Platform | URL | Branch |
|-------------|----------|-----|--------|
| **CMS (Staging/Production)** | Dokploy VPS | cms.wlf.com.mx | `main` |
| **Frontend (Production)** | Cloudflare Pages | Your CF URL | `main` |
| **Local Dev** | Your machine | localhost:3000 | any |

### Recommended: Add Staging

For safer deploys, add a staging environment:

```
Feature Branch → Staging → Production

1. Create branch: git checkout -b feature/new-landing
2. Push to staging branch: git push origin staging
3. Review on staging CMS
4. Merge to main → deploys to production
```

**To add staging:**

1. Create a new Dokploy application for staging
2. Set `NEXT_PUBLIC_SERVER_URL=https://staging-cms.wlf.com.mx`
3. Point to a separate MongoDB database
4. Configure DNS for staging subdomain

---

## 🔐 GitHub Secrets Setup

### Step-by-Step Guide

#### 1. Go to Repository Settings

```
GitHub → cabyz/dokploy-payload-zen → Settings → Secrets and variables → Actions
```

#### 2. Add These Secrets

| Secret Name | Value | Where to Find |
|-------------|-------|---------------|
| `DOKPLOY_HOST` | `143.198.49.232` | Your Dokploy VPS IP |
| `DOKPLOY_SSH_KEY` | (see below) | Generate new or use existing |
| `PAYLOAD_SECRET` | `7f8e9d...` | Your 32-char secret |
| `DATABASE_URI` | `mongodb://root:...` | From Dokploy MongoDB |

#### 3. Generate SSH Key for GitHub Actions

On your local machine:

```bash
# Generate new key pair (no passphrase!)
ssh-keygen -t ed25519 -f ~/.ssh/dokploy_deploy -N ""

# Show the PRIVATE key (copy this to DOKPLOY_SSH_KEY secret)
cat ~/.ssh/dokploy_deploy

# Show the PUBLIC key (add this to Dokploy VPS)
cat ~/.ssh/dokploy_deploy.pub
```

Add the public key to Dokploy VPS:

```bash
ssh root@143.198.49.232 "mkdir -p ~/.ssh && echo 'YOUR_PUBLIC_KEY_HERE' >> ~/.ssh/authorized_keys"
```

#### 4. Verify Setup

Push a commit to main branch. Check:
- GitHub → Actions tab → See workflow running
- Should complete in ~5-10 minutes

---

## 🚀 Deployment Workflow

### Automatic (Recommended)

```bash
# 1. Make changes
git add .
git commit -m "feat: new hero section"

# 2. Push to main
git push origin main

# 3. GitHub Actions handles everything:
#    - SSH to Dokploy
#    - Pull latest code
#    - Docker build
#    - Service update
#    - Cloudflare Pages auto-rebuilds from push

# 4. Wait ~5 min, then verify:
curl https://cms.wlf.com.mx/admin  # Should return 200
```

### Manual (Fallback)

If GitHub Actions fails:

```bash
# SSH to Dokploy
ssh root@143.198.49.232

# Navigate to app
cd /etc/dokploy/applications/payload-cms-uk3xw9/code

# Pull and build
git fetch origin && git reset --hard origin/main
docker build -t payload-cms-uk3xw9:latest \
  --build-arg NEXT_PUBLIC_SERVER_URL=https://cms.wlf.com.mx \
  --build-arg PAYLOAD_SECRET=your-secret \
  --build-arg DATABASE_URI='your-mongo-uri' .

# Restart service
docker service update --force --image payload-cms-uk3xw9:latest payload-cms-uk3xw9
docker service scale payload-cms-uk3xw9=1
```

---

## 📏 Best Practices

### For Content Creators

| Do | Don't |
|----|-------|
| ✅ Use descriptive page titles | ❌ Leave fields empty |
| ✅ Add alt text to images | ❌ Upload huge images (>5MB) |
| ✅ Preview before publishing | ❌ Publish untested changes |
| ✅ Use slug naming: `about-us` | ❌ Use slugs with spaces or caps |
| ✅ Schedule publishes for low traffic | ❌ Publish during peak hours |

### For Developers

| Do | Don't |
|----|-------|
| ✅ Test locally first | ❌ Push directly to main |
| ✅ Use feature branches | ❌ Force push to main |
| ✅ Add migrations for schema changes | ❌ Modify collections without testing |
| ✅ Tag releases (v1.5.0) | ❌ Leave commits untagged |
| ✅ Update docs when changing workflow | ❌ Assume everyone knows |

### Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Page slugs | lowercase-kebab | `about-us`, `contact` |
| Image files | descriptive-kebab | `hero-background.jpg` |
| Git branches | type/description | `feat/new-pricing` |
| Git commits | conventional | `feat: add pricing block` |

---

## 🔧 Troubleshooting

### White Screen on /admin

```bash
# Check for importMap error in logs
ssh root@143.198.49.232 "docker service logs payload-cms-uk3xw9 --tail 50" | grep -i importmap

# Fix: Rebuild with --no-cache
docker build --no-cache -t payload-cms-uk3xw9:latest ...
```

### Service at 0/0 Replicas

```bash
# Scale up the service
ssh root@143.198.49.232 "docker service scale payload-cms-uk3xw9=1"
```

### ChunkLoadError / 404 on JS Files

1. Clear Cloudflare cache
2. Verify `.dockerignore` has `.next` listed
3. Rebuild with `--no-cache`

### Database Connection Failed

```bash
# Check MongoDB is running
ssh root@143.198.49.232 "docker service ls | grep mongo"

# Check connection string in env
# Should be: mongodb://root:password@mongo-wjsixq:27017/payload-cms?authSource=admin
```

### GitHub Actions Failed

1. Go to GitHub → Actions → Failed workflow
2. Click to see logs
3. Common issues:
   - SSH key not authorized → Check public key on VPS
   - Secret not found → Verify secret names match exactly
   - Build failed → Check Docker build output

---

## 📞 Support

| Issue | Contact |
|-------|---------|
| CMS bugs | Create GitHub issue |
| Content questions | Ask in #content Slack |
| Deploy failures | Check GitHub Actions logs first |
| Emergency | SSH to VPS and check `docker service logs` |

---

## 📚 Related Docs

- [SPRINT_ZERO_DEBT.md](./SPRINT_ZERO_DEBT.md) - Technical sprint backlog
- [INCIDENT_2026_01_29.md](./INCIDENT_2026_01_29.md) - White screen resolution
- [/deploy workflow](../.agent/workflows/deploy.md) - Deploy command reference
