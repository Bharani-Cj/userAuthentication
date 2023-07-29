const nodemailer = require('nodemailer');

exports.mailtrap = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 587,
    auth: {
      user: '87d5bf974d1b59',
      pass: '7b2cf5ce736c51',
    },
  });

  const Emailer = {
    from: 'cj.bharani@gmail.com', // sender address
    to: options.to, // list of receivers
    subject: 'Password Reset Link', // Subject line
    text: options.message, // plain text body
  };

  await transporter.sendMail(Emailer);
};
