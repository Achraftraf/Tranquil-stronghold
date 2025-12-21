const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const { name, lastName, email, message } = JSON.parse(event.body);

    if (!name || !lastName || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'All fields are required' }),
      };
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: '"Contact Form" <systemtestbookstore@gmail.com>',
      to: 'systemtestbookstore@gmail.com',
      replyTo: email,
      subject: `New Contact Form Message from ${name} ${lastName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f7; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Helvetica, Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f7; padding: 40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #d2d2d7;">
                  
                  <tr>
                    <td style="padding: 48px 48px 32px 48px;">
                      <h1 style="margin: 0; font-size: 28px; font-weight: 600; color: #1d1d1f; letter-spacing: -0.02em; line-height: 1.2;">
                        New Message
                      </h1>
                      <p style="margin: 8px 0 0 0; font-size: 17px; color: #86868b; font-weight: 400; line-height: 1.5;">
                        You have received a new contact form submission.
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 0 48px 24px 48px;">
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f7; border-radius: 8px; padding: 24px;">
                        <tr>
                          <td>
                            <p style="margin: 0 0 12px 0; font-size: 13px; color: #86868b; font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em;">
                              From
                            </p>
                            <p style="margin: 0 0 16px 0; font-size: 17px; color: #1d1d1f; font-weight: 500;">
                              ${name} ${lastName}
                            </p>
                            <p style="margin: 0; font-size: 15px; color: #06c; font-weight: 400;">
                              ${email}
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 0 48px 48px 48px;">
                      <p style="margin: 0 0 12px 0; font-size: 13px; color: #86868b; font-weight: 500; text-transform: uppercase; letter-spacing: 0.04em;">
                        Message
                      </p>
                      <div style="font-size: 17px; color: #1d1d1f; line-height: 1.6; font-weight: 400;">
                        ${message.replace(/\n/g, '<br>')}
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding: 32px 48px; background-color: #fbfbfd; border-top: 1px solid #d2d2d7;">
                      <p style="margin: 0; font-size: 13px; color: #86868b; line-height: 1.5;">
                        This message was sent from your website contact form.
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
        This message was sent from your website contact form.
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info.messageId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Email sent successfully!',
        messageId: info.messageId
      }),
    };

  } catch (error) {
    console.error('Error sending email:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to send email',
        error: error.message
      }),
    };
  }
};
