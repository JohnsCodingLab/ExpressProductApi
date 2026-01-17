import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

export const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

export const comparePassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) {
    throw new Error("Password comparison failed: missing data");
  }

  return bcrypt.compare(plainPassword, hashedPassword);
};
