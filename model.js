export const localDate=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export const shift=(s,n)=>{const d=new Date(s+'T12:00:00');d.setDate(d.getDate()+n);return localDate(d)};
export function initial(today=localDate()){return {versions:[{date:today,habits:['Thyroid medicine','Vitamin C serum','Moisturizer','Sunscreen','Red light mask','Serum','Moisturizer','Retinol','Hair oiling','Vitamin D','Iron','Creatine'].map((name,i)=>({id:String(i),name,period:i<4?'morning':'night',group:i>8?'Supplements':'Care',days:i===7?[1,4]:[0,1,2,3,4,5,6],...(i===7?{perWeek:2}:{})}))}],checks:{},times:{morning:'07:00',night:'22:00'},anchors:{morning:'',night:''},auto:{}}}
// Fill in fields added after the first release so older saves and backups keep working.
export function upgrade(s){s.times??={morning:'07:00',night:'22:00'};s.anchors??={morning:'',night:''};s.auto??={};return s}
export function scheduled(state,date){const v=state.versions.filter(v=>v.date<=date).at(-1);return (v?.habits||[]).filter(h=>h.perWeek||h.days.includes(new Date(date+'T12:00:00').getDay()))}
// Habits on "light tracking" have become automatic: still checkable, but they no longer count toward daily totals or flowers.
// Weekly habits ("any 2 days a week") are offered every day but measured by the week, so they never count as a missed day.
export const active=(state,date)=>scheduled(state,date).filter(h=>!h.light&&!h.perWeek);
export const weekly=(state,date)=>scheduled(state,date).filter(h=>h.perWeek&&!h.light);
// Weeks run Monday to Sunday.
export const weekStart=date=>shift(date,-((new Date(date+'T12:00:00').getDay()+6)%7));
export function weekCount(s,id,date=localDate()){const start=weekStart(date);let n=0;for(let i=0;i<7;i++){const d=shift(start,i);if(d<=date&&s.checks[d]?.includes(id))n++}return n}
// Consecutive weeks the weekly goal was met, counting this week only once it is met.
export function weeksMet(s,id,target,date=localDate()){let d=weekStart(date),n=0;const full=w=>weekCount(s,id,shift(w,6))>=target;if(!(weekCount(s,id,date)>=target))d=shift(d,-7);while(d>=weekStart(s.versions[0].date)&&full(d)){n++;d=shift(d,-7)}return n}
export function revise(s,habits,today=localDate()){s.versions=s.versions.filter(v=>v.date!==today);s.versions.push({date:today,habits:structuredClone(habits)});s.versions.sort((a,b)=>a.date.localeCompare(b.date))}

/* Never miss twice. One missed day pauses a streak (it isn't counted, but the streak survives);
   two missed days in a row reset it. Missing a single day doesn't measurably slow habit formation
   (Lally et al. 2010), while a broken streak demotivates more than the lapse warrants (Silverman & Barasch 2023).
   Today may still be unfinished without counting as a miss. */
export function streakInfo(s,id,date=localDate()){
  const done=d=>!!s.checks[d]?.includes(id),today=done(date),yesterday=done(shift(date,-1));
  let d=today?date:shift(date,-1),count=0,rests=0,misses=0;
  while(misses<2){
    if(done(d)){if(misses)rests++;count++;misses=0}
    else misses++;
    d=shift(d,-1);
  }
  return {count,rests,
    comeback:today&&!yesterday&&count>1,      // came back after a rest day; streak intact
    atRisk:!today&&!yesterday&&count>0};      // rested yesterday: today keeps the streak alive
}
export const streak=(s,id,date=localDate())=>streakInfo(s,id,date).count;

/* Self-Report Behavioural Automaticity Index (Gardner et al. 2012): four statements, 1–5.
   The median habit takes ~66 days to feel automatic (Lally 2010; Singh 2024), so ask monthly. */
export const automaticityItems=['I do it automatically','I do it without having to consciously remember','I do it without thinking','I start doing it before I realise I’m doing it'];
export function recordAutomaticity(s,id,scores,date=localDate()){upgrade(s);const score=scores.reduce((a,b)=>a+b,0)/scores.length;(s.auto[id]??=[]).push({date,score});return score}
export const lastAutomaticity=(s,id)=>s.auto?.[id]?.at(-1);
export const automaticityDue=(s,id,date=localDate())=>{const l=lastAutomaticity(s,id);return !l||l.date<=shift(date,-30)};
