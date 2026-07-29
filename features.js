async function startPayment(amount,name){var btn=event&&event.target?event.target:null;if(btn){btn.textContent='\u5904\u7406\u4e2d...';btn.disabled=true;}try{var r=await fetch('/api/create-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({amount:amount,description:name})});var d=await r.json();if(d.success&&d.approvalUrl){sessionStorage.setItem('pay_order',d.orderId);sessionStorage.setItem('pay_amount',String(amount));sessionStorage.setItem('pay_name',name);window.location.href=d.approvalUrl;}else{alert('\u521b\u5efa\u8ba2\u5355\u5931\u8d25');if(btn){btn.textContent='\u8d2d\u4e70';btn.disabled=false;}}}catch(e){alert('\u7f51\u7edc\u5f02\u5e38');if(btn){btn.textContent='\u8d2d\u4e70';btn.disabled=false;}}}

(function(){var p=new URLSearchParams(window.location.search);if(p.get("payment")==="success"){var oid=sessionStorage.getItem('pay_order');if(oid){fetch('/api/capture-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId:oid})}).then(function(r){return r.json();}).then(function(d){if(d.success){try{localStorage.setItem('js_paid','true');}catch(e){}sessionStorage.removeItem('pay_order');sessionStorage.removeItem('pay_amount');sessionStorage.removeItem('pay_name');var msg=document.createElement('div');msg.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1a8a1a;color:#fff;padding:2rem 3rem;border-radius:12px;z-index:99999;font-size:1.2rem";msg.innerHTML="\u652f\u4ed8\u6210\u529f\uff01\u62a5\u544a\u5df2\u89e3\u9501";document.body.appendChild(msg);setTimeout(function(){window.location.href=window.location.pathname;},2000);}});}}if(p.get("payment")==="cancel"){alert("\u652f\u4ed8\u5df2\u53d6\u6d88");window.location.href=window.location.pathname;}})();

function showPaywall(){var h='<div id="paywall-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;">';h+='<div style="background:#fff;border-radius:12px;padding:2rem;max-width:400px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.2);">';h+='<h2 style="font-size:1.1rem;color:#2E2E2E;margin-bottom:0.5rem;">\u9700\u8981\u4ed8\u8d39\u89e3\u9501\u5b8c\u6574\u62a5\u544a</h2>';h+='<p style="font-size:0.85rem;color:#888;margin-bottom:1rem;">\u9009\u62e9\u4e0b\u65b9\u4ef7\u683c\uff0c\u901a\u8fc7PayPal\u652f\u4ed8\u540e\u81ea\u52a8\u89e3\u9501</p>';h+='<div style="display:grid;gap:0.5rem;margin-bottom:1rem">';h+='<button onclick="closePaywall();startPayment(5,\'\u62e9\u65e5\u57fa\u7840\')" style="padding:0.6rem;background:#0070BA;color:#fff;border:none;border-radius:8px;cursor:pointer">$4.99 - \u62e9\u65e5\u57fa\u7840</button>';h+='<button onclick="closePaywall();startPayment(15,\'\u62e9\u65e5\u4e13\u4e1a\')" style="padding:0.6rem;background:#0070BA;color:#fff;border:none;border-radius:8px;cursor:pointer">$14.99 - \u62e9\u65e5\u4e13\u4e1a</button>';h+='</div>';h+='<p style="font-size:0.75rem;color:#aaa;">\u9996\u6b21\u652f\u4ed8\u9700\u767b\u5f55PayPal\uff0c\u53ef\u7528\u4fe1\u7528\u5361/\u501f\u8bb0\u5361\u652f\u4ed8</p>';h+='</div></div>';var d=document.createElement('div');d.innerHTML=h;document.body.appendChild(d.firstElementChild);}
function closePaywall(){var el=document.getElementById('paywall-overlay');if(el)el.remove();}

var NAME_CHARS={
  "\u6587":{w:"\u6c34",m:"\u6709\u6587\u5316\u3001\u4f18\u96c5"},
  "\u6b66":{w:"\u706b",m:"\u52c7\u6b66\u3001\u6709\u6c14\u52bf"},
  "\u660e":{w:"\u706b",m:"\u660e\u4eae\u3001\u5149\u660e\u6b63\u5927"},
  "\u667a":{w:"\u706b",m:"\u667a\u6167\u3001\u806a\u660e"},
  "\u5fb7":{w:"\u706b",m:"\u54c1\u5fb7\u3001\u4ec1\u5fb7"},
  "\u4ec1":{w:"\u6728",m:"\u4ec1\u7231\u3001\u607b\u9690"},
  "\u4e49":{w:"\u91d1",m:"\u4e49\u6c14\u3001\u6b63\u4e49"},
  "\u793c":{w:"\u706b",m:"\u793c\u4eea\u3001\u6709\u793c\u8c8c"},
  "\u4fe1":{w:"\u91d1",m:"\u4fe1\u7528\u3001\u5b88\u4fe1"},
  "\u6052":{w:"\u571f",m:"\u6052\u5fc3\u3001\u6301\u4e4b\u4ee5\u6052"},
  "\u68a6":{w:"\u6728",m:"\u68a6\u60f3\u3001\u7f8e\u597d\u613f\u671b"},
  "\u660a":{w:"\u706b",m:"\u660a\u5929\u3001\u5e7f\u9614"},
  "\u78ca":{w:"\u571f",m:"\u78ca\u843d\u3001\u575a\u5b9a"},
  "\u6d69":{w:"\u6c34",m:"\u6d69\u7136\u3001\u6b63\u76f4"},
  "\u6cfd":{w:"\u6c34",m:"\u6cfd\u6da6\u4e07\u7269"},
  "\u6668":{w:"\u706b",m:"\u6668\u5149\u3001\u65b0\u7684\u5f00\u59cb"},
  "\u661f":{w:"\u706b",m:"\u660e\u661f\u3001\u707f\u70c2"},
  "\u60e0":{w:"\u6c34",m:"\u60e0\u6cfd\u3001\u4ec1\u7231"},
  "\u54f2":{w:"\u706b",m:"\u54f2\u5b66\u3001\u806a\u660e"},
  "\u8bda":{w:"\u91d1",m:"\u771f\u8bda\u3001\u5b88\u4fe1"},
  "\u6b23":{w:"\u6728",m:"\u6b23\u559c\u3001\u5feb\u4e50"},
  "\u6cd3":{w:"\u6c34",m:"\u6cd3\u767d\u3001\u7eaf\u6d01"},
  "\u946b":{w:"\u91d1",m:"\u591a\u91d1\u3001\u5bcc\u8d35"},
  "\u5fd7":{w:"\u706b",m:"\u5fd7\u5411\u3001\u62b1\u8d1f"},
  "\u8f89":{w:"\u706b",m:"\u8f89\u714c\u3001\u707f\u70c2"},
  "\u96c5":{w:"\u571f",m:"\u5178\u96c5\u3001\u4f18\u96c5"},
  "\u6db5":{w:"\u6c34",m:"\u6db5\u6cf3\u3001\u6697\u5947"},
  "\u7eaf":{w:"\u91d1",m:"\u7eaf\u771f\u3001\u5355\u7eaf"},
  "\u5d07":{w:"\u571f",m:"\u5d07\u9ad8\u3001\u5c0a\u656c"},
  "\u5a01":{w:"\u571f",m:"\u5a01\u4e25\u3001\u6709\u5a01\u4fe1"},
  "\u6167":{w:"\u706b",m:"\u6167\u654f\u3001\u7ec6\u5fc3"},
  "\u7426":{w:"\u6728",m:"\u7f8e\u7389\u3001\u73cd\u8d35"}
};

function generateNames(){
var surn=document.getElementById("nSurname").value.trim();
if(!surn){alert("\u8bf7\u8f93\u5165\u59d3\u6c0f");return;}
var y=parseInt(document.getElementById("nYear").value);
var wxMap={\u7532:"\u6728",\u4e59:"\u6728",\u4e19:"\u706b",\u4e01:"\u706b",\u620a:"\u571f",\u5df1:"\u571f",\u5e9a:"\u91d1",\u8f9b:"\u91d1",\u58ec:"\u6c34",\u7678:"\u6c34"};
var tg=["\u7532","\u4e59","\u4e19","\u4e01","\u620a","\u5df1","\u5e9a","\u8f9b","\u58ec","\u7678"][(y-4)%10];
var ux=wxMap[tg]||"\u571f";
var cp={\u91d1:"\u6c34",\u6c34:"\u6728",\u6728:"\u706b",\u706b:"\u571f",\u571f:"\u91d1"};
var nw=cp[ux]||"\u571f";
var ok=[];for(var c in NAME_CHARS){if(NAME_CHARS[c].w===nw||NAME_CHARS[c].w===ux)ok.push(c);}
ok.sort(function(){return Math.random()-0.5;});
var rs=ok.slice(0,6);
var h="<div class='dr-card'><p><strong>\u60a8\u7684\u4e94\u884c\u5c5e"+ux+"\uff0c\u5b9c\u8865"+nw+"\u3002</strong></p>";
h+="<div style='display:flex;flex-wrap:wrap;gap:0.5rem'>";
for(var i=0;i<rs.length;i++){
  h+="<div style='flex:1;min-width:110px;padding:0.5rem;background:#f5f0e8;border-radius:8px;text-align:center'>";
  h+="<div style='font-size:1.3rem;font-weight:bold;color:#AF2020'>"+surn+rs[i]+"</div>";
  h+="<div style='font-size:0.75rem;color:#888'>["+NAME_CHARS[rs[i]].w+"] "+NAME_CHARS[rs[i]].m+"</div>";
  h+="</div>";
}
h+="</div><p style='font-size:0.8rem;color:#aaa;margin-top:0.5rem">\u6b64\u4e3a\u7b80\u7248\uff0c\u5b8c\u6574\u62a5\u544a\u542b\u66f4\u591a\u5409\u540d\u3001\u7b14\u753b\u5206\u6790\u7b49</p>";
h+="<button class='ab' onclick='showPaywall()' style='margin-top:0.5rem;width:100%'>\u67e5\u770b\u5b8c\u6574\u62a5\u544a\uff08\u4ed8\u8d39\uff09</button></div>";
document.getElementById("nameResults").innerHTML=h;
}
