const express = require('express');
const cors = require('cors');
const app = express();

// PayPal credentials
const PAYPAL_CLIENT_ID = 'AVhq2W4f3mYFFtZcZqYUNvQoowjSAtt8HAX2KdYN8nicGp28iXoSvLEfyNq60OPRY6k-KXYpj8XNnbun';
const PAYPAL_SECRET = 'ENWC9lZCHd8QrO27Uh8xyesiwfbztHuTjwqtOStQvWyLROrhosuzVm85aV_BItJXsMm4AcMk_60iDx8F';
const PAYPAL_API = 'https://api-m.paypal.com';
const FRONTEND_URL = 'https://jishi.today';

app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// Get PayPal access token
async function getPayPalToken() {
  const auth = Buffer.from(PAYPAL_CLIENT_ID + ':' + PAYPAL_SECRET).toString('base64');
  const res = await fetch(PAYPAL_API + '/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Basic ' + auth,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  const data = await res.json();
  return data.access_token;
}

// API: Create PayPal order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, description = '吉时网 · 传统文化报告' } = req.body;
    const token = await getPayPalToken();

    const response = await fetch(PAYPAL_API + '/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: { currency_code: 'USD', value: String(amount) },
          description: description
        }]
      })
    });
    const data = await response.json();
    const approvalUrl = data.links ? data.links.find(l => l.rel === 'approve').href : null;

    res.json({
      success: data.id ? true : false,
      orderId: data.id || null,
      approvalUrl: approvalUrl,
      status: data.status || 'ERROR'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API: Capture PayPal order (called after user approves on PayPal)
app.post('/api/capture-order', async (req, res) => {
  try {
    const { orderId } = req.body;
    const token = await getPayPalToken();

    const response = await fetch(PAYPAL_API + '/v2/checkout/orders/' + orderId + '/capture', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await response.json();

    if (data.status === 'COMPLETED') {
      const capture = data.purchase_units[0].payments.captures[0];
      res.json({
        success: true,
        captureId: capture.id,
        status: data.status,
        amount: capture.amount.value,
        currency: capture.amount.currency_code
      });
    } else {
      res.json({ success: false, status: data.status, details: data });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health check
app.get('/api/health', function (req, res) {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('Jishi backend running on port ' + PORT);
});
