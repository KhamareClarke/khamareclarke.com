/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://khamareclarke.com',
  generateRobotsTxt: true, // (optional)
  generateIndexSitemap: false, // (optional) - disable index sitemap for smaller sites
  // ...other options
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  // Exclude certain paths if needed
  exclude: ['/api/*', '/admin/*'],
  // Transform function to modify sitemap entries
  transform: async (config, path) => {
    // Custom priority based on path
    let priority = 0.7;
    let changefreq = 'weekly';

    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    } else if (path === '/business-bundle') {
      priority = 0.9;
      changefreq = 'weekly';
    } else if (path.startsWith('/blog')) {
      priority = 0.8;
      changefreq = 'weekly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },
  // Additional paths to include (if not automatically discovered)
  additionalPaths: async (config) => {
    const result = [];

    // Add any dynamic routes here
    // Example: blog posts, case studies, etc.
    // const posts = await getBlogPosts();
    // posts.forEach(post => {
    //   result.push({
    //     loc: `/blog/${post.slug}`,
    //     changefreq: 'weekly',
    //     priority: 0.8,
    //     lastmod: post.updatedAt,
    //   });
    // });

    return result;
  },
};
