import {serviceCategories,products,serviceMaterials,icon} from './data.js';
import {button,label,photo,openDialog} from './ui.js';
import {withBase} from './config.js';

const ACCENTS=['#a15a2c','#28422b','#7a7038','#4c5f38','#4d6a72','#6b5a7a'];

export function servicesPage(){return `<section class="page-intro container"><div>${label('Our services')}<h1>A plan for every kind of outdoor project.</h1></div><p>Regular care, a seasonal refresh, or a new beginning — practical ways to make your outdoors work beautifully.</p></section><nav class="service-rail" aria-label="Jump to a service category"><div class="container service-rail-inner">${serviceCategories.map((s,i)=>`<a href="#${s.id}" data-rail="${s.id}" style="--accent:${ACCENTS[i%ACCENTS.length]}">${icon(s.icon)}<span>${s.name.split(' &')[0]}</span></a>`).join('')}</div></nav><section class="container service-directory">${serviceCategories.map((s,i)=>`<article class="service-detail" id="${s.id}" style="--accent:${ACCENTS[i%ACCENTS.length]}"><div class="service-visual">${photo(s.image,s.name)}<div class="service-visual-badge">${icon(s.icon)}</div></div><div class="service-copy"><h2>${s.name}</h2><p>${s.description}</p><p class="ideal"><b>A good fit for</b>${s.ideal}</p><div class="service-copy-actions"><button class="button ghost service-toggle" aria-expanded="false" aria-controls="panel-${s.id}" data-open-label="Hide the full list" data-closed-label="Explore ${s.services.length} services">Explore ${s.services.length} services<span class="button-arrow" aria-hidden="true"></span></button>${button('Discuss your project',withBase(`/contact/?service=${encodeURIComponent(s.services[0])}`),'ghost')}</div><div class="service-list-panel" id="panel-${s.id}" hidden><div class="service-list">${s.services.map(name=>`<button data-service="${name}">${name}</button>`).join('')}</div><details class="recommended"><summary>Materials that work well here<span class="button-arrow" aria-hidden="true"></span></summary><div>${s.products.map(id=>{const p=products.find(x=>x.id===id);return `<a href="${withBase(`/products/?product=${id}`)}">${p.name}</a>`}).join('')}</div></details></div></div></article>`).join('')}</section><section class="section service-note"><div class="container"><h2>The right scope.<br>A clear estimate.</h2><p>Every property is different. Project estimates account for access, site conditions, materials, and the level of care required. Start with a few details and shape a plan from there.</p>${button('Request an estimate',withBase('/contact/'))}</div></section>`;}

export function initServices(){
  document.querySelectorAll('.service-toggle').forEach(btn=>{
    const openLabel=btn.dataset.openLabel;
    const closedLabel=btn.dataset.closedLabel;
    btn.onclick=()=>{
      const open=btn.getAttribute('aria-expanded')!=='true';
      btn.setAttribute('aria-expanded',String(open));
      btn.firstChild.textContent=open?openLabel:closedLabel;
      const panel=document.getElementById(btn.getAttribute('aria-controls'));
      panel.hidden=!open;
      if(open)panel.scrollIntoView({block:'nearest',behavior:'smooth'});
    };
  });
  document.querySelectorAll('[data-service]').forEach(el=>el.onclick=()=>{const name=el.dataset.service;const category=serviceCategories.find(c=>c.services.includes(name));const related=serviceMaterials[name] || category.products.slice(0,3);openDialog(`<div class="dialog-copy"><p class="label">${category.name}</p><h2 id="dialog-title">${name}</h2><p>${category.description}</p><h3>What the plan includes</h3><ul class="check-list"><li>A review of your space, goals, and site access</li><li>A scope tailored to ${name.toLowerCase()}, with materials and preparation considered</li><li>A project estimate and an agreed schedule before work begins</li><li>Cleanup and practical guidance for ongoing care</li></ul><h3>Ideal for</h3><p>${category.ideal}</p><h3>Recommended materials</h3><div class="related-links">${related.map(id=>`<a href="${withBase(`/products/?product=${id}`)}">${products.find(p=>p.id===id).name}</a>`).join('')}</div><p class="small-copy">Related services: ${category.services.filter(s=>s!==name).slice(0,3).join(' · ')}</p>${button('Add service to quote',withBase(`/contact/?service=${encodeURIComponent(name)}`))}</div>`);});
  // If arriving with a #category hash, open that category's panel so the
  // linked content (from the homepage cards, product "pair with a service"
  // links, etc.) is not hidden behind a collapsed toggle.
  if(location.hash){
    const target=document.querySelector(location.hash);
    const toggle=target?.querySelector('.service-toggle');
    toggle?.click();
  }
  const rail=[...document.querySelectorAll('[data-rail]')];
  if(rail.length && 'IntersectionObserver' in window){
    const sections=serviceCategories.map(s=>document.getElementById(s.id)).filter(Boolean);
    const spy=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        rail.forEach(a=>a.classList.toggle('is-active',a.dataset.rail===entry.target.id));
      });
    },{rootMargin:'-40% 0px -55% 0px'});
    sections.forEach(s=>spy.observe(s));
  }
}
