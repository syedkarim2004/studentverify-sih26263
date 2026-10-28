import {issues,seed,type State} from '../lib/model.ts';

function assert(condition:unknown,message:string){if(!condition)throw new Error(message)}
const state=seed();
let findings=issues(state);
assert(findings.some(f=>f.kind==='missing-id'),'missing APAAR should be flagged');
assert(findings.some(f=>f.kind==='invalid-id'),'invalid APAAR format should be flagged');
assert(findings.some(f=>f.kind==='cross-institution-enrolment'),'cross-institution reuse should be distinguished');
const sameInstitution:State=structuredClone(state);
sameInstitution.students.push({...sameInstitution.students[1],id:'STU-DUPLICATE',createdAt:new Date().toISOString()});
findings=issues(sameInstitution);
assert(findings.some(f=>f.kind==='duplicate-record'&&f.studentId==='STU-DUPLICATE'),'same-institution duplicate should be flagged');
const inconsistent:State=structuredClone(state);
inconsistent.students[0]={...inconsistent.students[0],name:'Student 123',year:'2026',course:'Unsupported programme'};
findings=issues(inconsistent);
assert(findings.some(f=>f.kind==='inconsistent-name'),'numeric name should be flagged');
assert(findings.some(f=>f.kind==='inconsistent-data'),'unsupported reference data should be flagged');
assert(findings.some(f=>f.kind==='inconsistent-year'),'invalid academic year should be flagged');
console.log('Validation checks passed.');
