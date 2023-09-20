import { User } from "@prisma/client";
import hash from "../services/hash";

export default async function createUser(): Promise<Omit<User, "id">> {
  const password = await hash("admin");
  return {
    name: "admin",
    lastName: "admin",
    username: "admin",
    password,
  };
}
