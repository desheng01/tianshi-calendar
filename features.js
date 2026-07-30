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
var NAME_CHARS={金:{w:金,m:"金属、坚强"},银:{w:金,m:"财富、尊贵"},钧:{w:金,m:"重量、稳重"},铭:{w:金,m:"铭记、卓越"},铬:{w:金,m:"铮铮、刚强"},锡:{w:金,m:"赏赐、恩惠"},锦:{w:金,m:"锦绣、美好"},鑫:{w:金,m:"多金、富贵"},钟:{w:金,m:"钟爱、专注"},锋:{w:金,m:"锋利、锐气"},锐:{w:金,m:"锐利、敏锐"},钊:{w:金,m:"恭敬、钦佩"},钱:{w:金,m:"财富、价值"},钥:{w:金,m:"关键、重要"},钢:{w:金,m:"钢铁、坚强"},林:{w:木,m:"森林、繁茂"},森:{w:木,m:"森林、众多"},树:{w:木,m:"树立、建立"},松:{w:木,m:"松树、长寿"},柏:{w:木,m:"松柏、坚韧"},柳:{w:木,m:"柳树、柔美"},桂:{w:木,m:"桂花、芬芳"},桐:{w:木,m:"梧桐、高洁"},栋:{w:木,m:"栋梁、骨干"},杰:{w:木,m:"杰出、卓越"},楠:{w:木,m:"楠木、珍贵"},梓:{w:木,m:"桑梓、家乡"},楷:{w:木,m:"楷模、榜样"},枫:{w:木,m:"枫叶、热情"},桦:{w:木,m:"桦树、挺拔"},权:{w:木,m:"权力、权衡"},柔:{w:木,m:"柔和、善良"},柯:{w:木,m:"柯枝、繁茂"},荣:{w:木,m:"繁荣、光荣"},梁:{w:木,m:"桥梁、连接"},江:{w:水,m:"江河、广阔"},河:{w:水,m:"河川、源远"},湖:{w:水,m:"湖泊、宁静"},海:{w:水,m:"海洋、包容"},波:{w:水,m:"波浪、活力"},浪:{w:水,m:"浪潮、激情"},涛:{w:水,m:"波涛、气势"},浩:{w:水,m:"浩然、正直"},翰:{w:水,m:"浩瀚、学识"},润:{w:水,m:"润泽、恩惠"},泽:{w:水,m:"泽润、恩德"},清:{w:水,m:"清澈、纯洁"},鸿:{w:水,m:"鸿鹄、志向"},源:{w:水,m:"源泉、源头"},澜:{w:水,m:"波澜、壮阔"},澄:{w:水,m:"澄澈、清明"},泉:{w:水,m:"泉水、活力"},沟:{w:水,m:"沟通、交流"},深:{w:水,m:"深沉、智慧"},溪:{w:水,m:"溪流、持续"},汤:{w:水,m:"汤谷、温暖"},涌:{w:水,m:"涌现、活力"},炎:{w:火,m:"烈焰、热情"},炜:{w:火,m:"光辉、灿烂"},炜:{w:火,m:"炜烨、光彩"},煌:{w:火,m:"辉煌、成就"},焕:{w:火,m:"焕发、光彩"},灿:{w:火,m:"灿烂、明亮"},灵:{w:火,m:"灵巧、智慧"},煜:{w:火,m:"煜煜、明亮"},照:{w:火,m:"照耀、光明"},熹:{w:火,m:"熹微、晨光"},烨:{w:火,m:"烨烨、光辉"},光:{w:火,m:"光明、荣耀"},明:{w:火,m:"明亮、智慧"},亮:{w:火,m:"亮丽、出色"},晶:{w:火,m:"晶莹、剔透"},晟:{w:火,m:"晟光、兴盛"},昭:{w:火,m:"昭示、明亮"},昱:{w:火,m:"昱日、新一天"},炫:{w:火,m:"炫丽、光彩"},彤:{w:火,m:"彤云、吉祥"},炒:{w:火,m:"炽热、热情"},烛:{w:火,m:"烛光、照亮"},山:{w:土,m:"山岳、稳重"},岳:{w:土,m:"岳峙、崇高"},峰:{w:土,m:"山峰、顶峰"},岩:{w:土,m:"岩石、坚固"},岚:{w:土,m:"岚气、清新"},屹:{w:土,m:"屹立、坚定"},安:{w:土,m:"平安、安宁"},宇:{w:土,m:"宇宙、气度"},坤:{w:土,m:"坤元、大地"},坦:{w:土,m:"坦荡、真诚"},坚:{w:土,m:"坚强、毅力"},磊:{w:土,m:"磊落、正直"},岗:{w:土,m:"山岗、高处"},陵:{w:土,m:"丘陵、延绵"},陆:{w:土,m:"陆地、坚实"},隆:{w:土,m:"兴隆、昌盛"},维:{w:土,m:"维护、思维"},城:{w:土,m:"城墙、稳固"},垣:{w:土,m:"永恒、持久"},垩:{w:土,m:"基石、基础"},文:{w:水,m:"文化、文采"},武:{w:火,m:"勇武、气概"},智:{w:火,m:"智慧、聪明"},德:{w:火,m:"品德、仁德"},仁:{w:木,m:"仁爱、善良"},义:{w:金,m:"义气、正义"},礼:{w:火,m:"礼仪、礼貌"},信:{w:金,m:"信用、诚实"},恒:{w:土,m:"恒心、持久"},梦:{w:木,m:"梦想、追求"},昊:{w:火,m:"昊天、广阔"},浩:{w:水,m:"浩然、正气"},晨:{w:火,m:"晨光、新生"},星:{w:火,m:"明星、灿烂"},哲:{w:火,m:"哲学、智慧"},诚:{w:金,m:"真诚、守信"},志:{w:火,m:"志向、抱负"},辉:{w:火,m:"辉煌、光彩"},雅:{w:土,m:"典雅、高尚"},涵:{w:水,m:"涵养、包容"},纯:{w:金,m:"纯真、纯洁"},崇:{w:土,m:"崇高、尊敬"},威:{w:土,m:"威严、威信"},慧:{w:火,m:"慧心、聪慧"},琦:{w:木,m:"美玉、珍贵"},玺:{w:土,m:"瑾瑜、美德"},轩:{w:土,m:"气宇轩昂"},嘉:{w:木,m:"嘉奖、美好"},宇:{w:土,m:"气度、宽广"},翰:{w:水,m:"翰林、才华"},博:{w:水,m:"博学、渊博"},睿:{w:金,m:"睿智、英明"},麟:{w:火,m:"麒麟、祥瑞"},凯:{w:木,m:"凯旋、成功"},靖:{w:金,m:"靖安、平安"},宁:{w:火,m:"宁静、安详"},安:{w:土,m:"安全、平安"},平:{w:水,m:"平和、平稳"},天:{w:火,m:"天空、高远"},冠:{w:木,m:"冠军、卓越"}
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

// Additional dream keywords
(function(){if(typeof DREAM_DATA==="undefined")return;
DREAM_DATA.push({keyword:"猫",t:"梦见猫",d:"猫代表独立、神秘。黑猫提示谨慎，白猫赞好运，亲昵的猫意味着温暖的关系。"});
DREAM_DATA.push({keyword:"狗",t:"梦见狗",d:"狗代表忠诚、友谊。亲近的狗赞朋友可靠，狂吀的狗提示谨防小人。"});
DREAM_DATA.push({keyword:"鱼",t:"梦见鱼",d:"鱼代表财富、丰收。活泼的鱼赞财运佳，死鱼提示失去机会。"});
DREAM_DATA.push({keyword:"鸟",t:"梦见鸟",d:"鸟代表自由、理想。飞鸟赞心情愉悦，网中鸟提示感到束缚。"});
DREAM_DATA.push({keyword:"蜂蜜",t:"梦见蜂蜜",d:"蜂蜜代表祝福、甘甜。品尝蜂蜜赞生活美好，蜂蜜溢出提示福气满满。"});
DREAM_DATA.push({keyword:"蛇",t:"梦见蛇",d:"蛇代表智慧、转变。蛇脱皮赞重生，被蛇追提示压力大。"});
DREAM_DATA.push({keyword:"马",t:"梦见马",d:"马代表自由、勇往直前。奔驰的马赞事业进取，安静的马提示暂时休息。"});
DREAM_DATA.push({keyword:"兔",t:"梦见兔",d:"兔代表温柔、敏感。白兔赞幸福，被兔追赶提示想要逃避某事。"});
DREAM_DATA.push({keyword:"虎",t:"梦见虎",d:"虎代表威严、力量。躁虎赞能力强，被虎追提示受到威胁。"});
DREAM_DATA.push({keyword:"狮",t:"梦见狮",d:"狮代表权力、尊严。狮子赞领导力，温顺的狮提示能控制局面。"});
DREAM_DATA.push({keyword:"鹿",t:"梦见鹿",d:"鹿代表纯洁、长寿。欣快的鹿赞幸福安康，追逐提示追求目标。"});
DREAM_DATA.push({keyword:"浪花",t:"梦见海浪",d:"海浪代表情绪波动。大浪提示大起大落，平静的浪赞平稳过渡。"});
DREAM_DATA.push({keyword:"小艹",t:"梦见小艹",d:"小艹代表家庭、幸福。小艹赞幸福生活，小艹破损提示家庭问题。"});
DREAM_DATA.push({keyword:"船",t:"梦见船",d:"船代表人生旅程。大船赞事业稳定，小船提示孤独。"});
DREAM_DATA.push({keyword:"桥",t:"梦见桥",d:"桥代表过渡、转变。过桥赞顺利过渡，桥断提示困难。"});
DREAM_DATA.push({keyword:"香港船",t:"梦见渡轮",d:"渡轮代表旅程、等待。稳定的渡轮赞平安。错过渡轮提示错失机会"});
DREAM_DATA.push({keyword:"火车站",t:"梦见火车站",d:"火车站代表分别、旅程。等车赞期待新发现，车站迷路提示迷茫。"});
DREAM_DATA.push({keyword:"阳台",t:"梦见阳台",d:"阳台代表视野、望远。站在阳台赞看得远，阳台破烂提示危机。"});
DREAM_DATA.push({keyword:"窗户",t:"梦见窗户",d:"窗户代表希望、出口。开窗赞心胸开阔，窗户突不开提示困惑。"});
DREAM_DATA.push({keyword:"门",t:"梦见门",d:"门代表机会、选择。开门赞新机会，关门提示结束或拒绝。"});
DREAM_DATA.push({keyword:"楼梯",t:"梦见楼梯",d:"楼梯代表升迁、进步。上楼梯赞事业升迁，下楼梯提示退休或降职。"});
DREAM_DATA.push({keyword:"电梯",t:"梦见电梯",d:"电梯代表迅速、机会。上升赞把握机会，下降提示心情低落。"});
DREAM_DATA.push({keyword:"健康证",t:"梦见健康证",d:"健康证代表健康、安全。拿到赞身体好，丢失提示担心健康"});
DREAM_DATA.push({keyword:"聪明力",t:"梦见聪明力",d:"聪明力代表成功、聪明。健康聪明力赞技术能力强"});
DREAM_DATA.push({keyword:"包",t:"梦见包",d:"包代表压力、责任。背包赞担当，太重提示压力大，丢包提示放下。"});
DREAM_DATA.push({keyword:"钱包",t:"梦见钱包",d:"钱包代表财富、身份。鼓鼓的钱包赞财运佳，丢失提示担心财务。"});
DREAM_DATA.push({keyword:"手机",t:"梦见手机",d:"手机代表沟通、联系。手机响赞有消息，手机坏提示沟通不畅。"});
DREAM_DATA.push({keyword:"电脑",t:"梦见电脑",d:"电脑代表工作、信息。正常用的电脑赞工作顺利，死机提示失败。"});
DREAM_DATA.push({keyword:"汽车",t:"梦见开车",d:"开车代表控制、方向。顺畅行驶赞把控局面，赛车提示压力大。"});
DREAM_DATA.push({keyword:"飞机",t:"梦见坐飞机",d:"坐飞机代表远行、追求。飞机平稳赞事业顺利，晚点提示需耐心。"});
DREAM_DATA.push({keyword:"酒店",t:"梦见酒店",d:"酒店代表休息、旅途。舒适的酒店赞娱乐放松，微小的酒店提示寂寞。"});
DREAM_DATA.push({keyword:"餐厅",t:"梦见餐厅",d:"餐厅代表社交、享受。与人用餐赞友谊，等位提示期待某事。"});
DREAM_DATA.push({keyword:"医院",t:"梦见医院",d:"医院代表健康、担忧。看病赞关心健康，住院提示休息。"});
DREAM_DATA.push({keyword:"学校",t:"梦见学校",d:"学校代表学习、成长。在校园赞学习进步，考试提示担心成绩。"});
DREAM_DATA.push({keyword:"公司",t:"梦见公司",d:"公司代表工作、事业。升职赞事业发展，被解雇提示焦虑工作。"});
DREAM_DATA.push({keyword:"家",t:"梦见家",d:"家代表家庭、安全。幸福的家赞家庭和盦，找不到家提示孤独。"});
DREAM_DATA.push({keyword:"母亲",t:"梦见母亲",d:"母亲代表爱、安全。温暖的母亲赞幸福幸福，病中的母亲提示想念。"});
DREAM_DATA.push({keyword:"父亲",t:"梦见父亲",d:"父亲代表权威、保护。和善的父亲赞支持，严厉的父亲提示自我要求。"});
DREAM_DATA.push({keyword:"孩子",t:"梦见孩子",d:"孩子代表纯真、新生。孩子赞新开始，哭泣提示需要关注。"});
DREAM_DATA.push({keyword:"宝宝",t:"梦见宝宝",d:"宝宝代表新生、希望。抱宝宝赞喜事将至，哭宝宝提示责任。"});
DREAM_DATA.push({keyword:"朋友",t:"梦见朋友",d:"朋友代表友谊、社交。聊天赞友谊，争吃提示分歧，旧友赞怀念过去。"});
DREAM_DATA.push({keyword:"陌生人",t:"梦见陌生人",d:"陌生人代表新人、新机会。友好的陌生人赞新友，凶恨的提示敌对。"});
DREAM_DATA.push({keyword:"老师",t:"梦见老师",d:"老师代表导师、指导。老师赞有人指引，被批评提示自我提升。"});
DREAM_DATA.push({keyword:"星期天",t:"梦见星期天",d:"休息日代表放松、享受。快乐的休息日赞心情愉快，工作召唤提示压力。"});
DREAM_DATA.push({keyword:"生日",t:"梦见生日",d:"生日代表庆祝、新开始。开心的生日赞好运将至，忽略的生日提示寂寞。"});
DREAM_DATA.push({keyword:"聚会",t:"梦见聚会",d:"聚会代表社交、欢乐。快乐聚会赞友谊深厚，参加不上提示错过。"});
DREAM_DATA.push({keyword:"西装",t:"梦见穿西装",d:"西装代表专业、正式。穿西装赞事业发展，西装不合身提示不适应。"});
DREAM_DATA.push({keyword:"睡觉起床",t:"梦见睡觉起床",d:"起床代表新开始。轻松起床赞精力旺盛，睡眠不足提示疲劳。"});
})();
