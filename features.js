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
NAME_CHARS["\u6c5f"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6cb3"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6e56"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6d77"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6ce2"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6d6a"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6d9b"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6d69"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u7ff0"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6da6"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6cfd"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6e05"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u9e3f"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6e90"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6f9c"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6f84"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6fc1"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6c9b"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6db5"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u7eaf"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6df1"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6d8c"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6eaa"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6c64"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6cc9"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6ee1"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6d3e"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6e2f"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6e7f"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6ed1"]={w:"\u6c34",m:"\u6c34\u5c5e\u542b\u4e49"};
NAME_CHARS["\u91d1"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u94f6"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u94dc"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u94c1"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u94a2"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u950b"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u9510"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u94ed"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u94ec"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u9521"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u9526"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u946b"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u949f"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u94f8"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u955c"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u9488"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u94a5"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u94c3"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u94e0"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u94a9"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u948a"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u9493"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u94a7"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u94c3"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u94a2"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u9510"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u94b1"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u9521"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u950b"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u94ed"]={w:"\u91d1",m:"\u91d1\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6797"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u68ee"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6811"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u677e"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u67cf"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u67f3"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6842"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6850"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u680b"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6770"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6960"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6893"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6977"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u67ab"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6866"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6743"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u67d4"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u67ef"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u8363"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6881"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6768"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6843"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u674e"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u674f"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u68a8"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6a31"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u67a3"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u67ff"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u69d0"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6986"]={w:"\u6728",m:"\u6728\u5c5e\u542b\u4e49"};
NAME_CHARS["\u708e"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u709c"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u714c"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u7115"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u707f"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u7075"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u715c"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u7167"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u71b9"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u70e8"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u5149"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u660e"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u4eae"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6676"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u665f"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u662d"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u6631"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u70ab"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u71e6"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u71c3"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u70ce"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u70fb"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u5f64"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u8f89"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u8000"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u95ea"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u70c3"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u70db"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u70c8"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u70c8"]={w:"\u706b",m:"\u706b\u5c5e\u542b\u4e49"};
NAME_CHARS["\u5c71"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u5cb3"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u5cf0"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u5ca9"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u5c9a"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u5c79"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u5b89"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u5b87"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u5764"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u5766"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u575a"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u78ca"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u5c97"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u9675"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u9646"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u9686"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u7ef4"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u57ce"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u57a3"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u57fa"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u5cad"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u57df"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u5c7f"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u5ce1"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u5d16"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u5c97"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u5d06"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u5d82"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u5dcd"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
NAME_CHARS["\u5ce8"]={w:"\u571f",m:"\u571f\u5c5e\u542b\u4e49"};
DREAM_DATA.push({keyword:"\u4e0b96e8",t:"\u68a6\u89c1\u4e0b96e8",d:"\u68a6\u89c1\u4e0b96e8\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u522e98ce",t:"\u68a6\u89c1\u522e98ce",d:"\u68a6\u89c1\u522e98ce\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u625396f7",t:"\u68a6\u89c1\u625396f7",d:"\u68a6\u89c1\u625396f7\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u95ea7535",t:"\u68a6\u89c1\u95ea7535",d:"\u68a6\u89c1\u95ea7535\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u51b096ea",t:"\u68a6\u89c1\u51b096ea",d:"\u68a6\u89c1\u51b096ea\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u971c964d",t:"\u68a6\u89c1\u971c964d",d:"\u68a6\u89c1\u971c964d\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u5f698679",t:"\u68a6\u89c1\u5f698679",d:"\u68a6\u89c1\u5f698679\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u84dd5929",t:"\u68a6\u89c1\u84dd5929",d:"\u68a6\u89c1\u84dd5929\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u767d4e91",t:"\u68a6\u89c1\u767d4e91",d:"\u68a6\u89c1\u767d4e91\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u661f7a7a",t:"\u68a6\u89c1\u661f7a7a",d:"\u68a6\u89c1\u661f7a7a\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u67085149",t:"\u68a6\u89c1\u67085149",d:"\u68a6\u89c1\u67085149\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u65e551fa",t:"\u68a6\u89c1\u65e551fa",d:"\u68a6\u89c1\u65e551fa\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u65e5843d",t:"\u68a6\u89c1\u65e5843d",d:"\u68a6\u89c1\u65e5843d\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u8fdc5c71",t:"\u68a6\u89c1\u8fdc5c71",d:"\u68a6\u89c1\u8fdc5c71\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u6eaa8c37",t:"\u68a6\u89c1\u6eaa8c37",d:"\u68a6\u89c1\u6eaa8c37\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u70115e03",t:"\u68a6\u89c1\u70115e03",d:"\u68a6\u89c1\u70115e03\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u6e296cc9",t:"\u68a6\u89c1\u6e296cc9",d:"\u68a6\u89c1\u6e296cc9\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u5c9b5c7f",t:"\u68a6\u89c1\u5c9b5c7f",d:"\u68a6\u89c1\u5c9b5c7f\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u6d775cb8",t:"\u68a6\u89c1\u6d775cb8",d:"\u68a6\u89c1\u6d775cb8\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u6c996ee9",t:"\u68a6\u89c1\u6c996ee9",d:"\u68a6\u89c1\u6c996ee9\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u5ce18c37",t:"\u68a6\u89c1\u5ce18c37",d:"\u68a6\u89c1\u5ce18c37\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u5e73539f",t:"\u68a6\u89c1\u5e73539f",d:"\u68a6\u89c1\u5e73539f\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u9ad8539f",t:"\u68a6\u89c1\u9ad8539f",d:"\u68a6\u89c1\u9ad8539f\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u68ee6797",t:"\u68a6\u89c1\u68ee6797",d:"\u68a6\u89c1\u68ee6797\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u83495730",t:"\u68a6\u89c1\u83495730",d:"\u68a6\u89c1\u83495730\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u82b156ed",t:"\u68a6\u89c1\u82b156ed",d:"\u68a6\u89c1\u82b156ed\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u59159633",t:"\u68a6\u89c1\u59159633",d:"\u68a6\u89c1\u59159633\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u671d971e",t:"\u68a6\u89c1\u671d971e",d:"\u68a6\u89c1\u671d971e\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u665a971e",t:"\u68a6\u89c1\u665a971e",d:"\u68a6\u89c1\u665a971e\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u94f66cb3",t:"\u68a6\u89c1\u94f66cb3",d:"\u68a6\u89c1\u94f66cb3\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u6d41661f",t:"\u68a6\u89c1\u6d41661f",d:"\u68a6\u89c1\u6d41661f\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u5f57661f",t:"\u68a6\u89c1\u5f57661f",d:"\u68a6\u89c1\u5f57661f\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u4e916d77",t:"\u68a6\u89c1\u4e916d77",d:"\u68a6\u89c1\u4e916d77\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u96fe9724",t:"\u68a6\u89c1\u96fe9724",d:"\u68a6\u89c1\u96fe9724\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u72c298ce",t:"\u68a6\u89c1\u72c298ce",d:"\u68a6\u89c1\u72c298ce\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u66b496e8",t:"\u68a6\u89c1\u66b496e8",d:"\u68a6\u89c1\u66b496e8\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u96f79706",t:"\u68a6\u89c1\u96f79706",d:"\u68a6\u89c1\u96f79706\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u973996f3",t:"\u68a6\u89c1\u973996f3",d:"\u68a6\u89c1\u973996f3\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
DREAM_DATA.push({keyword:"\u75189732",t:"\u68a6\u89c1\u75189732",d:"\u68a6\u89c1\u75189732\u53ef\u80fd\u610f\u5473\u7740\u60c5\u7eea\u548c\u5fc3\u5883\u7684\u53cd\u6620"});
