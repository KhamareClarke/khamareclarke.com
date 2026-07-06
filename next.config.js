/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdfkit'],
  },
  // Required when worker runs "npm run build" on this repo (e.g. SEO/Ops cron); avoids "generate is not a function"
  generateBuildId: async () => {
    return String(process.env.BUILD_ID || process.env.VERCEL_GIT_COMMIT_SHA || 'build-' + Date.now());
  },
}

module.exports = nextConfig
