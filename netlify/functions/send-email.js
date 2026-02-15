const nodemailer = require("nodemailer");

exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method Not Allowed" }),
    };
  }

  try {
    const { name, lastName, email, message, formType } = JSON.parse(event.body);

    console.log("Received form data:", {
      name,
      lastName,
      email,
      message,
      formType,
    });

    if (!name || !lastName || !email || !message || !formType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "All fields are required" }),
      };
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Contact Form" <${process.env.GMAIL_USER}>`,
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `New Contact Form Message from ${name} ${lastName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>New Contact Form Message</title>
        </head>
        <body style="margin: 0; padding: 0; background: linear-gradient(135deg, #f5f7fa 0%, #e8f0fe 100%); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f5f7fa 0%, #e8f0fe 100%); padding: 40px 20px;">
            <tr>
              <td align="center">
                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);">
                  
                  <!-- Header with Logo and Gradient -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #3b82f6 0%, #14b8a6 50%, #22d3ee 100%); padding: 40px 48px; text-align: center;">
                      <img src="https://steadfasthaven.netlify.app/logo.png" alt="Steadfast Haven Logo" style="width: 120px; height: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;">
                      <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #ffffff; letter-spacing: -0.03em; line-height: 1.2; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        New Contact Message
                      </h1>
                      <p style="margin: 12px 0 0 0; font-size: 16px; color: rgba(255, 255, 255, 0.95); font-weight: 400; line-height: 1.5;">
                        You have received a new message from your website
                      </p>
                    </td>
                  </tr>

                  <!-- Sender Information Card -->
                  <tr>
                    <td style="padding: 40px 48px 24px 48px;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 28px; border-left: 4px solid #3b82f6;">
                        <tr>
                          <td>
                            <p style="margin: 0 0 4px 0; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">
                              👤 Sender Information
                            </p>
                            <h2 style="margin: 8px 0 0 0; font-size: 24px; color: #1e293b; font-weight: 700; line-height: 1.3;">
                              ${name} ${lastName}
                            </h2>
                            <a href="mailto:${email}" style="display: inline-block; margin: 12px 0 0 0; font-size: 16px; color: #3b82f6; font-weight: 500; text-decoration: none; padding: 8px 16px; background-color: rgba(59, 130, 246, 0.1); border-radius: 6px; transition: background-color 0.2s;">
                              📧 ${email}
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Message Content -->
                  <tr>
                    <td style="padding: 24px 48px 40px 48px;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border-radius: 12px; padding: 28px; border: 1px solid #e2e8f0;">
                        <tr>
                          <td>
                            <p style="margin: 0 0 4px 0; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em;">
                              💬 Message
                            </p>
                            <div style="margin: 16px 0 0 0; font-size: 16px; color: #334155; line-height: 1.7; font-weight: 400; white-space: pre-wrap;">
${message.replace(/\n/g, "<br>")}
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Call-to-Action Button -->
                  <tr>
                    <td style="padding: 0 48px 40px 48px; text-align: center;">
                      <a href="mailto:${email}?subject=Re: Contact Form Message" style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 10px; font-size: 16px; font-weight: 600; letter-spacing: 0.02em; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); transition: all 0.3s;">
                        ↩️ Reply to ${name}
                      </a>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 32px 48px; background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-top: 2px solid #e2e8f0;">
                      <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="text-align: center;">
                            <p style="margin: 0 0 8px 0; font-size: 13px; color: #64748b; line-height: 1.6;">
                              <strong>Sent from:</strong> ${formType} form
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                              © ${new Date().getFullYear()} Steadfast Haven. All rights reserved.
                            </p>
                            <p style="margin: 8px 0 0 0; font-size: 12px; color: #cbd5e1;">
                              <a href="https://steadfasthaven.netlify.app" style="color: #3b82f6; text-decoration: none;">Visit Website</a> · 
                              <a href="mailto:admin@steadfasthaven.com" style="color: #3b82f6; text-decoration: none;">Contact Support</a>
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                </table>

                <!-- Bottom Spacing -->
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px;">
                  <tr>
                    <td style="padding: 24px 20px; text-align: center;">
                      <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                        This is an automated message from your contact form. Please do not reply to this email.
                      </p>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
      text: `
        New Contact Form Submission

        From: ${name} ${lastName}
        Email: ${email}

        Message:
        ${message}

        ---
        This message was sent from your website ${formType} form.
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Email sent:", info.messageId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Email sent successfully!",
        messageId: info.messageId,
      }),
    };
  } catch (error) {
    console.error("Error sending email:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to send email",
        error: error.message,
      }),
    };
  }
};
