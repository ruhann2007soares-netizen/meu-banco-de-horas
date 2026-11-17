const KEY="mbhai_records_v1";
const $=id=>document.getElementById(id);
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`};
$("date").value=today();
let records=load();
function load(){try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch{return []}}
function save(){localStorage.setItem(KEY,JSON.stringify(records));render()}
function minutes(t){if(!/^\d{2}:\d{2}$/.test(t))throw Error("Informe horários válidos.");const [h,m]=t.split(":").map(Number);if(h>23||m>59)throw Error("Horário inválido.");return h*60+m}
function fmt(n){const sign=n<0?"−":"";n=Math.abs(n);return sign+String(Math.floor(n/60)).padStart(2,"0")+"h"+String(n%60).padStart(2,"0")}
function calc(entry,exit,target){let span=minutes(exit)-minutes(entry);if(span<0)span+=1440;if(span===0)throw Error("Entrada e saída não podem ser iguais.");return {worked:span,saldo:span-target}}
function dateLabel(s){return new Date(s+"T12:00:00").toLocaleDateString("pt-BR",{weekday:"short",day:"2-digit",month:"2-digit",year:"numeric"})}
function render(){
 const total=records.reduce((a,r)=>a+r.saldo,0),credits=records.reduce((a,r)=>a+Math.max(0,r.saldo),0),debits=records.reduce((a,r)=>a+Math.max(0,-r.saldo),0);
 $("balance").textContent=(total>=0?"+":"")+fmt(total);
 $("balanceStatus").textContent=records.length?(total>=0?"Saldo matemático positivo":"Saldo matemático negativo"):"Sem registros";
 $("credits").textContent=fmt(credits);$("debits").textContent=fmt(debits);$("days").textContent=records.length;
 const sorted=[...records].sort((a,b)=>b.date.localeCompare(a.date));
 $("history").innerHTML=sorted.length?sorted.map(r=>`<div class="record"><div><b>${dateLabel(r.date)}</b><small>${r.entry} → ${r.exit} · Trabalhado ${fmt(r.worked)} · Previsto ${fmt(r.target)}</small></div><div style="text-align:right"><div class="delta ${r.saldo>=0?"positive":"negative"}">${r.saldo>=0?"+":""}${fmt(r.saldo)}</div><button data-edit="${r.date}">Editar</button><button data-del="${r.date}">Excluir</button></div></div>`).join(""):'<div class="empty">Ainda não há registros. Adicione seu primeiro dia de trabalho.</div>';
 document.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{if(confirm("Excluir este registro?")){records=records.filter(r=>r.date!==b.dataset.del);save()}});
 document.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>{const r=records.find(x=>x.date===b.dataset.edit);$("date").value=r.date;$("entry").value=r.entry;$("exit").value=r.exit;$("target").value=String(r.target);window.scrollTo({top:0,behavior:"smooth"})});
}
$("calcBtn").onclick=()=>{
 try{
  const date=$("date").value,entry=$("entry").value,exit=$("exit").value,target=Number($("target").value);
  if(!date)throw Error("Informe a data.");
  const d=new Date(date+"T12:00:00");if(d.getDay()===0||d.getDay()===6)if(!confirm("Esta data cai no fim de semana. Deseja registrar mesmo assim?"))return;
  const c=calc(entry,exit,target),r={date,entry,exit,target,worked:c.worked,saldo:c.saldo,updated:new Date().toISOString()};
  const i=records.findIndex(x=>x.date===date);if(i>=0){if(!confirm("Já existe um registro nesta data. Deseja substituí-lo?"))return;records[i]=r}else records.push(r);
  save();$("message").textContent=`Registro salvo. Tempo decorrido: ${fmt(c.worked)}; saldo calculado: ${c.saldo>=0?"+":""}${fmt(c.saldo)}.`;
 }catch(e){$("message").textContent=e.message}
};
$("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify({app:"Meu Banco de Horas AI",version:1,records},null,2)],{type:"application/json"});download(blob,"backup-meu-banco-de-horas.json")};
function download(blob,name){const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href)}
$("restore").onchange=async e=>{try{const obj=JSON.parse(await e.target.files[0].text());if(!Array.isArray(obj.records))throw Error();if(!confirm("Restaurar backup? Os registros atuais serão substituídos."))return;records=obj.records;save();$("message").textContent="Backup restaurado."}catch{$("message").textContent="Arquivo de backup inválido."}e.target.value=""};
$("clearBtn").onclick=()=>{if(confirm("Tem certeza? Todos os registros locais serão apagados.")){records=[];save();$("message").textContent="Dados apagados."}};
$("photo").onchange=async e=>{const f=e.target.files[0];if(!f)return;const url=URL.createObjectURL(f);$("preview").classList.remove("hidden");$("preview").innerHTML=`<img src="${url}" alt="Comprovante enviado" style="max-width:100%;max-height:230px;border-radius:10px;display:block;margin-bottom:8px"><b>Fotografia recebida.</b><br>Na versão inicial, confira a imagem e preencha os horários manualmente nos campos acima. A leitura OCR automática será integrada na próxima etapa.`;e.target.value=""};
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
let deferredPrompt;$("installBtn").classList.add("hidden");
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("installBtn").classList.remove("hidden")});
$("installBtn").onclick=async()=>{if(!deferredPrompt){alert("Use o menu do navegador e escolha 'Adicionar à tela inicial' ou 'Instalar app'.");return}deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$("installBtn").classList.add("hidden")};
render();