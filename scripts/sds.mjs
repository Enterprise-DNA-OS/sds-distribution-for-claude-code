#!/usr/bin/env node
import {getDb} from './lib/db.mjs';
import {table} from './lib/format.mjs';
import {parseArgs,run} from './lib/sds.mjs';
export function human(value){
 if(Array.isArray(value)){
  if(!value.length)return '(none)';
  if(value[0]?.question)return value.map(v=>v.question+'\n'+human(v.rows)).join('\n\n');
  return table(value,Object.keys(value[0]).map(key=>({key,label:key.replaceAll('_',' '),width:key==='issue'?50:40,format:v=>v instanceof Date?v.toISOString().slice(0,10):v})));
 }
 return JSON.stringify(value,null,2);
}
let db;
try{const {cmd,args,opts}=parseArgs(process.argv.slice(2));db=await getDb();const result=await run(db,cmd,args,opts);console.log(opts.json?JSON.stringify(result):human(result));}
catch(e){console.error(e.message);process.exitCode=1;}
finally{if(db)await db.close();}
