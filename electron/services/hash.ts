import { genSalt, hash } from "bcrypt-ts";

export default async function encrypt(text: string) {
  const salt = await genSalt(10);
  return await hash(text, salt);
}
