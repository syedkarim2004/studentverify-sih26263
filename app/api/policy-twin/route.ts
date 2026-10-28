import {env} from 'cloudflare:workers';
import {capacity,institutions,programmes,type State} from '../../../lib/model';
import {packState,unpackState} from '../../../lib/state-storage';

export const dynamic='force-dynamic';
function owner(req:Request){return req.headers.get('oai-authenticated-user-id')||'private-demo-workspace'}
function db(){if(!env.DB)throw new Error('Database binding unavailable');return env.DB}
type Adjustments=Record<string,number>;

async function workspace(req:Request){
 const row=await db().prepare('SELECT data FROM workspaces WHERE id = ?').bind(owner(req)).first<{data:string}>();
 if(!row)throw new Error('Workspace not initialized. Open the dashboard first.');
 return unpackState(row.data);
}

function calculate(state:State,adjustments:Adjustments){
 const rows=institutions.map(inst=>{
  const baseline=programmes.reduce((total,programme)=>total+capacity(inst.id,programme),0);
  const adjustment=adjustments[inst.id]??0;
  const proposed=Math.max(1,Math.round(baseline*(1+adjustment/100)));
  const enrolled=state.students.filter(s=>s.institution===inst.id&&s.status==='Active'&&s.category!=='Supernumerary').length;
  const position=proposed-enrolled;
  return {institutionId:inst.id,institution:inst.name,adjustment,baseline,proposed,enrolled,position,status:position<0?'breach':'within_limit',explanation:position<0?`${Math.abs(position)} reported admissions would exceed the simulated intake.`:`${position} seats remain under the simulated intake.`};
 });
 const baselineSeats=rows.reduce((n,r)=>n+r.baseline,0),proposedSeats=rows.reduce((n,r)=>n+r.proposed,0);
 return {academicYear:'2026–27',calculatedAt:new Date().toISOString(),summary:{baselineSeats,proposedSeats,seatChange:proposedSeats-baselineSeats,projectedBreaches:rows.filter(r=>r.status==='breach').length,affectedSeats:Math.abs(proposedSeats-baselineSeats)},institutions:rows};
}

export async function GET(req:Request){
 try{const rows=await db().prepare('SELECT id,name,adjustments,result,created_at FROM policy_scenarios WHERE owner_id = ? ORDER BY created_at DESC LIMIT 20').bind(owner(req)).all<{id:string;name:string;adjustments:string;result:string;created_at:string}>();return Response.json({scenarios:rows.results.map(r=>({id:r.id,name:r.name,adjustments:JSON.parse(r.adjustments),result:JSON.parse(r.result),createdAt:r.created_at}))},{headers:{'Cache-Control':'no-store'}})}catch(e){return Response.json({error:e instanceof Error?e.message:'Unable to load scenarios.'},{status:500})}
}

export async function POST(req:Request){
 try{
  const body=await req.json() as {name?:string;adjustments?:Adjustments};
  const name=String(body.name||'Policy scenario').trim().slice(0,80);
  if(!body.adjustments||typeof body.adjustments!=='object')return Response.json({error:'Scenario adjustments are required.'},{status:400});
  const adjustments:Adjustments={};
  for(const inst of institutions){const value=Number(body.adjustments[inst.id]??0);if(!Number.isFinite(value)||value < -30||value > 30||value%5!==0)return Response.json({error:`${inst.id} adjustment must be between -30 and 30 in steps of 5.`},{status:400});adjustments[inst.id]=value}
  const state=await workspace(req),result=calculate(state,adjustments),id=crypto.randomUUID(),now=new Date().toISOString();
  state.revision++;state.activities.unshift({id:crypto.randomUUID(),action:'Policy twin scenario saved',detail:`${name} · ${result.summary.projectedBreaches} projected breach(es) · ${result.summary.seatChange>=0?'+':''}${result.summary.seatChange} seats.`,at:now});
  await db().batch([
   db().prepare('INSERT INTO policy_scenarios (id,owner_id,name,adjustments,result,created_at) VALUES (?,?,?,?,?,?)').bind(id,owner(req),name,JSON.stringify(adjustments),JSON.stringify(result),now),
   db().prepare('UPDATE workspaces SET data = ?, updated_at = ? WHERE id = ?').bind(await packState(state),now,owner(req))
  ]);
  return Response.json({scenario:{id,name,adjustments,result,createdAt:now}},{status:201});
 }catch(e){return Response.json({error:e instanceof Error?e.message:'Unable to save scenario.'},{status:400})}
}

export async function DELETE(req:Request){
 try{const id=new URL(req.url).searchParams.get('id');if(!id)return Response.json({error:'Scenario id is required.'},{status:400});const result=await db().prepare('DELETE FROM policy_scenarios WHERE id = ? AND owner_id = ?').bind(id,owner(req)).run();if(!result.meta.changes)return Response.json({error:'Scenario not found.'},{status:404});return Response.json({deleted:true})}catch{return Response.json({error:'Unable to delete scenario.'},{status:500})}
}
