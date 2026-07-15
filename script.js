
// Global error handler for debugging

// Register service worker for PWA
if('serviceWorker'in navigator){
  navigator.serviceWorker.register('/sw.js').catch(function(){});
}

window.onerror = function(msg, url, line, col, error) {
    var banner = document.createElement('div');
    banner.id = 'js-error-banner';
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:#AF2020;color:#fff;padding:10px 20px;font-size:13px;text-align:center;font-family:sans-serif;';
    banner.innerHTML = '<strong>JS Error: </strong>' + msg + ' <span style="font-size:11px;opacity:0.8;">(line ' + line + ':' + col + ')</span> <button onclick="this.parentElement.remove()" style="margin-left:10px;background:transparent;border:1px solid rgba(255,255,255,0.5);color:#fff;border-radius:4px;padding:2px 8px;cursor:pointer;">X</button>';
    if(document.body) document.body.prepend(banner);
    console.error('JS Error:', msg, 'at', line + ':' + col);
    return false;
};

window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXXX');


// ============================================================
// 天时 · 核心算法
// ============================================================

// ---- Constants ----
const TG = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const DZ = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
const SX = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
const JC = ['建','除','满','平','定','执','破','危','成','收','开','闭'];
const JC_S = {建:0,除:2,满:1,平:0,定:2,执:-1,破:-2,危:1,成:2,收:1,开:2,闭:-1};
const XIU = ['角','亢','氐','房','心','尾','箕','斗','牛','女','虚','危','室','壁','奎','娄','胃','昴','毕','觜','参','井','鬼','柳','星','张','翼','轸'];
const XIU_J = {角:1,亢:-1,氐:1,房:1,心:-1,尾:1,箕:1,斗:1,牛:-1,女:-1,虚:-1,危:1,室:1,壁:1,奎:1,娄:1,胃:1,昴:-1,毕:1,觜:-1,参:1,井:1,鬼:-1,柳:-1,星:1,张:1,翼:-1,轸:1};
const ELEM = {0:'水',1:'土',2:'木',3:'木',4:'火',5:'火',6:'土',7:'金',8:'金',9:'土'};
const ELEM_DZ = {0:'水',1:'土',2:'木',3:'木',4:'火',5:'火',6:'火',7:'土',8:'金',9:'金',10:'土',11:'水'};
const ELEM_COLORS = {金:'#D4A030',木:'#2A7A3A',水:'#2A5A8A',火:'#AF2020',土:'#B08040'};
const WU_XING = ['金','木','水','火','土'];

// Hidden stems (藏干) for each earthly branch
const CANG_GAN = {
  0:[9],1:[7,9,1],2:[2,4,7],3:[3],4:[7,3,9],5:[4,7,6],
  6:[4,7],7:[7,4,3],8:[8,9,7],9:[8],10:[7,8,4],11:[9,2]
};

// Lunar data 1900-2100
const LD = [0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
0x06566,0x0d4a0,0x0ea50,0x16a95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,
0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,
0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x05ac0,0x0ab60,0x096d5,0x092e0,
0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06aa0,0x1a6c4,0x0aae0,
0x092e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a4d0,0x0d150,0x0f252,
0x0d520];

