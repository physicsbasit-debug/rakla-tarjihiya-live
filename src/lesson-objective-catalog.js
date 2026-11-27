/* Verified objective catalog. Empty until curriculum sources are checked. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.RaklaObjectiveCatalog=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const LEVELS=Object.freeze(['معرفة','تطبيق','استدلال']);
function normalizeCatalog(entries){
 if(!Array.isArray(entries))throw new TypeError('Catalog must be an array');
 const out=Object.create(null);
 for(const e of entries){
  const key=String(e?.lessonKey||'');
  if(!/^(9|10)\|([1-9]|1[0-9]|20)\|([1-9]|1[0-9]|20)$/.test(key)||out[key])throw new Error('Invalid or duplicate lesson');
  const s=e.source;
  if(!s||!['title','reference','version'].every(k=>typeof s[k]==='string'&&s[k].trim()))throw new Error('Verified source required');
  if(!Array.isArray(e.objectives)||!e.objectives.length||e.objectives.length>12)throw new Error('Invalid objective count');
  const ids=new Set();
  const goals=e.objectives.map(o=>{const id=String(o?.id||''),text=String(o?.text||'').trim();if(!/^lo_[A-Za-z0-9]+$/.test(id)||!text||text.length>180||ids.has(id))throw new Error('Invalid objective');ids.add(id);return Object.freeze({id,text});});
  out[key]=Object.freeze({lessonKey:key,source:Object.freeze({title:s.title.trim(),reference:s.reference.trim(),version:s.version.trim()}),objectives:Object.freeze(goals)});
 }
 return Object.freeze(out);
}
function effectiveObjectives(catalog,key,saved=[]){
 const result=new Map();
 for(const o of [...(catalog[key]?.objectives||[]),...(Array.isArray(saved)?saved:[])])if(o&&/^lo_[A-Za-z0-9]+$/.test(String(o.id))&&typeof o.text==='string'&&o.text.trim()&&!result.has(o.id))result.set(o.id,{id:o.id,text:o.text.trim()});
 return [...result.values()];
}
function responseMetric(correct,total){
 if(!Number.isInteger(correct)||!Number.isInteger(total)||correct<0||total<0||correct>total)throw new RangeError('Invalid counts');
 return total===0?null:Math.round(correct/total*100);
}
return Object.freeze({LEVELS,normalizeCatalog,effectiveObjectives,responseMetric});
});