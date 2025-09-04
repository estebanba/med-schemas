# GitHub Packages Setup Instructions

## Manual Publishing (One-time setup)

1. **Create a GitHub Personal Access Token:**
   - Go to https://github.com/settings/tokens/new
   - Select "Classic" token
   - Give it a name like "npm-publish"
   - Select scopes:
     - `write:packages` (to publish packages)
     - `read:packages` (to read packages)
     - `delete:packages` (optional, to delete packages)
     - `repo` (if the repository is private)
   - Click "Generate token" and copy it

2. **Authenticate to GitHub Packages:**
   ```bash
   # Set the token as an environment variable
   export NODE_AUTH_TOKEN=YOUR_GITHUB_TOKEN_HERE
   
   # Or login interactively
   npm login --registry=https://npm.pkg.github.com
   # Username: YOUR_GITHUB_USERNAME
   # Password: YOUR_GITHUB_TOKEN (not your GitHub password!)
   # Email: YOUR_EMAIL
   ```

3. **Publish the package:**
   ```bash
   cd /Users/estebanbasili/Documents/GitHub/med-fullstack/med-schemas
   npm run build
   npm publish
   ```

## Automatic Publishing (GitHub Actions)

The package will be automatically published to GitHub Packages when:
- You push to the `main` branch
- You manually trigger the workflow from GitHub Actions tab

The workflow uses the repository's `GITHUB_TOKEN` automatically, no additional setup needed.

## Consuming the Package

### In Backend (med-back)

The backend already has an `.npmrc` file configured. You need to:

1. Set the `NODE_AUTH_TOKEN` environment variable in Coolify:
   - Go to your Coolify application settings
   - Add environment variable: `NODE_AUTH_TOKEN=YOUR_GITHUB_TOKEN`

2. Update package.json to use the published version:
   ```json
   "@estebanba/med-schemas": "^1.0.4"
   ```

### In Frontend (med-front)

1. Create/update `.npmrc` file:
   ```
   @estebanba:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
   ```

2. Update package.json to use the published version:
   ```json
   "@estebanba/med-schemas": "^1.0.4"
   ```

## Viewing Published Packages

Once published, you can view your package at:
https://github.com/estebanba?tab=packages

Or directly at:
https://github.com/users/estebanba/packages/npm/package/med-schemas