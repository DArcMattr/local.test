import { copyFile } from "node:fs"
const src = './node_modules/@csstools/normalize.css/normalize.css';
const dest = 'htdocs/style/normalize.css';

function callback(err) {
  if (err) throw err;
  console.log( `${src} was copied to ${dest}` );
}

copyFile(src, dest, callback);
