import {DatabaseSync} from 'node:sqlite';
import {mkdirSync} from 'node:fs';
import {join} from 'node:path';
import {demoProject,demoEvents} from '../shared/demo.mjs';
export function openStore(directory){mkdirSync(directory,{recursive:true,mode:0o700});const db=new DatabaseSync(join(directory,'walletflow.sqlite'));db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;
CREATE TABLE IF NOT EXISTS projects(id TEXT PRIMARY KEY, revision INTEGER NOT NULL DEFAULT 1, data TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS jobs(id TEXT PRIMARY KEY, project_id TEXT NOT NULL, data TEXT NOT NULL, status TEXT NOT NULL, updated_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE TABLE IF NOT EXISTS monitor_states(key TEXT PRIMARY KEY, data TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS alerts(id TEXT PRIMARY KEY, project_id TEXT NOT NULL, data TEXT NOT NULL, is_read INTEGER NOT NULL DEFAULT 0);
CREATE INDEX IF NOT EXISTS idx_alerts_project ON alerts(project_id);
CREATE TABLE IF NOT EXISTS snapshots(id INTEGER PRIMARY KEY, project_id TEXT NOT NULL, data TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE INDEX IF NOT EXISTS idx_snapshots_project ON snapshots(project_id);
`);if(!db.prepare('SELECT id FROM projects LIMIT 1').get()){const p=demoProject();db.prepare('INSERT INTO projects(id,data,updated_at) VALUES(?,?,?)').run(p.id,JSON.stringify(p),new Date().toISOString());}for(const row of db.prepare('SELECT * FROM projects').all()){const p=JSON.parse(row.data);if(p.demo&&!p.fixtureVersion){const fixtures=new Map(demoEvents().map(e=>[e.id,e]));for(const e of [...p.events,...p.staging]){const correct=fixtures.get(e.id);if(correct&&e.network==='demo'&&e.tx==='fictional-tx-06')e.timestamp=correct.timestamp;}p.fixtureVersion=2;p.history.unshift({id:'fixture-timestamp-correction',at:new Date().toISOString(),text:'Corrected fictional swap timestamps: all events in one transaction share the same chain time.'});db.prepare('UPDATE projects SET data=?,revision=revision+1 WHERE id=?').run(JSON.stringify(p),p.id);}}return db;}
