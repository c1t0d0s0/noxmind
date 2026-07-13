const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, 'www');
const inline = process.argv.includes('--inline');

// Create dest directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Load version from tauri.conf.json
let version = '0.0.0';
try {
  const tauriConfigPath = path.join(__dirname, 'src-tauri', 'tauri.conf.json');
  if (fs.existsSync(tauriConfigPath)) {
    const tauriConfig = JSON.parse(fs.readFileSync(tauriConfigPath, 'utf8'));
    version = tauriConfig.version || '0.0.0';
    console.log(`Found version ${version} in tauri.conf.json`);
  }
} catch (e) {
  console.error('Failed to read version from tauri.conf.json:', e);
}

const htmlSrc = path.join(__dirname, 'index.html');
const cssSrc = path.join(__dirname, 'style.css');
const jsSrc = path.join(__dirname, 'script.js');

if (!fs.existsSync(htmlSrc) || !fs.existsSync(cssSrc) || !fs.existsSync(jsSrc)) {
  console.error('Required source files not found!');
  process.exit(1);
}

let htmlContent = fs.readFileSync(htmlSrc, 'utf8');
const cssContent = fs.readFileSync(cssSrc, 'utf8');
const jsContent = fs.readFileSync(jsSrc, 'utf8');

htmlContent = htmlContent.replace(/__APP_VERSION__/g, version);

if (inline) {
  const cssTag = `<style>\n${cssContent}\n</style>`;
  htmlContent = htmlContent.replace(/<link[^>]*href=["']style\.css[^"']*["'][^>]*>/i, cssTag);

  const jsTag = `<script>\n${jsContent}\n</script>`;
  htmlContent = htmlContent.replace(/<script[^>]*src=["']script\.js[^"']*["'][^>]*><\/script>/i, jsTag);

  fs.writeFileSync(path.join(destDir, 'index.html'), htmlContent, 'utf8');
  console.log(`Built single-file HTML (inlined CSS/JS): www/index.html (version: ${version})`);
} else {
  fs.writeFileSync(path.join(destDir, 'index.html'), htmlContent, 'utf8');
  fs.copyFileSync(cssSrc, path.join(destDir, 'style.css'));
  fs.copyFileSync(jsSrc, path.join(destDir, 'script.js'));
  console.log(`Copied index.html, style.css, script.js to www/ (version: ${version})`);
}
