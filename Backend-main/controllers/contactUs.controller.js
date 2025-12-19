const ContactModel = require('../models/contactUs');
const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

// Send email notification
const sendEmailNotification = async (name, email, message) => {
    // Skip email if credentials are not configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.log('⚠️  Email credentials not configured. Skipping email notification.');
        return { skipped: true };
    }

    try {
        const transporter = createTransporter();

        // Email to admin
        const adminMailOptions = {
            from: `"${name}" <${process.env.EMAIL_FROM}>`,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea; }
                        .label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
                        .value { color: #555; }
                        .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 style="margin: 0;">📧 New Contact Message</h1>
                            <p style="margin: 10px 0 0 0; opacity: 0.9;">Learnify LMS</p>
                        </div>
                        <div class="content">
                            <p>You have received a new message from your contact form:</p>
                            
                            <div class="info-box">
                                <div class="label">Name:</div>
                                <div class="value">${name}</div>
                            </div>
                            
                            <div class="info-box">
                                <div class="label">Email:</div>
                                <div class="value">${email}</div>
                            </div>
                            
                            <div class="info-box">
                                <div class="label">Message:</div>
                                <div class="value">${message}</div>
                            </div>
                            
                            <div class="info-box">
                                <div class="label">Received:</div>
                                <div class="value">${new Date().toLocaleString()}</div>
                            </div>
                            
                            <div class="footer">
                                <p>This is an automated notification from Learnify LMS</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        // Email confirmation to user
        const userMailOptions = {
            from: `"Learnify Support" <${process.env.EMAIL_FROM}>`,
            to: email,
            subject: 'Thank you for contacting Learnify!',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .message-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
                        .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 style="margin: 0;">👋 Thank You!</h1>
                        </div>
                        <div class="content">
                            <p>Hi <strong>${name}</strong>,</p>
                            <p>Thank you for reaching out to us! We have received your message and our team will get back to you as soon as possible.</p>
                            
                            <div class="message-box">
                                <p><strong>Your message:</strong></p>
                                <p style="color: #555;">${message}</p>
                            </div>
                            
                            <p>We typically respond within 24-48 hours during business days.</p>
                            
                            <div style="text-align: center;">
                                <a href="${process.env.CLIENT_URL}" class="button">Visit Learnify</a>
                            </div>
                            
                            <div class="footer">
                                <p>Best regards,<br><strong>Learnify Support Team</strong></p>
                                <p style="margin-top: 20px;">This is an automated confirmation email.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        // Send both emails
        await Promise.all([
            transporter.sendMail(adminMailOptions),
            transporter.sendMail(userMailOptions)
        ]);

        console.log('✅ Emails sent successfully');
        return { success: true };
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        // Don't throw error - continue even if email fails
        return { error: error.message };
    }
};

const getMessages = async (req, res) => {
    try {
        const { name, email, message } = req.body;
        
        // Validate input
        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Please provide a valid email address" });
        }

        // Save to MongoDB
        const newMessage = await ContactModel.create({ 
            name, 
            email, 
            message 
        });

        // Send email notifications (async, don't wait)
        sendEmailNotification(name, email, message).catch(err => {
            console.error('Email notification failed:', err);
        });

        res.status(201).json({ 
            message: 'Message received successfully! We will get back to you soon.', 
            data: newMessage 
        });

    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getMessages };