const User = require("./User");
const Expense = require("./Expense");
const Payment = require("./Payment");
const ForgotPasswordRequest = require("./ForgotPasswordRequest");

//association
User.hasMany(Expense);
Expense.belongsTo(User);

Payment.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Payment, { foreignKey: "userId", onDelete: "CASCADE" });

User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);
