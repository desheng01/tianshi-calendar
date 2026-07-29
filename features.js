async function startPayment(amount,name){
var btn=event&&event.target?event.target:null;
if(btn){btn.textContent="处理中...";btn.disabled=true;}
try{
var r=await fetch("/api/create-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({amount:amount,description:name})});
var d=await r.json();
if(d.success&&d.approvalUrl){
sessionStorage.setItem("pay_order",d.orderId);
sessionStorage.setItem("pay_amount",String(amount));
sessionStorage.setItem("pay_name",name);
window.location.href=d.approvalUrl;
}else{alert("创建订单失败");if(btn){btn.textContent="购买";btn.disabled=false;}}
}catch(e){alert("网络异常");if(btn){btn.textContent="购买";btn.disabled=false;}}
}

(function(){
var p=new URLSearchParams(window.location.search);
if(p.get("payment")==="success"){
var oid=sessionStorage.getItem("pay_order");
if(oid){
fetch("/api/capture-order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderId:oid})})
.then(function(r){return r.json();}).then(function(d){
if(d.success){
try{localStorage.setItem("js_paid","true");}catch(e){}
sessionStorage.removeItem("pay_order");
sessionStorage.removeItem("pay_amount");
sessionStorage.removeItem("pay_name");
var msg=document.createElement("div");
msg.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1a8a1a;color:#fff;padding:2rem 3rem;border-radius:12px;z-index:99999;font-size:1.2rem";
msg.innerHTML="支付成功！报告已解锁";
document.body.appendChild(msg);
setTimeout(function(){window.location.href=window.location.pathname;},2000);
}});
}
}
if(p.get("payment")==="cancel"){alert("支付已取消");window.location.href=window.location.pathname;}
})();
