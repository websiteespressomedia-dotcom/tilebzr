import 'dotenv/config';
import { transporter } from './src/config/mail.js';

async function test() {
  try {
    console.log("Sending mail...");
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: process.env.MAIL_USER,
      subject: 'Test',
      text: 'Test'
    });
    console.log("Sent successfully!");
  } catch(e) {
    console.error("Error:", e);
  }
}

test();
