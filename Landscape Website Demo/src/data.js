export const productCategories = [
  {id:'mulch', name:'Mulch', description:'A considered finishing layer for healthier, tidier beds.', image:'mulch'},
  {id:'stone', name:'Stone & rock', description:'Natural texture, practical surfaces, lasting definition.', image:'stone'},
  {id:'soil', name:'Soil & ground', description:'The right foundation for everything that grows.', image:'soil'},
  {id:'plants', name:'Plants', description:'Seasonal interest, soft edges, and living structure.', image:'plants'},
  {id:'lawn', name:'Lawn products', description:'Give your lawn a strong start and thoughtful support.', image:'lawn'},
  {id:'landscape', name:'Landscape materials', description:'The details that bring an outdoor space together.', image:'pavers'},
];
const catalog = {
  mulch: [
    ['Hardwood mulch','A natural, textured finish that gradually enriches planting beds.','Tree rings and established garden beds','#8a6a45'],
    ['Black mulch','A dark, contrasting finish that sets off fresh foliage.','Contemporary beds and curb-appeal refreshes','#2b2420'],
    ['Brown mulch','An understated earth-tone finish for a cohesive landscape.','Mixed borders and residential planting beds','#6b4f34'],
    ['Red mulch','A warm-colored accent for distinctive landscape schemes.','Decorative beds and contrasting borders','#9a4020'],
    ['Cedar mulch','A fragrant wood mulch with a softly fibrous texture.','Ornamental beds and garden paths','#b98a55'],
  ],
  stone: [
    ['River rock','Rounded natural stones with soft variation in color and size.','Dry creek beds and decorative borders','#8b9099'],
    ['Pea gravel','Small, rounded aggregate with an easy, natural character.','Garden paths and seating areas','#a79a86'],
    ['Decorative gravel','Versatile decorative aggregate for a clean, textured surface.','Courtyards and planting accents','#948b7d'],
    ['White stone','Light-colored stone that adds definition and contrast.','Accent beds and modern landscapes','#d8d3c8'],
    ['Landscape rock','Larger natural pieces that create structure and visual interest.','Garden accents and bed transitions','#766b60'],
    ['Crushed stone','Angular aggregate that can create a stable, compacted base.','Walkway bases and utility areas','#7d8286'],
  ],
  soil: [
    ['Topsoil','Screened soil for leveling and preparing growing areas.','Lawn renovation and new beds','#4a3b2c'],
    ['Garden soil','A planting blend for thoughtfully prepared garden beds.','Vegetable gardens and new flower beds','#3f3224'],
    ['Compost','Organic material to improve the character of existing soil.','Soil conditioning and planting preparation','#2e2419'],
    ['Fill dirt','General ground material for shaping and leveling a site.','Grading and non-growing foundations','#7a5c3e'],
    ['Sand','Fine aggregate for appropriate leveling and landscaping uses.','Paver bedding and compatible soil mixes','#c9b488'],
  ],
  plants: [
    ['Shrubs','Structured planting options selected for your site and season.','Foundation beds and garden structure','#4a6b3f'],
    ['Ornamental grasses','Movement and texture with a relaxed, natural appearance.','Layered borders and sunny beds','#8a9a52'],
    ['Perennials','Returning color and texture, chosen for local growing conditions.','Seasonal garden borders','#736a8a'],
    ['Seasonal flowers','Fresh color for a welcoming entrance or seasonal refresh.','Entry beds and containers','#c97b8a'],
    ['Privacy plants','Layered living screens matched to available growing space.','Property edges and outdoor seating','#34502f'],
    ['Small ornamental trees','Garden-scale trees for shade, structure, or seasonal interest.','Feature planting and focal points','#557a45'],
  ],
  lawn: [
    ['Sod','Fresh turf selected to suit site conditions and intended use.','New lawns and lawn renovation','#5a8a3f'],
    ['Grass seed','Seed options matched to sunlight, climate, and existing turf.','Overseeding and lawn repairs','#9a9a5a'],
    ['Fertilizer','Lawn nutrition selected after considering soil and turf needs.','Seasonal lawn care','#7a8a5a'],
    ['Soil amendments','Targeted soil support based on your project requirements.','Lawn preparation and soil improvement','#6b5a3f'],
  ],
  landscape: [
    ['Landscape edging','A defined boundary between lawns, beds, and paths.','Mulch borders and garden separation','#5a5a52'],
    ['Pavers','Modular hardscape units in a selection of finishes and formats.','Walkways and small outdoor seating areas','#a89a80'],
    ['Stepping stones','Individual stones for relaxed routes through the garden.','Garden paths and planting transitions','#8a8578'],
    ['Landscape fabric','Permeable separation fabric for suitable landscape applications.','Aggregate areas and material separation','#a89878'],
    ['Decorative borders','Finishing elements that define the shape of outdoor spaces.','Flower beds and walkway edges','#918a7a'],
  ],
};
export const slugify = name => name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/-$/,'');
// `tint` is the material's real approximate color, rendered as a blended
// overlay on the shared category photograph plus a swatch chip — since a
// single demo photo stands in for each category, the tint is what makes an
// individual product (e.g. red mulch vs. black mulch) read as itself rather
// than a duplicate of its neighbors.
export const products = Object.entries(catalog).flatMap(([category,items]) => items.map(([name,description,uses,tint]) => ({id:slugify(name),name,category,description,uses,tint,image:productCategories.find(c=>c.id===category).image,price:'Quote by quantity & delivery'})));
export const serviceCategories = [
  {id:'lawn-care',name:'Lawn care & maintenance',short:'A lawn that feels looked after.',icon:'grass',description:'Consistent, seasonal care that keeps your property tidy, healthy, and ready to enjoy.',ideal:'Busy homeowners and properties that need a reliable, recurring care plan.',image:'lawn',products:['sod','grass-seed','fertilizer'], services:['Lawn mowing','Edging','Trimming','Blowing','Lawn cleanup','Weed control','Fertilization','Aeration','Overseeding','Lawn renovation','Seasonal lawn maintenance','Recurring maintenance plans']},
  {id:'landscaping',name:'Landscape design & installation',short:'A little vision. A lasting difference.',icon:'leaf',description:'From a new planting bed to a considered garden refresh, bring shape, texture, and year-round interest to your outdoors.',ideal:'New homes, tired gardens, and outdoor spaces ready for a fresh direction.',image:'hero',products:['hardwood-mulch','black-mulch','cedar-mulch','sod','topsoil','soil-amendments'],services:['Landscape design','Landscape installation','Landscape renovation','Flower bed installation','Garden bed installation','Plant installation','Shrub installation','Tree planting','Landscape edging','Rock installation','Decorative stone','Mulch installation','Pine straw installation','Sod installation']},
  {id:'cleanup',name:'Property cleanup',short:'A fresh start for your outdoors.',icon:'rake',description:'Clear the clutter, reclaim overgrown areas, and give your property room to breathe.',ideal:'Seasonal transitions, rental turnovers, and properties needing a reset. Hazardous storm debris requires specialist assessment.',image:'plants',products:['brown-mulch','compost'],services:['Yard cleanouts','Brush removal','Debris removal','Leaf removal','Overgrowth cleanup','Property cleanup','Storm cleanup','Seasonal cleanup','Vacant property cleanup','Rental property cleanup']},
  {id:'plant-care',name:'Tree, shrub & plant care',short:'Keep the growing things thriving.',icon:'tree',description:'Thoughtful trimming and routine bed care protect the shape and character of your planting.',ideal:'Established gardens, hedges, and small ornamental trees. Large or hazardous trees are referred to an appropriate specialist.',image:'plants',products:['shrubs','perennials','compost'],services:['Hedge trimming','Shrub trimming','Small tree pruning','Plant maintenance','Bed maintenance','Seasonal pruning']},
  {id:'outdoor',name:'Outdoor improvements',short:'Make more of the space outside.',icon:'path',description:'Practical paths, defined edges, and natural materials make a garden easier to use and enjoy.',ideal:'Homeowners looking for everyday improvements and better flow through a garden.',image:'pavers',products:['river-rock','decorative-gravel','white-stone','pavers','stepping-stones'],services:['Paver walkways','Garden paths','Landscape borders','Gravel areas','Decorative rock areas','Small retaining walls','Drainage improvements','Outdoor planting areas']},
  {id:'commercial',name:'Commercial property care',short:'A good first impression, maintained.',icon:'building',description:'A considered approach to clean, welcoming grounds for workplaces and shared communities.',ideal:'Offices, community spaces, rental properties, and light commercial sites.',image:'hero',products:['black-mulch','seasonal-flowers','landscape-edging'],services:['Commercial lawn maintenance','Office landscaping','HOA/community maintenance','Rental property maintenance','Property management landscaping','Recurring commercial maintenance']},
];
export const serviceMaterials = {
  'Mulch installation':['hardwood-mulch','black-mulch','cedar-mulch'],
  'Rock installation':['river-rock','decorative-gravel','white-stone'],
  'Decorative stone':['river-rock','decorative-gravel','white-stone'],
  'Sod installation':['sod','topsoil','soil-amendments'],
};
export const projects = [
  {name:'Room to unwind',type:'Landscape installation',image:'hero',description:'A flowing lawn, layered planting, and a quiet place to end the day.',service:'landscaping'},
  {name:'A naturally welcoming entrance',type:'Mulch & bed refresh',image:'plants',description:'Soft perennial planting and clean bed lines frame an everyday arrival.',service:'plant-care'},
  {name:'A path with purpose',type:'Decorative stone installation',image:'pavers',description:'Natural stone connects the garden with the spaces you use most.',service:'outdoor'},
];
export const icons = {
 grass:'<path d="M5 27h24M10 27C10 18 7 12 4 9m12 18V5m0 12 6-9m1 19c0-10 4-14 7-16"/>',
 leaf:'<path d="M7 26C1 10 14 4 29 5c1 17-9 25-22 21Zm0 0L23 11M16 18h9M16 18V10"/>',
 rake:'<path d="m7 30 15-18M15 6l13 11M17 3l-5 6m10-2-5 6m10-2-5 6m10-2-5 6"/>',
 tree:'<path d="M17 31V18M11 31h12M17 3 5 17h6l-7 8h26l-7-8h6L17 3Z"/>',
 path:'<path d="M5 30 12 4m18 26L22 4M7 23h20M9 16h16M11 10h12"/>',
 building:'<path d="M6 30V8h15v22M21 17h8v13M3 30h29M11 13h5m-5 5h5m-5 5h5M12 30v-4h4v4"/>',
};
export const icon = key => `<svg class="service-icon" viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[key]}</svg>`;
