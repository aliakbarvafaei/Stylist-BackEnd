const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "stylist.team.info@gmail.com",
    pass: "thgnprbgjepghwua",
  },
});
exports.sendMail = async (reciver, subject, text) => {
  transporter
    .sendMail({
      from: '"Stylist Support" <stylist.team.info@gmail.com>', // sender address
      to: reciver, // list of receivers
      subject: subject, // Subject line
      //   text: "ثبت نام شما با موفقیت انجام شد.به استایلیست خوش آمدید.", // plain text body
      html: text, // html body
    })
    .then((info) => {
      console.log( "email sent. "+info.response );
    })
    .catch(console.error);
};
