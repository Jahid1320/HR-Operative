# Cloud Deployment Guide (GitHub + Render + Supabase)

This guide will help you deploy the **Global Payroll Crisis Simulator** to the cloud for free using GitHub (Code Hosting), Render (Web Service), and Supabase (Database).

## Prerequisites
1.  **GitHub Account**: [github.com](https://github.com)
2.  **Render Account**: [render.com](https://render.com)
3.  **Supabase Account**: [supabase.com](https://supabase.com)

---

## Step 1: Push Code to GitHub

1.  **Initialize Git** (if not done):
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```

2.  **Create a New Repository** on GitHub.
3.  **Push your code**:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git branch -M main
    git push -u origin main
    ```

---

## Step 2: Set up Database (Supabase)

1.  Log in to [Supabase](https://supabase.com).
2.  Click **"New Project"**.
3.  Enter a Name (e.g., `payroll-crisis-db`) and a secure Password.
4.  Wait for the database to be created.
5.  Go to **Project Settings** (cog icon) -> **Database**.
6.  Under **Connection string**, make sure "Transaction Mode" is unchecked (use Session mode usually, or Transaction is fine too, but ensure port 6543 or 5432). Copy the **URI** mode connection string.
    -   It looks like: `postgresql://postgres:[PASSWORD]@db.project.supabase.co:5432/postgres`
    -   *Note: Replace `[PASSWORD]` with the password you set in step 3.*

---

## Step 3: Deploy to Render

1.  Log in to [Render](https://render.com).
2.  Click **"New +"** -> **"Web Service"**.
3.  Connect your GitHub repository.
4.  **Configure the Service**:
    -   **Name**: `global-payroll-crisis` (or any name)
    -   **Region**: Choose closest to you.
    -   **Branch**: `main`
    -   **Root Directory**: Leave empty (defaults to root).
    -   **Runtime**: `Node`
    -   **Build Command**: `npm install && npm run build` (This expects the root package.json specific for deployment)
        -   *Note: If Render picks up the root package.json I created, `npm install` runs the start script? No. Render runs Build Command, then Start Command.*
        -   **Wait**: Use `npm install && npm run build` (I added a root package.json that handles this).
    -   **Start Command**: `npm start`

5.  **Environment Variables**:
    -   Scroll down to "Environment Variables" and add:
        -   `NODE_ENV`: `production`
        -   `DATABASE_URL`: Paste your Supabase connection string here.
        -   `JWT_SECRET`: `your_secure_random_secret_key` (Make up a long random string).

6.  Click **"Create Web Service"**.

---

## Step 4: Finalize

Render will now:
1.  Clone your repo.
2.  Run `npm install` (Root).
3.  Run `npm run build` (which installs server deps, client deps, and builds client).
4.  Run `npm start` (starts the server).

Once deploy is **Live**, verify:
1.  The URL provided by Render should load your website.
2.  The `/admin` route should work.
3.  The database tables will be automatically created by Sequelize on first run.

**Troubleshooting:**
-   **Server Crash**: Check "Logs" in Render.
-   **Database Error**: Ensure `DATABASE_URL` is correct/password is correct.
-   **White Screen**: Ensure the build command finished successfully.
