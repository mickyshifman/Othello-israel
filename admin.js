const $=id=>document.getElementById(id),cfg=window.FIREBASE_CONFIG,D=window.DATA;
if(!cfg){$('login').hidden=true;$('nocfg').hidden=false;}
else{
const B='https://www.gstatic.com/firebasejs/10.12.2/';
const A=await import(B+'firebase-app.js'),U=await import(B+'firebase-auth.js'),F=await import(B+'firebase-firestore.js');
const app=A.initializeApp(cfg),auth=U.getAuth(app),db=F.getFirestore(app);
const touch=()=>F.setDoc(F.doc(db,'settings','site'),{updated:new Date().toLocaleDateString('he-IL')});
const SECS=[
{id:'t',title:'טורנירים',col:'tournaments',regs:true,sort:(a,b)=>(b.start||'9')<(a.start||'9')?1:-1,fields:[['name','שם','text'],['date','תאריך (טקסט)','text'],['start','תאריך התחלה','date'],['place','מקום','text'],['type','סוג','select',[['israel','ישראל'],['international','בינלאומי']]],['url','קישור','text'],['open','הרשמה פתוחה','checkbox']]},
{id:'r',title:'רייטינג',col:'ratings',touch:true,sort:(a,b)=>b.rating-a.rating,fields:[['name','שם','text'],['rating','רייטינג','number']]},
{id:'c',title:'אלופי ישראל',col:'champions',sort:(a,b)=>b.year-a.year,fields:[['year','שנה','number'],['name','אלוף','text']]}];
const btn=(t,f,c)=>{const b=document.createElement('button');b.type='button';b.className='btn sm '+(c||'');b.textContent=t;b.onclick=f;return b;};
function rowEl(s,r){
const d=document.createElement('div');d.className='arow'+(r?'':' new');const ins={};
s.fields.forEach(([k,l,t,opt])=>{const lab=document.createElement('label');lab.textContent=l;let i;
if(t==='select'){i=document.createElement('select');opt.forEach(([v,x])=>{const o=document.createElement('option');o.value=v;o.textContent=x;i.appendChild(o);});}
else{i=document.createElement('input');i.type=t;}
if(r&&r[k]!==undefined){if(t==='checkbox')i.checked=!!r[k];else i.value=r[k];}
ins[k]=i;lab.appendChild(i);d.appendChild(lab);});
const msg=document.createElement('span');msg.setAttribute('aria-live','polite');
d.appendChild(btn(r?'שמור':'הוסף',async()=>{const v={};
for(const [k,,t] of s.fields){const i=ins[k];v[k]=t==='checkbox'?i.checked:t==='number'?Number(i.value):i.value.trim();}
if(!v[s.fields[0][0]]){msg.textContent='יש למלא את השדה הראשון.';return;}
try{if(r)await F.setDoc(F.doc(db,s.col,r.id),v);else await F.addDoc(F.collection(db,s.col),v);if(s.touch)await touch();await renderSec(s);}catch(e){msg.textContent='שגיאה: '+e.code;}}));
if(r){d.appendChild(btn('מחק',async()=>{if(!confirm('למחוק?'))return;try{await F.deleteDoc(F.doc(db,s.col,r.id));if(s.touch)await touch();await renderSec(s);}catch(e){msg.textContent='שגיאה: '+e.code;}},'del'));
if(s.regs)d.appendChild(btn('נרשמים',async()=>{const old=d.nextSibling;if(old&&old.className==='regs'){old.remove();return;}
const p=document.createElement('div');p.className='regs';d.after(p);
const draw=async()=>{const sn=await F.getDocs(F.query(F.collection(db,'registrations'),F.where('tournamentId','==',r.id)));
p.innerHTML='<b>נרשמים: '+sn.size+'</b>';sn.docs.forEach(x=>{const q=x.data(),row=document.createElement('div');row.append(q.firstName+' '+q.lastName);
row.appendChild(btn('מחק',async()=>{await F.deleteDoc(x.ref);draw();},'del'));p.appendChild(row);});};
try{await draw();}catch(e){p.textContent='שגיאה: '+e.code;}}));}
d.appendChild(msg);return d;}
async function renderSec(s){let box=$('s_'+s.id);if(!box){box=document.createElement('section');box.id='s_'+s.id;$('secs').appendChild(box);}
const sn=await F.getDocs(F.collection(db,s.col));const rows=sn.docs.map(d=>({id:d.id,...d.data()})).sort(s.sort);
box.innerHTML='<h2>'+s.title+'</h2>';box.appendChild(rowEl(s,null));rows.forEach(r=>box.appendChild(rowEl(s,r)));}
const build=async()=>{$('secs').innerHTML='';for(const s of SECS)await renderSec(s);};
$('login').onsubmit=async e=>{e.preventDefault();try{await U.signInWithEmailAndPassword(auth,$('em').value,$('pw').value);}catch(x){$('lmsg').textContent='הכניסה נכשלה. בדקו דוא״ל וסיסמה.';}};
$('out').onclick=()=>U.signOut(auth);
$('imp').onclick=async()=>{if(!confirm('לייבא את נתוני ההתחלה מ-data.js? הפעולה מוסיפה אותם למסד.'))return;
for(const col of ['ratings','champions','tournaments'])for(const x of D[col]||[]){if(x.demo)continue;await F.addDoc(F.collection(db,col),x);}
await touch();build();};
U.onAuthStateChanged(auth,u=>{$('login').hidden=!!u;$('panel').hidden=!u;if(u)build().catch(()=>{$('secs').textContent='אין הרשאה או שגיאה בטעינה.';});});
}
