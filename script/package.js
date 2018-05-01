let path = require('path');
let fs = require('fs');
let AdmZip = require('adm-zip');
let manifest = require('../manifest');

manifest.iconFiles = function() {
  return Object.keys(this.icons).map(key => this.icons[key]);
};

manifest.contentScriptFiles = function() {
  let files = this.content_scripts.map(entry => entry.js);
  return [].concat.apply([], files);
};

manifest.backgroundScriptFiles = function() {
  return this.background.scripts;

};

manifest.webAccessibleResourceFiles = function() {
  return this.web_accessible_resources;
};

manifest.optionFiles = function() {
  let uiFile = this.options_ui.page;
  let dir = path.dirname(uiFile);
  let html = fs.readFileSync(uiFile, 'utf-8');

  let files = [uiFile];
  let regex = /<\s*script\s+src\s*=\s*'(.*)'\s*>/g;
  let match = regex.exec(html);
  while (match) {
    files.push(path.join(dir, match[1]));
    match = regex.exec(html);
  }
  return files;
};

let files = []
  .concat('manifest.json')
  .concat(manifest.iconFiles())
  .concat(manifest.contentScriptFiles())
  .concat(manifest.backgroundScriptFiles())
  .concat(manifest.webAccessibleResourceFiles())
  .concat(manifest.optionFiles());
let zip = new AdmZip();
let output = `${manifest.version}.zip`;
console.log(output);
for (let f of files) {
  let dir = path.dirname(f);
  zip.addLocalFile(f, dir);
  console.log('=>', path.join(dir, f));
}

zip.writeZip(output);
