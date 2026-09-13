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
    const {
      name,
      age,
      location,
      email,
      category,
      cyberTopic,
      deviceTrapped,
      otpStolen,
      remoteAccess,
      financialLoss,
      details,
      riskLevel
    } = payload;

    const timeStr = new Date().toLocaleString();

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
      from: '"NEXA Netlify Cyber Guardian" <alinto3002@gmail.com>',
      to: 'alinto3002@gmail.com',
      subject: `🛡️ NEXA CYBER CRIME & DEVICE THREAT ALERT (NETLIFY LIVE) - ${name || 'User'} [${(riskLevel || 'High').toUpperCase()}]`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #FAF6EF; padding: 25px; border: 3px double #C59B27; border-radius: 10px; color: #1C2536;">
          <h2 style="color: #1C2536; border-bottom: 2px solid #C59B27; padding-bottom: 10px;">
            🛡️ NEXA CYBER CRIME & DEVICE THREAT REPORT (NETLIFY LIVE)
          </h2>
          <p style="font-size: 15px;">
            A user has completed a detailed Cyber Crime Diagnostic assessment on the live Netlify NEXA portal.
          </p>

          <div style="background-color: #FFFDF9; border: 1px solid #D8CEA9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="color: #B83227; margin-top: 0;">👤 VISITOR INFORMATION</h3>
            <ul style="line-height: 1.8; font-size: 14px;">
              <li><strong>Name:</strong> ${name || 'Not provided'}</li>
              <li><strong>Age:</strong> ${age || 'Not provided'}</li>
              <li><strong>Location:</strong> ${location || 'Not provided'}</li>
              <li><strong>Email:</strong> ${email || 'Not provided'}</li>
              <li><strong>Category:</strong> ${category || 'Cyber Crime Help'}</li>
              <li><strong>Specific Threat:</strong> ${cyberTopic || 'General Threat'}</li>
            </ul>
          </div>

          <div style="background-color: #FFFDF9; border: 1px solid #D8CEA9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="color: #1C2536; margin-top: 0;">🔍 DEVICE & CYBER THREAT DIAGNOSTICS</h3>
            <ul style="line-height: 1.8; font-size: 14px;">
              <li><strong>Device Hacked / Behaving Strangely:</strong> ${deviceTrapped || 'Unspecified'}</li>
              <li><strong>Shared OTP / Passwords Stolen:</strong> ${otpStolen || 'Unspecified'}</li>
              <li><strong>Unauthorized Remote Access Active:</strong> ${remoteAccess || 'Unspecified'}</li>
              <li><strong>Financial Loss / QR Payment Scam:</strong> ${financialLoss || 'Unspecified'}</li>
            </ul>
          </div>

          <div style="background-color: #FFF5F4; border-left: 4px solid #B83227; padding: 15px; margin: 15px 0;">
            <strong style="color: #B83227;">💬 INCIDENT DESCRIPTION:</strong>
            <p style="margin: 5px 0 0 0; font-size: 14px;">
              "${details || 'User requested cyber crime guardian intervention.'}"
            </p>
          </div>

          <div style="margin: 15px 0; font-size: 15px;">
            <strong>EVALUATED RISK LEVEL:</strong> 
            <span style="background-color: #B83227; color: #FFFDF9; padding: 4px 10px; border-radius: 4px; font-weight: bold;">
              ${(riskLevel || 'HIGH').toUpperCase()}
            </span>
          </div>

          <div style="text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid #D8CEA9; font-size: 13px; color: #535C6D;">
            Report Dispatched at ${timeStr} | NEXA Netlify Serverless Cyber Defense Network
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Netlify Function Cyber Crime Email Sent:', info.messageId);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, message: 'Cyber Crime diagnostic email dispatched live from Netlify!', messageId: info.messageId })
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
