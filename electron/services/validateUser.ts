import { User } from "@prisma/client";
import prisma from "../db/client";
import compareStrings from "./compareStrings";

export default async function validateUser(
  username: string,
  password: string
): Promise<[boolean, Partial<User> | null]> {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) return [false, null];

  const matches = await compareStrings(password, user.password);
  if (!matches) return [false, null];

  const userWithoutPassword: Partial<User> = { ...user };
  delete userWithoutPassword.password;
  return [true, userWithoutPassword];
}
