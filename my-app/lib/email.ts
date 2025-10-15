// lib/email.ts
import nodemailer from "nodemailer";

export async function sendBookingConfirmation(to: string, slotTime: string, slotDate: string) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Danesh's Car Painting" <${process.env.EMAIL_USER}>`,
      to,
      subject: "✅ Booking Confirmation - Car Painting Appointment",
      html: `
        <div style="font-family:Arial, sans-serif; color:#333;">
          <h2>✅ Booking Confirmed!</h2>
          <p>Your appointment has been confirmed:</p>
          <ul>
            <li><strong>Date:</strong> ${slotDate}</li>
            <li><strong>Time:</strong> ${slotTime}</li>
          </ul>
          <p>Thank you for choosing Danesh’s Car Painting Service!</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent successfully to:", to);
  } catch (error) {
    console.error("❌ Failed to send email:", error);
  }
}
