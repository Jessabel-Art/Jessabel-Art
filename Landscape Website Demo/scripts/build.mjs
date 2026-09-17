import {cp,mkdir,writeFile,readFile} from 'node:fs/promises';
import {business,basePath} from '../src/config.js';
import {renderPage} from '../src/pages.js';
import {header,footer} from '../src/layout.js';
// Rewrites root-relative internal href/src/asset references (produced by the
// hand-rolled templates in src/layout.js, src/ui.js, and the page modules) so
// they resolve correctly when this site is hosted under basePath instead of
// at a domain root. Each pattern targets a distinct, non-overlapping
// attribute-value start (href=/src=, then srcset='s first and later URLs) so
// none of them can double-prefix a value another pattern already touched.
const withBase = html => html
 .replace(/(href|src)="\/(?!\/)/g, `$1="${basePath}/`)
 .replace(/srcset="\//g, `srcset="${basePath}/`)
 .replace(/, \/assets\//g, `, ${basePath}/assets/`);
const pages = { '':['Landscaping & Lawn Care','Thoughtfully planted. Beautifully kept. Discover landscaping, lawn care, and outdoor materials with Alder & Field, a fictional portfolio demonstration.'],services:['Landscaping Services','Explore lawn maintenance, landscape installation, property cleanup, plant care, outdoor improvements, and commercial property care.'],products:['Landscape Products & Materials','Browse mulch, stone, soil, plants, lawn products, and landscape materials. Build a shortlist for your project quote.'],about:['Our Approach','Meet the ideas behind Alder & Field: thoughtful landscaping, clear communication, and practical property care.'],contact:['Request a Quote','Plan your outdoor project. Select landscaping services and materials and explore our demonstration quote request experience.']};
await mkdir('dist',{recursive:true});
await cp('src','dist',{recursive:true});
for(const [route,[title,description]] of Object.entries(pages)){
 const url=business.siteUrl + '/' + (route ? route+'/':'');
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#243e33"><title>${title} | Alder & Field</title><meta name="description" content="${description}"><meta property="og:type" content="website"><meta property="og:title" content="${title} | Alder & Field"><meta property="og:description" content="${description}"><meta property="og:url" content="${url}"><meta property="og:site_name" content="Alder & Field — Portfolio Demo"><link rel="canonical" href="${url}"><link rel="icon" type="image/svg+xml" href="/assets/favicon.svg"><link rel="stylesheet" href="/styles.css"><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'WebSite',name:'Alder & Field — fictional portfolio demonstration',url:business.siteUrl,description:'A fictional landscaping website demonstrating web design and development.'})}</script></head><body><div id="app"></div><noscript><main><h1>Alder & Field</h1><p>Please enable JavaScript to explore this interactive landscaping portfolio demonstration.</p><a href="/">Home</a> · <a href="/services/">Services</a> · <a href="/products/">Products</a> · <a href="/about/">About</a> · <a href="/contact/">Request a Quote</a></main></noscript><script type="module" src="/app.js"></script></body></html>`;
 const routePath='/'+(route?route+'/':'');
 const rendered=withBase(html.replace('<div id="app"></div>',`<div id="app">${header(routePath)}<main id="main">${renderPage(routePath)}</main>${footer()}</div>`));
 await mkdir(`dist/${route}`,{recursive:true});await writeFile(`dist/${route?route+'/':''}index.html`,rendered);
}
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${business.siteUrl}/sitemap.xml\n`);
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.keys(pages).map(route=>`<url><loc>${business.siteUrl}/${route?route+'/':''}</loc></url>`).join('')}</urlset>`);
await writeFile('dist/404.html',withBase('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | Alder & Field</title><link rel="stylesheet" href="/styles.css"><main class="container section"><p class="eyebrow">ALDER & FIELD · 404</p><h1>A different<br>garden path.</h1><p>This page could not be found.</p><a class="button" href="/">Back to home ↗</a></main></html>'));
console.log('Built 5 pages, static assets, sitemap, robots.txt, and 404 page.');
