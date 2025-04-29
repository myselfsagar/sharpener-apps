var SibApiV3Sdk = require("sib-api-v3-sdk");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ Error: "Email is mandatory" });
    }

    var client = SibApiV3Sdk.ApiClient.instance;
    var apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.SMTP_API_KEY;

    var tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
    const sender = {
      email: "ssahu6244@gmail.com",
      name: "Sagar",
    };
    const receivers = [
      {
        email: email,
      },
    ];

    await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Forgot password",
      htmlContent: `Click the below link to reset your password!`,
    });
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.log("Error while login", err);
    return res.status(500).json({ Error: `Internal error - ${err.message}` });
  }
};

module.exports = {
  forgotPassword,
};
