import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {basePath} from '../src/config.js';
const root=path.resolve('dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.xml':'application/xml','.txt':'text/plain'};
// Built pages reference every asset via the production base path (see
// src/config.js), so the local preview mounts dist/ at that same path
// instead of at the server root — otherwise every absolute URL the build
// emits would 404 against this dev server.
http.createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(pathname===basePath)return res.writeHead(302,{Location:basePath+'/'}).end();const relative=pathname===basePath+'/'?'/':pathname.startsWith(basePath+'/')?pathname.slice(basePath.length):null;if(relative===null)throw Error();let file=path.resolve(root,'.'+relative);if(!file.startsWith(root+path.sep)&&file!==root)throw Error();if((await stat(file)).isDirectory())file=path.join(file,'index.html');const body=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(body);}catch{res.writeHead(404,{'Content-Type':'text/html'});res.end(await readFile(path.join(root,'404.html')));}}).listen(4173,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:4173${basePath}/`));
