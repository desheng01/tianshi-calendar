const fs = require('fs');
const dir = '/home/admin/tianshi-calendar';

console.log('=== Starting payment update ===');

// 1. Update server.js - add return_url
let server = fs.readFileSync(dir + '/server.js', 'utf8');
const oldOrder = "{ intent: 'CAPTURE', purchase_units: [{ amount: { currency_code: 'USD', value: String(amount) }, description }] }";
const newOrder = "{ intent: 'CAPTURE', purchase_units: [{ amount: { currency_code: 'USD', value: String(amount) }, description }], payment_source: { paypal: { experience_context: { return_url: 'http://47.243.90.125/?payment=success', cancel_url: 'http://47.243.90.125/?payment=cancel', user_action: 'PAY_NOW' } } } }";
server = server.replace(oldOrder, newOrder);
fs.writeFileSync(dir + '/server.js', server);
console.log('1. server.js updated');

// 2. Add payment functions to script.js
const payCode = `

// ===== Real PayPal Payment =====
async function startPayment(amount, name) {
  var btn = event && event.target ? event.target : null;
  if (btn) { btn.textContent = '\u5904\u7406\u4e2d...'; btn.disabled = true; }
  try {
    var r = await fetch('/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amount, description: name })
    });
    var d = await r.json();
    if (d.success && d.approvalUrl) {
      sessionStorage.setItem('pay_order', d.orderId);
      sessionStorage.setItem('pay_amount', String(amount));
      sessionStorage.setItem('pay_name', name);
      window.location.href = d.approvalUrl;
    } else {
      alert('\u521b\u5efa\u8ba2\u5355\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5');
      if (btn) { btn.textContent = '\u7acb\u5373\u8d2d\u4e70'; btn.disabled = false; }
    }
  } catch(e) {
    alert('\u7f51\u7edc\u5f02\u5e38\uff0c\u8bf7\u91cd\u8bd5');
    if (btn) { btn.textContent = '\u7acb\u5373\u8d2d\u4e70'; btn.disabled = false; }
  }
}

// Handle PayPal callback on page load
(function() {
  var p = new URLSearchParams(window.location.search);
  if (p.get('payment') === 'success') {
    var oid = sessionStorage.getItem('pay_order');
    if (oid) {
      fetch('/api/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: oid })
      }).then(function(r) { return r.json(); }).then(function(d) {
        if (d.success) {
          try { localStorage.setItem('js_paid', 'true'); } catch(e) {}
          sessionStorage.removeItem('pay_order');
          sessionStorage.removeItem('pay_amount');
          sessionStorage.removeItem('pay_name');
          var msg = document.createElement('div');
          msg.style.cssText = 'position:fixed;top:40%;left:50%;transform:translate(-50%,-50%);background:#1a8a1a;color:#fff;padding:2rem 3rem;border-radius:12px;z-index:99999;font-size:1.2rem;text-align:center;box-shadow:0 4px 30px rgba(0,0,0,0.5);line-height:2';
          msg.innerHTML = '\u2705 \u652f\u4ed8\u6210\u529f\uff01\u62a5\u544a\u5df2\u89e3\u9501<br><small>\u7a0d\u540e\u81ea\u52a8\u5237\u65b0...</small>';
          document.body.appendChild(msg);
          setTimeout(function() { window.location.href = window.location.pathname; }, 2000);
        }
      });
    }
  }
  if (p.get('payment') === 'cancel') {
    alert('\u652f\u4ed8\u5df2\u53d6\u6d88');
    window.location.href = window.location.pathname;
  }
})();
`;

var script = fs.readFileSync(dir + '/script.js', 'utf8');
script += payCode;
fs.writeFileSync(dir + '/script.js', script);
console.log('2. script.js updated');

// 3. Update index.html
var html = fs.readFileSync(dir + '/index.html', 'utf8');

var replacements = [
  ['https://paypal.me/jishinet/5', "startPayment(5,'\u62e9\u65e5\u57fa\u7840')"],
  ['https://paypal.me/jishinet/15', "startPayment(15,'\u62e9\u65e5\u4e13\u4e1a')"],
  ['https://paypal.me/jishinet/44', "startPayment(44,'\u62e9\u65e5\u8c6a\u534e')"],
  ['https://paypal.me/jishinet/10', "startPayment(10,'\u516b\u5b57\u547d\u7406\u57fa\u7840')"],
  ['https://paypal.me/jishinet/33', "startPayment(33,'\u516b\u5b57\u547d\u7406\u6df1\u5ea6')"],
  ['https://paypal.me/jishinet/50', "startPayment(50,'\u5b9a\u5236\u5408\u76d8')"]
];

for (var i = 0; i < replacements.length; i++) {
  var oldUrl = replacements[i][0];
  var newCall = replacements[i][1];
  var oldLink = 'href="' + oldUrl + '" target="_blank"';
  var newLink = 'onclick="' + newCall + '"';
  html = html.replace(oldLink, newLink);
}

fs.writeFileSync(dir + '/index.html', html);
console.log('3. index.html updated');
console.log('=== Payment update complete ===');
