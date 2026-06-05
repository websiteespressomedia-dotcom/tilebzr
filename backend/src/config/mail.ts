import https from 'https';

function post(urlStr: string, headers: any, body: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: "POST",
      headers
    };
    const req = https.request(options, res => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve({ status: res.statusCode, data }));
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

/**
 * Custom Gmail API Transporter
 * Bypasses SMTP completely to avoid Railway/Cloud SMTP port blocking (465/587/25).
 * Uses the Gmail REST API directly over HTTPS (Port 443).
 */
export const transporter = {
  sendMail: async (options: { from?: string, to?: string | string[], subject: string, html: string, bcc?: string | string[] }) => {
    try {
      // 1. Get Access Token
      const tokenBody = new URLSearchParams({
        client_id: process.env.OAUTH_CLIENT_ID || '',
        client_secret: process.env.OAUTH_CLIENT_SECRET || '',
        refresh_token: process.env.OAUTH_REFRESH_TOKEN || '',
        grant_type: "refresh_token"
      }).toString();

      const tokenRes = await post("https://oauth2.googleapis.com/token", {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": tokenBody.length
      }, tokenBody);

      const tokenData = JSON.parse(tokenRes.data);
      if (!tokenData.access_token) {
         console.error("Token error:", tokenRes.data);
         throw new Error("Failed to authenticate with Gmail API.");
      }
      
      // 2. Construct RFC822 Email
      const from = options.from || process.env.MAIL_USER;
      const subject = options.subject;
      
      let emailStr = `From: ${from}\r\n`;
      
      if (options.to) {
        const toArray = Array.isArray(options.to) ? options.to : [options.to];
        emailStr += `To: ${toArray.join(', ')}\r\n`;
      }
      
      if (options.bcc) {
        const bccArray = Array.isArray(options.bcc) ? options.bcc : [options.bcc];
        emailStr += `Bcc: ${bccArray.join(', ')}\r\n`;
      }
      
      emailStr += 
        `Subject: ${subject}\r\n` +
        `Content-Type: text/html; charset=utf-8\r\n\r\n` +
        options.html;
                       
      // 3. Base64url encode
      const raw = Buffer.from(emailStr).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      const body = JSON.stringify({ raw });

      // 4. Send via REST API
      const emailRes = await post("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        "Authorization": "Bearer " + tokenData.access_token,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body)
      }, body);
      
      if (emailRes.status !== 200) {
        throw new Error("Gmail API Error: " + emailRes.data);
      }
      
      console.log("✅ Email sent successfully via REST API!");
      return JSON.parse(emailRes.data);
    } catch (err: any) {
      console.error("❌ Transporter Error:", err);
      throw err; // Re-throw so the frontend receives a 500 error instead of failing silently
    }
  }
};

export const sendOTPEmail = async (
  toEmail: string,
  fullName: string,
  otpCode: string,
  type: "login" | "register"
) => {
  const subject =
    type === "login"
      ? "Your TileBazaar Login Code"
      : "Verify Your TileBazaar Account";

  const heading =
    type === "login"
      ? `Hello, ${fullName}!`
      : `Welcome to TileBazaar, ${fullName}!`;

  const html = `
    <div style="font-family:sans-serif;padding:20px;border:1px solid #ddd;">
      <h2>${heading}</h2>
      <p>Your one-time code is: <strong>${otpCode}</strong></p>
      <p>This code will expire in 5 minutes.</p>
    </div>
  `;

  return transporter.sendMail({
    to: toEmail,
    subject,
    html,
  });
};