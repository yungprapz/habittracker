import {test} from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import './reminders.js';
const R=globalThis.bloomReminders,noon=(y,m,d)=>new Date(y,m-1,d,12);
test('calendar reminders: two daily events with an alert at each routine time',()=>{
  const ics=R.ics({morning:'07:30',night:'22:00'},{start:noon(2026,11,17),now:new Date(Date.UTC(2026,10,17,12)),url:'https://example.github.io/bloom/'}),lines=ics.split('\r\n');
  assert.ok(ics.startsWith('BEGIN:VCALENDAR\r\n'));assert.ok(ics.endsWith('END:VCALENDAR\r\n'));
  assert.equal(lines.filter(l=>l==='BEGIN:VEVENT').length,2);assert.equal(lines.filter(l=>l==='RRULE:FREQ=DAILY').length,2);assert.equal(lines.filter(l=>l==='TRIGGER:PT0S').length,2);
  for(const l of ['DTSTART:20261117T073000','DTEND:20261117T074000','DTSTART:20261117T220000','DTSTAMP:20261117T120000Z','UID:bloom-morning-0730@example.github.io','SUMMARY:Bloom: Evening routine','URL:https://example.github.io/bloom/'])assert.ok(lines.includes(l),l);
  assert.ok(!/[^\x00-\x7f]/.test(ics),'plain ASCII');for(const l of lines)assert.ok(l.length<=75,l)});
test('calendar reminders: midnight wrap, folding, escaping and invalid times',()=>{
  const ics=R.ics({morning:'nope',night:'23:55'},{start:noon(2026,12,31),url:'https://example.github.io/a,very;long/path/that/keeps/going/so/the/line/folds/'}),lines=ics.split('\r\n');
  for(const l of ['DTSTART:20261231T070000','DTSTART:20261231T235500','DTEND:20270101T000500'])assert.ok(lines.includes(l),l);
  assert.ok(lines.some(l=>l.startsWith(' ')));for(const l of lines)assert.ok(l.length<=75,l);
  assert.ok(ics.replace(/\r\n /g,'').includes('Open Bloom: https://example.github.io/a\\,very\\;long'));
  assert.equal(R.path({morning:'07:00',night:'22:00'}),'bloom-reminders.ics');assert.equal(R.path({morning:'06:30',night:'22:00'}),'bloom-reminders.ics?m=06:30&n=22:00')});
test('static default reminders file matches the generator',()=>{
  const file=readFileSync(new URL('./bloom-reminders.ics',import.meta.url),'utf8'),made=R.ics({},{start:noon(2026,11,17),url:'https://yungprapz.github.io/habittracker/'}),strip=s=>s.replace(/DTSTAMP:\d{8}T\d{6}Z/g,'');
  assert.equal(strip(file),strip(made))});
