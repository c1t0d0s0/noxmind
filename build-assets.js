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

// Files to copy/process
const files = ['index.html', 'script.js', 'style.css'];

files.forEach(file => {
  const src = path.join(__dirname, file);
  const dest = path.join(destDir, file);
  if (fs.existsSync(src)) {
    if (file === 'index.html') {
      // Replace placeholder with version in index.html during copy
      let content = fs.readFileSync(src, 'utf8');
      content = content.replace(/__APP_VERSION__/g, version);
      fs.writeFileSync(dest, content, 'utf8');
      console.log(`Processed and copied ${file} to www/ (injected version: ${version})`);
    } else {
      fs.copyFileSync(src, dest);
      console.log(`Copied ${file} to www/`);
    }
  } else {
    console.error(`Source file ${file} not found!`);
  }
});
