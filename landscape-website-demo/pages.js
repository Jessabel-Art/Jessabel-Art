import {home} from './home.js';
import {servicesPage} from './services.js';
import {catalogPage} from './catalog.js';
import {aboutPage} from './about.js';
import {contactPage} from './contact.js';
export const renderPage = path => ({'/':home,'/services/':servicesPage,'/products/':catalogPage,'/about/':aboutPage,'/contact/':contactPage}[path] || home)();
