import {header,footer,updateCount} from './layout.js';
import {renderPage} from './pages.js';
import {initServices} from './services.js';
import {initCatalog,syncProductButtons} from './catalog.js';
import {initContact} from './contact.js';
import {business,basePath} from './config.js';
import {openDialog,toast} from './ui.js';
const rawPath = location.pathname.replace(/index\.html$/,'');
const path = rawPath.startsWith(basePath) ? (rawPath.slice(basePath.length) || '/') : rawPath;
const root = document.querySelector('#app');
root.innerHTML = header(path) + `<main id="main">${renderPage(path)}</main>` + footer();
if(path==='/services/')initServices();
if(path==='/products/')initCatalog();
if(path==='/contact/')initContact();
const menu=document.querySelector('.menu-toggle');
menu.onclick=()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu');document.querySelector('#main-nav').classList.toggle('open',open);};
document.addEventListener('keydown',e=>{if(e.key==='Escape' && menu.getAttribute('aria-expanded')==='true')menu.click();});
document.querySelectorAll('[data-portfolio]').forEach(el=>el.onclick=()=>{try{const url=new URL(business.portfolioUrl);if(url.protocol==='https:'||url.protocol==='http:'){window.open(url.href,'_blank','noopener,noreferrer');return;}}catch{}openDialog('<div class="dialog-copy"><p class="eyebrow">PORTFOLIO DEMONSTRATION</p><h2 id="dialog-title">You’re exploring a work sample.</h2><p>The portfolio return destination has not been connected yet. This standalone demo showcases the Alder & Field website experience.</p><button class="button" onclick="this.closest(\'dialog\').close()">Keep exploring ↗</button></div>');});
document.querySelector('[data-demo-info]').onclick=()=>openDialog('<div class="dialog-copy"><p class="eyebrow">ABOUT THIS WEBSITE</p><h2 id="dialog-title">A fictional brand.<br>A complete experience.</h2><p>Alder & Field is a portfolio demonstration, not an operating business. Landscapes are illustrative concepts, and contact details and business hours are examples. No customer testimonials or business credentials are claimed.</p><h3>Your privacy</h3><p>Quote submissions are simulated in your browser. Personal information and photos are not transmitted or saved. Material selections are stored on this device so you can browse between pages. No analytics or marketing cookies are used.</p><button class="button" id="clear-preferences">Clear saved materials</button></div>');
document.addEventListener('click',async e=>{if(e.target.id==='clear-preferences'){const {setSelected}=await import('./state.js');setSelected([]);toast('Saved materials cleared.');}});
document.addEventListener('materialschange',updateCount);updateCount();
document.addEventListener('materialschange',syncProductButtons);
if(location.hash)requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());
if(document.modelContext?.registerTool){
 const lifecycle=new AbortController();
 try{Promise.resolve(document.modelContext.registerTool({name:'stage_quote_materials',title:'Add materials to quote shortlist',description:'Stage valid material IDs in the visible quote shortlist. Does not submit a quote.',inputSchema:{type:'object',properties:{materialIds:{type:'array',items:{type:'string'},minItems:1}},required:['materialIds'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},async execute(input){const {products}=await import('./data.js');if(!input||!Array.isArray(input.materialIds)||!input.materialIds.length||Object.keys(input).some(k=>k!=='materialIds')||input.materialIds.some(id=>typeof id!=='string'||!products.some(p=>p.id===id)))throw new Error('Provide one or more valid material IDs.');const {getSelected,setSelected}=await import('./state.js');setSelected([...getSelected(),...input.materialIds]);toast('Materials added to your quote.');return {selectedMaterials:getSelected()};}}, {signal:lifecycle.signal})).catch(()=>{});}catch{}window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
}
