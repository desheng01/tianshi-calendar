var LANG={zh:{},en:{}};
var T={
"tab-day":["\u62e9\u5409\u65e5","Auspicious Days"],
"tab-today":["\u4eca\u65e5\u9ec4\u5386","Daily Almanac"],
"tab-zodiac":["\u751f\u8096\u8fd0\u52bf","Zodiac Fortune"],
"tab-bazi":["\u516b\u5b57\u6392\u76d8","BaZi Chart"],
"tab-know":["\u5173\u4e8e","About"],
"tab-dream":["\u5468\u516c\u89e3\u68a6","Dream Dictionary"],
"tab-name":["\u8d77\u540d","Name Suggestion"],
"tab-price":["\u670d\u52a1\u4e0e\u4ef7\u683c","Services & Pricing"],
"guide-title":["\u4f7f\u7528\u6307\u5bfc","How to Use"],
"guide-text":["\u2460 \u9009\u4e8b\u9879 \u2192 \u2461 \u770b\u5409\u65e5 \u2192 \u2462 \u70b9\u65e5\u671f","Select event \u2192 View days \u2192 Click date"],
"auspicious":["\u5927\u5409","Auspicious"],
"good":["\u5409","Good"],
"fair":["\u5e73","Fair"],
"avoid":["\u4e0d\u5b9c","Avoid"],
"prev":["\u4e0a\u6708","Prev"],
"next":["\u4e0b\u6708","Next"],
"bazi-btn":["\u5f00\u59cb\u6392\u76d8","Calculate"],
"dream-btn":["\u641c\u7d22","Search"],
"name-btn":["\u5f00\u59cb\u8d77\u540d","Generate Names"],
"buy":["\u7acb\u5373\u8d2d\u4e70","Buy Now"],
"preview":["\u514d\u8d39\u9884\u89c8","Free Preview"]
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
  if(btn) btn.textContent=currentLang==="zh"?"\u4e2d/EN":"EN/\u4e2d";
}