const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const { name, location, contact, details, timestamp } = payload;
    const timeStr = timestamp || new Date().toLocaleString();

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'alinto3002@gmail.com',
        pass: 'fnpl znyd dqov qamz'
      }
    });

    const mailOptions = {
      from: '"NEXA Netlify Emergency System" <alinto3002@gmail.com>',
      to: 'alinto3002@gmail.com',
      subject: '🚨 EMERGENCY WOMEN SAFETY SOS ALERT - NETLIFY LIVE DISPATCH',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #FAF6EF; padding: 25px; border: 3px double #B83227; border-radius: 10px; color: #1C2536;">
          <h2 style="color: #B83227; border-bottom: 2px solid #B83227; padding-bottom: 10px;">
            🚨 URGENT WOMEN SAFETY EMERGENCY SOS ALERT (NETLIFY LIVE)
          </h2>
          <p style="font-size: 16px;">
            A <strong>Women Safety Emergency SOS signal</strong> has just been triggered on the NEXA Netlify live portal!
          </p>

          <div style="background-color: #FFFDF9; border: 1px solid #D8CEA9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="color: #1C2536; margin-top: 0;">👤 VISITOR DISPATCH DETAILS</h3>
            <ul style="line-height: 1.8; font-size: 15px;">
              <li><strong>Name / Identity:</strong> ${name || 'Emergency Visitor'}</li>
              <li><strong>Current Location:</strong> ${location || 'Shared via Portal Session'}</li>
              <li><strong>Contact Info:</strong> ${contact || 'Provided via session'}</li>
              <li><strong>Submission Time:</strong> ${timeStr}</li>
            </ul>
          </div>

          <div style="background-color: #FFF5F4; border-left: 4px solid #B83227; padding: 15px; margin: 15px 0;">
            <strong style="color: #B83227;">⚠️ EMERGENCY DISPATCH STATEMENT:</strong>
            <p style="margin: 5px 0 0 0; font-size: 15px; font-style: italic;">
              "${details || 'Emergency assistance requested immediately by a woman in potential danger. Superhero dispatch signal initiated.'}"
            </p>
          </div>

          <div style="text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid #D8CEA9;">
            <strong style="color: #C59B27; font-size: 14px;">
              🦸 NEXA DIGITAL GUARDIAN | NETLIFY SERVERLESS EMERGENCY NETWORK
            </strong>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Netlify Function Women Safety Email Sent:', info.messageId);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, message: 'Women Safety SOS email dispatched live from Netlify!', messageId: info.messageId })
    };
  } catch (err) {
    console.error('❌ Netlify Function Error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
