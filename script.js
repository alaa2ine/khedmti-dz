const WILAYAS=["أدرار","الشلف","الأغواط","أم البواقي","باتنة","بجاية","بسكرة","بشار","البليدة","البويرة","تمنراست","تبسة","تلمسان","تيارت","تيزي وزو","الجزائر","الجلفة","جيجل","سطيف","سعيدة","سكيكدة","سيدي بلعباس","عنابة","قالمة","قسنطينة","المدية","مستغانم","المسيلة","معسكر","ورقلة","وهران","البيض","إليزي","برج بوعريريج","بومرداس","الطارف","تندوف","تيسمسيلت","الوادي","خنشلة","سوق أهراس","تيبازة","ميلة","عين الدفلى","النعامة","عين تموشنت","غرداية","غليزان","تيميمون","برج باجي مختار","أولاد جلال","بني عباس","إن صالح","إن قزام","تقرت","جانت","المغير","المنيعة"];
const CATS=[["كهربائي","⚡",42],["سبّاك","🔧",205],["إصلاح هواتف","📱",270],["مصمّم","🎨",330],["مبرمج","💻",160],["نجّار","🪚",22],["دهّان","🖌️",95]];
CATS.push(["بنّاء","🧱",18],["مبلّط","🟫",32],["حدّاد","⚙️",215],["زجّاج","🪟",198],["ميكانيكي سيارات","🚗",355],["كهربائي سيارات","🔋",55],["دراجات نارية","🏍️",10],["تبريد وتكييف","❄️",190],["أجهزة كهرومنزلية","🧺",180],["صيانة حواسيب","🖥️",225],["كاميرات مراقبة","📹",240],["ألواح شمسية","☀️",48],["تنظيف منازل","🧹",170],["بستاني","🌿",120],["نقل وتوصيل","🚚",30],["نقل أثاث","📦",35],["خيّاط","🧵",300],["حلاقة","💈",345],["تجميل نسائي","💄",320],["حلويات وطبخ","🍰",15],["تصوير","📷",250],["مونتاج فيديو","🎬",280],["ترجمة","🌐",195],["دروس خصوصية","📚",60],["كتابة وتحرير","✍️",260],["محاسبة","🧮",140],["تسويق إلكتروني","📈",145],["إدارة تواصل اجتماعي","📣",335],["مكافحة الحشرات","🐜",5],["رعاية أطفال وكبار","🤝",25]);
const DEMO=[["كهربائي","كهرباء منزلية","المدية","تركيب وصيانة وإصلاح الأعطال."],["سبّاك","تسريبات وتركيب صحي","الجزائر","كشف التسريبات وتركيب التجهيزات."],["إصلاح هواتف","شاشات وبطاريات","وهران","صيانة الهواتف الذكية."],["مصمّم","شعارات وهوية بصرية","قسنطينة","تصميم شعارات ومنشورات."],["مبرمج","مواقع وتطبيقات ويب","سطيف","بناء مواقع ولوحات تحكم."],["نجّار","أثاث ومطابخ","تلمسان","تصنيع وتركيب الأثاث."]].map((p,i)=>({id:"d"+i,cat:p[0],spec:p[1],wilaya:p[2],baladiya:"",price:"",desc:"مثال لبطاقة مقدّم خدمة: "+p[3],name:p[0]+" — نموذج تجريبي",demo:true}));
const $=s=>document.querySelector(s);
let mine=[],cat="",target=null,favs=[],DB=null,canW=false,adm=false,me="",shared=[],vset=new Set(),rat={},rep={};
const ALL=()=>{const ids=new Set(shared.map(p=>p.id));return[...shared.slice().sort((a,b)=>(b.at||0)-(a.at||0)),...mine.filter(p=>!ids.has(p.id)),...DEMO]};
const isV=p=>!!p.verified||vset.has(p.id);
const asked=id=>{try{return JSON.parse(localStorage.getItem("kdz_requests")||"[]").some(r=>r.to===id)}catch(e){return false}};
try{favs=JSON.parse(localStorage.getItem("kdz_favs")||"[]")}catch(e){favs=[]}
try{mine=JSON.parse(localStorage.getItem("kdz_providers")||"[]")}catch(e){mine=[]}
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}};
const addReq=r=>{let a=[];try{a=JSON.parse(localStorage.getItem("kdz_requests")||"[]")}catch(e){}a.push(r);save("kdz_requests",a)};
const info=c=>CATS.find(x=>x[0]===c)||["","🛠️",150];
const esc=s=>String(s||"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const intl=p=>{let d=String(p||"").replace(/\D/g,"");if(d.startsWith("00"))d=d.slice(2);if(d.startsWith("0"))d="213"+d.slice(1);return d};
const toast=t=>{const e=$("#toast");e.textContent=t;e.style.display="block";clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.display="none",2800)};
const norm=s=>String(s||"").replace(/[\u064B-\u0652ـ]/g,"").replace(/[أإآ]/g,"ا").replace(/ة/g,"ه").replace(/ى/g,"ي").toLowerCase();
function init(){
 const o=WILAYAS.map((w,i)=>`<option value="${w}">${String(i+1).padStart(2,"0")} - ${w}</option>`).join("");
 $("#wilaya").insertAdjacentHTML("beforeend",o);$("#joinWilaya").innerHTML=o;
 $("#joinCat").innerHTML=CATS.map(c=>`<option>${c[0]}</option>`).join("");
 $("#tiles").innerHTML=CATS.map((c,i)=>`<button class="tile${i>6?" extra":""}" style="--h:${c[2]}" aria-pressed="false" data-c="${c[0]}"><i>${c[1]}</i>${c[0]}</button>`).join("")+`<button class="tile moretile" style="--h:150" id="moreBtn" aria-expanded="false"><i>＋</i>${CATS.length-7} حرفة أخرى</button>`;
}
function render(){
 np();const q=norm($("#q").value.trim()),w=$("#wilaya").value,v=$("#vOnly").checked,f=$("#fOnly").checked,s=$("#sort").value;
 const all=ALL().filter(p=>(!cat||p.cat===cat)&&(!w||p.wilaya===w)&&(!v||isV(p))&&(!f||favs.includes(p.id))&&(!q||norm([p.name,p.cat,p.spec,p.wilaya,p.baladiya,p.desc].join(" ")).includes(q)));
 if(s==="name")all.sort((a,b)=>a.name.localeCompare(b.name,"ar"));
 $("#count").textContent=all.length?`${all.length} نتيجة`:"";
 if(!all.length){$("#grid").innerHTML=`<div class="empty">لا توجد نتائج لهذا البحث بعد.<br>جرّب ولاية أخرى، أو سجّل كمقدّم خدمة لتكون أول من يظهر هنا.<br><button class="btn" id="reset" style="margin-top:14px">مسح التصفية</button></div>`;return}
 $("#grid").innerHTML=all.map(p=>{const n=intl(p.phone),ok=!p.demo&&n,c=info(p.cat);
  return `<article class="card" style="--h:${c[2]}">
   <div class="head"><div class="av">${c[1]}</div><div><h3>${esc(p.name)}</h3><div class="meta">${esc(p.spec)}</div></div><button class="fav" data-fav="${p.id}" aria-pressed="${favs.includes(p.id)}" aria-label="المفضلة">${favs.includes(p.id)?"♥":"♡"}</button></div>
   <div class="badges"><span class="badge">${esc(p.cat)}</span>${p.demo?'<span class="badge demo">نموذج تجريبي</span>':''}${isV(p)?'<span class="badge ok">موثّق</span>':'<span class="badge tip" tabindex="0" data-tip="لم يتحقق فريق المنصة من هوية هذا المقدّم بعد">غير موثّق بعد</span>'}</div>
   <div class="meta">📍 ${esc(p.wilaya)}${p.baladiya?" — "+esc(p.baladiya):""}${p.price?" · 💰 "+esc(p.price):""}</div>
   ${(p.mobile||p.urgent||p.exp)?`<div class="badges">${p.mobile?'<span class="badge">🚗 يتنقّل إلى الزبون</span>':''}${p.urgent?'<span class="badge">⏱️ يقبل المستعجل</span>':''}${p.exp?`<span class="badge">خبرة ${esc(p.exp)} سنة</span>`:''}</div>`:''}${p.hours?`<div class="meta">🕘 ${esc(p.hours)}</div>`:''}
   <div>${esc(p.desc)}</div>
   <div class="meta">${rat[p.id]?`⭐ ${(rat[p.id][0]/rat[p.id][1]).toFixed(1)} (${rat[p.id][1]} تقييم)`:"لا توجد تقييمات بعد"}</div>${(DB&&canW&&!p.demo&&p.owner!==me&&asked(p.id))?`<select class="sort" data-rate="${p.id}" aria-label="قيّم"><option value="">قيّم تجربتك</option>${[5,4,3,2,1].map(n=>`<option value="${n}">${"★".repeat(n)}</option>`).join("")}</select>`:""}
   <div class="actions">${ok?`<a class="btn" href="tel:+${n}">اتصال</a><a class="btn" href="https://wa.me/${n}" target="_blank" rel="noopener">واتساب</a>`:`<button class="btn" disabled>التواصل غير متاح</button>`}<button class="btn" data-share="${p.id}">شارك</button>${(DB&&canW&&shared.some(x=>x.id===p.id))?`<button class="btn" data-rep="${p.id}">إبلاغ</button>`:""}${(adm&&DB&&shared.some(x=>x.id===p.id))?`<button class="btn" data-ver="${p.id}">${isV(p)?"إلغاء التوثيق":"توثيق"}</button><button class="btn" data-del="${p.id}">حذف${rep[p.id]?" ⚠️"+rep[p.id]:""}</button>`:""}<button class="btn" data-prof="${p.id}">الملف</button><button class="btn main" data-req="${p.id}">اطلب الخدمة</button></div></article>`}).join("");
}
document.addEventListener("click",e=>{
 if(e.target.closest("#moreBtn")){const o=$("#tiles").classList.toggle("open");const b=$("#moreBtn");b.setAttribute("aria-expanded",o);b.lastChild.textContent=o?"إخفاء":(CATS.length-7)+" حرفة أخرى";return}
 if(e.target.closest("#reset")){cat="";$("#q").value="";$("#wilaya").value="";$("#vOnly").checked=$("#fOnly").checked=false;document.querySelectorAll(".tile").forEach(x=>x.setAttribute("aria-pressed","false"));render();return}
 const fv=e.target.closest("[data-fav]");
 if(fv){const id=fv.dataset.fav;favs=favs.includes(id)?favs.filter(x=>x!==id):[...favs,id];save("kdz_favs",favs);render();return}
 const sh=e.target.closest("[data-share]");
 if(sh){const p=ALL().find(x=>x.id===sh.dataset.share),text=`${p.name} — ${p.spec} (${p.wilaya}) عبر خدمتي DZ`;if(navigator.share)navigator.share({title:"خدمتي DZ",text,url:location.href}).catch(()=>{});else if(navigator.clipboard)navigator.clipboard.writeText(text+" "+location.href).then(()=>toast("تم نسخ الرابط"),()=>toast("تعذّر النسخ"));else toast("المشاركة غير مدعومة في هذا المتصفح");return}
 const bp=e.target.closest("[data-prof]");
 if(bp){openProf(bp.dataset.prof);return}
 const gd=e.target.closest("[data-gdel]");
 if(gd){const p=shared.find(x=>x.id===gd.dataset.pid);if(p){p.gallery=(p.gallery||[]).filter(i=>i!==gd.dataset.gdel);DB.collection("providers").doc(p.id).set(p).then(()=>openProf(p.id),()=>toast("تعذّر الحذف"))}return}
 const bv=e.target.closest("[data-ver]");
 if(bv){const id=bv.dataset.ver,r=DB.collection("verified").doc(id);(vset.has(id)?r.delete():r.set({v:true,at:Date.now()})).catch(()=>toast("تعذّر التحديث"));return}
 const bd=e.target.closest("[data-del]");
 if(bd){if(!bd.dataset.armed){bd.dataset.armed=1;bd.textContent="تأكيد الحذف";return}DB.collection("providers").doc(bd.dataset.del).delete().catch(()=>toast("تعذّر الحذف"));return}
 const br=e.target.closest("[data-rep]");
 if(br){const rr=DB.collection("reports").doc(me);rr.get().then(s=>{const o=s.exists?{...s.data().pids}:{};o[br.dataset.rep]=Date.now();return rr.set({pids:o})}).then(()=>toast("تم إرسال البلاغ، شكرًا"),()=>toast("تعذّر إرسال البلاغ"));return}
 const t=e.target.closest(".tile:not(.moretile)");
 if(t){const on=t.getAttribute("aria-pressed")==="true";cat=on?"":t.dataset.c;document.querySelectorAll(".tile").forEach(x=>x.setAttribute("aria-pressed",!on&&x===t));render();return}
 const r=e.target.closest("[data-req]");
 if(r){target=ALL().find(p=>p.id===r.dataset.req);$("#reqTo").textContent="إلى: "+target.name;$("#reqDlg").showModal();return}
 if(e.target.closest("[data-close]"))e.target.closest("dialog").close();
});
document.querySelectorAll("[data-join]").forEach(b=>b.onclick=()=>$("#joinDlg").showModal());
$("#go").onclick=()=>{render();$("#grid").scrollIntoView({behavior:"smooth",block:"start"})};
$("#q").oninput=render;$("#wilaya").onchange=render;$("#vOnly").onchange=render;$("#fOnly").onchange=render;$("#sort").onchange=render;
$("#reqForm").onsubmit=e=>{
 const f=new FormData(e.target);
 addReq({to:target.id,toName:target.name,name:f.get("name"),phone:f.get("phone"),desc:f.get("desc"),at:new Date().toISOString()});
 const n=intl(target.phone);
 if(!target.demo&&n)window.open(`https://wa.me/${n}?text=${encodeURIComponent(`السلام عليكم، أنا ${f.get("name")} (${f.get("phone")}). أحتاج خدمة: ${f.get("desc")} — عبر خدمتي DZ`)}`,"_blank","noopener");
 toast(target.demo?"تم حفظ الطلب التجريبي في متصفحك":"تم تجهيز طلبك، أكمل الإرسال عبر واتساب");
 e.target.reset();
};
$("#joinForm").onsubmit=e=>{
 const rec={...Object.fromEntries(new FormData(e.target)),id:"m"+Date.now(),owner:me,at:Date.now()};
 if(DB&&canW){DB.collection("providers").doc(rec.id).set(rec).then(()=>toast("تمت إضافة ملفك للجميع (غير موثّق حتى يُتحقّق منه)"),()=>{mine.unshift(rec);save("kdz_providers",mine);render()});e.target.reset();return}
 mine.unshift(rec);
 toast(save("kdz_providers",mine)?"تمت إضافة ملفك (غير موثّق حتى يُتحقّق منه)":"تعذّر الحفظ، لكن الملف ظاهر في هذه الجلسة");
 e.target.reset();render();
};
document.addEventListener("change",e=>{const s=e.target.closest("[data-rate]");if(s&&s.value&&DB)DB.collection("ratings").doc(s.dataset.rate+"_"+me).set({pid:s.dataset.rate,stars:+s.value,by:me,at:Date.now()}).then(()=>toast("شكرًا لتقييمك"),()=>toast("تعذّر حفظ التقييم"))});
(async()=>{try{if(typeof claude==="undefined")return;const db=await claude.use("db");if(!db)return;const u=await claude.use("user");
 canW=u?(await u.can("data.write"))!==false:true;adm=u?await u.canEdit():false;me=u?String(await u.id()):"";DB=db;
 $("#mode").textContent=canW?"وضع المشاركة مفعّل: الملفات الجديدة تظهر لكل من يفتح الصفحة.":"وضع القراءة: يمكنك التصفح، لكن إضافة الملفات والتقييم غير متاحة لك.";
 const on=(c,f)=>db.collection(c).onSnapshot(f,()=>{});
 on("providers",s=>{shared=s.docs.map(d=>({...d.data(),id:d.id}));render()});
 on("verified",s=>{vset=new Set(s.docs.map(d=>d.id));render()});
 on("ratings",s=>{rat={};s.docs.forEach(d=>{const x=d.data(),r=rat[x.pid]||(rat[x.pid]=[0,0]);r[0]+=x.stars;r[1]++});render()});
 if(adm)on("reports",s=>{rep={};s.docs.forEach(d=>Object.keys(d.data().pids||{}).forEach(p=>{rep[p]=(rep[p]||0)+1}));render()})
}catch(e){}})();
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
if(!SR)$("#mic").style.display="none";else $("#mic").onclick=()=>{const r=new SR();r.lang="ar-DZ";r.onstart=()=>$("#mic").classList.add("on");r.onend=()=>$("#mic").classList.remove("on");r.onresult=e=>{$("#q").value=e.results[0][0].transcript;render()};r.onerror=()=>toast("تعذّر استخدام الميكروفون");try{r.start()}catch(x){}};
const PH=["كهربائي في المدية","تسريب ماء في المطبخ","مصمّم شعار لمشروعي","تصليح شاشة هاتف","دروس خصوصية للرياضيات","نقل أثاث إلى وهران"];let pi=0;
setInterval(()=>{const q=$("#q");if(!q.value&&document.activeElement!==q){pi=(pi+1)%PH.length;q.placeholder=LANG==="fr"?"Essayez : "+["Électricien à Médéa","Fuite d’eau dans la cuisine","Logo pour mon projet","Écran de téléphone cassé","Cours de maths","Déménagement vers Oran"][pi]:"جرّب: "+PH[pi]}},2600);
const rb=CATS.map(c=>`<span style="margin-inline:18px;font-weight:700">${c[1]} ${c[0]}</span>`).join("");$("#ribIn").innerHTML=rb+rb;
$("#grid").addEventListener("pointermove",e=>{const c=e.target.closest(".card");if(!c)return;const r=c.getBoundingClientRect();c.style.setProperty("--mx",e.clientX-r.left+"px");c.style.setProperty("--my",e.clientY-r.top+"px")});
const cu=(el,to)=>{if(matchMedia("(prefers-reduced-motion:reduce)").matches){el.textContent=to;return}const t0=performance.now(),f=n=>{const k=Math.min(1,(n-t0)/1200);el.textContent=Math.round(to*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
$("#n2").dataset.to=CATS.length;
const io=new IntersectionObserver((en,ob)=>en.forEach(x=>{if(x.isIntersecting){cu(x.target,+x.target.dataset.to);ob.unobserve(x.target)}}),{threshold:.6});
["#n1","#n2"].forEach(s=>io.observe($(s)));
function np(){const n=ALL().filter(p=>!p.demo).length;$("#n3").textContent=n;$("#n3").parentElement.hidden=!n}
$("#aiBtn").onclick=()=>$("#aiDlg").showModal();
$("#aiGo").onclick=async()=>{
 const q=$("#aiQ").value.trim(),out=$("#aiOut");if(!q)return;
 out.innerHTML='<div class="res">جارٍ التحليل…</div>';
 try{const s=typeof claude==="undefined"?null:await claude.use("sample");
  if(!s){out.innerHTML='<div class="res">المساعد الذكي غير متاح في هذا العرض.</div>';return}
  const r=await s.json(`أنت مساعد منصة «خدمتي DZ» الجزائرية. الحرف المتاحة: ${CATS.map(c=>c[0]).join("، ")}. الولايات: ${WILAYAS.join("، ")}. وصف الزبون لمشكلته: «${q}». أعد JSON فقط بلا أي نص آخر بهذا الشكل: {"cat":"اسم حرفة من القائمة حرفيًّا","wilaya":"اسم ولاية من القائمة حرفيًّا إن ذكرها الزبون وإلا نص فارغ","summary":"جملة واحدة تلخّص المشكلة","tips":["تصرّف آمن فوري 1","2"],"ask":["سؤال يطرحه الزبون على الحرفي 1","2"]}. ${LANG==="fr"?"اكتب بالفرنسية":"اكتب بالعربية"} وبنصائح آمنة وعملية فقط.`);
  const c=CATS.find(x=>x[0]===r.cat);
  if(!c){out.innerHTML='<div class="res">لم أستطع تحديد الحرفة، جرّب وصفًا أوضح.</div>';return}
  cat=c[0];if(CATS.indexOf(c)>6)$("#tiles").classList.add("open");
  document.querySelectorAll(".tile").forEach(x=>x.setAttribute("aria-pressed",x.dataset.c===cat));
  if(WILAYAS.includes(r.wilaya))$("#wilaya").value=r.wilaya;
  render();
  const li=a=>"<ul>"+(a||[]).slice(0,3).map(t=>`<li>${esc(t)}</li>`).join("")+"</ul>";
  out.innerHTML=`<div class="res"><strong>${c[1]} الحرفة المناسبة: ${esc(c[0])}</strong><div>${esc(r.summary)}</div><b>ماذا تفعل الآن:</b>${li(r.tips)}<b>اسأل الحرفي:</b>${li(r.ask)}<button class="btn" id="aiShow" type="button">اعرض الحرفيين المناسبين</button></div>`;
  $("#aiShow").onclick=()=>{$("#aiDlg").close();$("#grid").scrollIntoView({behavior:"smooth"})}
 }catch(e){out.innerHTML='<div class="res">تعذّر التحليل الآن، حاول لاحقًا.</div>'}
};
const shrink=f=>new Promise((ok,no)=>{const i=new Image(),fr=new FileReader();i.onload=()=>{const k=Math.min(1,1000/Math.max(i.width,i.height)),c=document.createElement("canvas");c.width=Math.round(i.width*k);c.height=Math.round(i.height*k);c.getContext("2d").drawImage(i,0,0,c.width,c.height);c.toBlob(b=>b?ok(b):no(),"image/jpeg",.82)};i.onerror=no;fr.onload=()=>{i.src=fr.result};fr.onerror=no;fr.readAsDataURL(f)});
async function addPhotos(id,files){const p=shared.find(x=>x.id===id);if(!p)return;try{const as=await claude.use("assets");if(!as){toast("رفع الصور غير متاح لك");return}const ids=[...(p.gallery||[])];for(const f of files.slice(0,6-ids.length)){const r=await as.upload(await shrink(f));ids.push(r.id)}p.gallery=ids;await DB.collection("providers").doc(id).set(p);toast("تمت إضافة الصور");openProf(id)}catch(e){toast("تعذّر رفع الصور")}}
function openProf(id){const p=ALL().find(x=>x.id===id);if(!p)return;const c=info(p.cat),n=intl(p.phone),own=DB&&canW&&p.owner===me&&shared.some(x=>x.id===id),g=p.gallery||[];
 $("#profBody").innerHTML=`<h2>${c[1]} ${esc(p.name)}</h2><div class="meta">${esc(p.spec)}</div><div class="badges"><span class="badge">${esc(p.cat)}</span>${isV(p)?'<span class="badge ok">موثّق</span>':'<span class="badge">غير موثّق بعد</span>'}</div><div class="kv"><div>📍 ${esc(p.wilaya)}${p.baladiya?" — "+esc(p.baladiya):""}</div>${p.price?`<div>💰 ${esc(p.price)}</div>`:""}${p.exp?`<div>خبرة ${esc(p.exp)} سنة</div>`:""}${p.hours?`<div>🕘 ${esc(p.hours)}</div>`:""}</div><div>${esc(p.desc)}</div><h3 style="margin:6px 0 0">معرض الأعمال</h3>${g.length?`<div class="gal">${g.map(i=>`<figure><img src="/_blob/${esc(i)}" alt="" loading="lazy">${own?`<button data-gdel="${esc(i)}" data-pid="${id}" aria-label="x">×</button>`:""}</figure>`).join("")}</div>`:'<div class="meta">لا توجد صور بعد.</div>'}${(own&&g.length<6)?`<label class="btn line" style="text-align:center;cursor:pointer">＋ أضف صورًا لأعمالك<input id="gUp" type="file" accept="image/*" multiple hidden></label>`:""}<div class="row"><button type="button" class="btn line" data-close>إغلاق</button>${(!p.demo&&n)?`<a class="btn" href="https://wa.me/${n}" target="_blank" rel="noopener">واتساب</a>`:""}</div>`;
 $("#profDlg").showModal();const up=$("#gUp");if(up)up.onchange=()=>addPhotos(id,[...up.files])}
const FRC=["Électricien","Plombier","Réparation téléphones","Designer","Développeur","Menuisier","Peintre","Maçon","Carreleur","Ferronnier","Vitrier","Mécanicien auto","Électricien auto","Motos","Froid et climatisation","Électroménager","Dépannage informatique","Caméras de surveillance","Panneaux solaires","Ménage","Jardinier","Transport et livraison","Déménagement","Couturier","Coiffeur","Esthétique femme","Pâtisserie et cuisine","Photographe","Montage vidéo","Traduction","Cours particuliers","Rédaction","Comptabilité","Marketing digital","Community manager","Dératisation","Garde d’enfants et seniors"];
const FRW=["Adrar","Chlef","Laghouat","Oum El Bouaghi","Batna","Béjaïa","Biskra","Béchar","Blida","Bouira","Tamanrasset","Tébessa","Tlemcen","Tiaret","Tizi Ouzou","Alger","Djelfa","Jijel","Sétif","Saïda","Skikda","Sidi Bel Abbès","Annaba","Guelma","Constantine","Médéa","Mostaganem","M’Sila","Mascara","Ouargla","Oran","El Bayadh","Illizi","Bordj Bou Arréridj","Boumerdès","El Tarf","Tindouf","Tissemsilt","El Oued","Khenchela","Souk Ahras","Tipaza","Mila","Aïn Defla","Naâma","Aïn Témouchent","Ghardaïa","Relizane","Timimoun","Bordj Badji Mokhtar","Ouled Djellal","Béni Abbès","In Salah","In Guezzam","Touggourt","Djanet","El M’Ghair","El Meniaa"];
const DR=`=الملف|Profil
=إغلاق|Fermer
=إلغاء|Annuler
=اتصال|Appeler
=شارك|Partager
=إبلاغ|Signaler
=توثيق|Vérifier
=إلغاء التوثيق|Retirer
=موثّق|Vérifié
=غير موثّق بعد|Non vérifié
=ابحث|Rechercher
=سجّل|S’inscrire
=التصنيف|Catégorie
=التخصص|Spécialité
=الولاية|Wilaya
=البلدية|Commune
=اسمك|Votre nom
=إخفاء|Masquer
=الاسم أو اسم النشاط|Nom ou activité
كيف تعمل المنصة|Comment ça marche
نصائح الأمان|Sécurité
طلباتي|Mes demandes
سجّل كمقدّم خدمة|Devenir prestataire
كمقدّم خدمة|comme prestataire
ابحث عن الحرفي أو المهني المناسب في ولايتك|Trouvez l’artisan ou le professionnel qu’il vous faut
كهربائي، سبّاك، مصلّح هواتف، مصمّم أو مبرمج. اختر الخدمة والولاية ثم تواصل مباشرة بالاتصال أو واتساب.|Électricien, plombier, réparateur, designer ou développeur : choisissez le service et la wilaya, puis contactez directement.
✨ لا تعرف أي حرفي تحتاج؟ صِف مشكلتك للمساعد الذكي|✨ Quel artisan choisir ? Décrivez votre problème à l’assistant IA
ماذا تحتاج؟ كهربائي، سباك، تصميم…|Que cherchez-vous ? Électricien, plombier, design…
كل الولايات|Toutes les wilayas
تصفّح حسب الحرفة|Parcourir par métier
حرفة أخرى|autres métiers
نتيجة|résultats
الأحدث أولًا|Plus récents
حسب الاسم|Par nom
مفضّلتي|Mes favoris
موثّقون فقط|Vérifiés seulement
البطاقات الموسومة «نموذج تجريبي» أمثلة لعرض شكل المنصة وليست أشخاصًا حقيقيين. لا توجد تقييمات ولا توثيق إلا عند حصولهما فعلًا.|Les fiches « Exemple fictif » illustrent la plateforme : ce ne sont pas de vraies personnes. Aucun avis ni badge sans vérification réelle.
وضع محلي: الملفات تُحفظ في متصفحك فقط.|Mode local : fiches enregistrées dans votre navigateur.
وضع المشاركة مفعّل: الملفات الجديدة تظهر لكل من يفتح الصفحة.|Mode partagé : les nouvelles fiches sont visibles par tous.
وضع القراءة: يمكنك التصفح، لكن إضافة الملفات والتقييم غير متاحة لك.|Mode lecture : navigation seulement.
نموذج تجريبي|Exemple fictif
لم يتحقق فريق المنصة من هوية هذا المقدّم بعد|Identité pas encore vérifiée
لا توجد تقييمات بعد|Aucun avis
تقييم|avis
قيّم تجربتك|Notez l’expérience
واتساب|WhatsApp
اطلب الخدمة|Demander
التواصل غير متاح|Contact indisponible
تأكيد الحذف|Confirmer
حذف|Supprimer
يتنقّل إلى الزبون|Se déplace
يقبل المستعجل|Urgences OK
خبرة|Expérience
سنة|ans
لا توجد نتائج لهذا البحث بعد.|Aucun résultat.
جرّب ولاية أخرى، أو سجّل كمقدّم خدمة لتكون أول من يظهر هنا.|Essayez une autre wilaya ou inscrivez-vous comme prestataire.
مسح التصفية|Effacer les filtres
ولاية مشمولة|wilayas
حرفة ومهنة|métiers
ملف مسجّل|fiches
نصائح للتعامل بأمان|Conseils pour traiter en sécurité
كيف أختار مقدّم الخدمة؟|Comment choisir un prestataire ?
قارن بين أكثر من ملف، واطلب صورًا لأعمال سابقة، وتحقق من أن الولاية والتخصص يناسبان حاجتك.|Comparez plusieurs fiches, demandez des photos de travaux, vérifiez wilaya et spécialité.
متى أتفق على السعر؟|Quand fixer le prix ?
قبل بدء العمل. اطلب تقديرًا واضحًا للتكلفة، واسأل إن كانت قطع الغيار أو التنقل محسوبة ضمنه.|Avant le début. Demandez un devis clair, pièces et déplacement inclus ou non.
متى أدفع؟|Quand payer ?
يُفضَّل الدفع بعد إنجاز العمل والتأكد منه، وتجنّب دفع مبالغ كبيرة مقدّمًا لشخص لا تعرفه.|De préférence après vérification du travail ; pas de grosse avance à un inconnu.
ماذا يعني وسم «موثّق»؟|Que signifie « Vérifié » ?
لا يظهر هذا الوسم إلا بعد تحقق فعلي من المقدّم. الملفات التي لم يُتحقّق منها تحمل وسم «غير موثّق بعد».|Ce badge n’apparaît qu’après une vraie vérification. Sinon : « Non vérifié ».
ابحث عن الخدمة|Cherchez le service
اختر الحرفة والولاية وتصفّح ملفات مقدّمي الخدمات.|Choisissez métier et wilaya, puis parcourez les fiches.
تواصل مباشرة|Contactez directement
اتصل أو راسل عبر واتساب، أو أرسل طلبًا مفصّلًا.|Appelez, écrivez sur WhatsApp ou envoyez une demande détaillée.
اتفق على التفاصيل|Convenez des détails
السعر والموعد يُتفق عليهما بينك وبين مقدّم الخدمة.|Prix et rendez-vous se fixent avec le prestataire.
تقدّم خدمة؟ أضف ملفك ليجدك الزبائن في منطقتك.|Vous proposez un service ? Ajoutez votre fiche.
منصة جزائرية تربط الزبائن بأصحاب الحرف والمهن.|plateforme algérienne reliant clients et artisans.
نسخة تجريبية: البيانات المسجّلة تُحفظ في متصفحك فقط.|Version de test : données enregistrées dans votre navigateur.
طلب خدمة|Demande de service
إلى:|À :
رقم هاتفك|Votre téléphone
وصف الطلب|Description
إرسال الطلب|Envoyer
مثال: عطل في الكهرباء بالمطبخ، أحتاج زيارة هذا الأسبوع|Ex. : panne électrique en cuisine
سنوات الخبرة (اختياري)|Années d’expérience (facultatif)
ساعات العمل (اختياري)|Horaires (facultatif)
مثال: 8:00 - 18:00، عدا الجمعة|Ex. : 8h-18h, sauf vendredi
أتنقّل إلى مكان الزبون|Je me déplace chez le client
أقبل الطلبات المستعجلة|J’accepte les urgences
السعر التقريبي (اختياري)|Prix approximatif (facultatif)
مثال: من 1500 دج|Ex. : dès 1500 DA
رقم الهاتف / واتساب|Téléphone / WhatsApp
نبذة قصيرة|Courte description
حفظ الملف|Enregistrer
مثال: تركيب وصيانة الكهرباء المنزلية|Ex. : installation électrique
لا توجد طلبات محفوظة بعد.|Aucune demande.
المساعد الذكي|Assistant IA
صِف مشكلتك بلغتك (فصحى أو دارجة) وسأحدّد لك الحرفة المناسبة وأعطيك نصائح قبل وصول الحرفي.|Décrivez votre problème (arabe, darija ou français) : je choisis le métier et donne des conseils.
مثال: ماء يتسرّب من تحت مغسلة المطبخ|Ex. : fuite sous l’évier
حلّل مشكلتي|Analyser
جارٍ التحليل…|Analyse…
الحرفة المناسبة|Métier adapté
ماذا تفعل الآن:|À faire maintenant :
اسأل الحرفي:|À demander :
اعرض الحرفيين المناسبين|Voir les artisans
المساعد الذكي غير متاح في هذا العرض.|Assistant indisponible.
لم أستطع تحديد الحرفة، جرّب وصفًا أوضح.|Métier non identifié, précisez.
تعذّر التحليل الآن، حاول لاحقًا.|Échec, réessayez.
تم حفظ الطلب التجريبي في متصفحك|Demande test enregistrée
تم تجهيز طلبك، أكمل الإرسال عبر واتساب|Demande prête, finalisez sur WhatsApp
تمت إضافة ملفك للجميع (غير موثّق حتى يُتحقّق منه)|Fiche publiée (non vérifiée)
تمت إضافة ملفك (غير موثّق حتى يُتحقّق منه)|Fiche ajoutée (non vérifiée)
تم نسخ الرابط|Lien copié
شكرًا لتقييمك|Merci pour votre avis
تم إرسال البلاغ، شكرًا|Signalement envoyé
معرض الأعمال|Réalisations
لا توجد صور بعد.|Aucune photo.
＋ أضف صورًا لأعمالك|＋ Ajouter des photos
تمت إضافة الصور|Photos ajoutées
مثال لبطاقة مقدّم خدمة: |Exemple de fiche : 
كهرباء منزلية|Électricité domestique
تسريبات وتركيب صحي|Fuites et sanitaire
شاشات وبطاريات|Écrans et batteries
شعارات وهوية بصرية|Logos et identité visuelle
مواقع وتطبيقات ويب|Sites et applications web
أثاث ومطابخ|Meubles et cuisines
تركيب وصيانة وإصلاح الأعطال.|Installation, entretien et dépannage.
كشف التسريبات وتركيب التجهيزات.|Détection de fuites, pose d’équipements.
صيانة الهواتف الذكية.|Réparation de smartphones.
تصميم شعارات ومنشورات.|Logos et visuels.
بناء مواقع ولوحات تحكم.|Sites et tableaux de bord.
تصنيع وتركيب الأثاث.|Fabrication et pose de meubles.`.split("\n").filter(Boolean).map(l=>l.split("|"));
const X={},D=[];DR.forEach(([a,f])=>{if(a[0]==="=")X[a.slice(1)]=f;else D.push([a,f])});
CATS.forEach((c,i)=>D.push([c[0],FRC[i]]));WILAYAS.forEach((w,i)=>D.push([w,FRW[i]]));D.sort((a,b)=>b[0].length-a[0].length);
let LANG="ar";const O=new WeakMap(),AR=/[\u0600-\u06FF]/;
const xl=s=>{const t=s.trim();if(X[t])return s.replace(t,X[t]);for(const [a,f] of D)if(s.includes(a))s=s.split(a).join(f);return s};
function tr(root){root=root||document.body;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){if(/^(SCRIPT|STYLE)$/.test(n.parentNode.nodeName))continue;if(!O.has(n)){if(!AR.test(n.nodeValue))continue;O.set(n,n.nodeValue)}n.nodeValue=LANG==="fr"?xl(O.get(n)):O.get(n)}
 root.querySelectorAll("[placeholder],[data-tip]").forEach(el=>{["placeholder","data-tip"].forEach(a=>{if(!el.hasAttribute(a))return;el._o=el._o||{};if(!(a in el._o)){if(!AR.test(el.getAttribute(a)))return;el._o[a]=el.getAttribute(a)}el.setAttribute(a,LANG==="fr"?xl(el._o[a]):el._o[a])})})}
function setLang(l){LANG=l;const d=document.documentElement;d.lang=l;d.dir=l==="fr"?"ltr":"rtl";$("#lang").textContent=l==="fr"?"عربي":"FR";tr();try{localStorage.setItem("kdz_lang",l)}catch(e){}}
$("#lang").onclick=()=>setLang(LANG==="fr"?"ar":"fr");
const mo=new MutationObserver(()=>{if(LANG==="fr"){cancelAnimationFrame(mo.t);mo.t=requestAnimationFrame(()=>tr())}});mo.observe(document.body,{childList:true,subtree:true});
try{if(localStorage.getItem("kdz_lang")==="fr")setLang("fr")}catch(e){}
$("#theme").onclick=()=>{const d=document.documentElement,cur=d.dataset.theme||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light");d.dataset.theme=cur==="dark"?"light":"dark"};
$("#myReq").onclick=()=>{let a=[];try{a=JSON.parse(localStorage.getItem("kdz_requests")||"[]")}catch(e){}
 $("#reqItems").innerHTML=a.length?a.slice().reverse().map(r=>`<div class="card" style="--h:150"><strong>${esc(r.toName)}</strong><div>${esc(r.desc)}</div><div class="meta">${new Date(r.at).toLocaleDateString("ar-DZ")}</div></div>`).join(""):'<div class="meta">لا توجد طلبات محفوظة بعد.</div>';$("#reqList").showModal()};
init();$("#grid").innerHTML='<div class="sk"></div>'.repeat(3);setTimeout(render,450);
