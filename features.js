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
var NAME_CHARS={
  "文":{w:"水",m:"有文化、优雅"},
  "武":{w:"火",m:"勇武、有气势"},
  "明":{w:"火",m:"明亮、光明正大"},
  "智":{w:"火",m:"智慧、聪明"},
  "德":{w:"火",m:"品德、仁德"},
  "仁":{w:"木",m:"仁爱、恺惠"},
  "义":{w:"金",m:"义气、正义"},
  "礼":{w:"火",m:"礼仪、有礼貌"},
  "信":{w:"金",m:"信用、守信"},
  "恒":{w:"土",m:"恒心、持之以恒"},
  "梦":{w:"木",m:"梦想、美好愿望"},
  "昊":{w:"火",m:"昊天、广阔"},
  "浩":{w:"水",m:"浩然、正直"},
  "泽":{w:"水",m:"泽润万物"},
  "晨":{w:"火",m:"晨光、新的开始"},
  "星":{w:"火",m:"明星、灿烂"},
  "惠":{w:"水",m:"恺泽、仁爱"},
  "哲":{w:"火",m:"哲学、聪明"},
  "诚":{w:"金",m:"真诚、守信"},
  "欣":{w:"木",m:"欣喜、快乐"},
  "浚":{w:"水",m:"浚白、纯洁"},
  "鑫":{w:"金",m:"多金、富贵"},
  "志":{w:"火",m:"志向、抱负"},
  "辉":{w:"火",m:"辉煌、灿烂"},
  "雅":{w:"土",m:"典雅、优雅"},
  "涵":{w:"水",m:"涵泳、暗奇"},
  "纯":{w:"金",m:"纯真、单纯"},
  "崇":{w:"土",m:"崇高、尊敬"},
  "威":{w:"土",m:"威严、有威信"},
  "慧":{w:"火",m:"慧敏、细心"},
  "瑷":{w:"火",m:"瑷华、美好"},
  "琦":{w:"木",m:"美玉、珍贵"},
  "玺":{w:"土",m:"玺瑜、美好"},
  "磊":{w:"土",m:"磊落、坚定"}
};


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


