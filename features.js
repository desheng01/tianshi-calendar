// Payment
async function startPayment(amount,name){
var btn=event&&event.target?event.target:null;
if(btn){btn.textContent='Processing...';btn.disabled=true;}
try{
var r=await fetch('/api/create-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({amount:amount,description:name})});
var d=await r.json();
if(d.success&&d.approvalUrl){
sessionStorage.setItem('pay_order',d.orderId);
sessionStorage.setItem('pay_amount',String(amount));
sessionStorage.setItem('pay_name',name);
window.location.href=d.approvalUrl;
}else{alert('Order failed');if(btn){btn.textContent='Buy';btn.disabled=false;}}
}catch(e){alert('Network error');if(btn){btn.textContent='Buy';btn.disabled=false;}}
}

// PayPal callback
(function(){
var p=new URLSearchParams(window.location.search);
if(p.get('payment')==='success'){
var oid=sessionStorage.getItem('pay_order');
if(oid){
fetch('/api/capture-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId:oid})})
.then(function(r){return r.json();}).then(function(d){
if(d.success){
try{localStorage.setItem('js_paid','true');}catch(e){}
sessionStorage.removeItem('pay_order');
sessionStorage.removeItem('pay_amount');
sessionStorage.removeItem('pay_name');
var msg=document.createElement('div');
msg.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1a8a1a;color:#fff;padding:2rem;border-radius:12px;z-index:99999';
msg.innerHTML='Payment successful! Report unlocked.';
document.body.appendChild(msg);
setTimeout(function(){window.location.href=window.location.pathname;},2000);
}});
}
}
if(p.get('payment')==='cancel'){alert('Payment cancelled');window.location.href=window.location.pathname;}
})();

// showPaywall override
function showPaywall(){
var h='<div id="paywall-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;">';
h+='<div style="background:#fff;border-radius:12px;padding:2rem;max-width:400px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.2);">';
h+='<h2 style="font-size:1.1rem;color:#2E2E2E;margin-bottom:0.5rem;">Unlock Full Report</h2>';
h+='<p style="font-size:0.85rem;color:#888;margin-bottom:1rem;">Select price below to pay via PayPal</p>';
h+='<div style="display:grid;gap:0.5rem;margin-bottom:1rem">';
h+='<button onclick="closePaywall();startPayment(5,' + "'" + 'basic' + "'" + ')" style="padding:0.6rem;background:#0070BA;color:#fff;border:none;border-radius:8px;cursor:pointer">$4.99 - Basic</button>';
h+='<button onclick="closePaywall();startPayment(15,' + "'" + 'pro' + "'" + ')" style="padding:0.6rem;background:#0070BA;color:#fff;border:none;border-radius:8px;cursor:pointer">$14.99 - Pro</button>';
h+='</div>';
h+='<p style="font-size:0.75rem;color:#aaa;">First payment needs PayPal login. Cards accepted.</p>';
h+='</div></div>';
var d=document.createElement('div');d.innerHTML=h;document.body.appendChild(d.firstElementChild);
}
function closePaywall(){var el=document.getElementById('paywall-overlay');if(el)el.remove();}

// Name characters (simplified)
var NAME_CHARS={};

function generateNames(){
var surn=document.getElementById('nSurname').value.trim();
if(!surn){alert('Enter surname');return;}
var y=parseInt(document.getElementById('nYear').value);
var wx=['','Wood','Wood','Fire','Fire','Earth','Earth','Metal','Metal','Water','Water'];
var wxName=wx[((y-4)%10)+1]||'Earth';
var h='<div class="dr-card"><p><strong>Based on birth year. Element: '+wxName+'.</strong></p><div style="display:flex;flex-wrap:wrap;gap:0.5rem">';
var names=Object.keys(NAME_CHARS);
names.sort(function(){return Math.random()-0.5;});
for(var i=0;i<Math.min(4,names.length);i++){
h+='<div style="flex:1;min-width:110px;padding:0.5rem;background:#f5f0e8;border-radius:8px;text-align:center">';
h+='<div style="font-size:1.3rem;font-weight:bold;color:#AF2020">'+surn+names[i]+'</div>';
h+='<div style="font-size:0.75rem;color:#888">Suggested</div></div>';
}
h+='</div><button class="ab" onclick="showPaywall()" style="margin-top:0.5rem;width:100%">Get Full Report</button></div>';
document.getElementById('nameResults').innerHTML=h;
}

function switchLang(){
  var lst = window.localStorage;
  var lang = lst.getItem("jishi_lang") === "en" ? "zh" : "en";
  lst.setItem("jishi_lang", lang);
  var els = document.querySelectorAll("[data-i18n]");
  for (var i = 0; i < els.length; i++) {
    var key = els[i].getAttribute("data-i18n");
    if (window.LANG && LANG[lang] && LANG[lang][key]) {
      els[i].textContent = LANG[lang][key];
    }
  }
  var btn = document.querySelector(".lang-btn");
  if (btn) btn.textContent = lang === "zh" ? "中/EN" : "EN/中";
}
