import bcrypt from 'bcryptjs';
const SALT_ROUNDS = 10;

export const hashPassword = (pwd: string) => bcrypt.hash(pwd, SALT_ROUNDS);
export const comparePwd = (raw: string, hash: string) => bcrypt.compare(raw, hash);
