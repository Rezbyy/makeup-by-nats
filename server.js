require('dotenv').config();
const express    = require('express');
const nodemailer = require('nodemailer');
const cors       = require('cors');
const path       = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // serves all HTML/CSS/JS/images

// ── Helpers ───────────────────────────────────────────────────────────────────

/** One table row in the email */
function emailRow(label, value) {
  if (!value) return '';
  return `
    <tr>
      <td style="padding:10px 16px 10px 0;vertical-align:top;width:42%;
                 font-family:Arial,Helvetica,sans-serif;font-size:11px;
                 letter-spacing:0.5px;text-transform:uppercase;color:#999999;">
        ${label}
      </td>
      <td style="padding:10px 0;vertical-align:top;
                 font-family:Georgia,'Times New Roman',serif;font-size:14px;
                 color:#1a1a1a;line-height:1.6;">
        ${value}
      </td>
    </tr>`;
}

/** Section header row inside the email table */
function emailSection(title) {
  return `
    <tr>
      <td colspan="2" style="padding:32px 0 10px;
                              font-family:Arial,Helvetica,sans-serif;font-size:10px;
                              letter-spacing:4px;text-transform:uppercase;
                              color:#c8a96e;font-weight:700;
                              border-bottom:1px solid #ede8e2;">
        ${title}
      </td>
    </tr>
    <tr><td colspan="2" style="padding:0 0 4px;"></td></tr>`;
}

