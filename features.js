async function startPayment(amount,name){var btn=event&&event.target?event.target:null;if(btn){btn.textContent='处理中...';btn.disabled=true;}try{var r=await fetch('/api/create-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({amount:amount,description:name})});var d=await r.json();if(d.success&&d.approvalUrl){sessionStorage.setItem('pay_order',d.orderId);sessionStorage.setItem('pay_amount',String(amount));sessionStorage.setItem('pay_name',name);window.location.href=d.approvalUrl;}else{alert('创建订单失败');if(btn){btn.textContent='购买';btn.disabled=false;}}}catch(e){alert('网络异常');if(btn){btn.textContent='购买';btn.disabled=false;}}}

(function(){var p=new URLSearchParams(window.location.search);if(p.get("payment")==="success"){var oid=sessionStorage.getItem('pay_order');if(oid){fetch('/api/capture-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId:oid})}).then(function(r){return r.json();}).then(function(d){if(d.success){try{localStorage.setItem('js_paid','true');}catch(e){}sessionStorage.removeItem('pay_order');sessionStorage.removeItem('pay_amount');sessionStorage.removeItem('pay_name');var msg=document.createElement('div');msg.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1a8a1a;color:#fff;padding:2rem 3rem;border-radius:12px;z-index:99999;font-size:1.2rem";msg.innerHTML="支付成功！报告已解锁";document.body.appendChild(msg);setTimeout(function(){window.location.href=window.location.pathname;},2000);}});}}if(p.get("payment")==="cancel"){alert("支付已取消");window.location.href=window.location.pathname;}})();

function showPaywall(){var h='<div id="paywall-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;">';h+='<div style="background:#fff;border-radius:12px;padding:2rem;max-width:400px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.2);">';h+='<h2 style="font-size:1.1rem;color:#2E2E2E;margin-bottom:0.5rem;">需要付费解锁完整报告</h2>';h+='<p style="font-size:0.85rem;color:#888;margin-bottom:1rem;">选择下方价格，通过PayPal支付后自动解锁</p>';h+='<div style="display:grid;gap:0.5rem;margin-bottom:1rem">';h+='<button onclick="closePaywall();startPayment(5,\'择日基础\')" style="padding:0.6rem;background:#0070BA;color:#fff;border:none;border-radius:8px;cursor:pointer">$4.99 - 择日基础</button>';h+='<button onclick="closePaywall();startPayment(15,\'择日专业\')" style="padding:0.6rem;background:#0070BA;color:#fff;border:none;border-radius:8px;cursor:pointer">$14.99 - 择日专业</button>';h+='</div>';h+='<p style="font-size:0.75rem;color:#aaa;">首次支付需登录PayPal，可用信用卡/借记卡支付</p>';h+='</div></div>';var d=document.createElement('div');d.innerHTML=h;document.body.appendChild(d.firstElementChild);}
function closePaywall(){var el=document.getElementById('paywall-overlay');if(el)el.remove();}

var NAME_CHARS={
  "文":{w:"水",m:"有文化、优雅"},
  "武":{w:"火",m:"勇武、有气势"},
  "明":{w:"火",m:"明亮、光明正大"},
  "智":{w:"火",m:"智慧、聪明"},
  "德":{w:"火",m:"品德、仁德"},
  "仁":{w:"木",m:"仁爱、恻隐"},
  "义":{w:"金",m:"义气、正义"},
  "礼":{w:"火",m:"礼仪、有礼貌"},
  "信":{w:"金",m:"信用、守信"},
  "恒":{w:"土",m:"恒心、持之以恒"},
  "梦":{w:"木",m:"梦想、美好愿望"},
  "昊":{w:"火",m:"昊天、广阔"},
  "磊":{w:"土",m:"磊落、坚定"},
  "浩":{w:"水",m:"浩然、正直"},
  "泽":{w:"水",m:"泽润万物"},
  "晨":{w:"火",m:"晨光、新的开始"},
  "星":{w:"火",m:"明星、灿烂"},
  "惠":{w:"水",m:"惠泽、仁爱"},
  "哲":{w:"火",m:"哲学、聪明"},
  "诚":{w:"金",m:"真诚、守信"},
  "欣":{w:"木",m:"欣喜、快乐"},
  "泓":{w:"水",m:"泓白、纯洁"},
  "鑫":{w:"金",m:"多金、富贵"},
  "志":{w:"火",m:"志向、抱负"},
  "辉":{w:"火",m:"辉煌、灿烂"},
  "雅":{w:"土",m:"典雅、优雅"},
  "涵":{w:"水",m:"涵泳、暗奇"},
  "纯":{w:"金",m:"纯真、单纯"},
  "崇":{w:"土",m:"崇高、尊敬"},
  "威":{w:"土",m:"威严、有威信"},
  "慧":{w:"火",m:"慧敏、细心"},
  "琦":{w:"木",m:"美玉、珍贵"}
};

function generateNames(){
var surn=document.getElementById("nSurname").value.trim();
if(!surn){alert("请输入姓氏");return;}
var y=parseInt(document.getElementById("nYear").value);
var wxMap={甲:"木",乙:"木",丙:"火",丁:"火",戊:"土",己:"土",庚:"金",辛:"金",壬:"水",癸:"水"};
var tg=["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"][(y-4)%10];
var ux=wxMap[tg]||"土";
var cp={金:"水",水:"木",木:"火",火:"土",土:"金"};
var nw=cp[ux]||"土";
var ok=[];for(var c in NAME_CHARS){if(NAME_CHARS[c].w===nw||NAME_CHARS[c].w===ux)ok.push(c);}
ok.sort(function(){return Math.random()-0.5;});
var rs=ok.slice(0,6);
var h="<div class='dr-card'><p><strong>您的五行属"+ux+"，宜补"+nw+"。</strong></p>";
h+="<div style='display:flex;flex-wrap:wrap;gap:0.5rem'>";
for(var i=0;i<rs.length;i++){
  h+="<div style='flex:1;min-width:110px;padding:0.5rem;background:#f5f0e8;border-radius:8px;text-align:center'>";
  h+="<div style='font-size:1.3rem;font-weight:bold;color:#AF2020'>"+surn+rs[i]+"</div>";
  h+="<div style='font-size:0.75rem;color:#888'>["+NAME_CHARS[rs[i]].w+"] "+NAME_CHARS[rs[i]].m+"</div>";
  h+="</div>";
}
h+="</div><p style='font-size:0.8rem;color:#aaa;margin-top:0.5rem">此为简版，完整报告含更多吉名、笔画分析等</p>";
h+="<button class='ab' onclick='showPaywall()' style='margin-top:0.5rem;width:100%'>查看完整报告（付费）</button></div>";
document.getElementById("nameResults").innerHTML=h;
}
