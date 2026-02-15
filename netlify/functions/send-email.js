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
          <title>New Contact Message - Steadfast Haven</title>
          <!--[if mso]>
          <style type="text/css">
            body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
          </style>
          <![endif]-->
        </head>
        <body style="margin: 0; padding: 0; background-color: #f0f4f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
          
          <!-- Preheader Text (Hidden) -->
          <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">
            New message from ${name} ${lastName} - ${email}
          </div>

          <!-- Main Email Container -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f0f4f8; padding: 50px 20px;">
            <tr>
              <td align="center">
                
                <!-- Email Wrapper -->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640" style="max-width: 640px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);">
                  
                  <!-- Brand Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #1e40af 0%, #0891b2 50%, #06b6d4 100%); padding: 50px 40px; text-align: center; position: relative;">
                      <!-- Decorative Circles -->
                      <div style="position: absolute; top: -30px; right: -30px; width: 150px; height: 150px; background: rgba(255, 255, 255, 0.1); border-radius: 50%; opacity: 0.6;"></div>
                      <div style="position: absolute; bottom: -40px; left: -40px; width: 180px; height: 180px; background: rgba(255, 255, 255, 0.08); border-radius: 50%; opacity: 0.5;"></div>
                      
                      <!-- Text Logo -->
                      <div style="position: relative; z-index: 10;">
                        <h1 style="margin: 0 0 8px 0; font-size: 36px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; text-transform: uppercase; text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);">
                          STEADFAST HAVEN
                        </h1>
                        <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #22d3ee, #06b6d4); margin: 0 auto 20px auto; border-radius: 2px;"></div>
                        <p style="margin: 0; font-size: 14px; color: rgba(255, 255, 255, 0.9); font-weight: 500; text-transform: uppercase; letter-spacing: 2px;">
                          New Contact Message
                        </p>
                      </div>
                    </td>
                  </tr>

                  <!-- Notification Badge -->
                  <tr>
                    <td style="padding: 0 40px;">
                      <div style="margin-top: -25px; position: relative; z-index: 20;">
                        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; padding: 12px 24px; border-radius: 50px; display: inline-block; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);">
                          📬 New Inquiry
                        </div>
                      </div>
                    </td>
                  </tr>

                  <!-- Sender Details Section -->
                  <tr>
                    <td style="padding: 40px 40px 30px 40px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 16px; border: 2px solid #3b82f6; overflow: hidden;">
                        <tr>
                          <td style="padding: 32px;">
                            <!-- Section Label -->
                            <div style="margin-bottom: 20px;">
                              <span style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: #ffffff; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
                                Sender Details
                              </span>
                            </div>
                            
                            <!-- Name -->
                            <h2 style="margin: 0 0 16px 0; font-size: 28px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; line-height: 1.2;">
                              ${name} ${lastName}
                            </h2>
                            
                            <!-- Email -->
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                              <tr>
                                <td style="padding: 12px 20px; background-color: #ffffff; border-radius: 10px; border: 1px solid #bfdbfe;">
                                  <a href="mailto:${email}" style="color: #2563eb; text-decoration: none; font-size: 16px; font-weight: 600; display: flex; align-items: center; gap: 8px;">
                                    <span style="font-size: 20px;">✉️</span>
                                    <span>${email}</span>
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Message Content Section -->
                  <tr>
                    <td style="padding: 0 40px 40px 40px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
                        <tr>
                          <td style="padding: 32px;">
                            <!-- Section Label -->
                            <div style="margin-bottom: 20px;">
                              <span style="background: linear-gradient(135deg, #6366f1, #4f46e5); color: #ffffff; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
                                Message Content
                              </span>
                            </div>
                            
                            <!-- Message Text -->
                            <div style="font-size: 17px; color: #1e293b; line-height: 1.8; font-weight: 400; white-space: pre-wrap; padding: 20px; background-color: #ffffff; border-radius: 12px; border-left: 4px solid #6366f1;">
${message.replace(/\n/g, "<br>")}
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- CTA Button Section -->
                  <tr>
                    <td style="padding: 0 40px 50px 40px; text-align: center;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
                        <tr>
                          <td style="border-radius: 12px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);">
                            <a href="mailto:${email}?subject=Re:%20Contact%20Form%20Message" style="display: inline-block; padding: 18px 50px; color: #ffffff; text-decoration: none; font-size: 17px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
                              <span style="font-size: 20px; margin-right: 8px;">↩️</span> Reply to ${name}
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Metadata & Footer -->
                  <tr>
                    <td style="padding: 35px 40px; background: linear-gradient(to bottom, #f8fafc 0%, #f1f5f9 100%); border-top: 3px solid #e2e8f0;">
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                        <tr>
                          <td style="text-align: center; padding-bottom: 20px;">
                            <p style="margin: 0 0 10px 0; font-size: 14px; color: #475569; font-weight: 600;">
                              📋 Form Type: <span style="color: #0f172a; font-weight: 700;">${formType}</span>
                            </p>
                            <p style="margin: 0; font-size: 13px; color: #64748b;">
                              Received on ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style="text-align: center; padding-top: 20px; border-top: 1px solid #cbd5e1;">
                            <p style="margin: 0 0 12px 0; font-size: 13px; color: #94a3b8; font-weight: 600;">
                              © ${new Date().getFullYear()} Steadfast Haven · All Rights Reserved
                            </p>
                            <p style="margin: 0; font-size: 13px;">
                              <a href="https://steadfasthaven.netlify.app" style="color: #3b82f6; text-decoration: none; font-weight: 600; margin: 0 8px;">🌐 Website</a>
                              <span style="color: #cbd5e1;">|</span>
                              <a href="mailto:admin@steadfasthaven.com" style="color: #3b82f6; text-decoration: none; font-weight: 600; margin: 0 8px;">📧 Support</a>
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                </table>

                <!-- Bottom Disclaimer -->
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="640" style="max-width: 640px; margin-top: 24px;">
                  <tr>
                    <td style="padding: 0 20px; text-align: center;">
                      <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.6;">
                        This is an automated notification from your website contact form.<br>
                        Please reply directly to <strong>${email}</strong> to respond to this inquiry.
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
