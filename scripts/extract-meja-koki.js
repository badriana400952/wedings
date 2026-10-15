const fs = require('fs');
const path = require('path');

const srcFile = 'C:/Users/USER.DESKTOP-UQ662UT.000/.gemini/antigravity-cli/brain/18898a72-8bb0-4d82-a195-ce76be336182/.system_generated/steps/229/content.md';
const content = fs.readFileSync(srcFile, 'utf8');
const lines = content.split('\n');

console.log('Total lines in content.md:', lines.length);

// Extract CSS
let styleLines = [];
let inStyle = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<style>') && i > 300 && !inStyle) {
    inStyle = true;
    continue;
  }
  if (inStyle && lines[i].includes('</style>')) {
    inStyle = false;
    break;
  }
  if (inStyle) styleLines.push(lines[i]);
}
console.log('Style lines extracted:', styleLines.length);

// Extract HTML Body
let htmlLines = [];
let inBody = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<body id="page-body">')) {
    inBody = true;
    continue;
  }
  if (inBody && lines[i].includes('<script type="application/json" id="wedivo-rundown-data">')) {
    inBody = false;
    break;
  }
  if (inBody) htmlLines.push(lines[i]);
}
console.log('HTML body lines extracted:', htmlLines.length);

// Extract JS
let scriptLines = [];
let inScript = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<script>') && i > 7200 && !inScript) {
    inScript = true;
    continue;
  }
  if (inScript && lines[i].includes('</script>')) {
    inScript = false;
    break;
  }
  if (inScript) scriptLines.push(lines[i]);
}
console.log('Script lines extracted:', scriptLines.length);

// Write CSS
const cssDir = path.join(__dirname, '../public/css');
if (!fs.existsSync(cssDir)) fs.mkdirSync(cssDir, { recursive: true });
fs.writeFileSync(path.join(cssDir, 'meja-koki.css'), styleLines.join('\n'));
console.log('Wrote public/css/meja-koki.css');

// Write JS
const distDir = path.join(__dirname, '../public/dist');
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(path.join(distDir, 'meja-koki.js'), scriptLines.join('\n'));
console.log('Wrote public/dist/meja-koki.js');
