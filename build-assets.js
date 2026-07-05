const fs = require('fs');
const path = require('path');

const destDir = path.join(__dirname, 'www');

// Create dest directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Files to copy
const files = ['index.html', 'script.js', 'style.css'];

files.forEach(file => {
  const src = path.join(__dirname, file);
  const dest = path.join(destDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} to www/`);
  } else {
    console.error(`Source file ${file} not found!`);
  }
});
