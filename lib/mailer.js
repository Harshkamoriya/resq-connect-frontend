import nodemailer from "nodemailer";





export const sendEmailOTP = async (to, otp) => {
    console.log(to)

    const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: process.env.EMAIL_USER, // Your email
          pass: process.env.EMAIL_PASS, // Your email password
        },
      });

  const mailOptions = {
    from: "harshkamoriya@gmail.com",
    to: to,
    subject: "Your ResQ Connect OTP",
    html: `<p>Your OTP for the booking is <b>${otp}</b>.</p>`,
  };
  console.log(mailOptions, "mailoptions");

  await transporter.sendMail(mailOptions);
};
