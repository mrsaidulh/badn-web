# Complete VPS Installation Guide for BADN Academy (Full-Stack Express + React/Vite + MySQL)

This guide provides a comprehensive, step-by-step manual to deploy the **BADN Academy** web application on a freshly provisioned Virtual Private Server (VPS) running **Ubuntu 20.04, 22.04, or 24.04 LTS**. It covers environment setup, MySQL database configuration, Node.js installation, build pipelines, process management, and Nginx reverse proxy configuration.

---

## Prerequisites

- A freshly provisioned VPS (Ubuntu 20.04 / 22.04 / 24.04 LTS)
- Root access or a user with `sudo` privileges
- A domain name (e.g., `academy.badn-edu.com`) pointed to your VPS IP address (optional, but required for HTTPS/SSL)

---

## Step 1: System Update & Essential Tools

First, log into your VPS via SSH and update the system packages to their latest versions:

```bash
sudo apt update && sudo apt upgrade -y
```

Now, install essential developer tools, curl, and Git:

```bash
sudo apt install curl git build-essential ufw -y
```

---

## Step 2: Install Node.js (v20 LTS)

We recommend using **Node.js v20.x (LTS)**. Let's install it using the official NodeSource distribution:

```bash
# Download and import the NodeSource GPG key and add the repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js and npm
sudo apt install -y nodejs
```

Verify that Node.js and NPM are installed correctly:

```bash
node -v
npm -v
```

---

## Step 3: Install & Configure MySQL Database

The application uses MySQL to persist course information, enrollments, seminars, registrations, and messages.

### 1. Install MySQL Server

```bash
sudo apt install mysql-server -y
```

### 2. Enable and Start MySQL Service

```bash
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 3. Secure MySQL installation (Recommended)

Run the security script to set a root password, disable remote root logins, and clean up test databases:

```bash
sudo mysql_secure_installation
```
*Note: Follow the prompts. You can choose to enforce strong password guidelines and remove anonymous users.*

### 4. Create the Application Database and User

Log into the MySQL command line as root:

```bash
sudo mysql -u root -p
```

Inside the MySQL prompt, run the following SQL commands. **Make sure to replace `'YourSecurePassword'` with a strong, custom password:**

```sql
-- Create the database
CREATE DATABASE IF NOT EXISTS badn_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create a dedicated user for the app
CREATE USER 'badn_user'@'localhost' IDENTIFIED BY 'YourSecurePassword';

-- Grant all privileges on the app database to this user
GRANT ALL PRIVILEGES ON badn_db.* TO 'badn_user'@'localhost';

-- Flush privileges to apply changes
FLUSH PRIVILEGES;

-- Exit the MySQL client
EXIT;
```

---

## Step 4: Clone the Code Repository via Git

We will set up the application inside the `/var/www` directory.

### 1. Create the Directory and Adjust Ownership

Create the target directory and give your current system user ownership so you don't need `sudo` for every git or build action:

```bash
sudo mkdir -p /var/www/badn-academy
sudo chown -R $USER:$USER /var/www/badn-academy
```

### 2. Clone Your Repository

Clone your repository directly into that folder using git (replace `<your-git-repo-url>` with your actual repository URL):

```bash
git clone <your-git-repo-url> /var/www/badn-academy
```

Navigate into the project directory:

```bash
cd /var/www/badn-academy
```

---

## Step 5: Configure Environment Variables

The application reads its database configuration from a `.env` file at the root.

Copy the example environment file:

```bash
cp .env.example .env
```

Open the `.env` file for editing:

```bash
nano .env
```

Modify the variables to match the database credentials you set up in Step 3:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=badn_user
DB_PASSWORD=YourSecurePassword
DB_NAME=badn_db
```

Save and exit `nano` (`Ctrl+O`, `Enter`, then `Ctrl+X`).

---

## Step 6: Install Dependencies and Build the Application

### 1. Install NPM Dependencies

Run `npm install` to download all package dependencies (React, Express, Tailwind, Vite, MySQL2, and build tools):

```bash
npm install
```

### 2. Build for Production

