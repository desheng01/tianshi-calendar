var LANG={zh:{},en:{}};
var T={
"about-12guardians":["建除十二神 — 黄历每日由十二位值日神轮流掌管：建、除、满、平、定、执、破、危、成、收、开、闭。其中除、定、危、成、开为吉；破、闭为凶。","The 12 Guardians — Each day is governed by one of 12 guardian spirits: Establish, Remove, Full, Balance, Steady, Execute, Break, Danger, Accomplish, Receive, Open, Close. Remove, Steady, Danger, Accomplish, Open are auspicious; Break, Close are inauspicious."],
"about-28mansions":["二十八宿 — 中国古代将黄道分为二十八星宿，每日轮值一宿，各宿有吉凶属性。","The 28 Mansions — Ancient Chinese astronomy divided the ecliptic into 28 lunar mansions, each day governed by one mansion with its own fortune attribute."],
"about-5elements":["五行 — 金、木、水、火、土五种元素，八字中每种元素的多少和强弱决定一个人的先天特质。","Five Elements — Metal, Wood, Water, Fire, Earth. The balance of these elements in a BaZi chart determines one's innate characteristics."],
"about-bazi-title":["关于八字","About BaZi"],
"about-calculation":["月柱根据节气精准计算。时柱根据日干用五鼠遁法推算。二十八宿以公历1900年1月1日为角宿起算。","Month Pillar calculated by solar terms. Hour Pillar derived from Day Stem via the Five Rat method. 28 Mansions calculated from Jan 1, 1900 as Horn Mansion."],
"about-commondreams":["常见梦境解析 — 梦见水象征财运；梦见飞代表志向远大；梦见故人表示思念；梦见蛇暗示小人。解梦需结合梦境细节和梦者现实情况。","Common Dreams — Water symbolizes wealth; Flying represents ambition; Deceased indicate longing; Snake suggests hidden troubles. Context matters."],
"about-contact":["联系方式：","Contact:"],
"about-daymaster":["日主 — 指出生日那天的天干，代表命主自身。日主的五行属性是八字分析的核心。","Day Master — The Heavenly Stem of the birth day represents the self. Its elemental nature is the core of BaZi analysis."],
"about-dayselect-title":["关于择吉","About Day Selection"],
"about-desc":["吉时网致力于传承中华传统文化，提供择吉日、八字命理、周公解梦等传统民俗服务。","JiShi Wang is dedicated to preserving Chinese traditional culture, offering auspicious day selection, BaZi fortune-telling, and Zhou Gong dream interpretation services."],
"about-destiny-title":["关于命理","About Destiny Analysis"],
"about-disclaimer":["本网站提供的内容仅供娱乐参考，不作为任何决策依据。","All content on this website is for entertainment and reference only. Not intended as professional advice."],
"about-dream-title":["关于解梦","About Dream Interpretation"],
"about-dukeofzhou":["周公解梦 — 相传为周公旦所著，是中国古代最著名的梦文化典籍。梦境被视为人与天地沟通的桥梁，不同梦境元素对应不同的预兆与启示。","Zhou Gong Dream Dictionary — Attributed to Duke of Zhou, it is China's most famous dream culture classic. Dreams are seen as bridges between humans and the universe."],
"about-physiognomy":["面相手相 — 相学认为面部和手掌纹路反映命运走向。额头看智慧、眼睛看心性、鼻子看财运、下巴看晚运。","Physiognomy — Facial and palm features reflect destiny. Forehead indicates wisdom, eyes show character, nose represents wealth, chin reveals later years."],
"about-scoring":["评分体系 — 综合建除、二十八宿、日干支三大因素。大吉≥3分，吉≥1分，平≥-1分，不宜<-1分。","Scoring — Combines the 12 Guardians, 28 Mansions, and Day Stem-Branch. Auspicious≥3, Good≥1, Fair≥-1, Avoid<-1."],
"about-zeday":["择日学 — 古代称为选日或择吉，源远流长。黄历择日综合考虑建除、二十八宿、五行生克、冲煞回避等因素。","Day Selection — Known as xuanri or zeji in ancient times. The almanac considers Guardians, Mansions, Five Elements, and zodiac conflicts to select auspicious days."],
"about-zwds":["紫微斗数 — 与八字齐名的传统命理体系，以命宫、身宫为核心，配合十二宫位和百余星曜解读人一生的轨迹。","Zi Wei Dou Shu — Equally renowned as BaZi, this system uses Life Palace and Body Palace as core, with 12 houses and over 100 stars to interpret one's life path."],
"ausp-avoid":["不宜","Avoid"],
"ausp-big":["大吉","Auspicious"],
"auspicious":["大吉","Auspicious"],
"avoid":["不宜","Avoid"],
"bazi-btn":["开始排盘","Calculate"],
"bazi-unknown":["未知","Unknown"],
"buy":["立即购买","Buy Now"],
"dream-btn":["搜索","Search"],
"event-choose":["选择事项","Select Event"],
"fair":["平","Fair"],
"female":["女","Female"],
"good":["吉","Good"],
"guide-text":["选择事项→看吉日→点日期","Select event→View days→Click date"],
"guide-title":["使用指导","How to Use"],
"male":["男","Male"],
"name-btn":["开始起名","Generate Names"],
"next":["下月","Next"],
"prev":["上月","Prev"],
"preview":["免费预览","Free Preview"],
"price-buy":["立即购买","Buy Now"],
"price-preview":["免费预览","Free Preview"],
"price-series-day":["择吉系列","Calendar Reports"],
"price-series-destiny":["命理系列","Destiny Reports"],
"tab-bazi":["八字排盘","BaZi Chart"],
"tab-day":["择吉日","Auspicious Days"],
"tab-dream":["周公解梦","Dream Dictionary"],
"tab-know":["关于","About"],
"tab-name":["起名","Name Suggestion"],
"tab-price":["服务与价格","Services & Pricing"],
"tab-today":["今日黄历","Daily Almanac"],
"tab-zodiac":["生肖运势","Zodiac Fortune"]
};
for(var k in T){LANG.zh[k]=T[k][0];LANG.en[k]=T[k][1];}

var currentLang="zh";
function switchLang(){
  currentLang=currentLang==="zh"?"en":"zh";
  var els=document.querySelectorAll("[data-i18n]");
  for(var i=0;i<els.length;i++){
    var key=els[i].getAttribute("data-i18n");
    if(LANG[currentLang][key]) els[i].textContent=LANG[currentLang][key];
  }
  var btn=document.querySelector(".lang-btn");
  if(btn) btn.textContent=currentLang==="zh"?"中/EN":"EN/中";
}