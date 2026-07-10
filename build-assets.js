const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, 'www');

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
  console.error("Failed to read version from tauri.conf.json:", e);
}

// Load source contents
const htmlSrc = path.join(__dirname, 'index.html');
const cssSrc = path.join(__dirname, 'style.css');
const jsSrc = path.join(__dirname, 'script.js');

if (fs.existsSync(htmlSrc) && fs.existsSync(cssSrc) && fs.existsSync(jsSrc)) {
  let htmlContent = fs.readFileSync(htmlSrc, 'utf8');
  const cssContent = fs.readFileSync(cssSrc, 'utf8');
  const jsContent = fs.readFileSync(jsSrc, 'utf8');

  // Replace version placeholder
  htmlContent = htmlContent.replace(/__APP_VERSION__/g, version);

  // Inline CSS - replace the stylesheet link tag
  const cssTag = `<style>\n${cssContent}\n</style>`;
  htmlContent = htmlContent.replace(/<link[^>]*href=["']style\.css[^"']*["'][^>]*>/i, cssTag);

  // Inline JS - replace the script tag
  const jsTag = `<script>\n${jsContent}\n</script>`;
  htmlContent = htmlContent.replace(/<script[^>]*src=["']script\.js[^"']*["'][^>]*><\/script>/i, jsTag);

  // Write single compiled HTML file
  const destHtml = path.join(destDir, 'index.html');
  fs.writeFileSync(destHtml, htmlContent, 'utf8');
  console.log(`Successfully compiled and inlined all assets into a single HTML file: www/index.html`);
  
  // Also copy raw files to www/ just in case Tauri configuration or debug modes reference them
  fs.copyFileSync(cssSrc, path.join(destDir, 'style.css'));
  fs.copyFileSync(jsSrc, path.join(destDir, 'script.js'));
} else {
  console.error("Required source files not found!");
}
