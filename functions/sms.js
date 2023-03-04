const axios = require("axios");

exports.sendSmsLogin = (reciver, code) => {
  console.log("sms code: " + code);
  // var data = JSON.stringify({
  //   lineNumber: 30007732008851,
  //   messageText: `به استایلست خوش آمدید.\nکد ورود: ${code}`,
  //   mobiles: [reciver],
  //   sendDateTime: null,
  // });

  // var config = {
  //   method: "post",
  //   url: "https://api.sms.ir/v1/send/bulk",
  //   headers: {
  //     "X-API-KEY":
  //       "XLdop743ieewpDZ2q9zCj4Vp5Zjf8o5LzCZahrAbXovI5ftdo1dzC6UXphgfQOZm",
  //     "Content-Type": "application/json",
  //   },
  //   data: data,
  // };

  // axios(config)
  //   .then(function (response) {
  //     console.log(response.data);
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
};

exports.sendSmsForget = (reciver, code) => {
  console.log("sms code: " + code);
  // var data = JSON.stringify({
  //   lineNumber: 30007732008851,
  //   messageText: `به استایلست خوش آمدید.\nکد فراموشی: ${code}`,
  //   mobiles: [reciver],
  //   sendDateTime: null,
  // });

  // var config = {
  //   method: "post",
  //   url: "https://api.sms.ir/v1/send/bulk",
  //   headers: {
  //     "X-API-KEY":
  //       "XLdop743ieewpDZ2q9zCj4Vp5Zjf8o5LzCZahrAbXovI5ftdo1dzC6UXphgfQOZm",
  //     "Content-Type": "application/json",
  //   },
  //   data: data,
  // };

  // axios(config)
  //   .then(function (response) {
  //     console.log(response.data);
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
};
