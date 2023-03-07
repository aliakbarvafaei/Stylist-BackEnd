const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "stylist.team.info@gmail.com",
    pass: "thgnprbgjepghwua",
  },
});
exports.mailSignup = async (reciver, name, urlLogo) => {
  transporter
    .sendMail({
      from: '"Stylist Support" <stylist.team.info@gmail.com>', // sender address
      to: reciver, // list of receivers
      subject: "ثبت نام", // Subject line
      html: `<div
      marginwidth="0"
      marginheight="0"
      style="
        width: 100%;
        background-color: #fff;
        margin: 0;
        padding: 0;
        font-family: 'Open Sans', sans-serif;
      "
    >
      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        class="m_-3927260596595642433container"
        style="
          border: 0;
          text-align: center;
          border-collapse: collapse;
          width: 100%;
          min-width: 100%;
          height: auto;
        "
      >
        <tbody>
          <tr>
            <td
              width="100%"
              valign="top"
              style="padding-top: 20px; background-color: #ffffff"
            >
              <table
                width="580"
                class="m_-3927260596595642433deviceWidth"
                cellpadding="0"
                cellspacing="0"
                style="
                  border-collapse: collapse;
                  margin: 0 auto;
                  border: 0;
                  text-align: center;
                  background-color: #ffffff;
                "
              >
                <tbody>
                  <tr>
                    <td
                      valign="top"
                      align="center"
                      style="padding: 0"
                      bgcolor="#ffffff"
                    >
                      <a
                        href="https://google.com/"
                        target="_blank"
                        ><img
                          class="m_-3927260596595642433deviceWidth CToWUd"
                          src=${urlLogo}
                          alt=""
                          border="0"
                          width="125"
                          style="display: inline"
                          data-bit="iit"
                      /></a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="
                        font-size: 16px;
                        color: #282828;
                        font-weight: 400;
                        text-align: center;
                        font-family: 'Gill Sans', 'Gill Sans MT', Calibri,
                          'Trebuchet MS', sans-serif;
                        line-height: 24px;
                        vertical-align: top;
                        padding: 15px 8px 10px 8px;
                      "
                      bgcolor="#ffffff"
                    >
                      <h1
                        style="
                          text-align: center;
                          font-weight: 600;
                          margin: 30px 0 50px 0;
                        "
                      >
                        ثبت نام با موفقیت انجام شد
                      </h1>
                      <p>${name} عزیز</p>
                      <p>
                      حساب شما با ایمیل ${reciver} ایجاد شد
                      </p><br>
                      <p>همین حالا استایل خودتو بساز</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 30px">
                      <a
                        href="https://google.com/"
                        style="
                          padding: 10px;
                          width: 150px;
                          display: block;
                          text-decoration: none;
                          border: 1px solid #8c011b;
                          text-align: center;
                          font-weight: 700;
                          font-size: 14px;
                          font-family: 'Open Sans', sans-serif;
                          color: #fff;
                          background: #8c011b;
                          border-radius: 5px;
                          line-height: 17px;
                          margin: 0 auto;
                        "
                        target="_blank"
                        >بازدید از سایت</a
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>`, // html body
    })
    .then((info) => {
      console.log("email sent. " + info.response);
    })
    .catch(console.error);
};
exports.mailResetPass = async (reciver, code, urlLogo) => {
  console.log("email code: " + code);
  transporter
    .sendMail({
      from: '"Stylist Support" <stylist.team.info@gmail.com>', // sender address
      to: reciver, // list of receivers
      subject: "بازیابی رمز", // Subject line
      html: `<div
      marginwidth="0"
      marginheight="0"
      style="
        width: 100%;
        background-color: #fff;
        margin: 0;
        padding: 0;
        font-family: 'Open Sans', sans-serif;
      "
    >
      <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
        class="m_-3927260596595642433container"
        style="
          border: 0;
          text-align: center;
          border-collapse: collapse;
          width: 100%;
          min-width: 100%;
          height: auto;
        "
      >
        <tbody>
          <tr>
            <td
              width="100%"
              valign="top"
              style="padding-top: 20px; background-color: #ffffff"
            >
              <table
                width="580"
                class="m_-3927260596595642433deviceWidth"
                cellpadding="0"
                cellspacing="0"
                style="
                  border-collapse: collapse;
                  margin: 0 auto;
                  border: 0;
                  text-align: center;
                  background-color: #ffffff;
                "
              >
                <tbody>
                  <tr>
                    <td
                      valign="top"
                      align="center"
                      style="padding: 0"
                      bgcolor="#ffffff"
                    >
                      <a
                        href="https://google.com/"
                        target="_blank"
                        ><img
                          class="m_-3927260596595642433deviceWidth CToWUd"
                          src=${urlLogo}
                          alt=""
                          border="0"
                          width="125"
                          style="display: inline"
                          data-bit="iit"
                      /></a>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="
                        font-size: 16px;
                        color: #282828;
                        font-weight: 400;
                        text-align: center;
                        font-family: 'Gill Sans', 'Gill Sans MT', Calibri,
                          'Trebuchet MS', sans-serif;
                        line-height: 24px;
                        vertical-align: top;
                        padding: 15px 8px 10px 8px;
                      "
                      bgcolor="#ffffff"
                    >
                      <h1
                        style="
                          text-align: center;
                          font-weight: 600;
                          margin: 30px 0 50px 0;
                        "
                      >
                        فراموشی رمز عبور
                      </h1>
                      <p>کد بازیابی</p>
                      <p>
                        ${code}

                      </p><br>
                      <p>همین حالا استایل خودتو بساز</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 30px">
                      <a
                        href="https://google.com/"
                        style="
                          padding: 10px;
                          width: 150px;
                          display: block;
                          text-decoration: none;
                          border: 1px solid #8c011b;
                          text-align: center;
                          font-weight: 700;
                          font-size: 14px;
                          font-family: 'Open Sans', sans-serif;
                          color: #fff;
                          background: #8c011b;
                          border-radius: 5px;
                          line-height: 17px;
                          margin: 0 auto;
                        "
                        target="_blank"
                        >بازدید از سایت</a
                      >
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>`, // html body
    })
    .then((info) => {
      console.log("email sent. " + info.response);
    })
    .catch(console.error);
};