// Added dream keywords (appended to DREAM_DATA from script.js)
(function(){if(typeof DREAM_DATA==="undefined")return;
DREAM_DATA.push({keyword:"河",t:"梦见河",d:"河流代表生命之源、财路开阔。清澈的河流赞叹事业顺畅，混浊的河水提示谨慎投资。"});
DREAM_DATA.push({keyword:"池塘",t:"梦见池塘",d:"池塘代表心境平和、私人空间。满池荷花赞名誉、空池提示寂寞。"});
DREAM_DATA.push({keyword:"水底",t:"梦见水底",d:"水底代表潜意识、隐秘事情。看清水底意味着看清真相。"});
DREAM_DATA.push({keyword:"火灾",t:"梦见火灾",d:"火灾代表急躁、危机也可能是转机。扑灭了表示能度过难关。"});
DREAM_DATA.push({keyword:"炼火",t:"梦见炼火",d:"炼火代表精神的纯净与转变，招来好运。"});
DREAM_DATA.push({keyword:"火把",t:"梦见火把",d:"火把指引路、希望，梦见火把照亮黑暗意味着找到方向。"});
DREAM_DATA.push({keyword:"山峰",t:"梦见山峰",d:"山峰代表目标、成就。登上山峰赞事业达顶峰，半山膊提示继续努力。"});
DREAM_DATA.push({keyword:"山谷",t:"梦见山谷",d:"山谷代表沉思、内省。青翠山谷赞吉祥，深谷提示谨慎。"});
DREAM_DATA.push({keyword:"山嵦",t:"梦见山嵦",d:"山嵦代表障碍、挑战。翻越山嵦意味着克服困难。"});
DREAM_DATA.push({keyword:"森林",t:"梦见森林",d:"森林代表发展、成长。茂密森林赞事业兴旺，迷路提示需明确方向。"});
DREAM_DATA.push({keyword:"树林",t:"梦见树林",d:"树林代表家族、社交圈子。茂盛树林赞人脶广，树叶被风吹落提示繁恼。"});
DREAM_DATA.push({keyword:"茵子",t:"梦见茵子",d:"茵子代表利益、小人。捁住茵子意味着能管理利益，被茵子捁提示谨防小人。"});
DREAM_DATA.push({keyword:"竹子",t:"梦见竹子",d:"竹子代表命运、转变。长势向上赞事业升迁，下降提示稍作调整。"});
DREAM_DATA.push({keyword:"飞机",t:"梦见坐飞机",d:"坐飞机代表远行、追求理想。飞机平稳的赞旅途顺利，晚点提示需耐心。"});
DREAM_DATA.push({keyword:"火车",t:"梦见坐火车",d:"火车代表生活节奏、复杂关系。赶火车意味着时间紧迫，坐稳了赞有条不紊。"});
DREAM_DATA.push({keyword:"行李",t:"梦见行李",d:"行李代表压力、责任。行李多意味着担心重，行李丢失提示放下担子。"});
DREAM_DATA.push({keyword:"路灯",t:"梦见路灯",d:"路灯代表引导、希望。亮着的路灯赞前途光明，灯灭了提示需寻求帮助。"});
DREAM_DATA.push({keyword:"月亮",t:"梦见月亮",d:"月亮代表感情、美好愿望。满月赞团圆、朋友聚会，新月提示新的开始。"});
DREAM_DATA.push({keyword:"星星",t:"梦见星星",d:"星星代表希望、愿望。闪耀的星星赞好运随行，流星提示把握机会。"});
DREAM_DATA.push({keyword:"雷电",t:"梦见雷电",d:"雷电代表惊讶、突变。闪电赞灵感爆发，雷声提示需谨慎行事。"});
DREAM_DATA.push({keyword:"雨披",t:"梦见雨披",d:"雨披代表保护、防范。穿雨披意味着做好准备，可度过困难。"});
DREAM_DATA.push({keyword:"披风幕雨",t:"梦见披风幕雨",d:"代表努力奋斗、坚持不懈，可得到回报。"});
DREAM_DATA.push({keyword:"降雨",t:"梦见降雨",d:"代表洗澄、新序幕。疯狂的降雨过后会风平浪静。"});
DREAM_DATA.push({keyword:"蓝天",t:"梦见蓝天",d:"蓝天代表开朗、愉悦。蓝天白云赞事业顺遂，阴天提示谨慎。"});
DREAM_DATA.push({keyword:"热带",t:"梦见热带",d:"热带代表情感热烈。邯待放纵的热带风情，可能意味着需要假期。"});
DREAM_DATA.push({keyword:"紫色",t:"梦见紫色",d:"紫色代表贵族、神秘。梦见紫色赞贵人相助，紫气东来。"});
DREAM_DATA.push({keyword:"红色",t:"梦见红色",d:"红色代表喜庆、活力。梦见红色赞好事将至，红包、红绣球等均为吉兆。"});
DREAM_DATA.push({keyword:"白色",t:"梦见白色",d:"白色代表纯洁、真诚。梦见白色衣服赞心底纯洁，白色空间提示重新开始。"});
DREAM_DATA.push({keyword:"黑暗",t:"梦见黑暗",d:"黑暗代表未知、恐惧。在黑暗中找到光明赞能度过困难，黑暗提示需要支持。"});
DREAM_DATA.push({keyword:"石头",t:"梦见石头",d:"石头代表坚硬、固执。大石头赞坚定，小石子提示细节重要。"});
DREAM_DATA.push({keyword:"宝石",t:"梦见宝石",d:"宝石代表贵重、珍藏。射着光芒的宝石赞发现新机会，宝石丢失提示失去珍贵东西。"});
DREAM_DATA.push({keyword:"钱币",t:"梦见钱币",d:"钱币代表财富、收获。梦见梦见许多钱币赞财运佳，丢失钱币提示疑心财务。"});
DREAM_DATA.push({keyword:"古董",t:"梦见古董",d:"古董代表历史、家族遗产。收藏古董赞重视家族，破损提示需修复旧关系。"});
DREAM_DATA.push({keyword:"肉",t:"梦见肉",d:"肉代表范、欲望。大块肉赞有口福，变质的肉提示谨慎健康。"});
DREAM_DATA.push({keyword:"粥",t:"梦见喝粥",d:"啽粥代表清淡、平静。喝粥赞生活平淡安康，粥焦了提示解决问题。"});
DREAM_DATA.push({keyword:"酒",t:"梦见喝酒",d:"喝酒代表庆祝、交际。与朋友喝酒赞社交广。喝醉提示过度放纵。"});
DREAM_DATA.push({keyword:"茶",t:"梦见喝茶",d:"喝茶代表休憩、沟通。品茶赞情感交流，蒸茶提示思考重要决定。"});
DREAM_DATA.push({keyword:"沙漠",t:"梦见沙漠",d:"沙漠代表孤独、杮立。广裕沙漠赞能独立，沙雨提示混乱情况。"});
DREAM_DATA.push({keyword:"海边",t:"梦见海边",d:"海边代表放松、望运。散步海边赞铃可放松心情，大浪提示需度过难关。"});
DREAM_DATA.push({keyword:"文件",t:"梦见文件",d:"文件代表工作、信息。整齐的文件赞工作有条理，丢失提示担心失误。"});
DREAM_DATA.push({keyword:"报纸",t:"梦见看报纸",d:"看报纸代表关注时事、学习。看到梦见报纸赞掌握新信息，旧报纸提示过去的事。"});
DREAM_DATA.push({keyword:"电话",t:"梦见接电话",d:"接电话代表沟通、消息。电话响起赞有新消息，没人接提示寂寞。"});
DREAM_DATA.push({keyword:"锁",t:"梦见锁",d:"锁代表秘密、保护。打开锁赞解决问题，锁住了提示困思困惑。"});
DREAM_DATA.push({keyword:"古城",t:"梦见古城",d:"古城代表历史、传统。游古城赞快乐旅行，废弃古城提示过去的影响。"});
DREAM_DATA.push({keyword:"公园",t:"梦见公园",d:"公园代表休闲、家庭。散步公园赞家庭和盦，寂静公园提示孤独。"});
DREAM_DATA.push({keyword:"建筑",t:"梦见高楼",d:"高楼代表理想、抱负。站在高楼看远方赞视野开阔，楼层太高提示压力大。"});
})();


