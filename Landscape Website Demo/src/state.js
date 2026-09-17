import { products } from './data.js';
const key = 'alder-field-materials-v1';
let selected = [];
try { const saved = JSON.parse(localStorage.getItem(key) || '[]'); if (Array.isArray(saved)) selected = [...new Set(saved)].filter(id => products.some(p => p.id === id)); } catch {}
export const getSelected = () => [...selected];
export function setSelected(ids) { selected = [...new Set(ids)].filter(id => products.some(p => p.id === id)); try { localStorage.setItem(key, JSON.stringify(selected)); } catch {} document.dispatchEvent(new CustomEvent('materialschange')); }
export const addProduct = id => setSelected([...selected, id]);
export const removeProduct = id => setSelected(selected.filter(item => item !== id));
if(typeof window !== 'undefined')window.addEventListener('storage', event => { if(event.key === key) { try { const ids = JSON.parse(event.newValue || '[]'); if(Array.isArray(ids)) { selected = [...new Set(ids)].filter(id => products.some(p=>p.id===id)); document.dispatchEvent(new CustomEvent('materialschange')); } } catch {} } });
