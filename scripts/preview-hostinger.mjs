import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('deploy/hostinger');
const types = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.ico':'image/x-icon', '.json':'application/json', '.webmanifest':'application/manifest+json', '.woff2':'font/woff2' };
http.createServer((req,res) => {
  const url = new URL(req.url, 'http://localhost');
  const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '');
  let file = path.resolve(root, relative);
  if (!file.startsWith(root + path.sep)) { res.writeHead(404).end(); return; }
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file,'index.html');
  if (!fs.existsSync(file) && !path.extname(file) && url.searchParams.get('noRewrite') !== '1') {
    const mount = relative.split('/')[0];
    if (['fmbl','cleaning-service-demo'].includes(mount)) file = path.join(root,mount,'index.html');
  }
  if (!fs.existsSync(file)) { res.writeHead(404).end('Not found (no static file)'); return; }
  res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store'});
  fs.createReadStream(file).pipe(res);
}).listen(4173,'127.0.0.1', () => console.log('Staged production builds: http://127.0.0.1:4173/fmbl/ and /cleaning-service-demo/'));
