const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, './')));

// Configure Nodemailer Transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'alinto3002@gmail.com',
    pass: 'fnpl znyd dqov qamz'
  }
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection Error:', error.message);
  } else {
    console.log('✅ Nodemailer Transport is ready to dispatch emails via Gmail SMTP!');
  }
});

// Endpoint 1: Women Safety Emergency SOS Alert
app.post('/api/women-safety-alert', async (req, res) => {
  try {
    const { name, location, contact, details, timestamp } = req.body;
    const timeStr = timestamp || new Date().toLocaleString();

    const mailOptions = {
      from: '"NEXA Emergency System" <alinto3002@gmail.com>',
      to: 'alinto3002@gmail.com',
      subject: '🚨 EMERGENCY WOMEN SAFETY SOS ALERT - URGENT GUARDIAN DISPATCH',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #FAF6EF; padding: 25px; border: 3px double #B83227; border-radius: 10px; color: #1C2536;">
          <h2 style="color: #B83227; border-bottom: 2px solid #B83227; padding-bottom: 10px;">
            🚨 URGENT WOMEN SAFETY EMERGENCY SOS ALERT
          </h2>
          <p style="font-size: 16px;">
            A <strong>Women Safety Emergency SOS signal</strong> has just been triggered on the NEXA Digital Guardian portal!
          </p>

          <div style="background-color: #FFFDF9; border: 1px solid #D8CEA9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <h3 style="color: #1C2536; margin-top: 0;">👤 VISITOR DISPATCH DETAILS</h3>
            <ul style="line-height: 1.8; font-size: 15px;">
              <li><strong>Name / Identity:</strong> ${name || 'Emergency Visitor'}</li>
              <li><strong>Current Location:</strong> ${location || 'Location shared via GPS/Portal'}</li>
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
              🦸 NEXA DIGITAL GUARDIAN | SUPERHERO EMERGENCY RESPONSE NETWORK
            </strong>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Women Safety Emergency Email Sent:', info.messageId);
    return res.status(200).json({ success: true, message: 'Women Safety SOS email dispatched successfully!', messageId: info.messageId });
  } catch (err) {
    console.error('❌ Error sending Women Safety email:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Endpoint 2: Cyber Crime & Device Threat Diagnostic Alert
app.post('/api/cyber-crime-alert', async (req, res) => {
  try {
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
    } = req.body;

    const timeStr = new Date().toLocaleString();

    const mailOptions = {
      from: '"NEXA Cyber Guardian" <alinto3002@gmail.com>',
      to: 'alinto3002@gmail.com',
      subject: `🛡️ NEXA CYBER CRIME & DEVICE THREAT ALERT - ${name || 'User'} [${(riskLevel || 'High').toUpperCase()}]`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #FAF6EF; padding: 25px; border: 3px double #C59B27; border-radius: 10px; color: #1C2536;">
          <h2 style="color: #1C2536; border-bottom: 2px solid #C59B27; padding-bottom: 10px;">
            🛡️ NEXA CYBER CRIME & DEVICE THREAT REPORT
          </h2>
          <p style="font-size: 15px;">
            A user has completed a detailed Cyber Crime Diagnostic assessment on NEXA.
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
            Report Dispatched at ${timeStr} | NEXA Digital Guardian Cyber Defense Network
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Cyber Crime Help Email Sent:', info.messageId);
    return res.status(200).json({ success: true, message: 'Cyber Crime diagnostic email dispatched successfully!', messageId: info.messageId });
  } catch (err) {
    console.error('❌ Error sending Cyber Crime email:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback Route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 NEXA Node.js Server is running live on http://localhost:${PORT}`);
});
