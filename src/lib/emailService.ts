// Email service for sending notifications
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface PasswordEmailData {
  name: string;
  userId: string;
  password: string;
  loginUrl: string;
  userType: 'student' | 'employee';
}

export class EmailService {
  private static instance: EmailService;
  private isEnabled: boolean = false; // Set to true when email service is configured

  private constructor() {
    // Initialize email service configuration
    this.isEnabled = process.env.EMAIL_ENABLED === 'true';
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Send email using SMTP or email service
  private async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (!this.isEnabled) {
        console.log('📧 Email Service (Mock Mode):');
        console.log(`To: ${options.to}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Content: ${options.text || 'HTML content'}`);
        console.log('---');
        return true;
      }

      // Use nodemailer for SMTP sending
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      });

      const mailOptions = {
        from: `"DMUDMS" <${process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('📧 Email sent successfully:', info.messageId);
      return true;

    } catch (error) {
      console.error('📧 Email sending failed:', error);
      return false;
    }
  }

  // Send welcome email with login credentials
  public async sendWelcomeEmail(data: PasswordEmailData): Promise<boolean> {
    const subject = `Welcome to DMUDMS - Your Account Details`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .credentials { background: white; padding: 15px; border-left: 4px solid #2563eb; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to DMUDMS</h1>
            <p>Debre Markos University Dormitory Management System</p>
          </div>
          
          <div class="content">
            <h2>Hello ${data.name},</h2>
            
            <p>Your ${data.userType} account has been successfully created in the Dormitory Management System.</p>
            
            <div class="credentials">
              <h3>Your Login Credentials:</h3>
              <p><strong>User ID:</strong> ${data.userId}</p>
              <p><strong>Password:</strong> ${data.password}</p>
              <p><strong>Login URL:</strong> <a href="${data.loginUrl}">${data.loginUrl}</a></p>
            </div>
            
            <p><strong>Important Security Notes:</strong></p>
            <ul>
              <li>Please change your password after your first login</li>
              <li>Keep your login credentials secure and do not share them</li>
              <li>Contact the system administrator if you experience any issues</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.loginUrl}" class="button">Login to DMUDMS</a>
            </div>
            
            <p>If you have any questions or need assistance, please contact the IT support team.</p>
          </div>
          
          <div class="footer">
            <p>This is an automated message from DMUDMS. Please do not reply to this email.</p>
            <p>© 2024 Debre Markos University. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Welcome to DMUDMS - Debre Markos University Dormitory Management System

Hello ${data.name},

Your ${data.userType} account has been successfully created.

Login Credentials:
- User ID: ${data.userId}
- Password: ${data.password}
- Login URL: ${data.loginUrl}

Important: Please change your password after your first login.

If you have any questions, please contact the IT support team.

© 2024 Debre Markos University
    `;

    return await this.sendEmail({
      to: data.name.includes('@') ? data.name : `${data.userId}@dmu.edu`, // Use email if provided, otherwise construct
      subject,
      html,
      text
    });
  }

  // Send password reset email
  public async sendPasswordResetEmail(data: PasswordEmailData): Promise<boolean> {
    const subject = `DMUDMS - Password Reset Notification`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .credentials { background: white; padding: 15px; border-left: 4px solid #dc2626; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          .button { display: inline-block; padding: 12px 24px; background: #dc2626; color: white; text-decoration: none; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset</h1>
            <p>DMUDMS - Debre Markos University</p>
          </div>
          
          <div class="content">
            <h2>Hello ${data.name},</h2>
            
            <p>Your password has been reset by a system administrator.</p>
            
            <div class="credentials">
              <h3>Your New Login Credentials:</h3>
              <p><strong>User ID:</strong> ${data.userId}</p>
              <p><strong>New Password:</strong> ${data.password}</p>
              <p><strong>Login URL:</strong> <a href="${data.loginUrl}">${data.loginUrl}</a></p>
            </div>
            
            <p><strong>Security Recommendations:</strong></p>
            <ul>
              <li>Change this password immediately after logging in</li>
              <li>Use a strong, unique password</li>
              <li>Do not share your credentials with anyone</li>
              <li>Contact support if you did not request this reset</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.loginUrl}" class="button">Login Now</a>
            </div>
            
            <p>If you did not request this password reset, please contact the system administrator immediately.</p>
          </div>
          
          <div class="footer">
            <p>This is an automated security notification from DMUDMS.</p>
            <p>© 2024 Debre Markos University. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
DMUDMS - Password Reset Notification

Hello ${data.name},

Your password has been reset by a system administrator.

New Login Credentials:
- User ID: ${data.userId}
- New Password: ${data.password}
- Login URL: ${data.loginUrl}

Please change this password immediately after logging in.

If you did not request this reset, contact the administrator immediately.

© 2024 Debre Markos University
    `;

    return await this.sendEmail({
      to: data.name.includes('@') ? data.name : `${data.userId}@dmu.edu`,
      subject,
      html,
      text
    });
  }

  // Test email configuration
  public async testEmailService(): Promise<boolean> {
    return await this.sendEmail({
      to: 'test@dmu.edu',
      subject: 'DMUDMS Email Service Test',
      html: '<p>This is a test email from DMUDMS.</p>',
      text: 'This is a test email from DMUDMS.'
    });
  }
}

// Export singleton instance
export const emailService = EmailService.getInstance();