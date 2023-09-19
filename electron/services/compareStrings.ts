import { compare } from "bcrypt-ts";

export default async function compareStrings(text: string, hashedText: string) {
  return await compare(text, hashedText);
}
