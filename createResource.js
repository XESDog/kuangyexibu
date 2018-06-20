const fs = require('fs');
const path = require('path');
const url = path.join(__dirname, 'static');


let fileArray = [];
itr(url);


function itr(dirPath) {
  let files = fs.readdirSync(dirPath);
  files.forEach(value => {
    let file = path.join(dirPath, value);
    let ext = path.parse(file).ext;

    if (ext === '.atlas') return;

    let fileState = fs.statSync(file);
    let filePath = file.split(path.sep);
    let key = filePath.slice(6);
    let fileName = filePath[filePath.length - 1];
    key = key.join("_");

    if (/^\./.test(fileName)) return;


    key = key.replace('.', '_')
    if (fileState.isDirectory()) {
      itr(file);
    } else {
      fileArray.push({key, path: "./static" + file.slice(url.length), ext})
    }
  })
}

let resData = `import {getTexture,getSound} from "./resource.js"\n`

fileArray.forEach(value => {
  if (value.ext === '.json') return;
  if(value.ext==='.mp3'){
    resData+=`export const ${value.key.toLocaleUpperCase()}= getSound("${value.key}");\n`
  }else {
    resData += `export const ${value.key.toLocaleUpperCase()}= getTexture("${value.key}");\n`
  }
})

fs.writeFileSync('./src/assets/resource.json', JSON.stringify(fileArray));
fs.writeFileSync('./src/components/RES.js', resData)

