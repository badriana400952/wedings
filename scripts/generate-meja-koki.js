const fs = require('fs');
const path = require('path');

const srcFile = 'C:/Users/USER.DESKTOP-UQ662UT.000/.gemini/antigravity-cli/brain/18898a72-8bb0-4d82-a195-ce76be336182/.system_generated/steps/229/content.md';
const content = fs.readFileSync(srcFile, 'utf8');
const lines = content.split('\n');

console.log('Total lines in content.md:', lines.length);

// 1. Extract CSS
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

let cssText = styleLines.join('\n');
// Replace template decorative assets with local paths
cssText = cssText.replace(/https:\/\/wedivo\.id\/uploads\/templates\/efAgCX4Uz49oTDQ5Ch6N\//g, '/assets/templates/meja-koki/');
fs.writeFileSync(path.join(__dirname, '../public/css/meja-koki.css'), cssText);
console.log('Generated public/css/meja-koki.css (' + cssText.length + ' bytes)');

// 2. Extract HTML Body
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

let bodyHtml = htmlLines.join('\n');
// Replace template decorative assets with local paths
bodyHtml = bodyHtml.replace(/https:\/\/wedivo\.id\/uploads\/templates\/efAgCX4Uz49oTDQ5Ch6N\//g, '/assets/templates/meja-koki/');

fs.writeFileSync(path.join(__dirname, 'raw-body.html'), bodyHtml);
console.log('Extracted raw-body.html (' + bodyHtml.length + ' bytes)');

// 3. Extract JS
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

let jsText = scriptLines.join('\n');
// Wrap in window.initMejaKoki and add helpers
const wrappedJs = `
window.copyRekening = function (number) {
  if (!number) return;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(number).then(function () {
      var toast = document.getElementById("found-toast");
      var txt = document.getElementById("found-toast-text");
      if (toast && txt) {
        txt.textContent = "Nomor rekening berhasil disalin!";
        toast.classList.add("is-visible");
        setTimeout(function () {
          toast.classList.remove("is-visible");
        }, 3000);
      }
    });
  }
};

window.initMejaKoki = function() {
${jsText}
};
`;

fs.writeFileSync(path.join(__dirname, '../public/dist/meja-koki.js'), wrappedJs);
console.log('Generated public/dist/meja-koki.js (' + wrappedJs.length + ' bytes)');
