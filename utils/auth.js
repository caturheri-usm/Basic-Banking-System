const bcrypt = require("bcryptjs");
const salt = 10;

async function hashPassword(password) {
  try {
    const encryptedPassword = await bcrypt.hash(password, salt);
    return encryptedPassword;
  } catch (e) {
    throw new Error(e);
  }
}

async function checkPassword(password, hashedPassword) {
  try {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
  } catch (e) {
    throw new Error(e);
  }
}

module.exports = { hashPassword, checkPassword };
