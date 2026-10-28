import type {State} from './model';

function bytesToBase64(bytes:Uint8Array){let binary='';for(let i=0;i<bytes.length;i+=32768)binary+=String.fromCharCode(...bytes.subarray(i,i+32768));return btoa(binary)}
function base64ToBytes(value:string){const binary=atob(value),bytes=new Uint8Array(binary.length);for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);return bytes}

export async function packState(state:State){const json=JSON.stringify(state);if(json.length<800000)return json;const stream=new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'));return 'gzip:'+bytesToBase64(new Uint8Array(await new Response(stream).arrayBuffer()))}
export async function unpackState(value:string):Promise<State>{if(!value.startsWith('gzip:'))return JSON.parse(value) as State;const stream=new Blob([base64ToBytes(value.slice(5))]).stream().pipeThrough(new DecompressionStream('gzip'));return JSON.parse(await new Response(stream).text()) as State}
