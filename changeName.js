let path = './static/options/4'
const fs = require('fs');


let dir = fs.readdirSync(path)
dir.forEach(value => {
  let index = value.slice(8);
  // index = index.split('.')[0]
  fs.renameSync(path + "/" + value, path + "/" + index)
})
