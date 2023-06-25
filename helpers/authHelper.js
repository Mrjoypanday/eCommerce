import bcryt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcryt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {}
};

export const comparePassword = async (password, hashedPassword) => {
  return bcryt.compare(password, hashedPassword);
};
