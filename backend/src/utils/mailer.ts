import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendOrderConfirmationEmail = async (email: string, firstName: string, orderId: string, amount: number) => {
  const mailOptions = {
    from: `"Tile Bazaar" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Order Confirmation & Payment Link - Tile Bazaar",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <h2 style="color: #4a2c2a; text-align: center; border-bottom: 2px solid #f4f4f4; padding-bottom: 10px;">Tile Bazaar</h2>
        <p>Dear <strong>${firstName || 'Customer'}</strong>,</p>
        <p>Thank you for placing your order with Tile Bazaar! Your order (<strong>#${orderId.substring(0,8)}</strong>) has been successfully placed.</p>
        <p>Your order total is <strong>£${amount.toFixed(2)}</strong>.</p>
        <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #4a2c2a; margin: 20px 0;">
          <strong>Payment Link:</strong><br/>
          Our team is currently reviewing your order. We will share the secure payment link with you via this registered email address within the next 24 hours.
        </p>
        <p>If you have any questions in the meantime, feel free to reply to this email or contact our support team.</p>
        <p>Best Regards,<br/><strong>Tile Bazaar Team</strong></p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent: " + info.response);
    return true;
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return false;
  }
};