//=== Enhanced Report Previews ===

// Enhanced openReport for day selection
if(typeof openReport_orig==="undefined"){
  var openReport_orig=window.openReport;
}
window.openReport=function(tier){
  var h="<div style=\"background:#fff;border-radius:12px;padding:2rem;max-width:600px;margin:0 auto\">";
  h+="<div style=\"text-align:center;margin-bottom:1.5rem\">";
  h+="<div style=\"font-size:0.9rem;color:#AF2020;font-weight:600\">吉时网 Jishi.today</div>";
  h+="<div style=\"font-size:1.1rem;color:#2E2E2E;margin-top:0.3rem\">择吉日报告</div>";
  h+="<div style=\"font-size:0.8rem;color:#aaa;margin-top:0.2rem\">Day Selection Report</div>";
  h+="</div><hr style=\"border:none;border-top:1px solid #eee\">";
  h+="<div style=\"padding:0.5rem 0\">";
  if(tier==="basic"){
    h+="<p style=\"font-size:0.85rem;color:#666;line-height:1.8\"><b>所择日期：</b>2026年8月8日<br>";
    h+="<b>农历：</b>丙午年六月廿六<br>";
    h+="<b>日干支：</b>甲申<br>";
    h+="<b>建除：</b>满日 吉<br>";
    h+="<b>二十八宿：</b>角宿 吉<br>";
    h+="<b>冲煞：</b>冲虎(戊寅) 煞南<br>";
    h+="<b>宜：</b>结婚、搬家、入宅、开业、出行<br>";
    h+="<b>忌：</b>安葬、动土<br>";
    h+="<b>评分：</b><span style=\"color:#AF2020;font-weight:600\">大吉 (★★★★★)</span></p>";
    h+="<p style=\"font-size:0.8rem;color:#888;margin-top:0.8rem\">* 此为简要预览。完整报告含时辰吉凶表、五行生克分析、冲煞方位图解等详细内容。</p>";
  } else {
    h+="<p style=\"font-size:0.85rem;color:#666;line-height:1.8\"><b>此报告包含：</b><br>";
    h+="• 多日对比推荐（3-5个吉日）<br>";
    h+="• 每日时辰吉凶表<br>";
    h+="• 周易卦象解读<br>";
    h+="• 五行生克推理<br>";
    h+="• 冲煞方位详细解析</p>";
    h+="<p style=\"font-size:0.8rem;color:#888;margin-top:0.8rem\">* 此为简要预览。付费后可查看完整报告。</p>";
  }
  h+="</div><hr style=\"border:none;border-top:1px solid #eee\">";
  h+="<button onclick=\"document.getElementById('reportPage').className='rp';showPaywall()\" style=\"display:block;width:100%;padding:0.7rem;background:#AF2020;color:#fff;border:none;border-radius:8px;font-size:0.9rem;cursor:pointer;margin-top:1rem\">查看完整报告</button>";
  h+="</div>";
  document.getElementById("rpContent").innerHTML=h;
  document.getElementById("rpSubtitle").textContent=tier==="basic"?"择日报告预览":"深度报告预览";
  document.getElementById("reportPage").className="rp op";
};

