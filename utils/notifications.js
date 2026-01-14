const nodemailer = require('nodemailer');

const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendEmail = async (to, subject, html) => {
  try {
    await emailTransporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

exports.notifyBookingStatus = async (user, booking, resource, status) => {
  const statusMessages = {
    approved: 'Your booking has been approved!',
    declined: 'Your booking has been declined.',
    cancelled: 'Your booking has been cancelled.'
  };

  const emailSubject = `Booking ${status.toUpperCase()} - ${resource.name}`;
  const emailHtml = `
    <h2>Booking Status Update</h2>
    <p>Dear ${user.name},</p>
    <p>${statusMessages[status]}</p>
    <h3>Booking Details:</h3>
    <ul>
      <li><strong>Resource:</strong> ${resource.name}</li>
      <li><strong>Date:</strong> ${new Date(booking.startTime).toLocaleDateString()}</li>
      <li><strong>Time:</strong> ${new Date(booking.startTime).toLocaleTimeString()} - ${new Date(booking.endTime).toLocaleTimeString()}</li>
      <li><strong>Purpose:</strong> ${booking.purpose}</li>
    </ul>
    ${booking.adminNotes ? `<p><strong>Admin Notes:</strong> ${booking.adminNotes}</p>` : ''}
    <p>Best regards,<br>Campus Resource Management Team</p>
  `;

  await this.sendEmail(user.email, emailSubject, emailHtml);
};
