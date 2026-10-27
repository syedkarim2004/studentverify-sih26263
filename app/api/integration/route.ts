import {categories,institutions,programmes} from '../../../lib/model';

export const dynamic='force-dynamic';

export async function GET(){
 return Response.json({
  name:'AICTE Student Data Submission API',version:'1.0-demo',production:false,
  disclaimer:'Local validation demonstrator. Not connected to AICTE or APAAR.',
  method:'POST',requiredHeader:'x-institution-id',maximumRecords:500,
  requiredFields:['name','apaar','institution','course','category'],
  supported:{institutions:institutions.map(i=>i.id),programmes,categories}
 },{headers:{'Cache-Control':'no-store'}});
}

export async function POST(req:Request){
 try{
  const institution=req.headers.get('x-institution-id')||'';
  if(!institutions.some(i=>i.id===institution))return Response.json({error:'Supply a supported x-institution-id header.'},{status:401});
  const body=await req.json() as {records?:Record<string,unknown>[]};
  if(!Array.isArray(body.records)||!body.records.length||body.records.length>500)return Response.json({error:'Submit 1–500 records.'},{status:400});
  const seen=new Set<string>();
  const results=body.records.map((row,index)=>{
   const errors:string[]=[];
   const name=String(row.name||'').trim(),apaar=String(row.apaar||'').trim(),rowInstitution=String(row.institution||''),course=String(row.course||''),category=String(row.category||'General');
   if(!name)errors.push('name_missing');
   if(!/^\d{12}$/.test(apaar))errors.push(apaar?'apaar_format_invalid':'apaar_missing');
   if(apaar&&seen.has(apaar))errors.push('duplicate_apaar_in_batch');
   if(apaar)seen.add(apaar);
   if(rowInstitution!==institution)errors.push('institution_scope_mismatch');
   if(!programmes.includes(course))errors.push('programme_unsupported');
   if(!categories.includes(category))errors.push('category_unsupported');
   return {index:index+1,status:errors.length?'rejected':'accepted',errors};
  });
  const accepted=results.filter(r=>r.status==='accepted').length;
  return Response.json({demo:true,officiallySubmitted:false,institution,summary:{received:results.length,accepted,rejected:results.length-accepted},results});
 }catch{return Response.json({error:'Request body must be valid JSON.'},{status:400})}
}
