var SibApiV3Sdk = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const ForgotPasswordRequest = require("../models/ForgotPasswordRequest");

const sendPasswordResetEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ Error: "Email is mandatory" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ Error: "User not found" });
    }

    // Generate UUID for password reset request
    const requestId = uuidv4();

    // Store request in DB
    await ForgotPasswordRequest.create({
      id: requestId,
      isActive: true,
      expiresBy: new Date(Date.now() + 30 * 60 * 1000), // 30 min exporation
      userId: user.id,
    });

    // Setup Sendinblue email client
    var client = SibApiV3Sdk.ApiClient.instance;
    var apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.SMTP_API_KEY;

    var tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
    const sender = { email: "ssahu6244@gmail.com", name: "Sagar" };
    const receivers = [{ email: email }];

    // Construct actual reset link
    const resetLink = `${process.env.CLIENT_BASE_URL}/pages/reset-password.html?requestId=${requestId}`;

    await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Password Reset Request",
      htmlContent: `<p>Click the link below to reset your password:</p>
                    <a href="${resetLink}">Reset password</a>
                    <p>This link expires in 30 minutes.</p>`,
    });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.log("Error while doing forgot password", err);
    return res.status(500).json({ Error: `Internal error - ${err.message}` });
  }
};

const verifyResetRequest = async (req, res) => {
  const { requestId } = req.params;
  try {
    const request = await ForgotPasswordRequest.findOne({
      where: { id: requestId, isActive: true },
    });
    if (!requestId || new Date() > new Date(request.expiresBy)) {
      return res
        .status(400)
        .json({ error: "Invalid or expired reset request!" });
    }

    // Mark request as inactive upon first click
    request.isActive = false;
    await request.save();

    res.status(200).json({
      message: "Reset request is valid. Proceed with password update.",
    });
  } catch (err) {
    console.error("Error verifying reset request:", err);
    res.status(500).json({ error: "Internal server error!" });
  }
};

const updatepassword = async (req, res) => {
  const { requestId, newPassword } = req.body;

  try {
    const request = await ForgotPasswordRequest.findOne({
      where: { id: requestId },
    });
    if (!request || new Date() > new Date(request.expiresBy)) {
      return res
        .status(400)
        .json({ error: "Invalid or expired reset request!" });
    }

    const user = await User.findByPk(request.userId);
    if (!user) return res.status(404).json({ error: "User not found!" });

    //Encrypt password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Mark the reset request as inactive
    request.isActive = false;
    await request.save();

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ error: "Failed to update password!" });
  }
};

module.exports = {
  sendPasswordResetEmail,
  verifyResetRequest,
  updatepassword,
};