if(typeof showBaziPreview_orig==="undefined"){
  var showBaziPreview_orig=window.showBaziPreview;
}
window.showBaziPreview=function(){
  var h="<div style=\"background:#fff;border-radius:12px;padding:2rem;max-width:600px;margin:0 auto\">";
  h+="<div style=\"text-align:center;margin-bottom:1.5rem\">";
  h+="<div style=\"font-size:0.9rem;color:#AF2020;font-weight:600\">吉时网 Jishi.today</div>";
  h+="<div style=\"font-size:1.1rem;color:#2E2E2E;margin-top:0.3rem\">八字命理报告</div>";
  h+="<div style=\"font-size:0.8rem;color:#aaa;margin-top:0.2rem\">BaZi Destiny Report</div>";
  h+="</div><hr style=\"border:none;border-top:1px solid #eee\">";
  h+="<div style=\"padding:0.5rem 0\">";
  h+="<p style=\"font-size:0.85rem;color:#666;line-height:1.8\"><b>出生时间：</b>1990年1月15日 辰时<br>";
  h+="<b>八字：</b>己巳 丁丑 癸未 丙辰<br>";
  h+="<b>日主：</b>癸水（生于丑月）<br>";
  h+="<b>五行：</b>火旺 土相 木休 水囚 金死<br>";
  h+="<b>用神：</b>金、水<br>";
  h+="<b>忌神：</b>火、土<br>";
  h+="<b>性格特点：</b>聪慧敏感，善谋略，但有时过于谨慎。</p>";
  h+="<p style=\"font-size:0.8rem;color:#888;margin-top:0.8rem\">* 此为简要预览。付费后可查看完整分析报告（含事业、财运、感情等详解）。</p>";
  h+="</div><hr style=\"border:none;border-top:1px solid #eee\">";
  h+="<button onclick=\"showPaywall()\" style=\"display:block;width:100%;padding:0.7rem;background:#AF2020;color:#fff;border:none;border-radius:8px;font-size:0.9rem;cursor:pointer;margin-top:1rem\">查看完整报告</button>";
  h+="</div>";
  var rp=document.getElementById("reportPage");
  var rc=document.getElementById("rpContent");
  if(!rp||!rc){alert("报告区域未找到");return;}
  rc.innerHTML=h;
  document.getElementById("rpSubtitle").textContent="八字命理报告预览";
  rp.className="rp op";
};