function formatDate(str) {
  try {
    const d = new Date(str + 'T00:00:00');
    return d.toLocaleDateString('en-NZ', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch { return str; }
}

function formatTime(str) {
  try {
    const [h, m] = str.split(':');
    const d = new Date();
    d.setHours(Number(h), Number(m), 0);
    return d.toLocaleTimeString('en-NZ', { hour: 'numeric', minute: '2-digit', hour12: true });
  } catch { return str; }
}

// ── POST /api/enquiry ─────────────────────────────────────────────────────────
app.post('/api/enquiry', async (req, res) => {
  const {
    firstName, lastName, email, phone,
    weddingDate, readyTime, partySize, location,
    culturalWedding, culturalDressing, bridalTrial,
    hairstylist, photographer, instagram, howHeard,
  } = req.body;

  // ── Validate required fields ──────────────────────────────────────────────
  const required = {
    'First Name'        : firstName,
    'Last Name'         : lastName,
    'Email'             : email,
    'Phone'             : phone,
    'Wedding Date'      : weddingDate,
    'Ready Time'        : readyTime,
    'Party Size'        : partySize,
    'Location'          : location,
    'Cultural Wedding'  : culturalWedding,
    'Cultural Dressing' : culturalDressing,
    'Bridal Trial'      : bridalTrial,
    'Hairstylist'       : hairstylist,
    'Photographer'      : photographer,
    'How Heard'         : howHeard,
  };

  for (const [field, value] of Object.entries(required)) {
    if (!value || !String(value).trim()) {
      return res.status(400).json({ error: `Please complete: ${field}` });
    }
  }

  // ── Lookup maps ───────────────────────────────────────────────────────────
  const fullName   = `${firstName.trim()} ${lastName.trim()}`;
  const yesNoMap   = { yes: 'Yes', no: 'No', na: 'Not Applicable' };
  const trialMap   = { yes: 'Yes — trial requested', no: 'No — skipping trial' };
  const sourceMap  = {
    instagram         : 'Instagram',
    facebook          : 'Facebook',
    tiktok            : 'TikTok',
    google            : 'Google Search',
    'word-of-mouth'   : 'Word of Mouth',
    'wedding-directory': 'Wedding Directory',
    other             : 'Other',
  };

  const formattedDate = formatDate(weddingDate);
  const formattedTime = formatTime(readyTime);
  const instagramVal  = instagram
    ? `<a href="https://instagram.com/${instagram.replace('@', '')}" style="color:#c8a96e;text-decoration:none;">${instagram}</a>`
    : null;

  // ── Build HTML email ──────────────────────────────────────────────────────
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>New Bridal Enquiry — ${fullName}</title>
</head>
<body style="margin:0;padding:40px 0;background:#f5f0eb;
             font-family:Georgia,'Times New Roman',serif;">

  <div style="max-width:640px;margin:0 auto;background:#ffffff;
              box-shadow:0 4px 32px rgba(0,0,0,0.10);">

    <!-- ── HEADER ── -->
    <div style="background:#1a1a1a;padding:38px 48px;text-align:center;">
      <p style="margin:0 0 8px;
                font-family:Arial,Helvetica,sans-serif;font-size:10px;
                letter-spacing:5px;text-transform:uppercase;color:#c8a96e;">
        New Bridal Enquiry
      </p>
      <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:300;
                 letter-spacing:3px;font-family:Georgia,serif;">
        Makeup by Nats
      </h1>
    </div>

    <!-- ── GOLD SUMMARY BAR ── -->
    <div style="background:#c8a96e;padding:18px 48px;">
      <p style="margin:0;color:#ffffff;
                font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;">
        <strong>${fullName}</strong>
        &nbsp;&middot;&nbsp;
        ${formattedDate}
      </p>
    </div>

    <!-- ── BODY ── -->
    <div style="padding:44px 48px 16px;">
      <table style="width:100%;border-collapse:collapse;">

        ${emailSection('Contact Details')}
        ${emailRow('Full Name', fullName)}
        ${emailRow('Email',     `<a href="mailto:${email}" style="color:#c8a96e;text-decoration:none;">${email}</a>`)}
        ${emailRow('Phone',     `<a href="tel:${phone}" style="color:#c8a96e;text-decoration:none;">${phone}</a>`)}
        ${emailRow('Instagram', instagramVal)}

        ${emailSection('Wedding Details')}
        ${emailRow('Wedding Date',         formattedDate)}
        ${emailRow('Ready By',             formattedTime)}
        ${emailRow('Getting Ready At',     location)}
        ${emailRow('People Needing Makeup', partySize)}

        ${emailSection('Services &amp; Preferences')}
        ${emailRow('Cultural Wedding',          yesNoMap[culturalWedding]  || culturalWedding)}
        ${emailRow('Cultural Dressing Service', yesNoMap[culturalDressing] || culturalDressing)}
        ${emailRow('Bridal Makeup Trial',       trialMap[bridalTrial]      || bridalTrial)}

        ${emailSection('Vendors &amp; Discovery')}
        ${emailRow('Hairstylist',          hairstylist)}
        ${emailRow('Photographer',         photographer)}
        ${emailRow('How They Found Nats',  sourceMap[howHeard] || howHeard)}

      </table>
    </div>

    <!-- ── FOOTER ── -->
    <div style="background:#f5f0eb;padding:28px 48px;
                text-align:center;border-top:1px solid #ede8e2;margin-top:32px;">
      <p style="margin:0 0 6px;
                font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#888;">
        Hit <strong>Reply</strong> to respond directly to ${firstName} at
        <a href="mailto:${email}" style="color:#c8a96e;">${email}</a>
      </p>
      <p style="margin:0;
                font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#bbb;">
        Makeup by Nats &nbsp;&middot;&nbsp; Hamilton, New Zealand
      </p>
    </div>

  </div>
</body>
</html>`;

  // ── Send via Gmail SMTP ───────────────────────────────────────────────────
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from    : `"Makeup by Nats — Website" <${process.env.EMAIL_USER}>`,
      to      : process.env.RECIPIENT_EMAIL || process.env.EMAIL_USER,
      replyTo : `"${fullName}" <${email}>`,
      subject : `✨ New Bridal Enquiry — ${fullName} · ${formattedDate}`,
      html,
    });

    console.log(`[Enquiry] Email sent for ${fullName} (${weddingDate})`);
    return res.json({ success: true });

  } catch (err) {
    console.error('[Enquiry] Failed to send email:', err.message);
    return res.status(500).json({
      error: 'Unable to send your enquiry right now. Please email Makeupbynats101@gmail.com directly.',
    });
  }
});

// ── Start server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✓  Makeup by Nats server running`);
  console.log(`   http://localhost:${PORT}\n`);
});
