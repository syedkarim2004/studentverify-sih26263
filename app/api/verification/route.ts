import {env} from 'cloudflare:workers';
import {institutions} from '../../../lib/model';
import {packState,unpackState} from '../../../lib/state-storage';

export const dynamic='force-dynamic';
function db(){if(!env.DB)throw new Error('Database binding unavailable');return env.DB}
function owner(req:Request){return req.headers.get('oai-authenticated-user-id')||'private-demo-workspace'}
const stakeholders=['Employer','Institution','Regulatory body'] as const;

export async function POST(req:Request){
 try{
  const body=await req.json() as {studentId?:string;stakeholder?:string;purpose?:string};
  const stakeholder=String(body.stakeholder||'');
  const purpose=String(body.purpose||'').trim();
  if(!stakeholders.includes(stakeholder as typeof stakeholders[number]))return Response.json({error:'Select a supported stakeholder type.'},{status:400});
  if(purpose.length<10||purpose.length>200)return Response.json({error:'Provide a verification purpose of 10–200 characters.'},{status:400});
  const row=await db().prepare('SELECT data FROM workspaces WHERE id = ?').bind(owner(req)).first<{data:string}>();
  if(!row)return Response.json({error:'Workspace not initialized.'},{status:404});
  const state=await unpackState(row.data);
  const student=state.students.find(s=>s.id===body.studentId);
  if(!student)return Response.json({error:'Synthetic record not found.'},{status:404});
  const consent=state.consents[student.id];
  if(!consent?.granted||new Date(consent.expires)<=new Date())return Response.json({error:'Active demo consent is required before details can be disclosed.'},{status:403});
  const now=new Date().toISOString();
  state.revision++;
  state.activities.unshift({id:crypto.randomUUID(),action:'Limited verification response issued',detail:`${stakeholder} · ${student.id} · ${purpose.slice(0,120)} · Synthetic demo response.`,at:now});
  await db().prepare('UPDATE workspaces SET data = ?, updated_at = ? WHERE id = ?').bind(await packState(state),now,owner(req)).run();
  return Response.json({demo:true,officiallyVerified:false,scope:['studentId','name','institution','programme','academicYear','enrolmentStatus'],stakeholder,purpose,issuedAt:now,consentExpires:consent.expires,record:{studentId:student.id,name:student.name,institution:institutions.find(i=>i.id===student.institution)?.name||student.institution,programme:student.course,academicYear:student.year,enrolmentStatus:student.status}},{headers:{'Cache-Control':'no-store'}});
 }catch(e){return Response.json({error:e instanceof Error?e.message:'Unable to issue verification response.'},{status:400})}
}
