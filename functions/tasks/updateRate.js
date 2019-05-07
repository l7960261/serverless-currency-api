const https = require('https');
const path = require('path');
const fs = require('fs');

https.get('https://tw.rter.info/capi.php', (res) => {
  var body = '';

  res.on('data', function (chunk) {
    body += chunk;
  });

  res.on('end', function () {
    const filePath = path.join(__dirname, '..', 'src', 'rate.ts');
    const data = `export default ${body}`;
    fs.writeFile(filePath, data, { encoding: 'utf8' }, err => {});
  });

}).on('error', (e) => {
  console.error(e);
});