Run the production build pipeline. This step builds the static frontend assets using Vite and bundles the TypeScript backend server into `dist/server.cjs` using Esbuild:

```bash
npm run build
```

Verify that the output directory has been successfully generated:

```bash
ls -la dist
```
*You should see static assets along with a unified `server.cjs` file.*

---

## Step 7: Manage Process with PM2 (Background Runner)

To ensure the Node.js server runs continuously in the background and automatically restarts if the VPS reboots, we use **PM2**.

### 1. Install PM2 Globally

```bash
sudo npm install -g pm2
```

### 2. Start the Application

Start the bundled production server:

```bash
pm2 start dist/server.cjs --name "badn-academy"
```

### 3. Set Up PM2 to Autostart on Reboot

Configure PM2 to automatically start your application on system boot:

```bash
pm2 startup
```
*Note: This command generates a specific `sudo env PATH=...` command on your screen. **Copy and paste that command into your terminal** to complete the configuration.*

Once done, save the current process list:

```bash
pm2 save
```

### 4. Useful PM2 Commands

- View running apps and resource consumption: `pm2 status`
- View application logs in real-time: `pm2 logs badn-academy`
- Restart the application (e.g., after updating code via git pull): `pm2 restart badn-academy`
- Stop the application: `pm2 stop badn-academy`

---

## Step 8: Setup Nginx as a Reverse Proxy with Let's Encrypt SSL

Currently, the server is running on port `3000`. To access it on default web ports (Port 80 for HTTP and 443 for HTTPS) using your custom domain, we will configure **Nginx** as a reverse proxy.

### 1. Install Nginx

```bash
sudo apt install nginx -y
```

### 2. Configure Nginx Server Block

Create a configuration file for your domain:

```bash
sudo nano /etc/nginx/sites-available/badn-academy
```

Paste the following configuration inside the file, replacing `academy.badn-edu.com` with your actual domain name:

```nginx
server {
    listen 80;
    server_name academy.badn-edu.com;

    # Adjust client upload size limit if needed
    client_max_body_size 20M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Save and exit (`Ctrl+O`, `Enter`, then `Ctrl+X`).

### 3. Enable the Site and Test Nginx

Link the configuration file to the enabled sites directory:

```bash
sudo ln -s /etc/nginx/sites-available/badn-academy /etc/nginx/sites-enabled/
```

Remove the default Nginx page to avoid conflicts:

```bash
sudo rm /etc/nginx/sites-enabled/default
```

Test Nginx configuration for syntax correctness:

```bash
sudo nginx -t
```

If the test is successful, restart Nginx:

```bash
sudo systemctl restart nginx
```

---

## Step 9: Install SSL Certificate with Certbot (HTTPS)

Secure your application with a free Let's Encrypt SSL certificate.

### 1. Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 2. Request and Apply SSL Certificate

Run the Certbot command for Nginx:

```bash
sudo certbot --nginx -d academy.badn-edu.com
```

- Enter your email address when prompted.
- Accept the terms of service.
- Choose whether to redirect HTTP traffic to HTTPS (highly recommended).

Once complete, Certbot will automatically rewrite your Nginx configuration to support SSL and set up an automatic renewal cron job.

---

## Step 10: Configure Firewall (UFW)

Make sure your firewall is open for HTTP, HTTPS, and SSH traffic while keeping port `3000` closed to direct external access:

```bash
# Allow Nginx Full (Port 80 and 443)
sudo ufw allow 'Nginx Full'

# Allow SSH (Port 22)
sudo ufw allow OpenSSH

# Enable the firewall
sudo ufw enable
```

To verify the status of your firewall rules:

```bash
sudo ufw status
```

---

## Redeploying Future Code Updates

When you push new updates to your git repository, you can redeploy the application on your VPS in a few seconds:

```bash
# 1. Pull the latest code
cd /var/www/badn-academy
git pull

# 2. Re-install packages (if package.json changed)
npm install

# 3. Rebuild the application
npm run build

# 4. Restart the running background process
pm2 restart badn-academy
```

Your system is now fully set up, secured, and ready for production! 🚀
