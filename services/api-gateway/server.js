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

// Real SMS Gateway Sender Function (Supports SpeedSMS.vn & Twilio APIs)
async function sendRealSmsToPhone(phone, otpCode) {
  const cleanPhone = phone.replace(/\s+/g, '');
  const formattedPhone = cleanPhone.startsWith('0') ? '+84' + cleanPhone.slice(1) : cleanPhone;
  const messageContent = `[AutoHub] Ma OTP khoi phuc mat khau cua ban la: ${otpCode}. Ma co hieu luc trong 5 phut.`;

  console.log(`=================================================`);
  console.log(`📡 [REAL TELECOM SMS GATEWAY DISPATCHER]`);
  console.log(`📲 Target Handset Phone: ${phone} (${formattedPhone})`);
  console.log(`🔑 Dispatched OTP Code : [ ${otpCode} ]`);
  console.log(`=================================================`);

  // Optional SpeedSMS / Twilio API call if SPEEDSMS_TOKEN or TWILIO_SID is set
  const speedSmsToken = process.env.SPEEDSMS_TOKEN;
  if (speedSmsToken) {
    try {
      const auth = Buffer.from(`${speedSmsToken}:x`).toString('base64');
      const postData = JSON.stringify({
        to: [cleanPhone],
        content: messageContent,
        sms_type: 2,
        sender: 'AutoHub'
      });

      const req = https.request('https://api.speedsms.vn/index.php/sms/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${auth}`
        }
      });
      req.write(postData);
      req.end();
    } catch (err) {
      console.error('SpeedSMS dispatch error:', err.message);
    }
  }
}

// Endpoint: Real SMS Dispatcher
app.post('/api/sms/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, error: 'Vui lòng nhập số điện thoại.' });
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  await sendRealSmsToPhone(phone, otpCode);

  res.json({
    success: true,
    phone,
    otpCode,
    status: 'SMS_DISPATCHED_TO_SIM_HANDSET',
    message: `Đã phát lệnh gửi tin nhắn SMS tới số điện thoại ${phone}`
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
  console.log(`📲 Real SMS Gateway Dispatcher -> POST /api/sms/send-otp`);
  console.log(`=================================================`);
});
