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
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title>New Message - Steadfast Haven</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', 'Helvetica Neue', Arial, sans-serif;">
          
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; padding: 60px 20px;">
            <tr>
              <td align="center">
                
                <!-- Main Email Container -->
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);">
                  
                  <!-- Elegant Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #2563eb 0%, #0891b2 100%); padding: 60px 48px; text-align: center;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="text-align: center;">
                            <div style="background-color: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border-radius: 16px; padding: 24px 32px; display: inline-block; margin-bottom: 24px;">
                              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: 3px; text-transform: uppercase;">
                                STEADFAST HAVEN
                              </h1>
                            </div>
                            <p style="margin: 0; font-size: 15px; color: rgba(255, 255, 255, 0.85); font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase;">
                              New Contact Message
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Content Area -->
                  <tr>
                    <td style="padding: 48px;">
                      
                      <!-- Sender Information -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
                        <tr>
                          <td>
                            <p style="margin: 0 0 8px 0; font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 1.2px;">
                              From
                            </p>
                            <h2 style="margin: 0 0 16px 0; font-size: 26px; font-weight: 700; color: #0f172a; line-height: 1.3; letter-spacing: -0.5px;">
                              ${name} ${lastName}
                            </h2>
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="background-color: #f1f5f9; border-radius: 10px; padding: 14px 20px;">
                                  <a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-size: 15px; font-weight: 600;">
                                    ${email}
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- Divider -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
                        <tr>
                          <td style="height: 1px; background: linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%);"></td>
                        </tr>
                      </table>

                      <!-- Message Content -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 40px;">
                        <tr>
                          <td>
                            <p style="margin: 0 0 16px 0; font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 1.2px;">
                              Message
                            </p>
                            <div style="font-size: 16px; color: #334155; line-height: 1.8; font-weight: 400; padding: 24px; background-color: #f8fafc; border-radius: 12px; border-left: 3px solid #2563eb;">
${message.replace(/\n/g, "<br>")}
                            </div>
                          </td>
                        </tr>
                      </table>

                      <!-- Reply Button -->
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td align="center">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border-radius: 12px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);">
                                  <a href="mailto:${email}?subject=Re:%20Contact%20Form%20Message" style="display: inline-block; padding: 16px 48px; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; letter-spacing: 0.5px;">
                                    Reply to ${name}
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 40px 48px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                          <td style="text-align: center;">
                            <p style="margin: 0 0 12px 0; font-size: 13px; color: #64748b; line-height: 1.6;">
                              <strong style="color: #475569;">Form Type:</strong> ${formType}
                            </p>
                            <p style="margin: 0 0 12px 0; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                              Received: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <div style="margin: 16px 0; height: 1px; background-color: #e2e8f0;"></div>
                            <p style="margin: 0 0 8px 0; font-size: 12px; color: #94a3b8; font-weight: 500;">
                              © ${new Date().getFullYear()} Steadfast Haven. All Rights Reserved.
                            </p>
                            <p style="margin: 0; font-size: 13px;">
                              <a href="https://steadfasthaven.netlify.app" style="color: #2563eb; text-decoration: none; font-weight: 500; margin: 0 8px;">Website</a>
                              <span style="color: #cbd5e1;">•</span>
                              <a href="mailto:admin@steadfasthaven.com" style="color: #2563eb; text-decoration: none; font-weight: 500; margin: 0 8px;">Support</a>
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                </table>

                <!-- Disclaimer -->
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin-top: 24px;">
                  <tr>
                    <td style="text-align: center; padding: 0 20px;">
                      <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.6;">
                        This is an automated notification from your contact form.<br>
                        Reply directly to <strong style="color: #64748b;">${email}</strong> to respond.
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
