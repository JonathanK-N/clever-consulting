const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname), {
  maxAge: '1d',
  etag: true,
}));

/* ─── CONTACT FORM — RESEND ──────────────────── */
const RESEND_API_KEY   = process.env.RESEND_API_KEY;
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL   || 'contact@cleverconsult.com';
const CONTACT_FROM     = process.env.RESEND_FROM_EMAIL  || 'Clever Consulting <onboarding@resend.dev>';

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

app.post('/api/contact', async (req, res) => {
  if (!RESEND_API_KEY) {
    return res.status(503).json({ ok: false, error: 'not_configured' });
  }

  const { name, email, phone, service, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: 'missing_fields' });
  }

  const subject = `Nouvelle demande${service ? ' — ' + service : ''} — ${name}`;

  const textBody = [
    `Nom : ${name}`,
    `Email : ${email}`,
    phone ? `Téléphone : ${phone}` : null,
    service ? `Service concerné : ${service}` : null,
    '',
    'Message :',
    message,
  ].filter(Boolean).join('\n');

  const htmlBody = `
    <div style="font-family:Arial,sans-serif;font-size:15px;color:#18110A;line-height:1.6;">
      <h2 style="color:#B8941F;margin-bottom:16px;">Nouvelle demande — Clever Consulting</h2>
      <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
      <p><strong>Email :</strong> ${escapeHtml(email)}</p>
      ${phone ? `<p><strong>Téléphone :</strong> ${escapeHtml(phone)}</p>` : ''}
      ${service ? `<p><strong>Service concerné :</strong> ${escapeHtml(service)}</p>` : ''}
      <p style="margin-top:20px;"><strong>Message :</strong></p>
      <p style="white-space:pre-wrap;background:#FAF6E8;padding:16px;border-radius:8px;border-left:3px solid #B8941F;">${escapeHtml(message)}</p>
    </div>
  `;

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_TO_EMAIL],
        reply_to: email,
        subject,
        text: textBody,
        html: htmlBody,
      }),
    });

    if (!resendRes.ok) {
      const errBody = await resendRes.text();
      console.error('Resend error:', resendRes.status, errBody);
      return res.status(502).json({ ok: false, error: 'send_failed' });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Clever Consulting — port ${PORT}`);
});
