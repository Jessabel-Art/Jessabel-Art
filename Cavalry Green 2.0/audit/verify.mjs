import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const origin = 'https://cavalrygreenllc.com';
const oldHost = ['cavalry-green-property-care', 'jessieleonne', 'chatgpt', 'site'].join('.');
const walk = p => fs.readdirSync(p, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(p,e.name)) : [path.join(p,e.name)]);
const decode = s => s.replaceAll('&amp;', '&').replaceAll('&#x27;', "'").replaceAll('&quot;', '"').replaceAll('&#39;', "'");
const attrs = s => Object.fromEntries([...s.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m => [m[1],decode(m[2])]));
function inspect(html) {
 const metas = [...html.matchAll(/<meta\b[^>]*>/g)].map(m=>attrs(m[0]));
 const links = [...html.matchAll(/<link\b[^>]*>/g)].map(m=>attrs(m[0]));
 return {
  titles: [...html.matchAll(/<title>(.*?)<\/title>/gs)].map(m=>decode(m[1])),
  descriptions: metas.filter(m=>m.name==='description').map(m=>m.content),
  canonicals: links.filter(m=>m.rel==='canonical').map(m=>m.href),
  robots: metas.filter(m=>/^(robots|googlebot)$/.test(m.name)).map(m=>m.content),
  social: metas.filter(m=>/^(og:|twitter:)/.test(m.property||m.name)).map(m=>[m.property||m.name,m.content]),
  viewport: metas.filter(m=>m.name==='viewport'),
  icons: links.filter(m=>/icon|manifest/.test(m.rel)),
  headings: [...html.matchAll(/<h([1-6])\b[^>]*>(.*?)<\/h\1>/gs)].map(m=>({level:Number(m[1]),text:decode(m[2].replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim())})),
  schema: [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(m=>JSON.parse(m[1])),
  images: [...html.matchAll(/<img\b[^>]*>/g)].map(m=>attrs(m[0])),
  anchors: [...html.matchAll(/<a\b[^>]*>/g)].map(m=>attrs(m[0])),
  oldDomainPresent: html.includes(oldHost),
 };
}
const mode=process.argv[2]||'final';
if(mode==='live') {
 const results=[];
 for(const route of ['/', '/services', '/services/', '/quote', '/quote/', '/robots.txt', '/sitemap.xml', '/seo-audit-nonexistent-20260910', '/index.html', '/services/index.html', '/quote/index.html']) {
  const name=route.replaceAll('/','_')||'home';
  const body=`audit/live${name}.txt`, headers=`audit/live${name}.headers`;
  try {
   const status=execFileSync('curl.exe',['-sS','-L','--retry','2','--retry-all-errors','--retry-delay','1','--max-time','20','-D',headers,'-o',body,'-w','%{http_code} %{url_effective}',origin+route],{encoding:'utf8'});
   const text=fs.readFileSync(body,'utf8');
   results.push({route,status,headers:fs.readFileSync(headers,'utf8'),...(text.includes('<html')?{page:inspect(text)}:{body:text})});
  } catch(e) {results.push({route,error:e.message});}
 }
 fs.writeFileSync('audit/live-verification.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results.map(r=>({route:r.route,status:r.status,error:r.error,title:r.page?.titles,canonical:r.page?.canonicals,robots:r.page?.robots,body:r.body})),null,2));
} else {
 const failures=[]; const pages={};
 for(const [route,file] of [['/','index.html'],['/services/','services/index.html'],['/quote/','quote/index.html']]) {
  const html=fs.readFileSync(`dist/${file}`,'utf8'), p=inspect(html); pages[route]=p;
  if(p.titles.length!==1||p.descriptions.length!==1||p.canonicals.length!==1)failures.push(`${route}: metadata count`);
  if(p.canonicals[0]!==origin+route)failures.push(`${route}: canonical mismatch`);
  if(p.headings.filter(h=>h.level===1).length!==1)failures.push(`${route}: H1 count`);
  if(p.robots.some(r=>/noindex|nofollow/.test(r)))failures.push(`${route}: blocked`);
  if(p.oldDomainPresent)failures.push(`${route}: preview domain`);
  if(p.images.some(i=>!Object.hasOwn(i,'alt')))failures.push(`${route}: missing alt`);
  for(const m of html.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
   const target=decode(m[1]); const f=path.join('dist',target);
   if(!fs.existsSync(f)&&!fs.existsSync(path.join(f,'index.html')))failures.push(`${route}: missing ${target}`);
  }
  for(const m of html.matchAll(/href="#([^"]+)"/g))if(!html.includes(`id="${m[1]}"`))failures.push(`${route}: broken fragment ${m[1]}`);
  const social=Object.fromEntries(p.social);
  if(social['og:url']!==origin+route)failures.push(`${route}: OG URL mismatch`);
  for(const key of ['og:title','og:description','og:site_name','og:type','og:image','twitter:card','twitter:title','twitter:description','twitter:image'])if(!social[key])failures.push(`${route}: missing ${key}`);
 }
 const files=walk('dist');
 const oldMatches=files.filter(f=>fs.readFileSync(f).includes(Buffer.from(oldHost)));
 const productionMatches=files.filter(f=>fs.readFileSync(f).includes(Buffer.from(origin)));
 const robots=fs.readFileSync('dist/robots.txt','utf8'), sitemap=fs.readFileSync('dist/sitemap.xml','utf8');
 const sitemapUrls=[...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]);
 if(JSON.stringify(sitemapUrls)!==JSON.stringify(Object.keys(pages).map(p=>origin+p)))failures.push('sitemap mismatch');
 if(!robots.includes('Allow: /')||!robots.includes(`${origin}/sitemap.xml`)||robots.includes('Disallow: /'))failures.push('robots mismatch');
 if(oldMatches.length)failures.push('preview domain in dist');
 const protectedHashes=JSON.parse(fs.readFileSync('audit/protected-hashes.json','utf8'));
 const changedProtected=Object.entries(protectedHashes).filter(([p,hash])=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')!==hash).map(([p])=>p);
 if(changedProtected.length)failures.push('protected files modified');
 const exportedBackendMismatches=Object.entries(protectedHashes).filter(([p,hash])=>p.startsWith('public/')&&(!fs.existsSync(p.replace('public/','dist/'))||crypto.createHash('sha256').update(fs.readFileSync(p.replace('public/','dist/'))).digest('hex')!==hash)).map(([p])=>p);
 if(exportedBackendMismatches.length)failures.push('exported backend mismatch');
 const result={pages,robots,sitemapUrls,sitemap,distFileCount:files.length,oldDomainMatches:oldMatches,productionDomainFileCount:productionMatches.length,protectedFileCount:Object.keys(protectedHashes).length,changedProtected,exportedBackendMismatches,failures};
 fs.writeFileSync(`audit/${mode}-verification.json`,JSON.stringify(result,null,2));
 console.log(JSON.stringify({pages:Object.fromEntries(Object.entries(pages).map(([k,p])=>[k,{titles:p.titles,canonicals:p.canonicals,h1:p.headings.filter(h=>h.level===1),schema:p.schema.map(s=>s['@type'])}])),distFileCount:files.length,oldDomainMatches:oldMatches.length,productionDomainFileCount:productionMatches.length,changedProtected,exportedBackendMismatches,failures},null,2));
 if(mode==='final'&&failures.length)process.exitCode=1;
}
