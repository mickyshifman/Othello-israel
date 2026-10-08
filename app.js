const D=window.DATA,cfg=window.FIREBASE_CONFIG;
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl=u=>/^https?:\/\//.test(u||'')?u:'';
let db=null,fs=null,err='';
if(cfg){try{const B='https://www.gstatic.com/firebasejs/10.12.2/';const a=await import(B+'firebase-app.js');fs=await import(B+'firebase-firestore.js');db=fs.getFirestore(a.initializeApp(cfg));}catch(e){err='לא הצלחנו להתחבר למסד הנתונים.';}}
async function load(col){if(!db)return D[col]||[];try{const s=await fs.getDocs(fs.collection(db,col));return s.docs.map(d=>({id:d.id,...d.data()}));}catch(e){err='שגיאה בטעינת הנתונים.';return[];}}
const [ratings,champs,tours,sets]=await Promise.all(['ratings','champions','tournaments','settings'].map(load));
const updated=db?((sets.find(x=>x.id==='site')||{}).updated||''):D.updated;
if(err)document.getElementById('top').insertAdjacentHTML('afterbegin','<p class="card" role="alert">'+err+'</p>');
const sv=[...Array(17).keys()].map(i=>'<circle cx="'+(16+i*40)+'" cy="16" r="12" fill="'+(i%2?'#fff':'#111')+'"'+(i%2?' stroke="#0038B8" stroke-width="2"':'')+'/>').join('');
$('strip').innerHTML=sv;
/* מנוע אותלו */
var DIRS=[[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
function opp(p){return p==='b'?'w':'b';}
function flips(b,p,pl){if(b[p]!=='.')return[];var r=Math.floor(p/8),c=p%8,out=[],o=opp(pl);
DIRS.forEach(function(d){var rr=r+d[0],cc=c+d[1],t=[];while(rr>=0&&rr<8&&cc>=0&&cc<8&&b[rr*8+cc]===o){t.push(rr*8+cc);rr+=d[0];cc+=d[1];}
if(t.length&&rr>=0&&rr<8&&cc>=0&&cc<8&&b[rr*8+cc]===pl)out=out.concat(t);});return out;}
function anyMove(b,pl){for(var p=0;p<64;p++)if(flips(b,p,pl).length)return true;return false;}
function put(b,p,pl){var f=flips(b,p,pl);b[p]=pl;f.forEach(function(x){b[x]=pl;});return f;}
function sq(s){return (s.charCodeAt(0)-97)+(parseInt(s[1],10)-1)*8;}
function sqn(p){return 'abcdefgh'[p%8]+(Math.floor(p/8)+1);}
function start(){var b=[];for(var i=0;i<64;i++)b.push('.');b[27]='w';b[36]='w';b[28]='b';b[35]='b';return b;}
function draw(el,b,o){o=o||{};var h='<div class="lbl"></div>';
for(var c=0;c<8;c++)h+='<div class="lbl">'+'abcdefgh'[c]+'</div>';
for(var r=0;r<8;r++){h+='<div class="lbl">'+(r+1)+'</div>';
for(c=0;c<8;c++){var p=r*8+c;h+='<button type="button" class="cell'+(o.mark===p?' mark':'')+'" data-p="'+p+'" aria-label="'+sqn(p)+'">'+(b[p]!=='.'?'<span class="disc'+(b[p]==='w'?' w':'')+'"></span>':'')+'</button>';}}
el.innerHTML=h;
el.onclick=o.click?function(e){var t=e.target.closest('.cell');if(t)o.click(+t.dataset.p);}:null;}



const cs=champs.slice().sort((a,b)=>a.year-b.year);
if(cs.length){const l=cs[cs.length-1];$('champ').textContent='אלוף ישראל '+l.year+': '+l.name;}
const today=new Date().toISOString().slice(0,10);
const up=tours.filter(t=>!t.start||t.start>=today).sort((a,b)=>(a.start||'9')<(b.start||'9')?-1:1);
$('up').innerHTML=up.map(u=>{const il=u.type==='israel',lk=u.open?'<a href="#tournament">להרשמה</a>':(safeUrl(u.url)?'<a href="'+esc(u.url)+'" target="_blank" rel="noopener">לפרטים</a>':'');
return '<div class="card '+(il?'il':'intl')+'"><h3>'+esc(u.name)+'<span class="tag'+(il?' il':'')+'">'+(il?'ישראל':'בינלאומי')+'</span></h3><div><span class="ltr">'+esc(u.date)+'</span> · '+esc(u.place)+'</div>'+lk+'</div>';}).join('')||'<p>אין כרגע טורנירים מתוכננים.</p>';
const rs=ratings.slice().sort((a,b)=>b.rating-a.rating),mx=rs.length?rs[0].rating:1;
$('rt').innerHTML=rs.map((r,i)=>'<tr><td class="n">'+(i+1)+'</td><td>'+esc(r.name)+'</td><td class="n"><b>'+esc(r.rating)+'</b></td><td style="width:35%"><div class="bar" style="width:'+Math.round(r.rating/mx*100)+'%"></div></td></tr>').join('');
$('upd').textContent=updated;
const cm={},byY={};cs.forEach(c=>{byY[c.year]=c.name;cm[c.name]=(cm[c.name]||0)+1;});
const y0=cs.length?Math.min(1998,cs[0].year):1998,y1=cs.length?cs[cs.length-1].year:2026;let hh='';
for(let y=y1;y>=y0;y--)hh+='<tr><td class="n">'+y+'</td><td>'+(byY[y]?esc(byY[y]):'<span style="color:var(--mute)">אין נתון</span>')+'</td></tr>';
$('ch').innerHTML=hh;
$('lb').innerHTML=Object.keys(cm).sort((a,b)=>cm[b]-cm[a]).map(n=>'<tr><td>'+esc(n)+'</td><td class="n"><b>'+cm[n]+'</b></td></tr>').join('');
let oh='';D.openings.forEach((o,i)=>{const b=start();let pl='b',lm=0;
o.m.split(' ').forEach(m=>{const p=sq(m);if(!flips(b,p,pl).length)pl=opp(pl);put(b,p,pl);pl=opp(pl);lm=p;});
oh+='<div class="op"><h3>'+o.n+'</h3><div class="bd mini" id="ob'+i+'"></div><div class="mv">'+o.m+'</div><div class="hint" style="margin:0;align-self:flex-start">משפחה: '+o.f+'</div></div>';o._b=b;o._m=lm;});
$('ops').innerHTML=oh;D.openings.forEach((o,i)=>draw($('ob'+i),o._b,{mark:o._m}));
const opens=tours.filter(t=>t.open);
if(!opens.length){$('tnone').hidden=false;}else{$('tform').hidden=false;
$('tsel').innerHTML=opens.map(t=>'<option value="'+esc(t.id||t.name)+'">'+esc(t.name)+' · '+esc(t.date)+'</option>').join('');
$('tform').onsubmit=async e=>{e.preventDefault();const m=$('tmsg'),f=e.target;
if(!db){m.textContent='מצב דמו: האתר עדיין לא מחובר למסד הנתונים.';return;}
const t=opens.find(x=>(x.id||x.name)===f.tsel.value);
try{await fs.addDoc(fs.collection(db,'registrations'),{tournamentId:t.id,tournamentName:t.name,firstName:f.firstName.value.trim(),lastName:f.lastName.value.trim(),createdAt:fs.serverTimestamp()});m.textContent='תודה! ההרשמה התקבלה.';f.reset();}catch(_){m.textContent='שגיאה בשליחה. נסו שוב מאוחר יותר.';}};}
const tb=$('totop');addEventListener('scroll',()=>tb.classList.toggle('show',scrollY>500));
tb.onclick=()=>scrollTo({top:0,behavior:'smooth'});
