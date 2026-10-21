import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { REPO_ROOT, dataDir } from './db.mjs';
import { parseCsv } from './csv.mjs';

export const tables=['products','sheets','customers','subscriptions','deliveries','requests','activity','imports'];
export const reads={
 products:'select id,sku,name,supplier from products order by sku',
 sheets:'select s.id,p.sku,s.country,s.language,s.version,s.issued_on,s.status,s.review_ref from sheets s join products p on p.id=s.product_id order by p.sku,s.issued_on desc',
 customers:'select id,name,contact from customers order by name',
 subscriptions:'select id,customer,sku,country,language,first_supplied,issue from distribution_queue order by customer,sku,country',
 deliveries:'select d.id,c.name customer,p.sku,sh.version,sh.country,d.delivered_on,d.evidence,d.actor from deliveries d join subscriptions s on s.id=d.subscription_id join customers c on c.id=s.customer_id join sheets sh on sh.id=d.sheet_id join products p on p.id=sh.product_id order by d.delivered_on,d.id',
 requests:'select * from request_queue order by due_on,id',
 activity:'select entity,entity_id,action,actor,note,created_at from activity order by created_at,id',
 attention:"select customer,sku,country,language,version,issue from distribution_queue where issue<>'Current delivery recorded' order by customer,sku,country",
 'revision-chase':"select customer,sku,country,version,issue from distribution_queue where issue='Revision needs delivery evidence' order by customer,sku",
 'first-supply':"select customer,sku,country,language,issue from distribution_queue where issue in ('First supply needs delivery evidence','No approved sheet') order by customer,sku,country",
 'review-due':'select sku,product,country,language,version,issued_on,status,issue from review_queue order by issued_on,sku',
 compliance:`select 'SDS-01' rule,sku reference,issue finding from distribution_queue where issue='No approved sheet'
 union all select 'SDS-02',sku,'Supplier document at least five years old; request review' from distribution_queue where issue='Supplier review overdue'
 union all select 'SDS-03',sku,issue from distribution_queue where issue in ('First supply needs delivery evidence','Revision needs delivery evidence')
 union all select 'OPS-01',sku,'Customer request past its recorded deadline' from request_queue where overdue
 union all select 'SDS-05',sku,issue from distribution_queue where issue='New revision awaiting review'
 union all select 'SDS-04',sku,'Imported or new document has no review evidence' from review_queue where status='unverified' order by rule,reference`,
};
export const insights=[
 ['Which customers have both overdue requests and outstanding revisions?',`select distinct q.customer,q.sku from distribution_queue q join request_queue r on r.customer=q.customer and r.sku=q.sku where r.overdue and q.issue='Revision needs delivery evidence' order by q.customer,q.sku`],
 ['Which suppliers have unverified sheets with customers waiting?',`select distinct p.supplier,p.sku,q.customer from products p join sheets sh on sh.product_id=p.id join distribution_queue q on q.sku=p.sku and q.country=sh.country and q.language=sh.language where sh.status='unverified' and q.issue<>'Current delivery recorded' order by p.supplier,p.sku,q.customer`],
 ['Which customers need a different country edition of an existing product?',`select q.customer,q.sku,q.country from distribution_queue q where q.sheet_id is null and exists(select 1 from current_sheets sh join products p on p.id=sh.product_id where p.sku=q.sku and sh.country<>q.country) order by q.customer,q.sku`],
 ['Which approved revisions have no recorded deliveries at all?',`select p.sku,sh.country,sh.version from current_sheets sh join products p on p.id=sh.product_id where not exists(select 1 from deliveries d where d.sheet_id=sh.id) order by p.sku,sh.country`],
 ['Which suppliers have ageing sheets still attached to customer obligations?',`select distinct p.supplier,p.sku,q.customer from distribution_queue q join products p on p.sku=q.sku where q.issued_on <= (current_date-interval '5 years'+interval '60 days')::date order by p.supplier,p.sku,q.customer`],
 ['How many outstanding obligations does each customer have?',`select customer,count(*)::int outstanding from distribution_queue where issue<>'Current delivery recorded' group by customer order by outstanding desc,customer`],
 ['Which product and country combinations have multiple approved versions?',`select p.sku,sh.country,sh.language,count(*)::int versions from sheets sh join products p on p.id=sh.product_id where sh.status='approved' group by p.sku,sh.country,sh.language having count(*)>1 order by p.sku,sh.country`],
 ['Which customer requests lack a usable current sheet?',`select r.customer,r.sku,r.due_on,q.issue from request_queue r join distribution_queue q on q.id=(select subscription_id from requests where id=r.id) where q.issue in ('No approved sheet','Supplier review overdue') order by r.due_on`],
 ['Which customers have delivery evidence for an older revision only?',`select distinct q.customer,q.sku,q.version required_version from distribution_queue q join deliveries d on d.subscription_id=q.id where d.sheet_id<>q.sheet_id and q.issue='Revision needs delivery evidence' order by q.customer,q.sku`],
 ['Which registered products have no customer supply records?',`select p.sku,p.name from products p where not exists(select 1 from subscriptions s where s.product_id=p.id) order by p.sku`],
];
export const specs={
 product:{args:['product'],flags:[]},
 'add-product':{args:[],flags:['sku','name','supplier','actor']},
 'add-customer':{args:[],flags:['name','contact','actor']},
 'add-sheet':{args:['product'],flags:['country','language','version','issued-on','url','actor']},
 'reject-sheet':{args:['sheet'],flags:['reason','actor']},
 'approve-sheet':{args:['sheet'],flags:['file','owner-url','reference','actor']},
 subscribe:{args:['customer','product'],flags:['country','language','first-supplied','actor']},
 'record-delivery':{args:['subscription','sheet'],flags:['date','evidence','actor']},
 'add-request':{args:['subscription'],flags:['due','reason','actor']},
 'close-request':{args:['request'],flags:['reference','actor']},
 log:{args:['product'],flags:['note','actor']},
 import:{args:['directsds','file'],flags:['mapping','dry-run','actor']},
 export:{args:[],flags:['out']},
 'draft-pack':{args:['customer'],flags:[]},
 'weekly-review':{args:[],flags:[]},
 insights:{args:[],flags:[]},
 help:{args:[],flags:[]},
 ...Object.fromEntries(Object.keys(reads).map(k=>[k,{args:[],flags:[]}]))
};
export function parseArgs(argv){
 const a=[],o={};
 for(const arg of argv){if(arg.startsWith('--')){const at=arg.indexOf('=');const key=arg.slice(2,at<0?undefined:at);if(Object.hasOwn(o,key))throw Error('Duplicate flag: '+key);o[key]=at<0?true:arg.slice(at+1);}else a.push(arg);}
 const cmd=a.shift()||'help',sp=specs[cmd];if(!sp)throw Error('Unknown command: '+cmd);
 if(a.length!==sp.args.length)throw Error(`Usage: ${cmd} ${sp.args.map(x=>'<'+x+'>').join(' ')}`);
 for(const key of Object.keys(o))if(!['json',...sp.flags].includes(key))throw Error('Unknown flag: '+key);
 for(const key of ['json','dry-run'])if(o[key]!==undefined&&o[key]!==true)throw Error('--'+key+' takes no value');
 return {cmd,args:a,opts:o};
}
function required(o,k){const s=o[k];if(typeof s!=='string'||!s.trim())throw Error('Required --'+k+'=value');return s.trim();}
function date(s){if(!/^\d{4}-\d{2}-\d{2}$/.test(s)||!Number.isFinite(Date.parse(s))||new Date(s).toISOString().slice(0,10)!==s)throw Error('Invalid ISO date: '+s);return s;}
function past(s){date(s);if(s>new Date().toISOString().slice(0,10))throw Error('Date cannot be in the future');return s;}
function country(s){if(!['NZ','AU'].includes(s))throw Error('Country must be NZ or AU');return s;}
function language(s='en'){if(!/^[a-z]{2}(?:-[A-Z]{2})?$/.test(s))throw Error('Use a language such as en or en-NZ');return s;}
function url(s){const u=new URL(s);if(u.protocol!=='https:'||u.username||u.password)throw Error('Use an HTTPS URL without credentials');return s;}
const hash=x=>createHash('sha256').update(x).digest('hex');
export async function resolve(db,t,key){
 if(!tables.includes(t))throw Error('Unknown entity');
 const col=t==='products'?'sku':t==='customers'?'name':t==='sheets'?'version':null;
 let rows=await db.query(`select * from ${t} where id::text=$1${col?` or lower(${col})=lower($1)`:''}`,[key]);
 if(rows.length!==1)rows=await db.query(`select * from ${t} where starts_with(id::text,lower($1))${col?` or position(lower($1) in lower(${col}))>0`:''}${t==='products'?' or position(lower($1) in lower(name))>0':''} order by id`,[key]);
 if(rows.length!==1)throw Error(`${rows.length?'Ambiguous':'No matching'} ${t}: ${key}. Matches: ${rows.map(r=>r.id+' '+(r[col]||'')).join('; ')||'(none)'}`);
 return rows[0];
}
async function insert(db,t,obj){const keys=Object.keys(obj);return (await db.query(`insert into ${t} (${keys.join(',')}) values (${keys.map((_,i)=>'$'+(i+1)).join(',')}) returning *`,Object.values(obj)))[0];}
async function audit(db,entity,id,action,actor,note){await insert(db,'activity',{entity,entity_id:id,action,actor,note});}
function artifact(kind,content,ext='json',target){const dir=path.join(process.env.OUTPUT_DIR||REPO_ROOT,kind);mkdirSync(dir,{recursive:true,mode:0o700});const file=target?path.resolve(target):path.join(dir,`${kind}-${randomUUID()}.${ext}`);writeFileSync(file,content,{flag:'wx',mode:0o600});return file;}
export async function run(db,cmd,args=[],o={}){
 if(reads[cmd])return db.query(reads[cmd]);
 if(cmd==='help')return Object.entries(specs).map(([command,s])=>({command,arguments:s.args.join(' '),flags:s.flags.map(k=>'--'+k).join(' ')}));
 if(cmd==='insights'){const out=[];for(const [question,sql]of insights)out.push({question,rows:await db.query(sql)});return out;}
 if(cmd==='product'){const p=await resolve(db,'products',args[0]);return {product:p,sheets:await db.query('select * from sheets where product_id=$1 order by issued_on desc',[p.id]),customers:await db.query('select * from distribution_queue where sku=$1',[p.sku])};}
 if(cmd==='export'){await db.exec('BEGIN READ ONLY');try{const archive={format:'sds-distribution-v1',exported_at:new Date().toISOString()};for(const t of tables)archive[t]=await db.query(`select * from ${t} order by id`);const file=artifact('exports',JSON.stringify(archive,null,2)+'\n','json',o.out);return {file,tables:tables.length};}finally{await db.exec('ROLLBACK');}}
 if(cmd==='weekly-review'){const sections={};for(const k of ['attention','review-due','compliance'])sections[k]=await run(db,k);return {file:artifact('drafts','# Internal weekly review\n\n'+JSON.stringify(sections,null,2)+'\n','md')};}
 if(cmd==='draft-pack'){const c=await resolve(db,'customers',args[0]);const rows=await db.query('select q.* from distribution_queue q join subscriptions s on s.id=q.id where s.customer_id=$1 order by q.sku',[c.id]);return {file:artifact('drafts',`# INTERNAL DRAFT: ${c.name}\n\nReview every supplier document and recipient before any delivery. This is not a safety data sheet or proof of sending.\n\n`+JSON.stringify(rows,null,2)+'\n','md')};}
 const actor=required(o,'actor');
 await db.exec('BEGIN ISOLATION LEVEL SERIALIZABLE');
 try{
  let result,entity,action=cmd;
  if(cmd==='add-product'){entity='products';result=await insert(db,entity,{sku:required(o,'sku'),name:required(o,'name'),supplier:required(o,'supplier')});}
  else if(cmd==='add-customer'){entity='customers';result=await insert(db,entity,{name:required(o,'name'),contact:required(o,'contact')});}
  else if(cmd==='add-sheet'){
   const p=await resolve(db,'products',args[0]);entity='sheets';result=await insert(db,entity,{product_id:p.id,country:country(required(o,'country')),language:language(o.language),version:required(o,'version'),issued_on:past(required(o,'issued-on')),source_url:url(required(o,'url'))});
  }else if(cmd==='reject-sheet'){
   const sh=await resolve(db,'sheets',args[0]);if(sh.status!=='unverified')throw Error('Only unverified sheets can be rejected');
   entity='sheets';result=(await db.query("update sheets set status='rejected',reviewer=$1,review_ref=$2,reviewed_on=current_date where id=$3 returning *",[actor,required(o,'reason'),sh.id]))[0];
  }else if(cmd==='approve-sheet'){
   const sh=await resolve(db,'sheets',args[0]);if(sh.status!=='unverified')throw Error('Only unverified sheets can be approved');
   const current=(await db.query('select * from current_sheets where product_id=$1 and country=$2 and language=$3',[sh.product_id,sh.country,sh.language]))[0];
   if(current&&sh.issued_on<=current.issued_on)throw Error('New revision must have a later issue date than the current sheet');
   const ageing=await db.query("select id from sheets where id=$1 and issued_on <= (current_date-interval '5 years')::date",[sh.id]);if(ageing.length)throw Error('Supplier review overdue; obtain a current sheet');
   const owned=url(required(o,'owner-url')),ref=required(o,'reference'),buffer=readFileSync(required(o,'file'));if(buffer.subarray(0,5).toString()!=='%PDF-')throw Error('Review requires the supplier PDF');
   if(buffer.length>50*1024*1024)throw Error('PDF exceeds 50 MB');
   const digest=hash(buffer),archive=path.join(dataDir(),'..','sheets',digest+'.pdf');mkdirSync(path.dirname(archive),{recursive:true,mode:0o700});if(!existsSync(archive))writeFileSync(archive,buffer,{flag:'wx',mode:0o600});
   entity='sheets';result=(await db.query("update sheets set status='approved',owned_url=$1,sha256=$2,archive_path=$3,reviewer=$4,review_ref=$5,reviewed_on=current_date where id=$6 returning *",[owned,digest,path.resolve(archive),actor,ref,sh.id]))[0];
  }else if(cmd==='subscribe'){
   const c=await resolve(db,'customers',args[0]),p=await resolve(db,'products',args[1]);entity='subscriptions';result=await insert(db,entity,{customer_id:c.id,product_id:p.id,country:country(required(o,'country')),language:language(o.language),first_supplied:past(required(o,'first-supplied'))});
  }else if(cmd==='record-delivery'){
   const s=await resolve(db,'subscriptions',args[0]),sh=await resolve(db,'sheets',args[1]);const delivered=past(required(o,'date'));
   if(s.product_id!==sh.product_id||s.country!==sh.country||s.language!==sh.language)throw Error('Sheet does not match the subscription product, country and language');
   if(sh.status!=='approved')throw Error('Sheet is not approved');
   const q=(await db.query('select * from distribution_queue where id=$1',[s.id]))[0];
   if(q.sheet_id!==sh.id||['Supplier review overdue','New revision awaiting review'].includes(q.issue))throw Error('Use the current, reviewed sheet');
   if(delivered<sh.issued_on||delivered<sh.reviewed_on||delivered<s.first_supplied)throw Error('Delivery date predates supply, issue or review');
   if(!existsSync(sh.archive_path)||hash(readFileSync(sh.archive_path))!==sh.sha256)throw Error('Owned PDF archive missing or changed');
   entity='deliveries';result=await insert(db,entity,{subscription_id:s.id,sheet_id:sh.id,delivered_on:delivered,evidence:required(o,'evidence'),actor});
  }else if(cmd==='add-request'){
   const s=await resolve(db,'subscriptions',args[0]);entity='requests';result=await insert(db,entity,{subscription_id:s.id,due_on:date(required(o,'due')),reason:required(o,'reason')});
  }else if(cmd==='close-request'){
   const r=await resolve(db,'requests',args[0]);if(r.status!=='open')throw Error('Request is already closed');
   const q=(await db.query('select * from distribution_queue where id=$1',[r.subscription_id]))[0];if(q.issue!=='Current delivery recorded')throw Error('Current delivery evidence required before closing');
   entity='requests';result=(await db.query("update requests set status='closed',resolution_ref=$1 where id=$2 returning *",[required(o,'reference'),r.id]))[0];
  }else if(cmd==='log'){
   result=await resolve(db,'products',args[0]);entity='products';await audit(db,entity,result.id,cmd,actor,required(o,'note'));await db.exec('COMMIT');return {id:result.id,logged:true};
  }else if(cmd==='import'){
   if(args[0]!=='directsds')throw Error('Supported import: directsds');
   const content=readFileSync(args[1],'utf8');const mapping=o.mapping?JSON.parse(readFileSync(o.mapping,'utf8')):{sku:'SKU',name:'Product name',supplier:'Supplier',country:'Country',language:'Language',version:'Version',issued_on:'Revision date',source_url:'SDS URL'};
   const keys=['sku','name','supplier','country','language','version','issued_on','source_url'];
   if(keys.some(k=>typeof mapping[k]!=='string'||!mapping[k])||Object.keys(mapping).some(k=>!keys.includes(k))||new Set(Object.values(mapping)).size!==keys.length)throw Error('Mapping must contain exactly the eight distinct source columns');
   const rows=parseCsv(content);if(!rows.length)throw Error('CSV has no data rows');
   if(Object.keys(rows[0]).some(k=>!Object.values(mapping).includes(k))||Object.values(mapping).some(k=>!Object.hasOwn(rows[0],k)))throw Error('CSV columns do not match mapping; explicitly prepare the eight-column extract');
   const fingerprint=hash(JSON.stringify(mapping)+'\n'+content);
   const old=await db.query('select id from imports where fingerprint=$1',[fingerprint]);if(old.length){await db.exec('ROLLBACK');return {imported:0,skipped:rows.length,dry_run:!!o['dry-run']};}
   let imported=0,skipped=0;const seen=new Set();
   for(const row of rows){
    const v=Object.fromEntries(keys.map(k=>[k,row[mapping[k]].trim()]));if(keys.some(k=>!v[k]))throw Error('Import has a blank required value');
    country(v.country);language(v.language);past(v.issued_on);url(v.source_url);
    const key=JSON.stringify([v.sku,v.country,v.language,v.version]);if(seen.has(key))throw Error('Duplicate sheet key in import');seen.add(key);
    let p=(await db.query('select * from products where sku=$1',[v.sku]))[0];
    if(p&&(p.name!==v.name||p.supplier!==v.supplier))throw Error('Product mapping conflicts with existing SKU '+v.sku);
    if(!p)p=await insert(db,'products',{sku:v.sku,name:v.name,supplier:v.supplier});
    const existing=(await db.query('select * from sheets where product_id=$1 and country=$2 and language=$3 and version=$4',[p.id,v.country,v.language,v.version]))[0];
    if(existing){if(existing.issued_on!==v.issued_on||existing.source_url!==v.source_url)throw Error('Changed source row; create a distinct version');skipped++;continue;}
    await insert(db,'sheets',{product_id:p.id,country:v.country,language:v.language,version:v.version,issued_on:v.issued_on,source_url:v.source_url});imported++;
   }
   if(o['dry-run']){await db.exec('ROLLBACK');return {imported,skipped,dry_run:true};}
   result=await insert(db,'imports',{fingerprint,source_name:path.basename(args[1]),rows_count:rows.length,actor});entity='imports';
   await audit(db,entity,result.id,cmd,actor,`${imported} unverified sheets, ${skipped} unchanged`);await db.exec('COMMIT');return {imported,skipped,dry_run:false};
  }else throw Error('Unknown command: '+cmd);
  await audit(db,entity,result.id,action,actor,'Operator recorded '+action);await db.exec('COMMIT');return result;
 }catch(e){await db.exec('ROLLBACK');throw e;}
}
