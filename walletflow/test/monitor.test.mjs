import test from 'node:test';
import assert from 'node:assert/strict';
import Fastify from 'fastify';
import {mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {openStore} from '../server/store.mjs';
import {registerMonitor} from '../server/monitor.mjs';
import {demoProject} from '../shared/demo.mjs';
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
test('monitor API baseline, burst, staging, pause and reopen retain correct state without editing evidence',async()=>{
 const db=openStore(mkdtempSync(join(tmpdir(),'walletflow-monitor-'))),p=demoProject();p.monitor.minGap=0;p.monitor.maxAge=86400;
 db.prepare('INSERT INTO projects(id,data,updated_at) VALUES(?,?,?)').run(p.id,JSON.stringify(p),new Date().toISOString());
 const getProject=id=>JSON.parse(db.prepare('SELECT data FROM projects WHERE id=?').get(id).data);
 const app=Fastify();registerMonitor(app,db,{getProject,hasKey:()=>false,saveJob:()=>{throw Error('Demo must not request a provider.');}});
 const request=async(action,body={})=>{const r=await app.inject({method:action?'POST':'GET',url:'/api/monitor/'+p.id+(action?'/'+action:''),payload:action?body:undefined});assert.equal(r.statusCode,200,r.body);return r.json();};
 const complete=async()=>{for(let i=0;i<100;i++){const s=await request();if(s.lastScan&&s.status==='Paused')return s;await pause(50);}throw Error('Monitor scan did not finish.');};
 await request('scan');let state=await complete();assert.equal(state.alerts.length,0);assert.equal(state.rows.length,p.wallets.filter(w=>w.kind==='wallet').length);assert.ok(state.rows.every(w=>w.initialized));
 await request('demo-burst');state=await complete();assert.equal(state.alerts.length,3); // minimum gap 0 intentionally matches each new event
 const stage=await request('stage');assert.equal(stage.events.length,3);assert.equal(getProject(p.id).events.length,13);
 await request('scan');state=await complete();assert.equal(state.alerts.length,3);assert.equal(state.observations.length,3);
 await request('read',{id:state.alerts[0].id});assert.equal((await request()).alerts.filter(a=>a.read).length,1);
 await request('start');await request('pause');assert.equal((await request()).enabled,false);
 await app.close();const app2=Fastify();registerMonitor(app2,db,{getProject,hasKey:()=>false,saveJob:()=>{}});const reopened=(await app2.inject({url:'/api/monitor/'+p.id})).json();assert.equal(reopened.status,'Paused');assert.equal(reopened.alerts.length,3);assert.ok(reopened.rows[0].initialized);await app2.close();db.close();
});
