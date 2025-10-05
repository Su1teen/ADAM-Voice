# 🚀 Deployment Guide for ADAM Voice

## ✅ Issue Fixed

The production build error has been resolved by separating Server and Client Components properly for Next.js 15.

### What Was Changed

1. Created `components/ConversationClient.tsx` - Client component with all interactive logic
2. Updated `app/c/[slug]/page.tsx` - Now a Server Component that wraps the Client component
3. Fixed Next.js 15 async params handling

## 📦 Deploy to Digital Ocean

### Step 1: Commit and Push Changes

```bash
# On your local machine
git add .
git commit -m "Fix production build by separating Server/Client components"
git push origin deploy-branch
```

### Step 2: Pull Changes on Server

```bash
# SSH into your server
ssh root@157.230.126.81

# Navigate to project directory
cd /opt/ADAM-Voice

# Pull latest changes
git pull origin deploy-branch

# Verify the new files exist
ls -la components/ConversationClient.tsx
cat app/c/[slug]/page.tsx
```

### Step 3: Rebuild Docker Container

```bash
# Stop current containers
docker compose down

# Remove old images (optional but recommended for clean build)
docker system prune -f

# Rebuild without cache
docker compose build --no-cache

# Start the container
docker compose up -d

# Watch logs to ensure no errors
docker compose logs -f web
```

You should see:
```
✓ Ready in XXXms
```

Without any "Could not find the module" errors.

### Step 4: Test the Deployment

```bash
# Test redirect
curl -I http://voice.adamnext.com

# Should show:
# location: http://voice.adamnext.com/c/[random-id]

# Test full page load
curl http://voice.adamnext.com -L | grep "A.D.A.M. Voice Assistant"
```

### Step 5: Verify in Browser

1. Open `http://voice.adamnext.com` in your browser
2. You should see the voice interface without any errors
3. Check browser console - no more "500 Internal Server Error"
4. Test the voice functionality

### Step 6: Install SSL (After HTTP Works)

```bash
# Install SSL certificate
sudo certbot --nginx -d voice.adamnext.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose option 2 to redirect HTTP to HTTPS

# Test auto-renewal
sudo certbot renew --dry-run
```

### Step 7: Final Verification

```bash
# Test HTTPS
curl -I https://voice.adamnext.com

# Should redirect to:
# location: https://voice.adamnext.com/c/[random-id]
```

## 🎯 Expected Results

✅ No build errors
✅ App starts successfully in Docker
✅ Redirects work correctly (no `0.0.0.0:3000` or `localhost:3000`)
✅ Dynamic routes load without 500 errors
✅ Voice interface works
✅ Chat functionality works
✅ All features operational

## 🐛 Troubleshooting

### If you still see errors:

1. **Check Docker logs**:
   ```bash
   docker compose logs web | tail -50
   ```

2. **Verify files were updated**:
   ```bash
   cat app/c/[slug]/page.tsx
   ls -la components/ConversationClient.tsx
   ```

3. **Clean rebuild**:
   ```bash
   docker compose down -v
   docker system prune -af --volumes
   docker compose up --build -d
   ```

4. **Check Nginx configuration**:
   ```bash
   sudo nginx -t
   sudo systemctl status nginx
   ```

## 📊 Server Resources

Your current setup:
- **Droplet**: Basic (1 CPU, 2GB RAM) - sufficient for this application
- **Storage**: 50GB SSD - more than enough

If you experience performance issues under load, consider upgrading to:
- **Regular**: 2 CPUs, 4GB RAM ($24/month)

## 🔄 Future Updates

To update your app in the future:

```bash
cd /opt/ADAM-Voice
git pull
docker compose up --build -d
```

## ✅ Success!

Your ADAM Voice application is now successfully deployed on Digital Ocean! 🎉

Access it at: https://voice.adamnext.com
