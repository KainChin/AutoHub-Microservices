const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
const http = require('http');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const CUSTOMER_SERVICE_URL = process.env.CUSTOMER_SERVICE_URL || 'http://localhost:5001';
const SALES_SERVICE_URL = process.env.SALES_SERVICE_URL || 'http://localhost:5002';
const GARAGE_SERVICE_URL = process.env.GARAGE_SERVICE_URL || 'http://localhost:5003';
const PARTS_SERVICE_URL = process.env.PARTS_SERVICE_URL || 'http://localhost:5004';

// Real Telegram Bot Dispatcher Function (Free instant notification to phone handset)
async function sendTelegramMessage(phone, otpCode) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const text = `📩 *[AutoHub OTP Notification]*\n\n📲 *Số điện thoại:* \`${phone}\`\n🔑 *Mã xác thực OTP:* \`${otpCode}\`\n\n⏱ _Mã có hiệu lực trong 5 phút. Vui lòng không chia sẻ với bất kỳ ai!_`;

  console.log(`=================================================`);
  console.log(`📡 [REAL TELEGRAM BOT DISPATCHER]`);
  console.log(`📲 Target Phone: ${phone}`);
  console.log(`🔑 OTP Code    : [ ${otpCode} ]`);
  console.log(`=================================================`);

  if (!botToken || !chatId) return;

  try {
    const postData = JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown'
    });

    const req = https.request(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    });
    req.write(postData);
    req.end();
  } catch (err) {
    console.error('Telegram Dispatch Error:', err.message);
  }
}

// Endpoint: Send OTP via Telegram / Real SMS Dispatcher
app.post('/api/sms/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, error: 'Vui lòng nhập số điện thoại.' });
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  await sendTelegramMessage(phone, otpCode);

  res.json({
    success: true,
    phone,
    otpCode,
    status: 'OTP_DISPATCHED_TO_TELEGRAM_HANDSET',
    message: `Mã OTP đã được gửi đến thiết bị di động (${phone})`
  });
});

// Route Proxying
app.use('/api/customers', proxy(CUSTOMER_SERVICE_URL, {
  proxyReqPathResolver: (req) => '/api/customers' + req.url
}));

app.use('/api/sales', proxy(SALES_SERVICE_URL, {
  proxyReqPathResolver: (req) => '/api/sales' + req.url
}));

app.use('/api/garage', proxy(GARAGE_SERVICE_URL, {
  proxyReqPathResolver: (req) => '/api/garage' + req.url
}));

app.use('/api/parts', proxy(PARTS_SERVICE_URL, {
  proxyReqPathResolver: (req) => '/api/parts' + req.url
}));

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 [API Gateway] Listening on http://localhost:${PORT}`);
  console.log(`📲 Telegram OTP Dispatcher -> POST /api/sms/send-otp`);
  console.log(`=================================================`);
});
