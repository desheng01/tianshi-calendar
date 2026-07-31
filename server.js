const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
app.use(function(r,_,n){if(r.path.match(/^\/server/))return _.status(404).end();n();});
const PAYPAL_CLIENT_ID = 'AVhq2W4f3mYFFtZcZqYUNvQoowjSAtt8HAX2KdYN8nicGp28iXoSvLEfyNq60OPRY6k-KXYpj8XNnbun';
const PAYPAL_SECRET = 'ENWC9lZCHd8QrO27Uh8xyesiwfbztHuTjwqtOStQvWyLROrhosuzVm85aV_BItJXsMm4AcMk_60iDx8F';
const PAYPAL_API = 'https://api-m.paypal.com';
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
async function getToken() {
  const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_SECRET).toString('base64');
  const r = await fetch(PAYPAL_API + '/v1/oauth2/token', {
    method: 'POST',
    headers: { Accept: 'application/json', Authorization: 'Basic ' + auth, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials'
  });
  return (await r.json()).access_token;
}
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, description = '\u5409\u65f6\u7f51' } = req.body;
    const token = await getToken();
    const r = await fetch(PAYPAL_API + '/v2/checkout/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
      body: JSON.stringify({ intent: 'CAPTURE', purchase_units: [{ amount: { currency_code: 'USD', value: Number(amount).toFixed(2) }, description }] })
    });
    const d = await r.json();
    const url = d.links ? d.links.find(l => l.rel === 'approve').href : null;
    res.json({ success: !!d.id, orderId: d.id || null, approvalUrl: url, status: d.status || 'ERROR' });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});
app.post('/api/capture-order', async (req, res) => {
  try {
    const { orderId } = req.body;
    const token = await getToken();
    const r = await fetch(PAYPAL_API + '/v2/checkout/orders/' + orderId + '/capture', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }
    });
    const d = await r.json();
    if (d.status === 'COMPLETED') {
      const c = d.purchase_units[0].payments.captures[0];
      res.json({ success: true, captureId: c.id, status: d.status, amount: c.amount.value });
    } else { res.json({ success: false, status: d.status }); }
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));
const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log("Server on port " + PORT));
