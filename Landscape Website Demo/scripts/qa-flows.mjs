import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {writeFile,mkdir} from 'node:fs/promises';
const require=createRequire('C:/Users/Jessa/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/package.json');
const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
const context=await browser.newContext({viewport:{width:1440,height:1000}});
const page=await context.newPage();
const errors=[];const checks=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
const base='http://127.0.0.1:4173';
const check=(name,value)=>{assert.ok(value,name);checks.push(name);};
await mkdir('test-results',{recursive:true});
async function goto(route){await page.goto(base+route,{waitUntil:'networkidle'});}
async function allImages(){await page.locator('img').evaluateAll(imgs=>imgs.forEach(i=>i.loading='eager'));await page.waitForFunction(()=>[...document.images].every(i=>i.complete));check('All visible image sources load on '+new URL(page.url()).pathname,await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.naturalWidth>0)));}
try{
 for(const route of ['/','/services/','/products/','/about/','/contact/']){await goto(route);check('Single H1 '+route,await page.locator('h1').count()===1);check('No desktop overflow '+route,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await allImages();await page.screenshot({path:`test-results/${route==='/'?'home':route.split('/')[1]}-desktop.png`,fullPage:true});}
 await goto('/products/');
 check('Full material catalog',await page.locator('.product-card').count()===31);
 await page.locator('[data-category="stone"]').click();check('Category filter',await page.locator('.product-card').count()===6);
 await page.locator('#product-search').fill('river');check('Combined category and search',await page.locator('.product-card').count()===1);
 await page.locator('[data-detail="river-rock"]').first().click();check('Product detail dialog opens',await page.locator('dialog').evaluate(d=>d.open));
 await page.locator('dialog [data-add]').click();check('Product selection stored',await page.evaluate(()=>JSON.parse(localStorage.getItem('alder-field-materials-v1')).includes('river-rock')));
 for(let i=0;i<12;i++){await page.keyboard.press('Tab');check('Dialog focus trap '+i,await page.evaluate(()=>document.querySelector('dialog').contains(document.activeElement)));}
 await page.keyboard.press('Escape');check('Escape closes dialog',!await page.locator('dialog').evaluate(d=>d.open));check('Focus returns to dialog opener',await page.evaluate(()=>document.activeElement.dataset.detail==='river-rock'));
 await page.locator('#product-search').fill('does-not-exist');check('Empty search state',await page.locator('.empty-state').count()===1);
 await page.locator('#empty-reset').click();check('Reset filters restores all materials',await page.locator('.product-card').count()===31);
 await page.locator('[data-add="black-mulch"]').click();
 await goto('/contact/');check('Multiple selections survive navigation',await page.locator('.material-chip').count()===2);await page.reload();check('Selections survive refresh',await page.locator('.material-chip').count()===2);
 await page.locator('[data-remove-material="river-rock"]').click();check('Remove quote material',await page.locator('.material-chip').count()===1);
 await page.locator('#add-material-select').selectOption('topsoil');await page.locator('#add-material').click();check('Add material within quote form',await page.locator('.material-chip').count()===2);
 await page.locator('#submit-quote').click();check('Required validation focuses name',await page.locator('#name').evaluate(el=>document.activeElement===el));check('Required inline errors',await page.locator('[aria-invalid=true]').count()===4);
 await page.locator('#name').fill('Alex Green');await page.locator('#email').fill('not-an-email');await page.locator('#phone').fill('123');await page.locator('#preferred').selectOption('email');await page.locator('#submit-quote').click();check('Validation preserves entered name',await page.locator('#name').inputValue()==='Alex Green');check('Invalid email message',await page.locator('#email-error').textContent()==='Enter a valid email address.');
 await page.locator('#photos').setInputFiles({name:'invalid.txt',mimeType:'text/plain',buffer:Buffer.from('hello')});check('Reject unsupported file type',(await page.locator('#photos-error').textContent()).includes('JPG'));
 await page.locator('#clear-photos').click();
 await page.locator('#photos').setInputFiles({name:'large.jpg',mimeType:'image/jpeg',buffer:Buffer.alloc(10*1024*1024+1)});check('Reject oversized file',(await page.locator('#photos-error').textContent()).includes('10 MB'));
 await page.locator('#clear-photos').click();
 await page.locator('#photos').setInputFiles(Array.from({length:6},(_,i)=>({name:`file${i}.jpg`,mimeType:'image/jpeg',buffer:Buffer.from('fake')})));check('Reject excessive file count',(await page.locator('#photos-error').textContent()).includes('up to 5'));
 await page.locator('#clear-photos').click();
 await page.locator('#photos').setInputFiles({name:'invalid.jpg',mimeType:'image/jpeg',buffer:Buffer.from('not a jpeg')});await page.waitForFunction(()=>document.querySelector('#photos-error').textContent.includes('could not be opened'));check('Reject corrupt image',await page.locator('#photo-previews img').count()===0);
 await page.locator('#clear-photos').click();await page.locator('#photos').setInputFiles(['src/assets/hero.webp','src/assets/stone.webp']);await page.waitForSelector('#photo-previews img');check('Multiple photo previews',await page.locator('#photo-previews img').count()===2);await page.locator('[data-remove-photo="0"]').click();check('Remove photo',await page.locator('#photo-previews img').count()===1);
 await page.locator('#email').fill('alex@example.com');await page.locator('#phone').fill('(202) 555-0148');await page.locator('#submit-quote').click();await page.waitForSelector('.success-state');check('Demo success state',await page.locator('.success-state').textContent().then(t=>t.includes('No information or images were sent')));check('Clear shortlist after completion',await page.evaluate(()=>JSON.parse(localStorage.getItem('alder-field-materials-v1')).length===0));
 await goto('/contact/');await page.locator('#name').fill('Alex Green');await page.locator('#email').fill('alex@example.com');await page.locator('#phone').fill('2025550148');await page.locator('#preferred').selectOption('email');await page.locator('#submit-quote').click();check('Project info required',(await page.locator('#description-error').textContent()).includes('Select a service'));
 await goto('/services/');await page.getByRole('button',{name:'Mulch installation',exact:false}).click();check('Service material relationship',(await page.locator('dialog').textContent()).includes('Cedar mulch'));await page.locator('dialog a', {hasText:'Add service to quote'}).click();check('Service preselected on quote',await page.locator('input[value="Mulch installation"]').isChecked());
 await page.locator('[data-portfolio]').first().click();check('Portfolio placeholder handled safely',(await page.locator('dialog').textContent()).includes('not been connected'));await page.keyboard.press('Escape');
 for(const width of [320,390,768]){await page.setViewportSize({width,height:844});for(const route of ['/','/services/','/products/','/about/','/contact/']){await goto(route);check('No overflow '+width+' '+route,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));if(width===390){await allImages();await page.screenshot({path:`test-results/${route==='/'?'home':route.split('/')[1]}-mobile.png`,fullPage:true});}}}
 await page.setViewportSize({width:390,height:844});await goto('/');await page.locator('.menu-toggle').click();check('Mobile menu opens',await page.locator('.menu-toggle').getAttribute('aria-expanded')==='true');await page.locator('#main-nav').getByRole('link',{name:'Products',exact:true}).click();check('Mobile menu navigation',new URL(page.url()).pathname==='/products/');await page.locator('[data-detail="hardwood-mulch"]').first().click();check('Mobile modal fits',await page.locator('dialog').evaluate(d=>d.getBoundingClientRect().width<=innerWidth));await page.keyboard.press('Escape');
 // Test optional agent API through a mocked browser registration surface.
 await page.addInitScript(()=>{Object.defineProperty(document,'modelContext',{value:{registerTool(tool){window.demoTool=tool;}}});});await goto('/products/');check('WebMCP tool schema',await page.evaluate(()=>window.demoTool.name==='stage_quote_materials'&&window.demoTool.annotations.readOnlyHint===false));const staged=await page.evaluate(()=>window.demoTool.execute({materialIds:['sod','topsoil']}));check('WebMCP stages visible shared state',staged.selectedMaterials.includes('sod')&&(await page.locator('[data-add="sod"]').getAttribute('aria-pressed'))==='true');check('WebMCP invalid IDs rejected atomically',await page.evaluate(async()=>{const before=localStorage.getItem('alder-field-materials-v1');try{await window.demoTool.execute({materialIds:['sod','invented']});return false}catch{return before===localStorage.getItem('alder-field-materials-v1')}}));
 check('No browser console or runtime errors',errors.length===0);
 await writeFile('test-results/qa-report.json',JSON.stringify({passed:checks.length,checks,errors},null,2));console.log(JSON.stringify({passed:checks.length,errors}));
}catch(e){await page.screenshot({path:'test-results/failure.png',fullPage:true});console.error(e);console.log(JSON.stringify({checks,errors,url:page.url()}));process.exitCode=1;}finally{await browser.close();}