const LMN = ['','正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','冬月','腊月'];
const LDN = ['','初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
  '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
  '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
const PURPOSE_NAMES = {wedding:'结婚',move:'搬家',house:'入宅',open:'开业',travel:'出行',sign:'签约',ground:'动土',worship:'祭祀',burial:'安葬'};

const SHICHEN = [
  {name:'子时',start:'23:00',end:'01:00',idx:0},
  {name:'丑时',start:'01:00',end:'03:00',idx:1},
  {name:'寅时',start:'03:00',end:'05:00',idx:2},
  {name:'卯时',start:'05:00',end:'07:00',idx:3},
  {name:'辰时',start:'07:00',end:'09:00',idx:4},
  {name:'巳时',start:'09:00',end:'11:00',idx:5},
  {name:'午时',start:'11:00',end:'13:00',idx:6},
  {name:'未时',start:'13:00',end:'15:00',idx:7},
  {name:'申时',start:'15:00',end:'17:00',idx:8},
  {name:'酉时',start:'17:00',end:'19:00',idx:9},
  {name:'戌时',start:'19:00',end:'21:00',idx:10},
  {name:'亥时',start:'21:00',end:'23:00',idx:11}
];

// ---- Utility ----
function daysBetween(a,b){return Math.round((b-a)/86400000);}

// ---- Lunar ----
function g2l(year,month,day){
  if(year<1900||year>2100)return null;
  let base=new Date(1900,0,31);
  let target=new Date(year,month-1,day);
  let offset=daysBetween(base,target);
  if(offset<0)return null;
  let ly,lm,ld,isLeap=false,yd;
  for(ly=1900;ly<2101;ly++){
    yd=LD[ly-1900];let dy=0;
    for(let i=0;i<12;i++)dy+=(yd&(1<<i))?30:29;
    let leap=(yd>>12)&0x0F;
    if(leap>0)dy+=(yd>>16)&0x01?30:29;
    if(offset<dy)break;offset-=dy;
  }
  if(ly>2100)return null;
  let leapM=(yd>>12)&0x0F,leapD=(yd>>16)&0x01?30:0;
  for(lm=1;lm<=12;lm++){
    let dim=(yd&(1<<(lm-1)))?30:29;
    if(offset<dim)break;offset-=dim;
    if(lm===leapM){if(offset<leapD){isLeap=true;break;}offset-=leapD;}
  }
  if(lm>12)lm=12;
  ld=offset+1;
  return {year:ly,month:lm,day:ld,isLeap};
}
function fmtLunar(l){
  if(!l)return '—';
  return (l.isLeap?'闰':'')+LMN[l.month]+LDN[l.day];
}

// ---- Solar-term month branch ----
function getMonthBranch(y,m,d){
  const cutoff=[
    {m:2,d:4,b:2},{m:3,d:6,b:3},{m:4,d:5,b:4},{m:5,d:6,b:5},
    {m:6,d:6,b:6},{m:7,d:7,b:7},{m:8,d:8,b:8},{m:9,d:8,b:9},
    {m:10,d:8,b:10},{m:11,d:7,b:11},{m:12,d:7,b:0},{m:1,d:6,b:1}
  ];
  let fb=null;
  for(let c of cutoff){if(m>c.m||(m===c.m&&d>=c.d))fb=c.b;}
  if(fb===null)fb=1;
  return fb;
}

// ---- Gan-Zhi ----
function yGz(year){
  let s=(year-4)%10;if(s<0)s+=10;
  let b=(year-4)%12;if(b<0)b+=12;
  return {s,b,t:TG[s]+DZ[b]};
}
function mGz(year,month,day){
  let bIdx=getMonthBranch(year,month,day);
  let ys=(year-4)%10;if(ys<0)ys+=10;
  const mss=[2,4,6,8,0,2,4,6,8,0];
  let off=(bIdx-2+12)%12;
  let sIdx=(mss[ys]+off)%10;
  return {s:sIdx,b:bIdx,t:TG[sIdx]+DZ[bIdx]};
}
function dGz(year,month,day){
  let ref=new Date(1900,0,1);
  let t=new Date(year,month-1,day);
  let d=daysBetween(ref,t);
  let idx=((d%60)+60+10)%60;
  return {s:idx%10,b:idx%12,idx,t:TG[idx%10]+DZ[idx%12]};
}
// Hour Gan-Zhi (五鼠遁)
function hGz(dayStem,hourBranch){
  if(hourBranch<0)return null;
  const startStem=[0,2,4,6,8]; // 甲己→甲,乙庚→丙,丙辛→戊,丁壬→庚,戊癸→壬
  let sIdx=(startStem[dayStem%5]+hourBranch)%10;
  return {s:sIdx,b:hourBranch,t:TG[sIdx]+DZ[hourBranch]};
}
function hourToBranch(hour){
  if(hour<0||hour>23)return -1;
  if(hour===23||hour===0)return 0; // 子
  return Math.floor((hour+1)/2)%12; // 1-2→丑[1], 3-4→寅[2], etc.
}

// ---- JianChu ----
function jianChuInfo(year,month,day,dzB){
  let mb=getMonthBranch(year,month,day);
  let off=(dzB-mb+12)%12;
  let name=JC[off];
  return {idx:off,name,score:JC_S[name]||0};
}
function chongSha(db){let cb=(db+6)%12;return{text:'冲'+SX[cb],zodiac:SX[cb]};}
function getXiu(d){
  let ref=new Date(1900,0,1);
  let day=daysBetween(ref,d);
  let idx=((day%28)+28)%28;
  return {idx,name:XIU[idx],ji:XIU_J[XIU[idx]]||0};
}
function getRating(jcScore,xiuJi,db){
  let score=jcScore+xiuJi;
  if(db===3||db===9)score+=1;
  if(score>=3)return['大吉',score];
  if(score>=1)return['吉',score];
  if(score>=-1)return['平',score];
  return['凶',score];
}
function getYiJi(purpose,jcName,rating){
  const PMAP={wedding:['嫁娶','订婚'],move:['移徙','入宅'],house:['入宅','安床'],open:['开市','交易'],travel:['出行','赴任'],sign:['签约','交易'],ground:['动土','破土'],worship:['祭祀','祈福'],burial:['安葬','入殓']};
  let items=PMAP[purpose]||PMAP.house;
  let yi=(rating==='大吉'||rating==='吉')?[...items]:[];
  let ji=[];
  if(jcName==='破')ji.push('破日-诸事不宜');
  if(jcName==='闭')ji.push('闭日-不宜大事');
  if(rating==='凶')ji.push('凶日-宜静不宜动');
  if(ji.length===0)ji.push('无特别忌讳');
  return {yi,ji};
}

// ---- Full Day Calc ----
function calcDay(y,m,d,purpose){
  let date=new Date(y,m-1,d);
  let l=g2l(y,m,d);
  let yg=yGz(y),mg=mGz(y,m,d),dg=dGz(y,m,d);
  let jc=jianChuInfo(y,m,d,dg.b),cs=chongSha(dg.b),xiu=getXiu(date);
  let [r,sc]=getRating(jc.score,xiu.ji,dg.b);
  let yj=getYiJi(purpose,jc.name,r);
  return{date,dateStr:y+'年'+m+'月'+d+'日',dow:['日','一','二','三','四','五','六'][date.getDay()],
    fl:l?fmtLunar(l):'—',yg:yg.t,mg:mg.t,dg:dg.t,sx:SX[dg.b],jc:jc.name,cs:cs.text,xiu:xiu.name,r,sc,
    yi:yj.yi,ji:yj.ji,dgB:dg.b,dgS:dg.s};
}

// ---- Shichen (hourly periods) for a day ----
function calcShichen(year,month,day){
  let dg=dGz(year,month,day);
  return SHICHEN.map(function(sh){
    let hg=hGz(dg.s,sh.idx);
    let text=hg?hg.t+' '+sh.name:sh.name;
    // Simple scoring: 子午卯酉 slightly better; check element
    let shScore=1; // default 平
    let scEl=sh.idx%2===0?1:0; // even index: 吉, odd: 平
    if(sh.idx===0||sh.idx===6)scEl=2; // 子午: 吉+
    if(sh.idx===3||sh.idx===9)scEl=2; // 卯酉: 吉+
    if(shScore+scEl>=3)return {...sh,text,grade:'吉',cls:'sh-ji'};
    if(shScore+scEl>=1)return {...sh,text,grade:'平',cls:'sh-ping'};
    return {...sh,text,grade:'凶',cls:'sh-xiong'};
  });
}

// ---- Zodiac Fortune ----
function getZodiacFortune(dayBranch){
  // Six harmonies (六合): [0,1],[2,11],[3,10],[4,9],[5,8],[6,7]
  const liuHe=[[0,1],[2,11],[3,10],[4,9],[5,8],[6,7]];
  // Three harmonies groups (三合)
  const sanHe=[[0,4,8],[1,5,9],[2,6,10],[3,7,11]];
  // Punishments (相刑) simplified
  const xing=[[0,3],[1,1],[2,4],[4,2],[5,5],[6,6],[7,7],[8,8],[9,9],[10,10],[11,11]];
  
  const FORTUNE_TEXTS_GOOD = [
    '今日运势旺盛，贵人相助，诸事顺遂，宜把握良机。',
    '运势上扬，心想事成，人际关系和谐，适合社交活动。',
    '吉星高照，事业有进展，财运不错，可积极进取。',
    '贵人运佳，工作顺利，感情融洽，是愉快的一天。'
  ];
  const FORTUNE_TEXTS_MID = [
    '运势平稳，无大喜大忧，按计划行事即可。',
    '平平淡淡，宜静不宜动，适合整理内务。',
    '小有波动，但无大碍，保持平常心即可。',
    '稍显平淡，建议多关注自身，少管闲事。'
  ];
  const FORTUNE_TEXTS_LOW = [
    '今日运势欠佳，宜低调行事，谨言慎行。',
    '犯冲之日，注意口舌是非，不宜做重大决定。',
    '运势低迷，诸事不宜冒进，保守为上。',
    '星宿不利，建议放缓节奏，多些耐心。'
  ];
  
  return SX.map(function(_,i){
    let score=3;
    // Six harmonies: +2
    for(let h of liuHe){if((h[0]===dayBranch&&h[1]===i)||(h[0]===i&&h[1]===dayBranch)){score+=2;break;}}
    // Three harmonies: +1
    for(let g of sanHe){if(g.includes(dayBranch)&&g.includes(i)){score+=1;break;}}
    // Six conflicts (六冲): -2
    if((dayBranch+6)%12===i)score-=2;
    // Punishment: -1
    for(let x of xing){if(x[0]===dayBranch&&x[1]===i){score-=1;break;}}
    if(xing.some(x=>(x[0]===i&&x[1]===dayBranch)))score-=1;
    
    // Element support/restraint
    let dayEl=ELEM_DZ[dayBranch];
    let zodEl=ELEM_DZ[i];
    let elemScore=0;
    if(dayEl===zodEl)elemScore=1;
    else if((dayEl==='木'&&zodEl==='水')||(dayEl==='火'&&zodEl==='木')||
            (dayEl==='土'&&zodEl==='火')||(dayEl==='金'&&zodEl==='土')||
            (dayEl==='水'&&zodEl==='金'))elemScore=1;
    score+=elemScore;
    
    let stars,grade,texts;
    if(score>=5){stars='★★★★★';grade='大吉';texts=FORTUNE_TEXTS_GOOD;}
    else if(score>=4){stars='★★★★☆';grade='吉';texts=FORTUNE_TEXTS_GOOD;}
    else if(score===3){stars='★★★☆☆';grade='平';texts=FORTUNE_TEXTS_MID;}
    else if(score===2){stars='★★☆☆☆';grade='平';texts=FORTUNE_TEXTS_MID;}
    else {stars='★☆☆☆☆';grade='凶';texts=FORTUNE_TEXTS_LOW;}
    
    // Pick text based on zodiac index to get variety
    let tIdx=(i*7+dayBranch*3)%texts.length;
    
    return {zodiac:SX[i],index:i,score,stars,grade,text:texts[tIdx],top:score>=5,good:score>=4,low:score<=1};
  });
}

// ===== BaZi (八字) Computation =====
function computeBazi(year,month,day,hour,gender){
  let yg=yGz(year);
  let mg=mGz(year,month,day);
  let dg=dGz(year,month,day);
  let hb=hourToBranch(hour);
  let hg=hGz(dg.s,hb);
  
  // Hidden stems for each pillar's branch
  let yCg=CANG_GAN[yg.b]||[];
  let mCg=CANG_GAN[mg.b]||[];
  let dCg=CANG_GAN[dg.b]||[];
  let hCg=hg?CANG_GAN[hg.b]||[]:[];
  
  function fmtCang(arr){return arr.map(i=>TG[i]).join('');}
  
  // Five element count from 8 characters
  let elemCount={金:0,木:0,水:0,火:0,土:0};
  function countElem(ganArr,zhiArr){
    for(let s of ganArr){let el=ELEM[s];if(el&&elemCount[el]!==undefined)elemCount[el]++;}
    for(let b of zhiArr){let el=ELEM_DZ[b];if(el&&elemCount[el]!==undefined)elemCount[el]++;}
  }
  
  let ganArr=[yg.s,mg.s,dg.s];
  let zhiArr=[yg.b,mg.b,dg.b];
  if(hg){ganArr.push(hg.s);zhiArr.push(hg.b);}
  
  for(let s of ganArr){let el=ELEM[s];if(el)elemCount[el]++;}
  for(let b of zhiArr){let el=ELEM_DZ[b];if(el)elemCount[el]++;}
  
  // Find strongest/weakest
  let maxEl=0,minEl=10,maxElName='',minElName='';
  for(let k of WU_XING){
    if(elemCount[k]>maxEl){maxEl=elemCount[k];maxElName=k;}
    if(elemCount[k]<minEl){minEl=elemCount[k];minElName=k;}
  }
  
  // Day master (日主) analysis
  let dayMaster=TG[dg.s];
  let dayMasterEl=ELEM[dg.s];
  
  // Season based strength
  let monthBranch=mg.b;
  const seasonEl={0:'水',1:'土',2:'木',3:'木',4:'火',5:'火',6:'土',7:'金',8:'金',9:'土',10:'土',11:'水'};
  // In which season is the day master born?
  // 寅卯辰=春(木), 巳午未=夏(火), 申酉戌=秋(金), 亥子丑=冬(水)
  let season='';
  if([2,3,4].includes(monthBranch))season='木';
  else if([5,6,7].includes(monthBranch))season='火';
  else if([8,9,10].includes(monthBranch))season='金';
  else season='水';
  
  let dmStrong=false;
  // Day master is strong when born in its own season or when its element is most abundant
  if(dayMasterEl===season)dmStrong=true;
  if(elemCount[dayMasterEl]>=3)dmStrong=true;
  
  let analysis='日主'+dayMaster+'属'+dayMasterEl+'。';
  if(dmStrong)analysis+='生于'+season+'月，日主偏旺，喜用'+WU_XING.filter(k=>k!==dayMasterEl)[0]+'、'+WU_XING.filter(k=>k!==dayMasterEl)[1]+'调和。';
  else analysis+='生于'+season+'月，日主偏弱，喜用'+dayMasterEl+'补益。';
  
  if(maxElName)analysis+='八字中'+maxElName+'最旺('+elemCount[maxElName]+'个)，';
  if(minElName)analysis+=''+minElName+'最弱('+elemCount[minElName]+'个)。';
  analysis+='五行'+(elemCount[dayMasterEl]>=2?'相对均衡。':'略有偏颇，需后天补益。');
  
  // Personality traits based on day master element
  const PERSONALITY={
    '金':'刚毅果断、意志坚定，有领导力和执行力。',
    '木':'仁慈宽厚、有进取心，善于规划和组织。',
    '水':'智慧通达、善于变通，有艺术气质和洞察力。',
    '火':'热情开朗、有感染力，行动力强、善于交际。',
    '土':'稳重踏实、信守承诺，有包容心和耐心。'
  };
  analysis+='性格倾向：'+dayMasterEl+'日主之人通常'+PERSONALITY[dayMasterEl];
  
  return{
    pillars:[
      {label:'年柱',gan:yg.t,zhi:DZ[yg.b],cang:fmtCang(yCg),el:ELEM[yg.s],ganEl:ELEM[yg.s],zhiEl:ELEM_DZ[yg.b]},
      {label:'月柱',gan:mg.t,zhi:DZ[mg.b],cang:fmtCang(mCg),el:ELEM[mg.s],ganEl:ELEM[mg.s],zhiEl:ELEM_DZ[mg.b]},
      {label:'日柱',gan:dg.t,zhi:DZ[dg.b],cang:fmtCang(dCg),el:ELEM[dg.s],ganEl:ELEM[dg.s],zhiEl:ELEM_DZ[dg.b]},
      {label:'时柱',gan:hg?hg.t:'—',zhi:hg?DZ[hg.b]:'—',cang:hg?fmtCang(hCg):'—',el:hg?ELEM[hg.s]:'—',ganEl:hg?ELEM[hg.s]:'—',zhiEl:hg?ELEM_DZ[hg.b]:'—'}
    ],
    dayMaster:{gan:dayMaster,el:dayMasterEl},
    elemCount,season,
    dmStrong,analysis,
    gender:gender||'M',
    fourPillars:[yg.t,mg.t,dg.t,hg?hg.t:'—']
  };
}

// ===== Today's Almanac =====
function getTodayAlmanac(){
  let now=new Date();
  let y=now.getFullYear(),m=now.getMonth()+1,d=now.getDate();
  let info=calcDay(y,m,d,'house');
  let shichen=calcShichen(y,m,d);
  let l=g2l(y,m,d);
  return{year:y,month:m,day:d,info,shichen,lunar:l};
}


// ============================================================
// 天时 · 界面逻辑
// ============================================================

document.addEventListener('DOMContentLoaded',function(){
  // ---- Tab switching ----
  const tabs=document.querySelectorAll('.tab');
  tabs.forEach(function(t){
    t.addEventListener('click',function(){
      document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(x=>x.classList.remove('active'));
      this.classList.add('active');
      document.getElementById(this.dataset.tab).classList.add('active');
      // Refresh dynamic tabs when shown
      if(this.dataset.tab==='tab-today')renderToday();
      if(this.dataset.tab==='tab-zodiac')renderZodiac();
    });
  });

  // ---- 择吉日 ----
  const pg=document.getElementById('pg');
  const cb=document.getElementById('cb');
  const mt=document.getElementById('mt');
  const pm=document.getElementById('pm');
  const nm=document.getElementById('nm');
  const sb=document.getElementById('sb');
  const dp=document.getElementById('dp');
  const mlist=document.getElementById('mlist');
  
  let sel='house',vy,vm,cache={};
  let now=new Date();vy=now.getFullYear();vm=now.getMonth()+1;
  
  try{let s=localStorage.getItem('ts_purpose');if(s&&PURPOSE_NAMES[s])sel=s;}catch(e){}
  
  pg.addEventListener('click',function(e){
    let b=e.target.closest('.pp');if(!b)return;
    pg.querySelectorAll('.pp').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');sel=b.dataset.p;
    try{localStorage.setItem('ts_purpose',sel);}catch(e){}
    render(vy,vm);
  // Auto-calculate today's BaZi
  setTimeout(function(){
    var calcBtn=document.getElementById('calcBazi');
    if(calcBtn) calcBtn.click();
  }, 500);
  });
  let activeBtn=pg.querySelector('[data-p="'+sel+'"]');
  if(activeBtn)activeBtn.classList.add('active');
  
  pm.addEventListener('click',function(){vm--;if(vm<1){vm=12;vy--;}render(vy,vm);});
  nm.addEventListener('click',function(){vm++;if(vm>12){vm=1;vy++;}render(vy,vm);});
  
  function render(y,m){
    let key=y+'-'+m+'-'+sel;
    if(cache[key]){renderCached(cache[key]);}
    
    let first=new Date(y,m-1,1),last=new Date(y,m,0);
    let total=last.getDate(),fdow=first.getDay();
    let days=[],stats={dj:0,j:0,p:0,x:0};
    
    for(let d=1;d<=total;d++){
      let info=calcDay(y,m,d,sel);
      days.push(info);
      if(info.r==='大吉')stats.dj++;
      else if(info.r==='吉')stats.j++;
      else if(info.r==='平')stats.p++;
      else stats.x++;
    }
    let result={days,y,m,total,fdow,stats};
    cache[key]=result;
    renderCached(result);
  
    // Attach click handlers
    var _tds=document.querySelectorAll('#cb td');
    for(var _i=0;_i<_tds.length;_i++){
      _tds[_i].addEventListener('click',(function(td){
        return function(){
          var ds=td.dataset.ds;if(!ds)return;
          var p=ds.split('-');
          showDetail(parseInt(p[0]),parseInt(p[1]),parseInt(p[2]));
          document.querySelectorAll('#cb td').forEach(function(t){t.classList.remove('sel');});
          td.classList.add('sel');
        };
      })(_tds[_i]));
    }
}
  
  function renderCached(r){
    let li=g2l(r.y,r.m,1);
    mt.innerHTML=r.y+'年'+r.m+'月'+(li?' <small>'+LMN[li.month]+'</small>':'');
    
    // Calendar grid
    let h='<tr>';
    for(let i=0;i<r.fdow;i++)h+='<td class="om"></td>';
    let t=new Date();let ts=t.getFullYear()+'-'+(t.getMonth()+1)+'-'+t.getDate();
    
    r.days.forEach(function(day){
      let d=day.date.getDate(),isT=r.y+'-'+r.m+'-'+d===ts;
      let cls=isT?'tdy':'',dc='cdr ';
      if(day.r==='大吉')dc+='d1';else if(day.r==='吉')dc+='d2';else if(day.r==='平')dc+='d3';else dc+='d4';
      h+='<td class="'+cls+'" data-ds="'+r.y+'-'+r.m+'-'+d+'" data-d="'+d+'" title="'+day.dg+' '+day.jc+' '+day.r+'">'
        +'<div class="cdn">'+d+'</div><div class="cdl">'+(day.fl!=='—'?day.fl.slice(0,2):'-')+'</div><span class="'+dc+'"></span></td>';
      if((r.fdow+d)%7===0&&d<r.total)h+='</tr><tr>';
    });
    let lc=(r.fdow+r.total)%7;
    if(lc!==0)for(let i=lc;i<7;i++)h+='<td class="om"></td>';
    h+='</tr>';
    cb.innerHTML=h;
    
    // Summary
    let pn=PURPOSE_NAMES[sel]||sel;
    sb.innerHTML='<span><span class="d d1"></span>大吉 <b>'+r.stats.dj+'</b></span>'
      +'<span><span class="d d2"></span>吉 <b>'+r.stats.j+'</b></span>'
      +'<span><span class="d d3"></span>平 <b>'+r.stats.p+'</b></span>'
      +'<span><span class="d d4"></span>不宜 <b>'+r.stats.x+'</b></span>'
      +'<span style="margin-left:auto;color:#999;font-size:0.7rem;">'+pn+'</span>';
    
    // Day click
    cb.querySelectorAll('td[data-ds]').forEach(function(td){
      td.addEventListener('click',function(){
        let p=this.dataset.ds.split('-');
        showDetail(parseInt(p[0]),parseInt(p[1]),parseInt(p[2]));
        cb.querySelectorAll('td').forEach(t=>t.classList.remove('sel'));
        this.classList.add('sel');
      });
    });
    
        // Monthly auspicious list
    renderMonthlyList(r);
  }
  
  function renderMonthlyList(r){
    let goodDays=r.days.filter(d=>d.r==='大吉'||d.r==='吉');
    if(goodDays.length===0){mlist.innerHTML='';return;}
    let pn=PURPOSE_NAMES[sel]||sel;
    let html='<h4>'+pn+'吉日一览</h4>';
    goodDays.forEach(function(d){
      let dotCls=d.r==='大吉'?'d1':'d2';
      html+='<div class="ml-item" onclick="switchToDay('+d.date.getFullYear()+','+(d.date.getMonth()+1)+','+d.date.getDate()+')">'
        +'<span class="ml-dot '+dotCls+'"></span>'
        +'<span>'+d.dateStr+' 周'+d.dow+'</span>'
        +'<span style="color:#999;font-size:0.72rem;">'+d.dg+' '+d.jc+'</span>'
        +'<span style="margin-left:auto;color:'+(d.r==='大吉'?'#AF2020':'#D4A030')+';font-weight:600;">'+d.r+'</span>'
        +'</div>';
    });
    mlist.innerHTML=html;
  }
  
  function showDetail(y,m,d){
  y=parseInt(y)||new Date().getFullYear();
  m=parseInt(m)||new Date().getMonth()+1;
  d=parseInt(d)||new Date().getDate();
    let info=calcDay(y,m,d,sel);
    let colors={'大吉':'#AF2020','吉':'#D4A030','平':'#B0A898','凶':'#999'};
    let c=colors[info.r]||'#999';
    
    dp.className='dp op';
    dp.scrollIntoView({behavior:'smooth',block:'nearest'});
    dp.innerHTML='<div class="dh">'
      +'<span class="dd">'+info.dateStr+' 周'+info.dow+'</span>'
      +'<span class="dr" style="background:'+c+'">'+info.r+' ('+info.sc+'分)</span>'
      +'<button class="dc" onclick="closeDP()">X</button></div>'
      +'<div class="db">'
      +'<div class="drw"><span class="dl">农历</span><span>'+info.fl+'</span></div>'
      +'<div class="drw"><span class="dl">年柱</span><span>'+info.yg+'</span></div>'
      +'<div class="drw"><span class="dl">月柱(节气)</span><span>'+info.mg+'</span></div>'
      +'<div class="drw"><span class="dl">日柱</span><span>'+info.dg+'</span></div>'
      +'<div class="drw"><span class="dl">生肖日</span><span>'+info.sx+'</span></div>'
      +'<div class="drw"><span class="dl">建除</span><span>'+info.jc+'</span></div>'
      +'<div class="drw"><span class="dl">廿八宿</span><span>'+info.xiu+'</span></div>'
      +'<div class="drw"><span class="dl">冲煞</span><span>'+info.cs+'</span></div>'
      +'<div class="dyj">'
      +(info.yi.length?info.yi.map(t=>'<span class="ty">宜 '+t+'</span>').join(''):'')
      +(info.ji.length?info.ji.map(t=>'<span class="tj">忌 '+t+'</span>').join(''):'')
      +'</div>'
      +'<div class="dac"><button class="ab" onclick="paidReportFromDetail()">完整报告</button><button class="ab" onclick="copyText('+"'"+info.dateStr+' | '+info.dg+' | '+info.r+"'"+')">复制</button></div>'
      +'</div>';
  }
  
  window.switchToDay=function(y,m,d){
    // Switch to the tab-day tab and navigate to correct month
    document.querySelector('[data-tab="tab-day"]').click();
    // Navigate to correct month
    vy=y;vm=m;
    render(vy,vm);
  // Auto-calculate today's BaZi
  setTimeout(function(){
    var calcBtn=document.getElementById('calcBazi');
    if(calcBtn) calcBtn.click();
  }, 500);
    // After render, find and click the day
    setTimeout(function(){
      let target=document.querySelector('td[data-ds="'+y+'-'+m+'-'+d+'"]');
      if(target)target.click();
    },100);
  };
  
  // Initial render
  render(vy,vm);
  // Auto-calculate today's BaZi
  setTimeout(function(){
    var calcBtn=document.getElementById('calcBazi');
    if(calcBtn) calcBtn.click();
  }, 500);

  // ---- 今日黄历 ----
  function renderToday(){
    let data=getTodayAlmanac();
    let info=data.info;
    let header=document.getElementById('todayHeader');
    let grid=document.getElementById('todayGrid');
    
    header.innerHTML='<span class="ad">'+info.dateStr+'</span>'
      +'<span class="aw">星期'+info.dow+'</span>'
      +'<span class="alunar">'+(data.lunar?fmtLunar(data.lunar):'—')+'</span>';
    
    let colors={'大吉':'#AF2020','吉':'#D4A030','平':'#B0A898','凶':'#999'};
    let c=colors[info.r]||'#999';
    
    let html='<div class="ar"><span class="al">年柱</span><span>'+info.yg+'</span></div>'
      +'<div class="ar"><span class="al">月柱(节气)</span><span>'+info.mg+'</span></div>'
      +'<div class="ar"><span class="al">日柱</span><span>'+info.dg+'</span></div>'
      +'<div class="ar"><span class="al">生肖日</span><span>'+info.sx+'</span></div>'
      +'<div class="ar"><span class="al">建除</span><span>'+info.jc+'</span></div>'
      +'<div class="ar"><span class="al">廿八宿</span><span>'+info.xiu+'</span></div>'
      +'<div class="ar"><span class="al">冲煞</span><span>'+info.cs+'</span></div>'
      +'<div class="ar"><span class="al">吉凶</span><span style="color:'+c+';font-weight:600;">'+info.r+'</span></div>'
      +'<div class="ayiji">'
      +(info.yi.length?info.yi.map(t=>'<span class="ty">宜 '+t+'</span>').join(''):'')
      +(info.ji.length?info.ji.map(t=>'<span class="tj">忌 '+t+'</span>').join(''):'')
      +'</div>'
      +'<div class="sh"><h4>时辰吉凶</h4><div class="sh-grid">'
      +data.shichen.map(function(sh){
        return '<div class="sh-item '+sh.cls+'"><div>'+sh.text+'</div><div class="sh-time">'+sh.start+'-'+sh.end+'</div><div>'+sh.grade+'</div></div>';
      }).join('')
      +'</div></div>';
    
    grid.innerHTML=html;
  }

  // ---- 生肖运势 ----
  function renderZodiac(){
    let now=new Date();
    let y=now.getFullYear(),m=now.getMonth()+1,d=now.getDate();
    let dayInfo=calcDay(y,m,d,sel);
    let fortunes=getZodiacFortune(dayInfo.dgB);
    
    let title=document.getElementById('zdTitle');
    title.textContent=dayInfo.dateStr+'('+dayInfo.sx+'日)十二生肖今日运势';
    
    let grid=document.getElementById('zodiacGrid');
    let html='';
    fortunes.forEach(function(f,i){
      let cls='zc';
      if(f.top)cls+=' z-top';
      else if(f.good)cls+=' z-good';
      else if(f.low)cls+=' z-low';
      
      html+='<div class="'+cls+'" data-idx="'+i+'" onclick="showZodiacDetail('+i+','+y+','+m+','+d+')">'
        +'<div class="z-icon">'+['🐭','🐂','🐯','🐰','🐲','🐍','🐴','🐏','🐵','🐔','🐶','🐷'][i]+'</div>'
        +'<div class="z-name">'+SX[i]+'</div>'
        +'<div class="z-score">'+f.stars+'</div>'
        +'<div class="z-text">'+f.text+'</div>'
        +'</div>';
    });
    grid.innerHTML=html;
  }
  
  window.showZodiacDetail=function(idx,y,m,d){
    let dayInfo=calcDay(y,m,d,sel);
    let fortunes=getZodiacFortune(dayInfo.dgB);
    let f=fortunes[idx];
    let modal=document.getElementById('zodiacModal');
    let icons=['🐭','🐂','🐯','🐰','🐲','🐍','🐴','🐏','🐵','🐔','🐶','🐷'];
    
    modal.className='zm op';
    modal.innerHTML='<div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.4rem;">'
      +'<span style="font-size:1.5rem;">'+icons[idx]+'</span>'
      +'<span style="font-size:1rem;font-weight:600;">'+SX[idx]+'</span>'
      +'<span style="margin-left:auto;color:#D4A030;font-weight:600;">'+f.stars+' '+f.grade+'</span>'
      +'<button style="border:none;background:transparent;font-size:0.9rem;color:#999;cursor:pointer;" onclick="closeZM()">✕</button></div>'
      +'<p>'+f.text+'</p>'
      +'<p style="margin-top:0.4rem;font-size:0.75rem;color:#999;">本日'+dayInfo.dg+'日，与'+SX[idx]+'('+(f.score>=4?'相合':f.score<=2?'相冲':'无冲合')+')，综合评分'+f.score+'分。</p>'
      +'<p style="margin-top:0.3rem;font-size:0.72rem;color:#aaa;">* 供娱乐参考</p>';
  };

  // ---- 八字排盘 ----
  (function initBazi(){
    let yearSel=document.getElementById('baziYear');
    let monthSel=document.getElementById('baziMonth');
    let daySel=document.getElementById('baziDay');
    let hourSel=document.getElementById('baziHour');
    
    // Populate year: 1900-2030
    for(let y=2030;y>=1900;y--){
      let opt=document.createElement('option');
      opt.value=y;opt.textContent=y+'年';
      if(y===1990)opt.selected=true;
      yearSel.appendChild(opt);
    }
    
    // Month
    for(let m=1;m<=12;m++){
      let opt=document.createElement('option');
      opt.value=m;opt.textContent=m+'月';
      monthSel.appendChild(opt);
    }
    
    // Day
    for(let d=1;d<=31;d++){
      let opt=document.createElement('option');
      opt.value=d;opt.textContent=d+'日';
      daySel.appendChild(opt);
    }
    
    // Hour
    hourSel.innerHTML='<option value="-1">未知</option>';
    SHICHEN.forEach(function(sh){
      let opt=document.createElement('option');
      opt.value=sh.idx;opt.textContent=sh.name+' ('+sh.start+'-'+sh.end+')';
      hourSel.appendChild(opt);
    });
    
    // Gender toggle
    let genderBtns=document.querySelectorAll('.bg-opt');
    let gender='M';
    genderBtns.forEach(function(b){
      b.addEventListener('click',function(){
        genderBtns.forEach(x=>x.classList.remove('active'));
        this.classList.add('active');
        gender=this.dataset.g;
      });
    });
    
    // Calculate
    document.getElementById('calcBazi').addEventListener('click',function(){
      let y=parseInt(yearSel.value);
      let m=parseInt(monthSel.value);
      let d=parseInt(daySel.value);
      let h=parseInt(hourSel.value);
      
      if(!y||!m||!d){alert('请选择完整的出生日期');return;}
      
      let result=computeBazi(y,m,d,h,gender);
      displayBazi(result);
    });
  })();
  
  function displayBazi(r){
    let div=document.getElementById('baziResult');
    div.className='br op';
    
    let tableHtml='<table class="bt"><tr><th></th>';
    r.pillars.forEach(function(p){tableHtml+='<th>'+p.label+'</th>';});
    tableHtml+='</tr><tr><td>天干</td>';
    r.pillars.forEach(function(p){tableHtml+='<td class="t-gan">'+p.gan+'</td>';});
    tableHtml+='</tr><tr><td>地支</td>';
    r.pillars.forEach(function(p){tableHtml+='<td class="t-zhi">'+p.zhi+'</td>';});
    tableHtml+='</tr><tr><td>藏干</td>';
    r.pillars.forEach(function(p){tableHtml+='<td style="font-size:0.7rem;">'+p.cang+'</td>';});
    tableHtml+='</tr><tr><td>五行</td>';
    r.pillars.forEach(function(p){tableHtml+='<td><span style="display:inline-block;width:12px;height:12px;border-radius:3px;background:'+(ELEM_COLORS[p.el]||'#999')+';vertical-align:middle;margin-right:0.2rem;"></span>'+p.el+'</td>';});
    tableHtml+='</tr></table>';
    
    // Element bars
    let elemHtml='<div class="be"><div class="be-title">五行统计</div>';
    let maxCount=Math.max(...WU_XING.map(k=>r.elemCount[k]||0),1);
    for(let k of WU_XING){
      let cnt=r.elemCount[k]||0;
      let pct=Math.round(cnt/maxCount*80+10);
      elemHtml+='<div class="be-bar"><span style="width:20px;">'+k+'</span>'
        +'<div class="bar-track"><div class="bar-fill" style="width:'+pct+'%;background:'+ELEM_COLORS[k]+'"></div></div>'
        +'<span class="bar-count">'+cnt+'</span></div>';
    }
    elemHtml+='</div>';
    
    // Analysis
    let analysisHtml='<div class="ba"><p><b>日主：</b>'+r.dayMaster.gan+'('+r.dayMaster.el+')生于'+r.season+'月</p>'
      +'<p><b>四柱：</b>'+r.fourPillars.join(' ')+'</p>'
      +'<p>'+r.analysis+'</p>'
      +'<p style="margin-top:0.4rem;font-size:0.72rem;color:#aaa;">* 本分析仅供文化参考，不构成命理建议。</p></div>';
    
    div.innerHTML=tableHtml+elemHtml+analysisHtml;
  }

  // ---- Init today's tab (load when first shown) ----
  // Pre-render today and zodiac for fast tab switching
  setTimeout(function(){
    renderToday();
    renderZodiac();
  },200);
});



function closeDP(){document.getElementById('dp').className='dp';}
function closeZM(){document.getElementById('zodiacModal').className='zm';}
var _origFuncs={};
wrapPreview('showBaziPreview',showBaziPreview);
wrapPreview('showTimeDetail',showTimeDetail);
wrapPreview('showLuxuryReport',showLuxuryReport);
wrapPreview('openReport',openReport);
function copyText(t){
  navigator.clipboard.writeText('天时 '+t).catch(function(){
  // Dream search Enter key
  var dreamInp=document.getElementById('dreamSearch');
  if(dreamInp){
    dreamInp.addEventListener('keypress',function(e){
      if(e.key==='Enter')searchDream();
    });
    dreamInp.addEventListener('input',function(){
      if(this.value.trim())searchDream();
    });
  }});
}

// ============================================================
// 天时 · 高级功能 (周易 · 合盘 · 姓名 · 报告)
// ============================================================

// ---- 六十四卦 (64 Hexagrams) ----
const HEXAGRAMS = [
  {num:1,name:"乾为天",desc:"乾卦，天行健，君子以自强不息。刚健中正，自强不息。",yi:"关键日，适合开创性大事",ji:"不宜过分张扬"},
  {num:2,name:"坤为地",desc:"坤卦，地势坤，君子以厚德载物。柔顺包容，厚德载物。",yi:"宜稳重保守",ji:"不宜冒进"},
  {num:3,name:"水雷屯",desc:"屯卦，刚柔始交而难生。初创艰难，宜守不宜攻。",yi:"宜积蓄准备",ji:"不宜急于求成"},
  {num:4,name:"山水蒙",desc:"蒙卦，山下有险，险而止。启蒙教育，不宜远行。",yi:"宜学习静思",ji:"不宜出行签约"},
  {num:5,name:"水天需",desc:"需卦，需须也，险在前也。等待时机，不可冒进。",yi:"宜等待观望",ji:"不宜急进"},
  {num:6,name:"天水讼",desc:"讼卦，上刚下险，险而健。争讼之象，宜和解。",yi:"宜调解沟通",ji:"不宜诉讼争斗"},
  {num:7,name:"地水师",desc:"师卦，众也。师出以律，统兵之道。",yi:"宜团队协作",ji:"不宜单打独斗"},
  {num:8,name:"水地比",desc:"比卦，亲辅也。亲比和睦，众人归附。",yi:"宜社交联谊",ji:"不宜独处"},
  {num:9,name:"风天小畜",desc:"小畜卦，柔得位而上下应之。小有积蓄，不宜大事。",yi:"宜积累储蓄",ji:"不宜大额投资"},
  {num:10,name:"天泽履",desc:"履卦，履虎尾，不咥人。谨慎行事，如履薄冰。",yi:"宜按部就班",ji:"不宜冒险"},
  {num:11,name:"地天泰",desc:"泰卦，天地交而万物通。安泰亨通，万事如意。",yi:"百事皆宜",ji:"无"},
  {num:12,name:"天地否",desc:"否卦，天地不交。闭塞不通，宜静不宜动。",yi:"宜修身养性",ji:"不宜开业出行"},
  {num:13,name:"天火同人",desc:"同人卦，与人同也。同心协力，合作共赢。",yi:"宜合作签约",ji:"不宜独断专行"},
  {num:14,name:"火天大有",desc:"大有卦，柔得尊位，大中而上下应之。丰收大有。",yi:"宜开业签约",ji:"宜适度节制"},
  {num:15,name:"地山谦",desc:"谦卦，天道下济而光明。谦逊受益。",yi:"宜谦虚学习",ji:"不宜炫耀"},
  {num:16,name:"雷地豫",desc:"豫卦，利建侯行师。安乐愉悦，顺势而为。",yi:"宜娱乐社交",ji:"不宜过度放纵"},
  {num:17,name:"泽雷随",desc:"随卦，刚来而下柔。随顺时机。",yi:"宜随缘而行",ji:"不宜固执己见"},
  {num:18,name:"山风蛊",desc:"蛊卦，刚上而柔下。整顿治理。",yi:"宜整改修缮",ji:"不宜因循守旧"},
  {num:19,name:"地泽临",desc:"临卦，刚浸而长。面临督导。",yi:"宜监督检查",ji:"不宜放任自流"},
  {num:20,name:"风地观",desc:"观卦，大观在上。观察审视。",yi:"宜观察学习",ji:"不宜轻举妄动"},
  {num:21,name:"火雷噬嗑",desc:"噬嗑卦，颐中有物。排除障碍。",yi:"宜解决问题",ji:"不宜拖延"},
  {num:22,name:"山火贲",desc:"贲卦，山下有火。文饰美化。",yi:"宜装修布置",ji:"不宜过度装饰"},
  {num:23,name:"山地剥",desc:"剥卦，剥落也。剥极必复。",yi:"宜整理清理",ji:"不宜添置新物"},
  {num:24,name:"地雷复",desc:"复卦，七日来复。复兴回归。",yi:"宜重新开始",ji:"不宜半途而废"},
  {num:25,name:"天雷无妄",desc:"无妄卦，刚自外来而为主于内。顺其自然。",yi:"宜顺其自然",ji:"不宜强求"},
  {num:26,name:"山天大畜",desc:"大畜卦，刚健笃实辉光。积蓄力量。",yi:"宜积蓄准备",ji:"不宜急于表现"},
  {num:27,name:"山雷颐",desc:"颐卦，养正也。养生修身。",yi:"宜养生休息",ji:"不宜过度操劳"},
  {num:28,name:"泽风大过",desc:"大过卦，过也。过犹不及。",yi:"宜适度中庸",ji:"不宜走极端"},
  {num:29,name:"坎为水",desc:"坎卦，习坎，重险也。面临险境。",yi:"宜谨慎保守",ji:"不宜涉险"},
  {num:30,name:"离为火",desc:"离卦，明两作。光明照耀。",yi:"宜展示才华",ji:"不宜骄傲自满"},
  {num:31,name:"泽山咸",desc:"咸卦，感也。感应通灵。",yi:"宜感情交流",ji:"不宜冷漠"},
  {num:32,name:"雷风恒",desc:"恒卦，久也。持之以恒。",yi:"宜坚持不懈",ji:"不宜半途而废"},
  {num:33,name:"天山遁",desc:"遁卦，退也。急流勇退。",yi:"宜适时退让",ji:"不宜恋战"},
  {num:34,name:"雷天大壮",desc:"大壮卦，刚以动。势不可挡。",yi:"宜大展宏图",ji:"不宜鲁莽"},
  {num:35,name:"火地晋",desc:"晋卦，明出地上。晋升进步。",yi:"宜求职晋升",ji:"不宜安于现状"},
  {num:36,name:"地火明夷",desc:"明夷卦，明入地中。韬光养晦。",yi:"宜低调隐忍",ji:"不宜出头"},
  {num:37,name:"风火家人",desc:"家人卦，利女贞。家庭和睦。",yi:"宜家庭团聚",ji:"不宜在外奔波"},
  {num:38,name:"火泽睽",desc:"睽卦，乖也。求同存异。",yi:"宜沟通协调",ji:"不宜激化矛盾"},
  {num:39,name:"水山蹇",desc:"蹇卦，难也。知难而进。",yi:"宜知难而进",ji:"不宜退缩逃避"},
  {num:40,name:"雷水解",desc:"解卦，险以动。解脱困境。",yi:"宜解决问题",ji:"不宜制造新问题"},
  {num:41,name:"山泽损",desc:"损卦，损下益上。损有余补不足。",yi:"宜精简节约",ji:"不宜铺张浪费"},
  {num:42,name:"风雷益",desc:"益卦，损上益下。增益进益。",yi:"宜投资学习",ji:"不宜投机取巧"},
  {num:43,name:"泽天夬",desc:"夬卦，决也。果断决策。",yi:"宜决断行动",ji:"不宜犹豫不决"},
  {num:44,name:"天风姤",desc:"姤卦，遇也。不期而遇。",yi:"宜社交相逢",ji:"不宜刻意安排"},
  {num:45,name:"泽地萃",desc:"萃卦，聚也。精英荟萃。",yi:"宜聚会联合",ji:"不宜分散精力"},
  {num:46,name:"地风升",desc:"升卦，柔以时升。步步高升。",yi:"宜进取上升",ji:"不宜固步自封"},
  {num:47,name:"泽水困",desc:"困卦，刚掩也。困顿守志。",yi:"宜坚守待时",ji:"不宜投机"},
  {num:48,name:"水风井",desc:"井卦，木上有水。养人利民。",yi:"宜公益慈善",ji:"不宜索取过度"},
  {num:49,name:"泽火革",desc:"革卦，去故也。变革创新。",yi:"宜改革变化",ji:"不宜守旧"},
  {num:50,name:"火风鼎",desc:"鼎卦，以木巽火。鼎新革故。",yi:"宜创新立新",ji:"不宜墨守成规"},
  {num:51,name:"震为雷",desc:"震卦，震惊百里。临危不乱。",yi:"宜临危不乱",ji:"不宜惊慌失措"},
  {num:52,name:"艮为山",desc:"艮卦，止也。适可而止。",yi:"宜适时停止",ji:"不宜贪得无厌"},
  {num:53,name:"风山渐",desc:"渐卦，女归吉。循序渐进。",yi:"宜稳步前进",ji:"不宜急于求成"},
  {num:54,name:"雷泽归妹",desc:"归妹卦，征凶。归依归宿。",yi:"宜回归本心",ji:"不宜强求"},
  {num:55,name:"雷火丰",desc:"丰卦，明以动。丰盛盈满。",yi:"宜庆祝收获",ji:"不宜得意忘形"},
  {num:56,name:"火山旅",desc:"旅卦，柔得中乎外。旅行漂泊。",yi:"宜出行旅游",ji:"不宜久留"},
  {num:57,name:"巽为风",desc:"巽卦，申命行事。顺势而为。",yi:"宜从善如流",ji:"不宜刚愎自用"},
  {num:58,name:"兑为泽",desc:"兑卦，说也。喜悦明快。",yi:"宜交际言谈",ji:"不宜巧言令色"},
  {num:59,name:"风水涣",desc:"涣卦，风行水上。涣散聚合。",yi:"宜整理思绪",ji:"不宜散漫"},
  {num:60,name:"水泽节",desc:"节卦，苦节不可贞。节制有度。",yi:"宜节制自律",ji:"不宜过度"},
  {num:61,name:"风泽中孚",desc:"中孚卦，信及豚鱼。诚信立身。",yi:"宜守信承诺",ji:"不宜失信"},
  {num:62,name:"雷山小过",desc:"小过卦，小者过而亨。小有过度。",yi:"宜注重细节",ji:"不宜因小失大"},
  {num:63,name:"水火既济",desc:"既济卦，初吉终乱。事已成矣。",yi:"宜收官总结",ji:"不宜开启新程"},
  {num:64,name:"火水未济",desc:"未济卦，无位。事未成时。",yi:"宜继续努力",ji:"不宜放弃"}
];

function getHexagram(dayStem,dayBranch){
  try{
    let idx=(dayStem*6+dayBranch*5+33)%64;
    if(HEXAGRAMS&&HEXAGRAMS[idx])return HEXAGRAMS[idx];
  }catch(e){}
  return {name:'--',num:'?',desc:'暂无卦象',yi:'--',ji:'--'};
}// ---- Compatibility Analysis ----
function computeBaziForDate(y,m,d,h){
  let yg=yGz(y);
  let mg=mGz(y,m,d);
  let dg=dGz(y,m,d);
  let hb=h>=0?hourToBranch(h):-1;
  let hg=hb>=0?hGz(dg.s,hb):null;
  return {year:y,month:m,day:d,hour:h,yg,mg,dg,hg,dayMaster:dg.s,dayMasterEl:ELEM[dg.s]};
}

function computeCompat(){
  // Get form values
  let ay=parseInt(document.getElementById('caY').value);
  let am=parseInt(document.getElementById('caM').value);
  let ad=parseInt(document.getElementById('caD').value);
  let ah=parseInt(document.getElementById('caH').value);
  let by=parseInt(document.getElementById('cbY').value);
  let bm=parseInt(document.getElementById('cbM').value);
  let bd=parseInt(document.getElementById('cbD').value);
  let bh=parseInt(document.getElementById('cbH').value);
  
  let aData=computeBaziForDate(ay,am,ad,ah);
  let bData=computeBaziForDate(by,bm,bd,bh);
  
  // Day master compatibility
  let aEl=aData.dayMasterEl;
  let bEl=bData.dayMasterEl;
  
  let elCompat=0;
  const EL_RELATIONS={
    '金':{生:'水',克:'木',被生:'土',被克:'火'},
    '木':{生:'火',克:'土',被生:'水',被克:'金'},
    '水':{生:'木',克:'火',被生:'金',被克:'土'},
    '火':{生:'土',克:'金',被生:'木',被克:'水'},
    '土':{生:'金',克:'水',被生:'火',被克:'木'}
  };
  
  if(aEl===bEl)elCompat=70; // same element - harmonious
  else if(EL_RELATIONS[aEl].生===bEl||EL_RELATIONS[bEl].生===aEl)elCompat=85; // mutual generation
  else if(EL_RELATIONS[aEl].克===bEl||EL_RELATIONS[bEl].克===aEl)elCompat=40; // conflict
  else elCompat=55; // neutral
  
  // Year branch compatibility (六合三合)
  let ybCompat=0;
  if((aData.yg.b+6)%12===bData.yg.b)ybCompat=30; // six conflict
  else{
    // Check six harmony
    const sixHarmony=[[0,1],[2,11],[3,10],[4,9],[5,8],[6,7]];
    let isHarmony=false;
    for(let h of sixHarmony){
      if((h[0]===aData.yg.b&&h[1]===bData.yg.b)||(h[0]===bData.yg.b&&h[1]===aData.yg.b)){
        isHarmony=true;break;
      }
    }
    ybCompat=isHarmony?90:60;
  }
  
  // Overall score
  let total=Math.round(elCompat*0.5+ybCompat*0.3+Math.random()*10+55);
  total=Math.min(99,Math.max(30,total));
  
  let grade='';
  if(total>=85)grade='上等婚配';
  else if(total>=70)grade='中等婚配';
  else if(total>=55)grade='一般';
  else grade='需要慎重';
  
  let div=document.getElementById('compatResult');
  div.className='cpf-result op';
  div.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">'
    +'<div><b>甲方：</b>'+aData.yg.t+'年 '+aData.mg.t+'月 '+aData.dg.t+'日'+(aData.hg?(' '+aData.hg.t+'时'):'')+'</div>'
    +'<div><b>乙方：</b>'+bData.yg.t+'年 '+bData.mg.t+'月 '+bData.dg.t+'日'+(bData.hg?(' '+bData.hg.t+'时'):'')+'</div>'
    +'</div>'
    +'<div style="text-align:center;padding:0.5rem;background:'+(total>=70?'#EEF4EE':'#FFF5F0')+';border-radius:6px;margin:0.3rem 0;">'
    +'<span style="font-size:1.2rem;font-weight:800;color:'+(total>=70?'#2A7A3A':'#B05020')+';">'+total+'分</span>'
    +'<span style="margin-left:0.5rem;font-size:0.9rem;font-weight:600;">'+grade+'</span>'
    +'</div>'
    +'<p style="font-size:0.75rem;color:#888;margin-top:0.3rem;">* 基于日主五行'+aEl+'与'+bEl+'的'
    +(aEl===bEl?'相同':(EL_RELATIONS[aEl].生===bEl||EL_RELATIONS[bEl].生===aEl)?'相生':'相克')+'关系</p>'
    +'<p style="font-size:0.7rem;color:#aaa;">* Demo版本 · 完整版含姓名分析+详细冲煞</p>';
}

// ---- Populate compatibility form selects ----
(function initCompatForms(){
  let selects=['caY','caM','caD','caH','cbY','cbM','cbD','cbH'];
  for(let s of selects){
    let el=document.getElementById(s);
    if(!el)continue;
    if(s.endsWith('Y')){
      el.innerHTML='';
      for(let y=2030;y>=1950;y--){
        let o=document.createElement('option');
        o.value=y;o.textContent=y+'年';
        if(y===1990||y===1992)o.selected=true;
        el.appendChild(o);
      }
    }else if(s.endsWith('M')){
      el.innerHTML='';
      for(let m=1;m<=12;m++){
        let o=document.createElement('option');
        o.value=m;o.textContent=m+'月';
        el.appendChild(o);
      }
    }else if(s.endsWith('D')){
      el.innerHTML='';
      for(let d=1;d<=31;d++){
        let o=document.createElement('option');
        o.value=d;o.textContent=d+'日';
        el.appendChild(o);
      }
    }else if(s.endsWith('H')){
      el.innerHTML='<option value="-1">未知</option>';
      SHICHEN.forEach(function(sh){
        let o=document.createElement('option');
        o.value=sh.idx;o.textContent=sh.name+' ('+sh.start+'-'+sh.end+')';
        el.appendChild(o);
      });
    }
  }
})();

// ---- Report Generation ----
function openReport(type){
  let almanac=getTodayAlmanac();
  let info=almanac.info;
  let dt=almanac.info.dateStr;
  let targetDate=new Date();
  let y=targetDate.getFullYear(),m=targetDate.getMonth()+1,d=targetDate.getDate();
  
  // If user was looking at a specific date in the calendar, use that
  let selectedTd=document.querySelector('#cb td.sel');
  if(selectedTd){
    let ds=selectedTd.dataset.ds;
    if(ds){
      let parts=ds.split('-');
      y=parseInt(parts[0]);m=parseInt(parts[1]);d=parseInt(parts[2]);
      info=calcDay(y,m,d,'house');
    }
  }
  
  let hexagram=getHexagram(info.dgS,info.dgB); if(!hexagram)hexagram={name:'--',num:'?',desc:'--',yi:'--',ji:'--'};
  let isDeep=(type==='deep');
  
  let subtitle=isDeep?'周易深度报告':'择日报告';
  document.getElementById('rpSubtitle').textContent=info.dateStr+' | '+subtitle;
  
  let html='';
  
  // Section 1: Basic info
  html+='<div class="rp-sec"><h2>基础信息</h2><table>'
    +'<tr><td>日期</td><td>'+info.dateStr+' 星期'+info.dow+'</td></tr>'
    +'<tr><td>农历</td><td>'+info.fl+'</td></tr>'
    +'<tr><td>年柱</td><td>'+info.yg+'</td></tr>'
    +'<tr><td>月柱</td><td>'+info.mg+'</td></tr>'
    +'<tr><td>日柱</td><td>'+info.dg+'</td></tr>'
    +'<tr><td>生肖日</td><td>'+info.sx+'</td></tr>'
    +'<tr><td>建除</td><td>'+info.jc+'</td></tr>'
    +'<tr><td>廿八宿</td><td>'+info.xiu+'</td></tr>'
    +'<tr><td>冲煞</td><td>'+info.cs+'</td></tr>'
    +'<tr><td>综合评分</td><td style="font-weight:600;color:'+(info.r==='大吉'?'#AF2020':info.r==='吉'?'#D4A030':'#999')+'">'+info.r+' ('+info.sc+'分)</td></tr>'
    +'</table></div>';
  
  // Section 2: YiJi
  html+='<div class="rp-sec"><h2>宜忌建议</h2><table>'
    +'<tr><td>宜</td><td>'+(info.yi.length?info.yi.join('、'):'—')+'</td></tr>'
    +'<tr><td>忌</td><td>'+(info.ji.length?info.ji.join('、'):'—')+'</td></tr>'
    +'</table></div>';
  
  // Section 3: Shichen
  let shichen=calcShichen(y,m,d);
  html+='<div class="rp-sec"><h2>时辰吉凶</h2><table>';
  shichen.forEach(function(sh){
    html+='<tr><td>'+sh.name+'</td><td>'+sh.start+'-'+sh.end+'</td><td style="font-weight:600;color:'+(sh.grade==='吉'?'#2A7A3A':'#888')+'">'+sh.grade+'</td></tr>';
  });
  html+='</table></div>';
  
  // Section 4: Hexagram (周易) - deep only
  if(isDeep){
    html+='<div class="rp-sec"><h2>周易卦象</h2><table>'
      +'<tr><td>卦名</td><td style="font-weight:600;font-size:1.05rem">'+hexagram.name+' (第'+hexagram.num+'卦)</td></tr>'
      +'<tr><td>卦辞</td><td>'+hexagram.desc+'</td></tr>'
      +'<tr><td>宜</td><td>'+hexagram.yi+'</td></tr>'
      +'<tr><td>忌</td><td>'+hexagram.ji+'</td></tr>'
      +'</table>'
      +'<p style="font-size:0.75rem;color:#888;margin-top:0.3rem;">* 本日卦象基于日柱天干地支推算，结合当日五行气场。</p></div>';
    
    // Element analysis
    html+='<div class="rp-sec"><h2>五行生克推理</h2><table>'
      +'<tr><td>日主五行</td><td>'+ELEM[info.dgS]+'</td></tr>'
      +'<tr><td>当日旺相</td><td>'+(info.r==='大吉'||info.r==='吉'?'五行调和，气场流通':'五行相滞，宜静不宜动')+'</td></tr>'
      +'<tr><td>建议方位</td><td>'+(info.dgB%2===0?'正东、正南':'正西、正北')+'</td></tr>'
      +'</table></div>';
  }
  
  document.getElementById('rpContent').innerHTML=html;
  document.getElementById('reportPage').className='rp op';
  
  // Scroll to report
  document.getElementById('reportPage').scrollIntoView({behavior:'smooth',block:'start'});
}

// ---- Name Analysis (simplified) ----
function getNameStrokes(char){
  // Simplified 81-number theory mapping
  // In a full version, this would use a proper stroke dictionary
  // For now, we estimate based on Unicode range
  let code=char.charCodeAt(0);
  if(code>=0x4E00&&code<=0x9FFF){
    // Approximate: stroke count based on character complexity
    // This is a placeholder - real implementation needs Kangxi dictionary
    let strokes=((code-0x4E00)%24)+3;
    return Math.max(1,Math.min(strokes,30));
  }
  return 0;
}

function analyzeName(name){
  let totalStrokes=0;
  let charAnalysis=[];
  for(let ch of name){
    let strokes=getNameStrokes(ch);
    totalStrokes+=strokes;
    charAnalysis.push({char:ch,strokes});
  }
  
  // Map total strokes to 81-number theory (simplified)
  let numIndex=(totalStrokes-1)%81+1;
  const NUM_ELEMENTS={
    odd:{金:'刚健',木:'生长',水:'流动',火:'热烈',土:'厚重'},
    even:{金:'内敛',木:'柔韧',水:'深邃',火:'温暖',土:'包容'}
  };
  
  // Determine element from number
  let elem='';
  if([1,2,11,12,21,22,31,32,41,42,51,52,61,62,71,72,81].includes(numIndex))elem='木';
  else if([3,4,13,14,23,24,33,34,43,44,53,54,63,64,73,74].includes(numIndex))elem='火';
  else if([5,6,15,16,25,26,35,36,45,46,55,56,65,66,75,76].includes(numIndex))elem='土';
  else if([7,8,17,18,27,28,37,38,47,48,57,58,67,68,77,78].includes(numIndex))elem='金';
  else elem='水';
  
  return {totalStrokes,numIndex,elem,charAnalysis};
}

function openReportFromDetail(){

  var _selTd=document.querySelector('#cb td.sel');

  var _rp=document.getElementById("reportPage");

  var _rpContent=document.getElementById("rpContent");


function paidReportFromDetail(){
  if(isPaid()){
    openReportFromDetail();
  }else{
    showPaywall();
  }
}
  window.paidReportFromDetail=paidReportFrom
  window.openReportFromDetail=openReportFrom

  // Find the currently selected date in the calendar
  let selTd=document.querySelector('#cb td.sel');
  if(selTd){
    let ds=selTd.dataset.ds;
    if(ds){
      let parts=ds.split('-');
      let y=parseInt(parts[0]),m=parseInt(parts[1]),d=parseInt(parts[2]);
      let info=calcDay(y,m,d,'house');
      let hexagram=getHexagram(info.dgS,info.dgB); if(!hexagram)hexagram={name:'--',num:'?',desc:'--',yi:'--',ji:'--'};
      showReportContent(info,y,m,d,hexagram,false);
      return;
    }
  }
  // Fallback: use today
  let today=getTodayAlmanac();
  let info=today.info;
  let now=new Date();
  let hexagram=getHexagram(info.dgS,info.dgB); if(!hexagram)hexagram={name:'--',num:'?',desc:'--',yi:'--',ji:'--'};
  showReportContent(info,now.getFullYear(),now.getMonth()+1,now.getDate(),hexagram,false);
}
  function paidReportFromDetail(){

  if(isPaid()){
    var rp=document.getElementById("reportPage");
    if(rp){
      rp.className="rp op";
      rp.scrollIntoView({behavior:"smooth"});
      document.getElementById("rpContent").innerHTML="<p style=\"padding:2rem;text-align:center;color:#888\">\u52a0\u8f7d\u4e2d...</p>";
    }
  }
    if(isPaid()){
      openReportFromDetail();
    }else{
      showPaywall();
    }
  }
  window.paidReportFromDetail=paidReportFrom
  window.openReportFromDetail=openReportFrom

function showReportContent(info,y,m,d,hexagram,isDeep){
  let subtitle=isDeep?'周易深度报告':'择日报告';
  document.getElementById('rpSubtitle').textContent=info.dateStr+' | '+subtitle;
  
  let html='';
  html+='<div class="rp-sec"><h2>基础信息</h2><table>'
    +'<tr><td>日期</td><td>'+info.dateStr+' 星期'+info.dow+'</td></tr>'
    +'<tr><td>农历</td><td>'+info.fl+'</td></tr>'
    +'<tr><td>年柱</td><td>'+info.yg+'</td></tr>'
    +'<tr><td>月柱</td><td>'+info.mg+'(节气校准)</td></tr>'
    +'<tr><td>日柱</td><td>'+info.dg+'</td></tr>'
    +'<tr><td>生肖日</td><td>'+info.sx+'</td></tr>'
    +'<tr><td>建除</td><td>'+info.jc+'</td></tr>'
    +'<tr><td>廿八宿</td><td>'+info.xiu+'</td></tr>'
    +'<tr><td>冲煞</td><td>'+info.cs+'</td></tr>'
    +'<tr><td>综合评分</td><td style="font-weight:600;color:'+(info.r==='大吉'?'#AF2020':info.r==='吉'?'#D4A030':'#999')+'">'+info.r+' ('+info.sc+'分)</td></tr>'
    +'</table></div>';
  
  html+='<div class="rp-sec"><h2>宜忌建议</h2><table>'
    +'<tr><td>宜</td><td>'+(info.yi.length?info.yi.join('、'):'尚无专属宜项')+'</td></tr>'
    +'<tr><td>忌</td><td>'+(info.ji.length?info.ji.join('、'):'尚无特别忌讳')+'</td></tr>'
    +'</table></div>';
  
  let sc=calcShichen(y,m,d);
  html+='<div class="rp-sec"><h2>时辰吉凶</h2><table>';
  sc.forEach(function(sh){
    html+='<tr><td>'+sh.name+'</td><td>'+sh.start+'-'+sh.end+'</td><td style="font-weight:600;color:'+(sh.grade==='吉'?'#2A7A3A':'#888')+'">'+sh.grade+'</td></tr>';
  });
  html+='</table></div>';
  
  if(isDeep||true){
    html+='<div class="rp-sec"><h2>周易卦象</h2><table>'
      +'<tr><td>卦名</td><td style="font-weight:600;font-size:1rem">'+hexagram.name+' (第'+hexagram.num+'卦)</td></tr>'
      +'<tr><td>卦辞</td><td>'+hexagram.desc+'</td></tr>'
      +'<tr><td>宜</td><td>'+hexagram.yi+'</td></tr>'
      +'<tr><td>忌</td><td>'+hexagram.ji+'</td></tr>'
      +'</table>'
      +'<p style="font-size:0.72rem;color:#888;margin-top:0.25rem;">* 本日卦象基于日柱干支推算，结合整体气场。</p></div>';
  }
  
  document.getElementById('rpContent').innerHTML=html;
  document.getElementById('reportPage').className='rp op';
  document.getElementById('reportPage').scrollIntoView({behavior:'smooth',block:'start'});
}

// ---- 吉时精选预览 ----
function showTimeDetail(){
  let targetDate=new Date();
  let y=targetDate.getFullYear(),m=targetDate.getMonth()+1,d=targetDate.getDate();
  let selTd=document.querySelector('#cb td.sel');
  if(selTd&&selTd.dataset.ds){
    let parts=selTd.dataset.ds.split('-');
    y=parseInt(parts[0]);m=parseInt(parts[1]);d=parseInt(parts[2]);
  }
  let info=calcDay(y,m,d,'house');
  let shichen=calcShichen(y,m,d);
  
  document.getElementById('rpSubtitle').textContent=info.dateStr+' | 吉时精选';
  let html='<div class="rp-sec"><h2>基本信息</h2><table>';
  html+='<tr><td>日期</td><td>'+info.dateStr+' 周'+info.dow+'</td></tr>';
  html+='<tr><td>农历</td><td>'+info.fl+'</td></tr>';
  html+='<tr><td>日柱</td><td>'+info.dg+'</td></tr>';
  html+='<tr><td>建除</td><td>'+info.jc+'</td></tr>';
  html+='<tr><td>冲煞</td><td>'+info.cs+'</td></tr>';
  html+='<tr><td>综合</td><td>'+info.r+'('+info.sc+'分)</td></tr>';
  html+='</table></div>';
  
  html+='<div class="rp-sec"><h2>十二时辰吉凶详解</h2><table><tr><th>时辰</th><th>时段</th><th>吉凶</th><th>推荐</th></tr>';
  shichen.forEach(function(sh){
    let gd=sh.grade;
    html+='<tr><td>'+sh.text+'</td><td>'+sh.start+'-'+sh.end+'</td>';
    html+='<td style="font-weight:600;color:'+(gd==='吉'?'#2A7A3A':'#888')+'">'+gd+'</td>';
    html+='<td>'+(gd==='吉'?'宜重要活动':'宜休息')+'</td></tr>';
  });
  html+='</table><p style="font-size:0.75rem;color:#888;margin-top:0.3rem;">时辰吉凶综合日主五行与地支关系推算。</p></div>';
  
  // Best times summary
  let best=shichen.filter(function(sh){return sh.grade==='吉';});
  if(best.length>0){
    html+='<div class="rp-sec"><h2>推荐吉时</h2><p>本日最佳时辰为：'+best.map(function(sh){return sh.name;}).join('、')+'。宜将重要活动安排在这些时段。</p></div>';
  }
  
  document.getElementById('rpContent').innerHTML=html;
  document.getElementById('reportPage').className='rp op';
  document.getElementById('reportPage').scrollIntoView({behavior:'smooth',block:'start'});
}

// ---- 择吉豪华包预览 ----
function showLuxuryReport(){
  let targetDate=new Date();
  let y=targetDate.getFullYear(),m=targetDate.getMonth()+1,d=targetDate.getDate();
  let selTd=document.querySelector('#cb td.sel');
  if(selTd&&selTd.dataset.ds){
    let parts=selTd.dataset.ds.split('-');
    y=parseInt(parts[0]);m=parseInt(parts[1]);d=parseInt(parts[2]);
  }
  let info=calcDay(y,m,d,'house');
  let hexagram=getHexagram(info.dgS,info.dgB); if(!hexagram)hexagram={name:'--',num:'?',desc:'--',yi:'--',ji:'--'};
  let shichen=calcShichen(y,m,d);
  
  document.getElementById('rpSubtitle').textContent=info.dateStr+' | 择吉豪华包';
  let html='';
  
  html+='<div class="rp-sec"><h2>基础信息</h2><table>';
  html+='<tr><td>日期</td><td>'+info.dateStr+' 周'+info.dow+'</td></tr>';
  html+='<tr><td>农历</td><td>'+info.fl+'</td></tr>';
  html+='<tr><td>年柱</td><td>'+info.yg+'</td></tr>';
  html+='<tr><td>月柱(节气)</td><td>'+info.mg+'</td></tr>';
  html+='<tr><td>日柱</td><td>'+info.dg+'</td></tr>';
  html+='<tr><td>生肖日</td><td>'+info.sx+'</td></tr>';
  html+='<tr><td>建除</td><td>'+info.jc+'</td></tr>';
  html+='<tr><td>廿八宿</td><td>'+info.xiu+'</td></tr>';
  html+='<tr><td>冲煞</td><td>'+info.cs+'</td></tr>';
  html+='<tr><td>综合评分</td><td style="font-weight:600;color:'+(info.r==='大吉'?'#AF2020':info.r==='吉'?'#D4A030':'#999')+'">'+info.r+'('+info.sc+'分)</td></tr>';
  html+='</table></div>';
  
  html+='<div class="rp-sec"><h2>宜忌建议</h2><table>';
  html+='<tr><td>宜</td><td>'+(info.yi.length?info.yi.join('、'):'尚无专属宜项')+'</td></tr>';
  html+='<tr><td>忌</td><td>'+(info.ji.length?info.ji.join('、'):'尚无特别忌讳')+'</td></tr>';
  html+='</table></div>';
  
  html+='<div class="rp-sec"><h2>十二时辰吉凶</h2><table><tr><th>时辰</th><th>时段</th><th>吉凶</th></tr>';
  shichen.forEach(function(sh){
    html+='<tr><td>'+sh.text+'</td><td>'+sh.start+'-'+sh.end+'</td>';
    html+='<td style="font-weight:600;color:'+(sh.grade==='吉'?'#2A7A3A':'#888')+'">'+sh.grade+'</td></tr>';
  });
  html+='</table></div>';
  
  html+='<div class="rp-sec"><h2>周易卦象</h2><table>';
  html+='<tr><td>卦名</td><td style="font-weight:600">'+hexagram.name+'('+hexagram.num+'卦)</td></tr>';
  html+='<tr><td>卦辞</td><td>'+hexagram.desc+'</td></tr>';
  html+='<tr><td>宜</td><td>'+hexagram.yi+'</td></tr>';
  html+='<tr><td>忌</td><td>'+hexagram.ji+'</td></tr>';
  html+='</table></div>';
  
  html+='<p style="font-size:0.72rem;color:#aaa;margin-top:0.5rem;">* 豪华版含择日+吉时+周易三合一完整报告。</p>';
  
  document.getElementById('rpContent').innerHTML=html;
  document.getElementById('reportPage').className='rp op';
  document.getElementById('reportPage').scrollIntoView({behavior:'smooth',block:'start'});
}

// ---- 八字命理预览 ----
function showBaziPreview(){
  let now=new Date();
  let y=now.getFullYear(),m=now.getMonth()+1,d=now.getDate();
  let result=computeBazi(y,m,d,-1,'M');
  
  document.getElementById('rpSubtitle').textContent=result.fourPillars.join(' ')+' | 八字命理';
  let html='';
  
  html+='<div class="rp-sec"><h2>八字排盘</h2><table><tr><th></th>';
  result.pillars.forEach(function(p){html+='<th>'+p.label+'</th>';});
  html+='</tr><tr><td>天干</td>';
  result.pillars.forEach(function(p){html+='<td style="font-weight:600;color:#AF2020">'+p.gan+'</td>';});
  html+='</tr><tr><td>地支</td>';
  result.pillars.forEach(function(p){html+='<td style="font-weight:600">'+p.zhi+'</td>';});
  html+='</tr><tr><td>藏干</td>';
  result.pillars.forEach(function(p){html+='<td style="font-size:0.72rem">'+p.cang+'</td>';});
  html+='</tr></table></div>';
  
  html+='<div class="rp-sec"><h2>五行统计</h2><table>';
  var wuxing=['金','木','水','火','土'];
  var colors={'金':'#D4A030','木':'#2A7A3A','水':'#2A5A8A','火':'#AF2020','土':'#B08040'};
  var maxCnt=1;
  wuxing.forEach(function(k){var c=result.elemCount[k]||0;if(c>maxCnt)maxCnt=c;});
  wuxing.forEach(function(k){
    var cnt=result.elemCount[k]||0;
    var pct=Math.round(cnt/maxCnt*80+10);
    html+='<tr><td style="width:30px">'+k+'</td>';
    html+='<td><div style="height:12px;width:'+pct+'%;background:'+colors[k]+';border-radius:4px;min-width:4px"></div></td>';
    html+='<td style="width:24px;text-align:right">'+cnt+'</td></tr>';
  });
  html+='</table></div>';
  
  html+='<div class="rp-sec"><h2>命理简析</h2>';
  html+='<p><b>日主：</b>'+result.dayMaster.gan+'属'+result.dayMaster.el+'，生于'+result.season+'月。</p>';
  html+='<p>'+result.analysis+'</p>';
  html+='</div>';
  html+='<p style="font-size:0.7rem;color:#aaa;margin-top:0.3rem;">* 命理分析仅供文化参考。</p>';
  
  document.getElementById('rpContent').innerHTML=html;
  document.getElementById('reportPage').className='rp op';
  document.getElementById('reportPage').scrollIntoView({behavior:'smooth',block:'start'});
}
// ---- 付费解锁功能 ----
function getReportCount(){
  try{return parseInt(localStorage.getItem('js_count'))||0}catch(e){return 0}
}
function setReportCount(n){
  try{localStorage.setItem('js_count',n.toString())}catch(e){}
}
function isPaid(){
  try{return localStorage.getItem('js_paid')==='true'}catch(e){return false}
}
function setPaid(){
  try{localStorage.setItem('js_paid','true')}catch(e){}
}

function wrapPreview(name,fn){
  _origFuncs[name]=fn;
  window[name]=function(){
    if(isPaid()){
      fn();return;
    }
    var c=getReportCount();
    if(c<3){
      setReportCount(c+1);
      fn();
    }else{
      showPaywall();
    }
  };
}


function closePaywall(){setPaid();var el=document.getElementById("paywall-overlay");if(el)el.remove();}
function showPaywall(){
  var html='<div id="paywall-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;">'
    +'<div style="background:#fff;border-radius:12px;padding:2rem;max-width:400px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,0.2);">'
    +'<div style="font-size:2rem;margin-bottom:0.5rem;">🔒</div>'
    +'<h2 style="font-size:1.1rem;color:#2E2E2E;margin-bottom:0.5rem;">免费预览次数已用完</h2>'
    +'<p style="font-size:0.85rem;color:#888;margin-bottom:1rem;">您已使用 3 次免费预览，支付后可继续使用所有报告功能。</p>'
    +'<a href="https://paypal.me/jishinet" target="_blank" style="display:inline-block;padding:0.6rem 2rem;background:#0070BA;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;margin-bottom:0.5rem;">PayPal 支付支持</a>'
    +'<p style="font-size:0.75rem;color:#aaa;margin-bottom:0.3rem;">支付后点击下方按钮解锁</p>'
    +'<button onclick="setPaid();closePaywall();" style="padding:0.4rem 1.5rem;background:#AF2020;color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:0.85rem;">我已支付，解锁</button>'
    +'</div></div>';
  var d=document.createElement('div');
  d.innerHTML=html;
  document.body.appendChild(d.firstElementChild);
}
// ---- 周公解梦数据 ----
var DREAM_DATA = [
{keyword:"水",t:"梦见水",d:"水主财，清澈的水象征财运亨通；浑浊的水预示财运有波折。大水象征大财，细流象征小财。梦见喝水预示健康。"},
{keyword:"蛇",t:"梦见蛇",d:"蛇为小人，梦见蛇暗示身边有人对你不利。但蛇也象征智慧和转变，梦见蛇蜕皮预示新生和蜕变。梦见被蛇追表示有压力。"},
{keyword:"飞",t:"梦见飞",d:"梦见飞翔象征志向远大，渴望自由。在天空中自由飞翔预示事业腾飞；低空飞行则需脚踏实地，不可好高骛远。"},
{keyword:"掉牙",t:"梦见掉牙",d:"掉牙多与亲人健康有关。上牙代表长辈，下牙代表平辈。梦见牙齿脱落可能预示对亲人健康的担忧，或对衰老的恐惧。"},
{keyword:"死人",t:"梦见死人",d:"梦见已故之人多因思念所致。有时死人复活象征事情有转机。梦见自己死亡预示新生或重大转变，并非凶兆。"},
{keyword:"鱼",t:"梦见鱼",d:"鱼象征财富和机遇。梦见抓鱼预示将有好运；梦见鱼在水中游动表示财源广进；梦见鱼跃龙门象征事业突破。"},
{keyword:"血",t:"梦见血",d:"梦见见血有双重含义。对商人而言血象征财运；对普通人而言可能预示身体需要注意。梦见自己流血表示付出。"},
{keyword:"考试",t:"梦见考试",d:"梦见考试多因现实压力所致。考得好预示事情顺利；考不好也不必担心，只是潜意识的反映，提醒多做准备。"},
{keyword:"追",t:"梦见被追",d:"梦见被追赶表示你在逃避某些问题。被追但跑不动代表现实中有压力无法摆脱。正面面对问题可缓解此类梦境。"},
{keyword:"火",t:"梦见火",d:"火有兴旺之意也有危险之意。大火熊熊象征事业兴旺；小火或火灾预示有损失。火也代表热情和能量。"},
{keyword:"雨",t:"梦见雨",d:"雨象征滋润和贵人。细雨蒙蒙贵人相助；大雨滂沱可能有磨难但终将过去。雨过天晴预示困境会解决。"},
{keyword:"桥",t:"梦见桥",d:"桥象征过渡和选择。顺利过桥预示事情顺利；桥断或过不去表示遇到阻碍需要另寻出路。"},
{keyword:"山",t:"梦见山",d:"山既有阻碍之意又有靠山之意。爬山预示努力进取；翻过山岭表示克服困难；站在山顶象征成功。"},
{keyword:"花",t:"梦见花",d:"花象征美好和喜事。花开富贵预示好事将近；花谢表示美好事物逝去。各种花有不同寓意，牡丹象征富贵。"},
{keyword:"孩子",t:"梦见孩子",d:"孩子代表新生和希望。梦见小孩预示新开始；逗小孩玩表示心情愉悦；小孩哭闹可能有烦心事。"},
{keyword:"坟墓",t:"梦见坟墓",d:"坟墓不一定为凶，梦中坟墓有时象征升官发财。坟墓完好表示根基稳固；坟墓破损需要留意。"},
{keyword:"龙",t:"梦见龙",d:"龙象征贵人、权力和好运。梦见龙飞在天预示大吉大利；龙入水表示潜龙勿用，时机未到。"},
{keyword:"老虎",t:"梦见老虎",d:"老虎代表权力和威严。梦见老虎但未被伤害表示有贵人相助；被老虎追表示有压力挑战。打虎象征克服困难。"},
{keyword:"狗",t:"梦见狗",d:"狗象征朋友和忠诚。梦见温顺的狗表示朋友可靠；狗叫可能预示有口舌之争；被狗咬需注意人际关系。"},
{keyword:"猫",t:"梦见猫",d:"猫有时代表小人或女性。温顺的猫表示生活安逸；野猫或猫叫暗示有人背后议论。黑猫象征神秘。"},
{keyword:"猪",t:"梦见猪",d:"猪象征财富和福气。胖猪预示财运亨通；瘦猪表示财运一般。母猪带仔象征家庭和睦。"},
{keyword:"马",t:"梦见马",d:"马象征事业和动力。骑马奔跑预示事业顺利；马停不前表示需要进取。白马象征好运，黑马预示意外之喜。"},
{keyword:"牛",t:"梦见牛",d:"牛象征勤劳和踏实。梦见牛耕田预示辛勤会有回报；牛发怒需要留意工作中的矛盾。牛市象征股市上涨。"},
{keyword:"羊",t:"梦见羊",d:"羊象征吉祥温顺。梦见羊群预示事业发展；羊羔跪乳象征孝道。羊也代表财运，羊大为美。"},
{keyword:"猴子",t:"梦见猴子",d:"猴子象征聪明灵活。梦见猴子表示需要用智慧解决问题。猴子嬉戏预示喜事；猴子上树象征步步高升。"},
{keyword:"鸡",t:"梦见鸡",d:"鸡象征机遇和勤劳。公鸡打鸣预示新的开始；母鸡孵蛋象征孕育和积累。梦见吃鸡表示有口福。"},
{keyword:"鸟",t:"梦见鸟",d:"鸟象征自由和消息。鸟在天空飞翔表示心情愉悦；鸟入笼中表示受束缚。喜鹊报喜，乌鸦有警示之意。"},
{keyword:"月亮",t:"梦见月亮",d:"月亮代表思念和情感。圆月象征团圆和美满；新月代表新的开始；乌云遮月预示感情上的困扰。"},
{keyword:"太阳",t:"梦见太阳",d:"太阳象征光明和父亲。旭日东升预示事业蒸蒸日上；烈日当头有压力但也有成就；日落西山表示需要休息。"},
{keyword:"星星",t:"梦见星星",d:"星星象征希望和远方。星光璀璨预示前途光明；流星划过表示有愿望可以实现。数星星代表对未来的期许。"},
{keyword:"结婚",t:"梦见结婚",d:"结婚不一定意味着真结婚。梦见自己结婚预示人生新阶段；参加别人婚礼表示有喜事。结婚也象征结合与合作。"},
{keyword:"怀孕",t:"梦见怀孕",d:"怀孕象征新思想和创造力的孕育。梦见自己怀孕预示新项目或新计划即将诞生。不一定是真的怀孕。"},
{keyword:"落水",t:"梦见落水",d:"落水代表陷入困境。被人救起表示有人相助；自己游上来表示有能力解决问题。水清则浅，水浊则深。"},
{keyword:"被咬",t:"梦见被咬",d:"被不同动物咬有不同的寓意。被蛇咬需防小人；被狗咬注意朋友关系；被虫咬表示小事烦恼。"},
{keyword:"迷路",t:"梦见迷路",d:"迷路象征人生方向的迷茫。在陌生地方迷路表示对新环境的不适应；找到出路预示问题会解决。"},
{keyword:"厕所",t:"梦见厕所",d:"厕所象征污秽和财运。有人认为梦见厕所是财运将至的征兆，因粪土古代被视为肥料和财富。现代解读更偏向排泄压力。"},
{keyword:"坟墓2",t:"梦见上坟",d:"上坟祭祖表示不忘本，有祖先庇佑。坟墓整洁预示家族兴旺；坟墓荒凉需要注意家庭关系。"},
{keyword:"棺材",t:"梦见棺材",d:"棺材谐音官和财。梦见棺材有升官发财之寓意。棺材完好无损大吉大利，棺材破损则需谨慎。"},
{keyword:"黄金",t:"梦见黄金",d:"黄金象征财富和珍贵。捡到黄金预示意外之财；丢失黄金要注意财物安全。金子的多少代表财富的大小。"},
{keyword:"宝石",t:"梦见宝石",d:"宝石象征珍贵的东西。找到宝石预示有好事；宝石发光表示才华被发现。红宝石热情，蓝宝石理智。"},
{keyword:"数字",t:"梦见数字",d:"数字在梦中有特殊含义。一代表开始，二代表选择，三代表稳定，六代表顺利，八代表发财，九代表长久。"},
{keyword:"学校",t:"梦见学校",d:"学校象征学习和成长。回到学校表示需要补充知识；考试则是压力的体现。教室代表规则和秩序。"},
{keyword:"医院",t:"梦见医院",d:"医院代表健康和疗愈。自己去医院表示关注健康；看望病人表示关心他人。白色的医院象征新生。"},
{keyword:"警察",t:"梦见警察",d:"警察代表规则和权威。被警察抓表示内心有愧疚感；警察帮助表示需要寻求帮助。警车鸣笛表示警告。"},
{keyword:"钱",t:"梦见钱",d:"钱直接代表财富。捡到钱预示财运来临；丢钱要留意支出。钱币的多少代表财富的多少。旧币象征过去的财富。"},
{keyword:"食物",t:"梦见食物",d:"食物象征满足和滋养。丰盛的食物表示生活富足；寻找食物表示某种缺乏。腐烂的食物需留意健康。"},
{keyword:"电话",t:"梦见电话",d:"电话代表沟通和信息。接不到电话表示错过机会；电话打不通表示沟通有障碍。老式电话可能代表怀旧。"},
{keyword:"车",t:"梦见车",d:"车象征事业和生活的前进方向。开车顺利表示事业顺遂；车坏在路上表示遇到阻碍。不同车代表不同身份。"},
{keyword:"船",t:"梦见船",d:"船象征人生旅程。大船平稳预示顺遂；小船摇晃有波折。船在海上航行象征事业正在起航。轮船代表集体出行。"},
{keyword:"雨伞",t:"梦见雨伞",d:"雨伞象征保护和防备。撑伞表示有防备；伞破表示保护不足。送伞有散之意，需结合情境。"},

{keyword:"母亲",t:"梦见母亲",d:"母亲象征安全和家庭。梦见母亲健康安好表示家庭福祥；梦见母亲生病可能是自己对家人的担心。梦见和母亲说话预示有贵人相助。"},
{keyword:"父亲",t:"梦见父亲",d:"父亲象征权威和保护。梦见父亲健在预示事业有成。梦见已故父亲是思念之情，预示家庭安宁。"},
{keyword:"鬼",t:"梦见鬼",d:"梦见鬼往往是压力的反映。被鬼追表示有烦心事；打败鬼预示能克服困难。梦见鬼神也主财运，但需谨慎财物。"},
{keyword:"老板",t:"梦见老板",d:"梦见老板可能反映了工作压力。老板嘉奖预示工作顺利；老板批评需注意人际关系。与老板合作预示事业新机遇。"},
];

function searchDream(){try{
  var q=document.getElementById('dreamSearch').value.trim();
  if(!q){document.getElementById('dreamResults').innerHTML='<p style="color:#999;font-size:0.82rem">请输入梦境关键词</p>';return;}
  var results=DREAM_DATA.filter(function(item){
    return item.t.indexOf(q)>=0||item.keyword.indexOf(q)>=0||item.d.indexOf(q)>=0;
  });
  if(results.length===0){
    document.getElementById('dreamResults').innerHTML='<p style="color:#999;font-size:0.82rem">未找到相关梦境，试试其他关键词</p>';
    return;
  }
  var html='';
  results.forEach(function(item){
    html+='<div class="dr-item"><h3>'+item.t+'</h3><p>'+item.d+'</p></div>';
  });
  document.getElementById('dreamResults').innerHTML=html;}catch(e){console.error('Dream search error:',e)}
}

