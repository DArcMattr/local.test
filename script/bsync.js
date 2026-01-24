import browserSync from 'browser-sync';

const bs = browserSync.create();

const {
	DEV_HOST = 'local.localhost',
} = process.env.DEV_HOST;

bs.init({
  proxy: `https://${DEV_HOST}`,
  host: DEV_HOST,
  https: {
    key: `./tls/${DEV_HOST}-key.pem`,
    cert: `./tls/${DEV_HOST}.pem`
  },
  files: [
    "./htdocs/**/*.css",
    "./htdocs/**/*.html",
    "./htdocs/**/*.js",
    "./htdocs/**/*.php"
  ],
  port: 3000,
  open: false,
  notify: true,
  // This helps when proxying one local HTTPS site to another
  proxyRes: [
    (_proxyRes) => {
       // Optional: add headers if needed for CORS
    }
  ]
});

console.log(`🚀 BrowserSync is proxying https://${DEV_HOST}`);
