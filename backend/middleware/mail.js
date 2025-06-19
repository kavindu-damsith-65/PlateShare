const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});



const sendVerificationEmail =  async (email, code)=> {
    try {
        const mailOptions = {
            from: `"PLATESHARE" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: '🔐 Verify Your Email Address',
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    <style>
        body {
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f7fafc;
            margin: 0;
            padding: 0;
            color: #2d3748;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 20px 0;
        }
        .logo {
            color: #00CCBB;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .card {
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            padding: 30px;
            margin-bottom: 20px;
        }
        h1 {
            color: #2d3748;
            font-size: 22px;
            margin-top: 0;
            margin-bottom: 20px;
            text-align: center;
        }
        .code-container {
            background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
            border: 1px solid #d1fae5;
            border-radius: 8px;
            padding: 15px;
            margin: 25px 0;
            text-align: center;
        }
        .verification-code {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 3px;
            color: #065f46;
            padding: 10px 0;
        }
        .divider {
            border-top: 1px solid #e2e8f0;
            margin: 25px 0;
        }
        .footer {
            text-align: center;
            color: #718096;
            font-size: 14px;
            padding-top: 20px;
        }
        .cta-button {
            display: inline-block;
            background-color: #00CCBB;
            color: white !important;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-weight: 600;
            margin: 15px 0;
        }
        .note {
            background-color: #f8fafc;
            border-left: 4px solid #00CCBB;
            padding: 12px;
            margin: 20px 0;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">PLATESHARE</div>
        </div>
        
        <div class="card">
            <h1>Verify Your Email Address</h1>
            
            <p>Hello there,</p>
            
            <p>Thank you for signing up! To complete your registration, please enter the following verification code in your app:</p>
            
            <div class="code-container">
                <div class="verification-code">${code}</div>
            </div>
            
            <p style="text-align: center;">
                <a href="#" class="cta-button">Verify Email</a>
            </p>
            
            <div class="note">
                <strong>Note:</strong> This code will expire in 10 minutes. If you didn't request this, please ignore this email.
            </div>
            
            <div class="divider"></div>
            
            <p>If the button above doesn't work, you can manually enter the code in the app.</p>
            
            <p>Welcome aboard!<br></p>
        </div>
        
        <div class="footer">
            <p>© ${new Date().getFullYear()} PLATESHARE. All rights reserved.</p>
            <p>
                <a href="#" style="color: #00CCBB; text-decoration: none;">Help Center</a> | 
                <a href="#" style="color: #00CCBB; text-decoration: none;">Privacy Policy</a> | 
                <a href="#" style="color: #00CCBB; text-decoration: none;">Contact Us</a>
            </p>
        </div>
    </div>
</body>
</html>
            `,
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending verification email:', error);
        return false;
    }
}


module.exports={
    sendVerificationEmail
}
