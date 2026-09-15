import transporter from "../configs/nodemailer.js";
import resend from "../configs/resend.js";

/**
 * Sends a luxury HTML booking confirmation email to the guest
 * and an owner notification email to the hotel manager/admin.
 * Uses Resend API as primary transport with automatic Nodemailer SMTP fallback.
 */
export const sendBookingConfirmationEmail = async ({
  toEmail,
  userName,
  bookingId,
  hotelName,
  hotelAddress,
  hotelCity,
  roomName,
  roomType,
  checkInDate,
  checkOutDate,
  nights,
  guests,
  pricePerNight,
  totalPrice,
  paymentMethod
}) => {
  const senderEmail = process.env.SENDER_EMAIL || "ujjwal2007r@gmail.com";
  
  // Resolve target guest recipient
  const targetGuestEmail = (toEmail && !toEmail.endsWith("@clerk.user") && toEmail.includes("@"))
    ? toEmail
    : senderEmail;

  const formattedCheckIn = new Date(checkInDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const formattedCheckOut = new Date(checkOutDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const formattedBookingRef = `#${bookingId.toString().toUpperCase().slice(-8)}`;

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f3f4f6; padding: 40px 15px;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.08);">
            
            <!-- BRAND HEADER -->
            <tr>
              <td style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%); padding: 40px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 30px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">QUICKSTAY</h1>
                <p style="color: #c7d2fe; margin: 8px 0 0 0; font-size: 14px; font-weight: 300;">Luxury Hotel Reservations & Stays</p>
              </td>
            </tr>

            <!-- STATUS BADGE -->
            <tr>
              <td style="padding: 35px 40px 10px 40px; text-align: center;">
                <span style="background-color: #dcfce7; color: #15803d; font-size: 12px; font-weight: 700; text-transform: uppercase; padding: 8px 20px; border-radius: 50px; letter-spacing: 1px; display: inline-block;">
                  ✓ Reservation Confirmed
                </span>
                <h2 style="margin: 20px 0 8px 0; color: #111827; font-size: 24px; font-weight: 700;">Thank You for Your Booking, ${userName || "Guest"}!</h2>
                <p style="margin: 0; color: #6b7280; font-size: 15px; line-height: 1.6;">
                  We are delighted to confirm your upcoming stay. Here is your full reservation receipt.
                </p>
              </td>
            </tr>

            <!-- HOTEL & ROOM DETAILS CARD -->
            <tr>
              <td style="padding: 20px 40px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 14px; padding: 24px;">
                  <tr>
                    <td>
                      <p style="margin: 0 0 4px 0; font-size: 11px; text-transform: uppercase; font-weight: 700; color: #4f46e5; letter-spacing: 0.5px;">Hotel Property</p>
                      <h3 style="margin: 0 0 6px 0; font-size: 20px; color: #111827; font-weight: 700;">${hotelName}</h3>
                      <p style="margin: 0 0 16px 0; font-size: 14px; color: #6b7280;">📍 ${hotelAddress}${hotelCity ? `, ${hotelCity}` : ""}</p>
                      
                      <div style="border-top: 1px dashed #e5e7eb; margin: 14px 0;"></div>
                      
                      <p style="margin: 14px 0 4px 0; font-size: 11px; text-transform: uppercase; font-weight: 700; color: #4f46e5; letter-spacing: 0.5px;">Room Category</p>
                      <p style="margin: 0; font-size: 16px; font-weight: 700; color: #1f2937;">${roomName} <span style="color: #6b7280; font-weight: 400; font-size: 14px;">(${roomType})</span></p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- CHECK-IN / CHECK-OUT DATES -->
            <tr>
              <td style="padding: 0 40px 20px 40px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td width="48%" style="background-color: #eef2ff; border-radius: 14px; padding: 18px; vertical-align: top;">
                      <p style="margin: 0 0 4px 0; font-size: 11px; text-transform: uppercase; font-weight: 700; color: #4338ca;">Check-In</p>
                      <p style="margin: 0; font-size: 15px; font-weight: 700; color: #1e1b4b;">${formattedCheckIn}</p>
                    </td>
                    <td width="4%"></td>
                    <td width="48%" style="background-color: #eef2ff; border-radius: 14px; padding: 18px; vertical-align: top;">
                      <p style="margin: 0 0 4px 0; font-size: 11px; text-transform: uppercase; font-weight: 700; color: #4338ca;">Check-Out</p>
                      <p style="margin: 0; font-size: 15px; font-weight: 700; color: #1e1b4b;">${formattedCheckOut}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- BILLING SUMMARY TABLE -->
            <tr>
              <td style="padding: 0 40px 30px 40px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Booking Reference</td>
                    <td style="padding: 12px 0; text-align: right; font-weight: 700; color: #111827; font-size: 14px; font-family: monospace;">${formattedBookingRef}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Stay Duration</td>
                    <td style="padding: 12px 0; text-align: right; font-weight: 600; color: #111827; font-size: 14px;">${nights} ${nights === 1 ? "Night" : "Nights"}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Guests Count</td>
                    <td style="padding: 12px 0; text-align: right; font-weight: 600; color: #111827; font-size: 14px;">${guests} ${guests === 1 ? "Guest" : "Guests"}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Rate per Night</td>
                    <td style="padding: 12px 0; text-align: right; font-weight: 600; color: #111827; font-size: 14px;">$${pricePerNight}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #f3f4f6;">
                    <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Payment Method</td>
                    <td style="padding: 12px 0; text-align: right; font-weight: 600; color: #111827; font-size: 14px;">${paymentMethod || "Pay At Hotel"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 16px 0 0 0; color: #111827; font-size: 16px; font-weight: 700;">Total Amount Paid / Due</td>
                    <td style="padding: 16px 0 0 0; text-align: right; font-size: 22px; font-weight: 800; color: #4f46e5;">$${totalPrice}</td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- FOOTER -->
            <tr>
              <td style="background-color: #f9fafb; padding: 25px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280;">
                  We look forward to welcoming you! If you need to make any changes, feel free to contact us.
                </p>
                <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                  © 2026 QuickStay Hotel Booking Inc. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  // 1. Try Resend API first if initialized
  if (resend) {
    try {
      const response = await resend.emails.send({
        from: 'QuickStay <onboarding@resend.dev>',
        to: [targetGuestEmail],
        subject: `🏨 Booking Confirmed: ${hotelName} (${nights} ${nights === 1 ? "Night" : "Nights"})`,
        html: htmlContent,
      });

      if (response.error) {
        console.warn("⚠️ Resend API Warning:", response.error.message);
        console.log("🔄 Switching to Nodemailer Brevo SMTP for guaranteed delivery...");
      } else {
        console.log(`⚡ Resend API Email Sent Successfully to ${targetGuestEmail} (ID: ${response.data?.id})`);
        
        // Send alert copy to owner if different email
        if (targetGuestEmail !== senderEmail) {
          resend.emails.send({
            from: 'QuickStay <onboarding@resend.dev>',
            to: [senderEmail],
            subject: `🔔 New Booking Alert: ${hotelName} by ${userName}`,
            html: `<p>A new booking was made by <strong>${userName}</strong> (${targetGuestEmail}) for <strong>${hotelName}</strong>.</p>` + htmlContent,
          }).catch(() => {});
        }
        return response;
      }
    } catch (resendErr) {
      console.error("❌ Resend API Exception:", resendErr.message, "- Falling back to Nodemailer SMTP");
    }
  }

  // 2. Nodemailer Brevo SMTP (Fallback / Backup)
  const guestMailOptions = {
    from: `"QuickStay Bookings" <${senderEmail}>`,
    to: targetGuestEmail,
    subject: `🏨 Booking Confirmed: ${hotelName} (${nights} ${nights === 1 ? "Night" : "Nights"})`,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(guestMailOptions);
    console.log(`✅ Nodemailer SMTP email sent successfully to ${targetGuestEmail} (ID: ${info.messageId})`);

    if (targetGuestEmail !== senderEmail) {
      transporter.sendMail({
        from: `"QuickStay Alert" <${senderEmail}>`,
        to: senderEmail,
        subject: `🔔 New Booking Alert: ${hotelName} by ${userName}`,
        html: `<p>A new booking was made by <strong>${userName}</strong> (${targetGuestEmail}) for <strong>${hotelName}</strong>.</p>` + htmlContent,
      }).catch(e => console.warn("Owner alert copy error:", e.message));
    }

    return info;
  } catch (error) {
    console.error("❌ Nodemailer Email Delivery Error:", error.message);
  }
};
